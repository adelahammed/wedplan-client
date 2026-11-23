"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  X,
  ChevronRight,
  Ban,
  LogOut
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UILoader } from "@/components/ui-loader";
import { removeStoredToken } from "@/lib/jwt";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const user = session?.user;
  const userRole = (user?.role || "customer").toLowerCase();

  React.useEffect(() => {
    if (!isPending) {
      if (!user) {
        router.push("/signin");
        return;
      }

      if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
        router.push(`/dashboard/${userRole}`);
      } else if (pathname.startsWith("/dashboard/vendor") && userRole !== "vendor") {
        router.push(`/dashboard/${userRole}`);
      } else if (pathname.startsWith("/dashboard/customer") && userRole !== "customer") {
        router.push(`/dashboard/${userRole}`);
      }
    }
  }, [user, isPending, pathname, userRole, router]);

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
    { name: "Profile Settings", href: "/dashboard/vendor/profile", icon: UserCheck }
  ];

  const customerNav = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
    { name: "Profile Settings", href: "/dashboard/customer/profile", icon: UserCheck }
  ];

  let currentNav = customerNav;
  if (userRole === "admin") currentNav = adminNav;
  if (userRole === "vendor") currentNav = vendorNav;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ee] dark:bg-[#12100d]">
        <UILoader message="Verifying session..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.isBlocked) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#f8f5ee] dark:bg-[#12100d]">
        <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <Ban className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Account Suspended
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md">
          Your account has been deactivated by an administrator. Please reach out to platform support for further information.
        </p>
        <Button
          onClick={async () => {
            removeStoredToken();
            await signOut();
            router.push("/");
          }}
          className="mt-6 rounded-full bg-[#C39C45] text-white"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f5ee] dark:bg-[#12100d]">
      <aside className="hidden lg:flex w-72 flex-col border-r border-[#e7e0d3] bg-white dark:border-[#383124] dark:bg-[#1c1914] shrink-0 sticky top-20 h-[calc(100vh-5rem)]">
        <div className="p-5 border-b border-[#f0ebe1] dark:border-[#2e281d]">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-serif font-bold text-lg">
              {user.image ? (
                <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
              ) : (
                <span>{(user.name || "U")[0].toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {user.name || "User"}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f6efe2] text-[#C39C45]">
                {userRole.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#C39C45] flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Workspace Navigation</span>
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
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "opacity-100" : "opacity-0"}`} />
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#f0ebe1] dark:border-[#2e281d]">
          <button
            type="button"
            onClick={async () => {
              removeStoredToken();
              await signOut();
              router.push("/");
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-600 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="h-14 w-14 rounded-full bg-[#C39C45] text-white shadow-2xl flex items-center justify-center p-0"
        >
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80%] bg-white dark:bg-[#1c1914] shadow-2xl p-5">
            <div className="flex items-center gap-3 pb-4 border-b border-[#f0ebe1] dark:border-[#2e281d]">
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                ) : (
                  <span>{(user.name || "U")[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {user.name}
                </p>
                <span className="text-[10px] uppercase font-bold text-[#C39C45]">
                  {userRole}
                </span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {currentNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#C39C45] text-white font-semibold"
                        : "text-zinc-700 hover:bg-[#f6efe2] hover:text-[#C39C45] dark:text-zinc-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-hidden">
        {children}
      </main>
    </div>
  );
}
