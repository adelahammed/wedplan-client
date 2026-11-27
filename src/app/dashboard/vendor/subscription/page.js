"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Sparkles, Shield, ArrowRight, Star, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { UILoader, ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = React.useState(true);
  const [cancelling, setCancelling] = React.useState(false);
  const [isPremium, setIsPremium] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!user?.email) return;

    Promise.resolve().then(async () => {
      try {
        let token = getStoredToken();
        if (!token) {
          token = await fetchAuthToken(user);
        }
        const rawUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const serverUrl = (rawUrl || "").replace(/\/+$/, "");
        const res = await fetch(
          `${serverUrl}/users/profile/${user.id || user._id || user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );
        if (res.ok) {
          const profile = await res.json();
          if (active) {
            setIsPremium(Boolean(profile?.premium || profile?.subscriptionPlan === "Premium" || user?.premium || user?.subscriptionPlan === "Premium"));
          }
        } else if (active) {
          setIsPremium(Boolean(user?.premium || user?.subscriptionPlan === "Premium"));
        }
      } catch {
        if (active) {
          setIsPremium(Boolean(user?.premium || user?.subscriptionPlan === "Premium"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  const handleCancelSubscription = async () => {
    if (!user?.email) return;
    const confirmed = window.confirm(
      "Are you sure you want to cancel your Premium membership and return to the Free plan?"
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: user.email }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setIsPremium(false);
        await fetchAuthToken(user);
        toast.success("Subscription updated. You are now on the Free plan.");
      } else {
        toast.error(data.message || "Failed to cancel subscription");
      }
    } catch {
      toast.error("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <UILoader
          text="Retrieving subscription plans..."
          subtext="Loading your current vendor membership details."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
          Vendor Membership & Plans
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Manage Your Subscription
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Scale your wedding inquiry pipeline with prominent ranking, verified trust seals, and unlimited package listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        <div
          className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
            !isPremium
              ? "border-2 border-[#C39C45] bg-[#fdfbf7] shadow-xl relative dark:bg-[#1a1712]"
              : "border border-[#e7e0d3] bg-white shadow-xs dark:border-[#383124] dark:bg-[#1c1914]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Standard Tier
              </span>
              {!isPremium && (
                <span className="flex items-center gap-1 rounded-full bg-[#C39C45] px-3 py-1 text-xs font-semibold text-white">
                  Current Active Plan
                </span>
              )}
            </div>

            <h3 className="mt-3 text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Free Plan
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Ideal for new boutique wedding vendors and independent artisans getting started.
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                $0
              </span>
              <span className="text-xs text-zinc-500">/lifetime</span>
            </div>

            <div className="mt-6 border-t border-[#f0ebe1] dark:border-[#2e281d] pt-6 space-y-3">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Included Features
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Maximum 3 Active Service Listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Standard Search Placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Direct Customer Inquiries via Portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Standard Vendor Dashboard</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#f0ebe1] dark:border-[#2e281d]">
            {!isPremium ? (
              <Button
                disabled
                className="w-full h-11 rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 cursor-default"
              >
                Current Active Plan
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={cancelling}
                onClick={handleCancelSubscription}
                className="w-full h-11 rounded-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                {cancelling ? (
                  <ButtonLoader text="Cancelling..." />
                ) : (
                  <span>Downgrade to Free Plan</span>
                )}
              </Button>
            )}
          </div>
        </div>

        <div
          className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
            isPremium
              ? "border-2 border-[#C39C45] bg-[#fdfbf7] shadow-xl relative dark:bg-[#1a1712]"
              : "border-2 border-[#C39C45] bg-white shadow-xl relative dark:bg-[#1c1914]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C39C45]">
                Premium Membership
              </span>
              {isPremium ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  Current Active Plan
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-[#C39C45] px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </span>
              )}
            </div>

            <h3 className="mt-3 text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Premium Package
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Designed for premier venues, elite photographers, and luxury floral ateliers desiring unlimited listings.
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                $150
              </span>
              <span className="text-xs text-zinc-500">/lifetime</span>
            </div>

            <div className="mt-6 border-t border-[#f0ebe1] dark:border-[#2e281d] pt-6 space-y-3">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Exclusive Privileges
              </span>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    Unlimited Wedding Service Listings
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Featured Hero & Category Top Placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Gold Verified Luxury Vendor Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Zero Commission on Confirmed Bookings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#C39C45] shrink-0" />
                  <span>Priority Client Inquiries & Booking Alerts</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#f0ebe1] dark:border-[#2e281d]">
            {isPremium ? (
              <Button
                disabled
                className="w-full h-11 rounded-full bg-emerald-600 text-white cursor-default"
              >
                <Shield className="h-4 w-4 mr-2" />
                Active Premium Lifetime Plan
              </Button>
            ) : (
              <Link
                href="/payment?plan=Platinum+Signature&amount=150"
                className="w-full block"
              >
                <Button className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition flex items-center justify-center gap-2">
                  <span>Upgrade to Premium ($150)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
