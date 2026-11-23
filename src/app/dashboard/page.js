"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { UILoader } from "@/components/ui-loader";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  React.useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.push("/signin");
      } else {
        const role = (session.user.role || "customer").toLowerCase();
        router.push(`/dashboard/${role}`);
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="py-20 flex items-center justify-center">
      <UILoader message="Opening your workspace..." />
    </div>
  );
}
