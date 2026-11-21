"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (dropdownOpen) setDropdownOpen(false);
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      router.push("/");
    } catch {
      toast.error("Error signing out");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
    { name: "Dashboard", href: "/dashboard" }
  ];

  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e7e0d3] bg-[#fdfbf7]/90 backdrop-blur-md dark:border-[#383124] dark:bg-[#14120e]/90 transition-colors">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-44">
            <Image
              src="/assets/WEDPLAN Gold Serif Logo.png"
              alt="WedPlan - Luxury Wedding Planning"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-[#C39C45] ${
                  isActive
                    ? "text-[#C39C45] font-semibold"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-[#e7e0d3] bg-white p-1.5 pr-3 shadow-xs transition hover:border-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914]"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-medium">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{(user.name || "U")[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="max-w-[130px] truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                  {user.name || "My Account"}
                </span>
                <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-[#e7e0d3] bg-white p-2 shadow-xl dark:border-[#383124] dark:bg-[#1c1914] animate-in fade-in-50 zoom-in-95">
                  <div className="flex items-center gap-3 border-b border-[#f0ebe1] p-3 dark:border-[#2e281d]">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-serif text-lg">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{(user.name || "U")[0].toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-[#f8f3ea] hover:text-[#C39C45] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                    >
                      <LayoutDashboard className="h-4 w-4 text-[#C39C45]" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/customer/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-[#f8f3ea] hover:text-[#C39C45] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                    >
                      <Settings className="h-4 w-4 text-[#C39C45]" />
                      <span>Profile Settings</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#f0ebe1] pt-1 dark:border-[#2e281d]">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button
                  variant="ghost"
                  className="rounded-full px-5 text-sm font-medium text-zinc-700 hover:text-[#C39C45] dark:text-zinc-300"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full bg-[#C39C45] px-6 text-sm font-medium text-white shadow-sm hover:bg-[#b08b38] transition-all">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-700 hover:bg-[#f6efe2] hover:text-[#C39C45] dark:text-zinc-300 dark:hover:bg-[#29241b]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-[#e7e0d3] bg-[#fdfbf7] px-4 pt-2 pb-6 dark:border-[#383124] dark:bg-[#14120e] md:hidden animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block rounded-xl px-3 py-2.5 text-base font-medium ${
                    isActive
                      ? "bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]"
                      : "text-zinc-800 hover:bg-[#f6efe2] hover:text-[#C39C45] dark:text-zinc-200 dark:hover:bg-[#29241b]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 border-t border-[#e7e0d3] pt-4 dark:border-[#383124]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-medium">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span>{(user.name || "U")[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-[#f6efe2] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#C39C45]" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/customer/profile"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-[#f6efe2] dark:text-zinc-300 dark:hover:bg-[#29241b]"
                  >
                    <Settings className="h-4 w-4 text-[#C39C45]" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/signin" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#C39C45]/30 text-zinc-800 dark:text-zinc-200"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
