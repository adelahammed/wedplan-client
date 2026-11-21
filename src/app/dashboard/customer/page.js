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
  Sparkles,
  MapPin
} from "lucide-react";
import { fetchBookings } from "@/lib/api";
import { UILoader } from "@/components/ui-loader";
import { Button } from "@/components/ui/button";

export default function CustomerOverviewPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [recentBookings, setRecentBookings] = React.useState([]);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const bookings = await fetchBookings();
        const pending = bookings.filter((b) => b.status === "Pending").length;
        const accepted = bookings.filter((b) => b.status === "Accepted").length;
        const rejected = bookings.filter((b) => b.status === "Rejected").length;

        setStats({
          total: bookings.length,
          pending,
          accepted,
          rejected
        });
        setRecentBookings(bookings.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
      sub: "Inquiries submitted",
      icon: CalendarCheck,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40"
    },
    {
      title: "Pending Bookings",
      value: stats.pending,
      sub: "Awaiting vendor confirmation",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"
    },
    {
      title: "Accepted Bookings",
      value: stats.accepted,
      sub: "Dates locked with vendors",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
    },
    {
      title: "Rejected Bookings",
      value: stats.rejected,
      sub: "Declined or unavailable",
      icon: XCircle,
      color: "text-red-600 bg-red-50 dark:bg-red-950/40"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Bridal Suite
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Track your wedding booking requests, vendor schedules, and event details.
          </p>
        </div>
        <Link href="/services">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-2">
            <span>Browse More Services</span>
            <ArrowRight className="h-4 w-4" />
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

      <div className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0ebe1] dark:border-[#2e281d]">
          <div>
            <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
              Recent Booking Inquiries
            </h3>
            <p className="text-xs text-zinc-500">
              Live status updates on your wedding vendor communications
            </p>
          </div>
          <Link href="/dashboard/customer/bookings">
            <Button variant="ghost" size="sm" className="text-xs text-[#C39C45]">
              View All Bookings <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
          {recentBookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {b.serviceName}
                </p>
                <p className="text-xs text-zinc-500">
                  {b.vendorName} • {b.eventDate} ({b.eventLocation})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    b.status === "Accepted"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : b.status === "Rejected"
                      ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                  }`}
                >
                  {b.status}
                </span>
                <span className="text-xs text-zinc-400">{b.requestDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
