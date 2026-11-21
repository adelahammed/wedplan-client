"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Clock,
  CreditCard,
  UserCheck,
  UserMinus,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { fetchUsers, fetchServices, fetchTransactions } from "@/lib/api";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
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
      setLoading(true);
      try {
        const [users, services, txns] = await Promise.all([
          fetchUsers(),
          fetchServices(),
          fetchTransactions()
        ]);

        const vendors = users.filter((u) => u.role === "Vendor").length;
        const customers = users.filter((u) => u.role === "Customer").length;
        const pending = services.filter((s) => s.status.toLowerCase() === "pending").length;

        setStats({
          totalUsers: users.length,
          totalVendors: vendors,
          totalCustomers: customers,
          totalServices: services.length,
          pendingServices: pending,
          totalTransactions: txns.length
        });
        setRecentTransactions(txns.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <UILoader
        message="Loading Dashboard Data"
        subtext="Aggregating platform metrics, users, and audit logs..."
      />
    );
  }

  const statCards = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers,
      sub: "Active and pending accounts",
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40"
    },
    {
      title: "Total Vendors",
      value: stats.totalVendors,
      sub: "Verified wedding artisans",
      icon: Briefcase,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      sub: "Couples planning events",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      sub: "Live across categories",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40"
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      sub: "Awaiting admin review",
      icon: Clock,
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40"
    },
    {
      title: "Total Transactions",
      value: stats.totalTransactions,
      sub: "Completed subscriptions",
      icon: CreditCard,
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Platform Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Admin Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Real-time analytics and platform operational statistics.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link href="/dashboard/admin/services">
            <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] text-xs">
              Review Services ({stats.pendingServices})
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs dark:border-[#383124] dark:bg-[#1c1914] flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {card.title}
                </p>
                <h3 className="mt-1.5 text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  {card.value}
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  {card.sub}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebe1] dark:border-[#2e281d]">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Recent Vendor Subscriptions
            </h3>
            <p className="text-xs text-zinc-500">
              Verified financial transactions and vendor tier billing
            </p>
          </div>
          <Link href="/dashboard/admin/transactions">
            <Button variant="ghost" size="sm" className="text-xs text-[#C39C45]">
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {tx.vendorName}
                </p>
                <p className="text-xs text-zinc-500">{tx.vendorEmail} • {tx.subscriptionPlan}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#C39C45]">{tx.paymentAmount}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  {tx.paymentStatus}
                </span>
                <span className="text-xs text-zinc-400">{tx.transactionDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
