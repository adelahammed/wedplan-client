"use client";

import * as React from "react";
import { CreditCard, Search, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Input } from "@/components/ui/input";
import { UILoader } from "@/components/ui-loader";
import { useSession } from "@/lib/auth-client";

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        let token = getStoredToken();
        if (!token) {
          token = await fetchAuthToken(currentUser);
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setTransactions(Array.isArray(data) ? data : []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      (tx.vendorName && tx.vendorName.toLowerCase().includes(q)) ||
      (tx.vendorEmail && tx.vendorEmail.toLowerCase().includes(q)) ||
      (tx._id && String(tx._id).toLowerCase().includes(q)) ||
      (tx.plan && tx.plan.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Billing & Revenue
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Platform Transactions
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Audit vendor subscription fee receipts and payments.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-80">
        <Input
          type="text"
          placeholder="Search by vendor, transaction ID, or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
        />
      </div>

      {loading ? (
        <UILoader
          message="Loading Transaction Logs"
          subtext="Auditing merchant charges, checkout sessions, and payouts..."
        />
      ) : filtered.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No transactions found
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            There are currently no processed subscription charges recorded.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e7e0d3] bg-white overflow-hidden shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf5] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-[#f0ebe1] dark:bg-[#201c16] dark:border-[#2e281d]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Vendor Partner</th>
                  <th className="py-4 px-6 font-semibold">Tier / Plan</th>
                  <th className="py-4 px-6 font-semibold">Amount Paid</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Processed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
                {filtered.map((tx) => (
                  <tr
                    key={tx._id || tx.id}
                    className="hover:bg-[#faf7f0] dark:hover:bg-[#231e18] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {tx.vendorName || "Wedding Vendor"}
                      </p>
                      <p className="text-xs text-zinc-500">{tx.vendorEmail || ""}</p>
                    </td>

                    <td className="py-4 px-6 font-medium text-zinc-800 dark:text-zinc-200">
                      {tx.plan || tx.subscriptionPlan || "Vendor Premium"}
                    </td>

                    <td className="py-4 px-6 font-serif font-bold text-[#C39C45]">
                      ${tx.amount || "49.00"}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold dark:bg-emerald-950/40 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {tx.status || "Completed"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-zinc-500">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
