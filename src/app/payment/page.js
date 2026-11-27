"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, ShieldCheck, ArrowLeft, Lock, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const planName = searchParams.get("plan") || "Platinum Signature Vendor Plan";
  const amount = Number(searchParams.get("amount") || "150.00");
  const canceled = searchParams.get("canceled");

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!isPending) {
      if (!user) {
        router.push("/signin?callbackUrl=/payment");
        return;
      }
      const role = (user.role || "").toLowerCase();
      if (role !== "vendor") {
        router.push(`/dashboard/${role || "customer"}`);
        return;
      }

      if (user.premium || user.subscriptionPlan === "Premium") {
        toast.info("You already have an active Premium subscription.");
        router.push("/dashboard/vendor/subscription");
        return;
      }

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
            if (active && (profile?.premium || profile?.subscriptionPlan === "Premium")) {
              toast.info("You already have an active Premium subscription.");
              router.push("/dashboard/vendor/subscription");
            }
          }
        } catch {}
      });
    }

    return () => {
      active = false;
    };
  }, [user, isPending, router]);

  const handleCheckout = async () => {
    if (!Number.isFinite(amount) || amount <= 0) return;

    setLoading(true);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/checkout_sessions";

    const fields = {
      plan: planName,
      amount: amount.toString(),
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  if (isPending || !user) {
    return (
      <div className="py-24">
        <UILoader
          text="Verifying vendor access..."
          subtext="Confirming checkout credentials..."
        />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-16 bg-[#fdfbf7] dark:bg-[#14120e] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#C39C45] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Subscriptions
        </Link>

        {canceled && (
          <div className="mb-6 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-amber-800 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Payment checkout was cancelled. You can review your subscription options below whenever you are ready.</span>
          </div>
        )}

        <div className="mb-6 rounded-2xl bg-[#f6efe2] p-4 border border-[#e7e0d3] dark:bg-[#252016] dark:border-[#383124]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C39C45]">
            <Sparkles className="h-4 w-4" />
            <span>Free Tier Notice</span>
          </div>
          <p className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
            You are currently on the Free plan (maximum 3 services). Purchasing the Lifetime Premium Package ($150) grants unlimited active wedding offerings, gold verification seal, and priority vendor catalog placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xl dark:border-[#383124] dark:bg-[#1c1914]">
            <div className="flex items-center gap-3 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
              <CreditCard className="h-6 w-6 text-[#C39C45]" />
              <div>
                <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  Secure Checkout
                </h2>
                <p className="text-xs text-zinc-500">
                  Encrypted payment powered by Stripe
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-[#e7e0d3] p-5 dark:border-[#383124]">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-[#C39C45]" />
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Stripe Secure Payment
                  </h3>
                </div>
                <p className="text-sm text-zinc-500">
                  Complete your vendor lifetime upgrade securely through Stripe&apos;s checkout page.
                </p>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading || !Number.isFinite(amount) || amount <= 0}
                className="w-full h-12 rounded-xl bg-[#C39C45] hover:bg-[#ad8735] text-white"
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Redirecting to Stripe..." : `Upgrade Now for $${amount.toFixed(2)}`}
              </Button>

              <div className="flex justify-center items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Secure 256-bit SSL Encrypted Stripe Checkout
              </div>
            </div>
          </div>

          <div className="md:col-span-5 rounded-3xl border border-[#e7e0d3] bg-[#f8f5ee] p-6 sm:p-7 dark:border-[#383124] dark:bg-[#1a1712] space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C39C45]">
              Order Summary
            </span>

            <div className="border-b border-[#e7e0d3] dark:border-[#2e281d] pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {planName}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Lifetime luxury vendor membership with unlimited service publishing privileges.
              </p>
            </div>

            <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Package Price</span>
                <span>${amount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Billing Period</span>
                <span>Lifetime</span>
              </div>

              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>

              <div className="flex justify-between font-bold text-zinc-900 dark:text-white pt-3 border-t border-[#e7e0d3] dark:border-[#2e281d]">
                <span>Total Due Today</span>
                <span className="text-[#C39C45]">${amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#e7e0d3] dark:bg-[#14120e] dark:border-[#383124]">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4" />
                Lifetime Guarantee
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                One-time payment with zero renewal charges or recurring fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <React.Suspense
      fallback={<div className="py-24 text-center">Loading Checkout...</div>}
    >
      <PaymentContent />
    </React.Suspense>
  );
}
