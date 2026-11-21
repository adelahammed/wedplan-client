"use client";

import * as React from "react";
import { CreditCard, Search, ArrowDownRight, CheckCircle2 } from "lucide-react";
import { fetchTransactions } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { UILoader } from "@/components/ui-loader";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      tx.vendorName.toLowerCase().includes(q) ||
      tx.vendorEmail.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.subscriptionPlan.toLowerCase().includes(q)
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
          message="Loading Transactions"
          subtext="Fetching subscription receipts and payout audit logs..."
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <p className="text-sm text-zinc-500">No transactions recorded matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs flex flex-col justify-between dark:border-[#383124] dark:bg-[#1c1914]"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#f0ebe1] dark:border-[#2e281d]">
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    {tx.id}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {tx.paymentStatus}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50">
                      {tx.vendorName}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {tx.vendorEmail}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#fdfbf7] dark:bg-[#14120e] p-3 border border-[#f0ebe1] dark:border-[#2e281d] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Subscription Tier:</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {tx.subscriptionPlan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Transaction Date:</span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {tx.transactionDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0ebe1] dark:border-[#2e281d] flex items-center justify-between">
                <span className="text-xs text-zinc-400">Amount Charged</span>
                <span className="text-xl font-serif font-bold text-[#C39C45]">
                  {tx.paymentAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
