"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Briefcase, CalendarHeart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardIndexPage() {
  const roles = [
    {
      title: "Admin Dashboard",
      role: "Platform Management",
      description: "Manage registered users, review pending vendor service submissions, and audit platform transaction logs.",
      href: "/dashboard/admin",
      icon: Shield,
      badge: "Full Control"
    },
    {
      title: "Vendor Dashboard",
      role: "Artisans & Venues",
      description: "Add new wedding packages, update pricing, pause services, review client booking requests, and manage subscriptions.",
      href: "/dashboard/vendor",
      icon: Briefcase,
      badge: "Business Suite"
    },
    {
      title: "Customer Dashboard",
      role: "Engaged Couples",
      description: "Track your wedding booking requests, view confirmation statuses, cancel inquiries, and personalize your bridal profile.",
      href: "/dashboard/customer",
      icon: CalendarHeart,
      badge: "Wedding Planning"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
          Welcome to WedPlan Control
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Select Your Workspace
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Switch between administrative governance, vendor business tools, and customer booking management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-3xl border border-[#e7e0d3] bg-white p-7 shadow-xs hover:shadow-xl transition-all duration-300 dark:border-[#383124] dark:bg-[#1c1914]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-[#f6efe2] px-3 py-1 text-xs font-medium text-[#C39C45] dark:bg-[#29241b]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8">
                <Link href={item.href} className="block w-full">
                  <Button className="w-full rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center justify-center gap-2">
                    <span>Enter {item.title.split(" ")[0]} View</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
