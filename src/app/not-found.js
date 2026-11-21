import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b] shadow-inner mb-6">
        <Compass className="h-10 w-10 animate-pulse" />
      </div>
      <p className="text-sm font-semibold tracking-widest text-[#C39C45] uppercase">
        404 Page Not Found
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
        An Unscripted Moment
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
        We could not find the page or service you are seeking. It may have moved or the celebration has already begun elsewhere.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button className="rounded-full bg-[#C39C45] px-6 text-white hover:bg-[#b08b38] flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="outline" className="rounded-full border-[#e7e0d3] hover:bg-[#f6efe2] dark:border-[#383124]">
            Browse All Services
          </Button>
        </Link>
      </div>
    </div>
  );
}
