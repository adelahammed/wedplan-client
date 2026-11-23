"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PlusCircle
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function VendorOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
    subscriptionPlan: "Free"
  });

  React.useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        let token = getStoredToken();
        if (!token) {
          token = await fetchAuthToken(user);
        }
        const vendorId = user.id || user._id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/vendor/stats/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalServices: data.totalServices || 0,
            activeServices: data.activeServices || 0,
            pendingBookings: data.pendingBookings || 0,
            acceptedBookings: data.acceptedBookings || 0,
            subscriptionPlan: data.subscriptionPlan || "Free"
          });
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return (
      <UILoader
        message="Loading Vendor Suite"
        subtext="Fetching service metrics, booking requests, and subscription status..."
      />
    );
  }

  const statCards = [
    {
      title: "Total Services",
      value: stats.totalServices,
      sub: "Published wedding offerings",
      icon: Briefcase,
      href: "/dashboard/vendor/services",
      color: "bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]"
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      sub: "Live on platform catalog",
      icon: CheckCircle2,
      href: "/dashboard/vendor/services",
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
    },
    {
      title: "Pending Booking Requests",
      value: stats.pendingBookings,
      sub: "Awaiting your acceptance",
      icon: Clock,
      href: "/dashboard/vendor/bookings",
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    },
    {
      title: "Accepted Bookings",
      value: stats.acceptedBookings,
      sub: "Confirmed client ceremonies",
      icon: TrendingUp,
      href: "/dashboard/vendor/bookings",
      color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Business Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Welcome, {user?.name || "Vendor Partner"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Current Tier: <strong className="text-[#C39C45] uppercase">{stats.subscriptionPlan}</strong>
          </p>
        </div>

        <Link href="/dashboard/vendor/add-service">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Publish New Service</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  <span>View Details</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Current Membership Plan
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {stats.subscriptionPlan?.toLowerCase() === "premium"
                ? "You have unlimited active services publishing privileges and priority catalog placement."
                : "You are on the Free Plan. Free vendors can publish a maximum of 3 active services."}
            </p>
          </div>
          <span className="rounded-full bg-[#f6efe2] px-3 py-1 text-xs font-semibold text-[#C39C45]">
            {stats.subscriptionPlan.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
