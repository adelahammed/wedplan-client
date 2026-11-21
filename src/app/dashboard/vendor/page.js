"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PlusCircle
} from "lucide-react";
import { fetchServices, fetchBookings } from "@/lib/api";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";

export default function VendorOverviewPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    acceptedBookings: 0
  });

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [services, bookings] = await Promise.all([
          fetchServices(),
          fetchBookings()
        ]);

        const active = services.filter((s) => s.isActive !== false).length;
        const pending = bookings.filter((b) => b.status === "Pending").length;
        const accepted = bookings.filter((b) => b.status === "Accepted").length;

        setStats({
          totalServices: services.length,
          activeServices: active,
          pendingBookings: pending,
          acceptedBookings: accepted
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40"
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      sub: "Currently visible in search",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      title: "Pending Booking Requests",
      value: stats.pendingBookings,
      sub: "Requires your confirmation",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      title: "Accepted Bookings",
      value: stats.acceptedBookings,
      sub: "Confirmed client events",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Artisan & Vendor Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your wedding packages, respond to customer booking requests, and track business growth.
          </p>
        </div>
        <Link href="/dashboard/vendor/add-service">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Service</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      <div className="rounded-3xl border border-[#C39C45]/30 bg-gradient-to-br from-white via-[#fdfbf7] to-[#f8f3ea] p-7 shadow-md dark:border-[#383124] dark:from-[#1c1914] dark:via-[#191611] dark:to-[#14120e]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C39C45] px-3 py-1 text-xs font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Current Subscription: Premium Vendor Plan</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Your Platinum Visibility Status is Active
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              You receive priority homepage ranking, unlimited service package listings, direct client inquiry notifications, and verified badge endorsement.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-300 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#C39C45]" />
                Unlimited Service Listings
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#C39C45]" />
                0% Direct Booking Commission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#C39C45]" />
                24/7 Dedicated Concierge Support
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3">
            <Link href="/dashboard/vendor/subscription">
              <Button className="w-full rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] px-6 text-sm">
                Manage Subscription
              </Button>
            </Link>
            <Link href="/dashboard/vendor/bookings">
              <Button variant="outline" className="w-full rounded-full border-[#C39C45]/30 text-zinc-800 dark:text-zinc-200">
                View Inquiries ({stats.pendingBookings})
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
