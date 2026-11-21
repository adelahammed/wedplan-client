"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  CalendarCheck,
  PlusCircle,
  Sparkles,
  UserCheck,
  Shield,
  Layers,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const activeRole = pathname.includes("/dashboard/vendor")
    ? "Vendor"
    : pathname.includes("/dashboard/customer")
    ? "Customer"
    : "Admin";

  const adminNav = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Services", href: "/dashboard/admin/services", icon: Briefcase },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard }
  ];

  const vendorNav = [
    { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "My Services", href: "/dashboard/vendor/services", icon: Briefcase },
    { name: "Add Service", href: "/dashboard/vendor/add-service", icon: PlusCircle },
    { name: "Booking Requests", href: "/dashboard/vendor/bookings", icon: CalendarCheck },
    { name: "Subscription", href: "/dashboard/vendor/subscription", icon: Sparkles },
    { name: "Profile Settings", href: "/dashboard/vendor/profile", icon: UserCheck }
  ];

  const customerNav = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
    { name: "Profile Settings", href: "/dashboard/customer/profile", icon: UserCheck }
  ];

  let currentNav = adminNav;
  if (activeRole === "Vendor") currentNav = vendorNav;
  if (activeRole === "Customer") currentNav = customerNav;

  return (
    <div className="flex min-h-screen bg-[#f8f5ee] dark:bg-[#12100d]">
      <aside className="hidden lg:flex w-72 flex-col border-r border-[#e7e0d3] bg-white dark:border-[#383124] dark:bg-[#1c1914] shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-5 border-b border-[#f0ebe1] dark:border-[#2e281d]">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 block mb-2">
            Switch Dashboard Role
          </span>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#f6efe2] dark:bg-[#29241b]">
            <Link
              href="/dashboard/admin"
              className={`py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                activeRole === "Admin"
                  ? "bg-[#C39C45] text-white shadow-xs"
                  : "text-zinc-600 hover:text-[#C39C45] dark:text-zinc-300"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/dashboard/vendor"
              className={`py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                activeRole === "Vendor"
                  ? "bg-[#C39C45] text-white shadow-xs"
                  : "text-zinc-600 hover:text-[#C39C45] dark:text-zinc-300"
              }`}
            >
              Vendor
            </Link>
            <Link
              href="/dashboard/customer"
              className={`py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                activeRole === "Customer"
                  ? "bg-[#C39C45] text-white shadow-xs"
                  : "text-zinc-600 hover:text-[#C39C45] dark:text-zinc-300"
              }`}
            >
              Customer
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#C39C45] flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>{activeRole} Control Panel</span>
          </div>

          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#C39C45] text-white font-semibold shadow-xs"
                    : "text-zinc-700 hover:bg-[#f6efe2] hover:text-[#C39C45] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#C39C45]"}`} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 opacity-50 ${isActive ? "text-white" : ""}`} />
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#f0ebe1] dark:border-[#2e281d]">
          <div className="flex items-center gap-3 rounded-2xl bg-[#fdfbf7] p-3 border border-[#e7e0d3] dark:bg-[#14120e] dark:border-[#383124]">
            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{(session?.user?.name || "U")[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {session?.user?.name || "WedPlan Member"}
              </p>
              <p className="text-[11px] text-[#C39C45] font-medium">
                {activeRole} Account
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden border-b border-[#e7e0d3] bg-white px-4 py-3 dark:border-[#383124] dark:bg-[#1c1914] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="rounded-lg border-[#e7e0d3] dark:border-[#383124]"
            >
              {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="ml-1.5 text-xs">{activeRole} Menu</span>
            </Button>
          </div>
          <div className="flex gap-1">
            <Link
              href="/dashboard/admin"
              className={`px-2 py-1 text-xs rounded-md ${
                activeRole === "Admin" ? "bg-[#C39C45] text-white" : "bg-[#f6efe2] text-zinc-700"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/dashboard/vendor"
              className={`px-2 py-1 text-xs rounded-md ${
                activeRole === "Vendor" ? "bg-[#C39C45] text-white" : "bg-[#f6efe2] text-zinc-700"
              }`}
            >
              Vendor
            </Link>
            <Link
              href="/dashboard/customer"
              className={`px-2 py-1 text-xs rounded-md ${
                activeRole === "Customer" ? "bg-[#C39C45] text-white" : "bg-[#f6efe2] text-zinc-700"
              }`}
            >
              Customer
            </Link>
          </div>
        </div>

        {mobileSidebarOpen && (
          <div className="lg:hidden bg-white border-b border-[#e7e0d3] p-4 dark:bg-[#1c1914] dark:border-[#383124] space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-[#C39C45] text-white font-semibold"
                      : "text-zinc-700 hover:bg-[#f6efe2] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
