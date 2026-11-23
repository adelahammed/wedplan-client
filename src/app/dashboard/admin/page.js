"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Clock,
  CreditCard,
  UserCheck,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function AdminOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalServices: 0,
    pendingServices: 0,
    totalTransactions: 0
  });
  const [recentTransactions, setRecentTransactions] = React.useState([]);

  React.useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoading(true);
      try {
        let token = getStoredToken();
        if (!token) {
          token = await fetchAuthToken(user);
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalUsers: data.totalUsers || 0,
            totalVendors: data.totalVendors || 0,
            totalCustomers: data.totalCustomers || 0,
            totalServices: data.totalServices || 0,
            pendingServices: data.pendingServices || 0,
            totalTransactions: data.totalTransactions || 0
          });
          setRecentTransactions(Array.isArray(data.recentTransactions) ? data.recentTransactions : []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      sub: `${stats.totalVendors} vendors, ${stats.totalCustomers} customers`,
      icon: Users,
      href: "/dashboard/admin/users",
      color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      sub: "Active wedding artisans & venues",
      icon: UserCheck,
      href: "/dashboard/admin/users",
      color: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      sub: "Engaged couples & planners",
      icon: Users,
      href: "/dashboard/admin/users",
      color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      sub: "Catalog wedding packages",
      icon: Briefcase,
      href: "/dashboard/admin/services",
      color: "bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b] dark:text-[#C39C45]"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingServices,
      sub: "Awaiting moderator review",
      icon: Clock,
      href: "/dashboard/admin/services",
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      sub: "Vendor subscriptions & fees",
      icon: CreditCard,
      href: "/dashboard/admin/transactions",
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
    }
  ];

  if (loading) {
    return (
      <UILoader
        message="Loading Platform Intelligence"
        subtext="Aggregating user registrations, listing submissions, and billing..."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Administrative Control Panel
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Real-time platform operations, active vendor metrics, and security audits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group">
              <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 shadow-xs hover:shadow-lg transition-all dark:border-[#383124] dark:bg-[#1c1914] flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-2xl ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                    {card.value}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {card.sub}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f0ebe1] dark:border-[#2e281d] flex items-center justify-between text-xs font-medium text-[#C39C45] group-hover:underline">
                  <span>Manage Records</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Recent System Transactions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Stripe checkout transactions for vendor memberships
            </p>
          </div>
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              View All Audits
            </Button>
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500">
            No system transactions recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
            {recentTransactions.map((tx) => (
              <div
                key={tx._id || tx.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {tx.vendorName || "Wedding Vendor"}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {tx.plan || tx.subscriptionPlan || "Premium Plan"} - {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Recent"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-serif text-[#C39C45]">
                    ${tx.amount || "49.00"}
                  </span>
                  <span className="block text-[11px] text-emerald-600 font-medium">
                    {tx.status || "Completed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
