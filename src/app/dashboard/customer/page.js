"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Heart,
  Sparkles
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function CustomerOverviewPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
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
        const customerId = user.id || user._id;
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/customer/stats/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            total: data.totalBookings || 0,
            pending: data.pendingBookings || 0,
            accepted: data.acceptedBookings || 0,
            rejected: data.rejectedBookings || 0
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
        message="Loading Wedding Dashboard"
        subtext="Fetching your requested services and vendor confirmations..."
      />
    );
  }

  const statCards = [
    {
      title: "Total Booking Requests",
      value: stats.total,
      sub: "Inquiries submitted to vendors",
      icon: CalendarCheck,
      color: "bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]"
    },
    {
      title: "Pending Requests",
      value: stats.pending,
      sub: "Awaiting vendor response",
      icon: Clock,
      color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
    },
    {
      title: "Accepted Bookings",
      value: stats.accepted,
      sub: "Confirmed wedding reservations",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
    },
    {
      title: "Rejected Inquiries",
      value: stats.rejected,
      sub: "Unavailable dates or venues",
      icon: XCircle,
      color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Bridal Suite & Itinerary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Welcome, {user?.name || "Wedding Planner"}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Track your vendor inquiries, manage wedding itineraries, and curate your ceremony.
          </p>
        </div>

        <Link href="/services">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Discover Vendors</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href="/dashboard/customer/bookings" className="group">
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
                  <span>View Bookings</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
