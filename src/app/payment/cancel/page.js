import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-xl dark:border-[#383124] dark:bg-[#1c1914] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <AlertCircle className="h-10 w-10" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Checkout Suspended
          </span>
          <h1 className="mt-2 text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No charges were applied to your payment method. You can revisit your subscription options or return to your vendor dashboard whenever you are ready.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/vendor/subscription" className="flex-1">
            <Button className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Review Plans</span>
            </Button>
          </Link>
          <Link href="/dashboard/vendor" className="flex-1">
            <Button variant="outline" className="w-full h-11 rounded-full border-[#e7e0d3] dark:border-[#383124]">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
