"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Clock,
  Check,
  X,
  Mail,
  User,
  CalendarHeart,
  MessageSquare,
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { UILoader, ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

function VendorBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");
  const [manualFilter, setManualFilter] = React.useState(null);
  const activeFilter =
    manualFilter || (statusParam ? statusParam.toLowerCase() : "all");

  const setActiveFilter = (f) => {
    setManualFilter(f);
  };

  const { data: session } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoadingId, setActionLoadingId] = React.useState(null);

  const loadData = React.useCallback(async () => {
    if (!user) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const vendorId = user.id || user._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/vendor/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  }, [user, setBookings]);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && user) {
        loadData();
      }
    });
    return () => {
      active = false;
    };
  }, [user, loadData]);

  const handleUpdateStatus = async (booking, newStatus) => {
    setActionLoadingId(booking._id);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus.toLowerCase() }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(
          newStatus === "Accepted"
            ? `Booking request from ${booking.customerName} accepted!`
            : `Booking request declined`
        );
        loadData();
      } else {
        toast.error(data.message || "Failed to update booking status");
      }
    } catch {
      toast.error("Failed to update booking status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const status = (b.status || "pending").toLowerCase();
    if (activeFilter === "pending") return status === "pending";
    if (activeFilter === "accepted") return status === "accepted";
    if (activeFilter === "cancelled" || activeFilter === "rejected") {
      return status === "cancelled" || status === "rejected";
    }
    return true;
  });

  const filterTabs = [
    { id: "all", label: "All Requests", count: bookings.length },
    {
      id: "pending",
      label: "Pending",
      count: bookings.filter((b) => (b.status || "pending").toLowerCase() === "pending").length,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: bookings.filter((b) => (b.status || "").toLowerCase() === "accepted").length,
    },
    {
      id: "cancelled",
      label: "Cancelled / Rejected",
      count: bookings.filter(
        (b) => (b.status || "").toLowerCase() === "cancelled" || (b.status || "").toLowerCase() === "rejected"
      ).length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Client Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Customer Booking Requests
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review event dates, messages, and accept or reject customer booking inquiries.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#e7e0d3] pb-4 dark:border-[#383124]">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveFilter(tab.id);
              router.push(`/dashboard/vendor/bookings?status=${tab.id}`, { scroll: false });
            }}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeFilter === tab.id
                ? "bg-[#C39C45] text-white shadow-sm"
                : "bg-white text-zinc-600 hover:bg-[#f6efe2] hover:text-[#C39C45] dark:bg-[#1c1914] dark:text-zinc-400"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <UILoader
          message="Loading Booking Requests"
          subtext="Fetching customer inquiries and event logistics..."
        />
      ) : filteredBookings.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
            <CalendarHeart className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No Booking Requests Found
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            {activeFilter === "all"
              ? "You currently have no client requests. Ensure your services are active and high quality to attract bookings."
              : `No booking requests matching the "${activeFilter}" filter.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isPending = (b.status || "pending").toLowerCase() === "pending";
            const isAccepted = (b.status || "").toLowerCase() === "accepted";
            const isRejected = (b.status || "").toLowerCase() === "rejected";
            const isCancelled = (b.status || "").toLowerCase() === "cancelled";

            return (
              <div
                key={b._id}
                className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 dark:border-[#383124] dark:bg-[#1c1914]"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="relative h-24 w-28 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                    <Image
                      src={b.serviceImage || "/assets/Slider Image (1).jpg"}
                      alt={b.serviceName || "Wedding Service"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isAccepted
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : isRejected || isCancelled
                            ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}
                      >
                        {b.status ? b.status.toUpperCase() : "PENDING"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Requested on {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-50">
                      {b.serviceName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-zinc-900 dark:text-zinc-100">
                        <User className="h-3.5 w-3.5 text-[#C39C45]" />
                        {b.customerName || "Customer"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-[#C39C45]" />
                        {b.customerEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#C39C45]" />
                        {b.eventDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#C39C45]" />
                        {b.eventLocation}
                      </span>
                    </div>

                    {b.message && (
                      <div className="rounded-xl bg-[#fdfbf7] p-3 border border-[#f0ebe1] text-xs text-zinc-600 dark:bg-[#14120e] dark:border-[#2e281d] dark:text-zinc-300 mt-2 flex items-start gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-[#C39C45] shrink-0 mt-0.5" />
                        <p className="italic">&ldquo;{b.message}&rdquo;</p>
                      </div>
                    )}
                  </div>
                </div>

                {isPending && (
                  <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                    <Button
                      size="sm"
                      disabled={actionLoadingId === b._id}
                      onClick={() => handleUpdateStatus(b, "Accepted")}
                      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 flex-1 lg:flex-none"
                    >
                      {actionLoadingId === b._id ? (
                        <ButtonLoader text="Updating..." />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Check className="h-4 w-4" />
                          <span>Accept Booking</span>
                        </span>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoadingId === b._id}
                      onClick={() => handleUpdateStatus(b, "Rejected")}
                      className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 flex-1 lg:flex-none"
                    >
                      <X className="h-4 w-4 mr-1" />
                      <span>Reject</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function VendorBookingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24">
          <UILoader
            message="Loading Booking Requests"
            subtext="Please wait..."
          />
        </div>
      }
    >
      <VendorBookingsContent />
    </React.Suspense>
  );
}
