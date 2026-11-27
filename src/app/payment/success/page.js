"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UILoader } from "@/components/ui-loader";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (!sessionId) {
        if (active) {
          setLoading(false);
          setError("Please provide a valid session_id");
        }
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/payments/checkout-verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
            cache: "no-store",
          }
        );
        const result = await res.json();
        if (active) {
          if (result.success || result.message === "Payment already verified") {
            setData(result.session || result.payment || { id: sessionId });
          } else {
            setError(result.message || "Payment verification failed");
          }
        }
      } catch {
        if (active) {
          setError("Failed to verify payment with server");
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
  }, [sessionId]);

  if (loading) {
    return (
      <div className="py-24">
        <UILoader
          text="Verifying checkout with Stripe..."
          subtext="Please wait while we confirm your payment and upgrade your account."
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
        <div className="w-full max-w-lg space-y-6 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-2xl dark:border-[#383124] dark:bg-[#1c1914] text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Payment Verification Issue
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {error || "Payment is not completed."}
          </p>
          <div className="pt-2">
            <Button
              onClick={() => {
                window.location.href = "/dashboard/vendor/subscription";
              }}
              className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] px-6"
            >
              Return to Subscription
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const plan = data?.plan || "Platinum Signature";
  const amount = data?.amount_total
    ? (data.amount_total / 100).toFixed(2)
    : (data?.amount ? Number(data.amount).toFixed(2) : "150.00");
  const currency = (data?.currency || "USD").toUpperCase();

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-2xl dark:border-[#383124] dark:bg-[#1c1914] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Payment Confirmed
          </span>

          <h1 className="mt-2 text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Welcome to Platinum!
          </h1>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your payment has been successfully completed. Thank you for choosing
            our vendor membership.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e0d3] bg-[#fdfbf7] p-5 text-left space-y-3 text-xs dark:border-[#383124] dark:bg-[#14120e]">
          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Transaction ID:</span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 break-all text-right">
              {data?.id || sessionId}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Customer:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right">
              {data?.customer_name || data?.customer_email || "Vendor"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Email:</span>
            <span className="text-zinc-600 dark:text-zinc-400 text-right break-all">
              {data?.customer_email || "N/A"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Subscription Tier:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right">
              {plan}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Amount Paid:</span>
            <span className="font-bold text-[#C39C45]">
              {currency} {amount}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Payment Status:</span>
            <span className="font-semibold text-emerald-600">Paid</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-4 w-4" />
          Secure payment verified by Stripe
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              window.location.href = "/dashboard/vendor";
            }}
            className="flex-1 h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium flex items-center justify-center gap-2"
          >
            <span>Go to Vendor Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => {
              window.location.href = "/dashboard/vendor/services";
            }}
            variant="outline"
            className="flex-1 h-11 rounded-full border-[#e7e0d3] dark:border-[#383124]"
          >
            View My Services
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <React.Suspense fallback={<UILoader text="Loading checkout confirmation..." />}>
      <SuccessContent />
    </React.Suspense>
  );
}
