"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Trash2,
  CalendarHeart,
  ArrowRight,
  ExternalLink,
  Ban
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function CustomerBookingsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bookingToCancel, setBookingToCancel] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadBookings = React.useCallback(async () => {
    if (!user) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const customerId = user.id || user._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/customer/${customerId}`,
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
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user, loadBookings]);

  const openCancelDialog = (booking) => {
    setBookingToCancel(booking);
    setDeleteDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setActionLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/bookings/${bookingToCancel._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Booking request cancelled successfully");
        setDeleteDialogOpen(false);
        setBookingToCancel(null);
        loadBookings();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            My Itinerary
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            My Wedding Bookings
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review status updates and event schedules for your booked wedding vendors.
          </p>
        </div>
        <Link href="/services">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] text-xs">
            Explore More Services
          </Button>
        </Link>
      </div>

      {loading ? (
        <UILoader
          message="Loading Your Bookings"
          subtext="Fetching reserved wedding dates, vendor contracts, and notes..."
        />
      ) : bookings.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
            <CalendarHeart className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No Bookings Added
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            You have not submitted any wedding vendor inquiries yet. Browse our verified venues and artisans to get started.
          </p>
          <div className="mt-6">
            <Link href="/services">
              <Button className="rounded-full bg-[#C39C45] px-6 text-white hover:bg-[#b08b38] flex items-center gap-2 mx-auto">
                <span>Browse Services</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => {
            const isPending = b.status?.toLowerCase() === "pending";
            const isAccepted = b.status?.toLowerCase() === "accepted";
            const isCancelled = b.status?.toLowerCase() === "cancelled";
            const isRejected = b.status?.toLowerCase() === "rejected";

            return (
              <div
                key={b._id}
                className="rounded-2xl border border-[#e7e0d3] bg-white shadow-xs overflow-hidden flex flex-col justify-between dark:border-[#383124] dark:bg-[#1c1914]"
              >
                <div>
                  <div className="relative h-44 w-full bg-zinc-100">
                    <Image
                      src={b.serviceImage || "/assets/Slider Image (1).jpg"}
                      alt={b.serviceName || "Wedding Service"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md">
                        {b.category || "Wedding Service"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs ${
                          isAccepted
                            ? "bg-emerald-600 text-white"
                            : isCancelled || isRejected
                            ? "bg-red-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {b.status ? b.status.toUpperCase() : "PENDING"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                      {b.serviceName}
                    </h3>

                    <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#C39C45]" />
                        <span>Event Date: <strong className="text-zinc-800 dark:text-zinc-200">{b.eventDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#C39C45]" />
                        <span>{b.eventLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#C39C45]" />
                        <span>Requested: {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Recent"}</span>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#fdfbf7] dark:bg-[#14120e] p-3 border border-[#f0ebe1] dark:border-[#2e281d] text-xs">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Vendor Information</span>
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{b.vendorName || "Wedding Vendor"}</p>
                      <p className="text-zinc-500 text-[11px]">{b.vendorEmail || ""}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#f0ebe1] dark:border-[#2e281d] mt-2 flex items-center justify-between gap-2">
                  <Link href={`/services/${b.serviceId}`} target="_blank">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View Service</span>
                    </Button>
                  </Link>

                  {isPending && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCancelDialog(b)}
                      className="rounded-xl text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Cancel Wedding Booking Inquiry?"
        description={`Are you sure you want to cancel your booking request for "${bookingToCancel?.serviceName}"? This action cannot be reversed.`}
        confirmText="Yes, Cancel Booking"
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
