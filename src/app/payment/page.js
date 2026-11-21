"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ButtonLoader } from "@/components/ui-loader";
import { processPayment } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const planName = searchParams.get("plan") || "Platinum Signature Vendor Plan";
  const amount = searchParams.get("amount") || "49.00";

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: session?.user?.name || "The Royal Ballroom Hospitality Group",
    email: session?.user?.email || "vendor@wedplan.com",
    address: "450 Lexington Avenue",
    city: "New York",
    zip: "10017",
    cardNumber: "4242 •••• •••• 4242",
    exp: "12/28",
    cvc: "888"
  });

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await processPayment({
        vendorName: formData.name,
        email: formData.email,
        plan: planName,
        amount: `$${amount}`
      });

      toast.success("Payment processed successfully!");
      router.push(`/payment/success?id=${result.id}&plan=${encodeURIComponent(planName)}&amount=${amount}`);
    } catch {
      toast.error("Payment processing error. Please verify your billing details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#fdfbf7] dark:bg-[#14120e] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard/vendor/subscription"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#C39C45] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Subscriptions</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xl dark:border-[#383124] dark:bg-[#1c1914]">
            <div className="flex items-center gap-3 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  Secure Checkout
                </h2>
                <p className="text-xs text-zinc-500">
                  256-Bit SSL Encrypted & PCI-DSS Compliant Payment
                </p>
              </div>
            </div>

            <form onSubmit={handlePay} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Cardholder Full Name
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Billing Email Address
                </label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    required
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Expiration (MM/YY)
                  </label>
                  <Input
                    required
                    placeholder="12/28"
                    value={formData.exp}
                    onChange={(e) => setFormData({ ...formData, exp: e.target.value })}
                    className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11 text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Security Code (CVC)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <Input
                      required
                      placeholder="888"
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      className="pl-9 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11 text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all text-sm"
                >
                  {loading ? (
                    <ButtonLoader text="Processing Payment..." />
                  ) : (
                    <span>Authorize & Pay ${amount}</span>
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/payment/cancel"
                  className="text-xs text-zinc-400 hover:text-red-500 transition underline"
                >
                  Cancel and return to plans
                </Link>
              </div>
            </form>
          </div>

          <div className="md:col-span-5 rounded-3xl border border-[#e7e0d3] bg-[#f8f5ee] p-6 sm:p-7 shadow-xs dark:border-[#383124] dark:bg-[#1a1712] space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C39C45]">
              Order Summary
            </span>

            <div className="border-b border-[#e7e0d3] dark:border-[#2e281d] pb-4">
              <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {planName}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Full-featured luxury vendor membership with priority client dispatch.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100 pt-2 border-t border-[#e7e0d3] dark:border-[#2e281d]">
                <span>Total Due Today</span>
                <span className="text-[#C39C45] text-base font-serif">${amount}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 border border-[#e7e0d3] dark:bg-[#14120e] dark:border-[#383124] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Satisfaction Guarantee</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">
                Cancel or modify your subscription at any time without cancellation fees.
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
    <React.Suspense fallback={<div className="py-24 text-center">Loading Checkout...</div>}>
      <PaymentContent />
    </React.Suspense>
  );
}
