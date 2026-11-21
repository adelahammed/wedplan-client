"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Sparkles, ArrowRight, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txId = searchParams.get("id") || "TXN-9428";
  const plan = searchParams.get("plan") || "Platinum Signature Vendor Plan";
  const amount = searchParams.get("amount") || "49.00";
  const date = "2026-11-22";

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-2xl dark:border-[#383124] dark:bg-[#1c1914] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Payment Confirmed
          </span>
          <h1 className="mt-2 text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Welcome to Platinum!
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Your vendor subscription has been authorized. Your services now feature priority placement and verified badges.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e7e0d3] bg-[#fdfbf7] p-5 text-left space-y-2.5 text-xs dark:border-[#383124] dark:bg-[#14120e]">
          <div className="flex justify-between">
            <span className="text-zinc-400">Transaction ID:</span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{txId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Subscription Tier:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{plan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Amount Paid:</span>
            <span className="font-bold text-[#C39C45]">${amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Effective Date:</span>
            <span className="text-zinc-600 dark:text-zinc-400">{date}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/vendor" className="flex-1">
            <Button className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium flex items-center justify-center gap-2">
              <span>Go to Vendor Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/vendor/services">
            <Button variant="outline" className="h-11 rounded-full border-[#e7e0d3] dark:border-[#383124]">
              View My Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense fallback={<div className="py-24 text-center">Loading Receipt...</div>}>
      <PaymentSuccessContent />
    </React.Suspense>
  );
}
