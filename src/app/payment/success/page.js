import { stripe } from "@/lib/stripe";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const {
    id,
    status,
    payment_status,
    customer_details,
    amount_total,
    currency,
    created,
    metadata,
    line_items,
  } = session;

  if (status === "open") {
    return <div className="py-24 text-center">Payment is still pending.</div>;
  }

  if (status !== "complete" || payment_status !== "paid") {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold">Payment is not completed.</h1>
        <Link href="/dashboard/vendor/subscription">
          Return to Subscription
        </Link>
      </div>
    );
  }

  const plan =
    metadata?.plan ||
    line_items?.data?.[0]?.description ||
    "Vendor Subscription";

  const amount = ((amount_total || 0) / 100).toFixed(2);

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
              {id}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Customer:</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right">
              {customer_details?.name || "N/A"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-zinc-400">Email:</span>
            <span className="text-zinc-600 dark:text-zinc-400 text-right break-all">
              {customer_details?.email || "N/A"}
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
              {currency?.toUpperCase()} {amount}
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
          <Link href="/dashboard/vendor" className="flex-1">
            <Button className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium flex items-center justify-center gap-2">
              <span>Go to Vendor Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/dashboard/vendor/services" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-11 rounded-full border-[#e7e0d3] dark:border-[#383124]"
            >
              View My Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
