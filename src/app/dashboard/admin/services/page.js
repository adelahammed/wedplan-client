"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Check,
  X,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function AdminServicesPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadServices = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (statusFilter !== "All") queryParams.append("status", statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/services?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        }
      );
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [currentUser, search, statusFilter]);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && currentUser) {
        loadServices();
      }
    });
    return () => {
      active = false;
    };
  }, [currentUser, loadServices]);

  const handleStatusChange = async (service, newStatus) => {
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus.toLowerCase() })
        }
      );
      if (res.ok) {
        toast.success(`Service "${service.name}" marked as ${newStatus}`);
        loadServices();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openDeleteDialog = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setActionLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${serviceToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.ok) {
        toast.success(`Service "${serviceToDelete.name}" deleted`);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        loadServices();
      } else {
        toast.error("Failed to delete service");
      }
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Moderation Queue
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Manage Wedding Services
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review vendor submissions, approve new packages, and moderate platform catalog quality.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by package name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Pending", "Active", "Rejected"].map((st) => (
            <Button
              key={st}
              variant={statusFilter.toLowerCase() === st.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className={`rounded-full text-xs font-semibold ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? "bg-[#C39C45] text-white hover:bg-[#b08b38]"
                  : "border-[#e7e0d3] text-zinc-600 dark:border-[#383124] dark:text-zinc-300"
              }`}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <UILoader
          message="Loading Vendor Services"
          subtext="Fetching catalog listings, approvals, and package descriptions..."
        />
      ) : services.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No services found
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Try revising your search term or status filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e7e0d3] bg-white overflow-hidden shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf5] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-[#f0ebe1] dark:bg-[#201c16] dark:border-[#2e281d]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Service Package</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Starting Price</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
                {services.map((s) => {
                  const coverImage = Array.isArray(s.images) && s.images.length > 0
                    ? s.images[0]
                    : s.image || "/assets/Slider Image (1).jpg";
                  const isApproved = s.status?.toLowerCase() === "active";
                  const isPending = s.status?.toLowerCase() === "pending";
                  const isRejected = s.status?.toLowerCase() === "rejected";

                  return (
                    <tr
                      key={s._id}
                      className="hover:bg-[#faf7f0] dark:hover:bg-[#231e18] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-14 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
                            <Image
                              src={coverImage}
                              alt={s.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-[200px]">
                              {s.name}
                            </p>
                            <p className="text-xs text-zinc-500">{s.vendorName || "Wedding Vendor"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="rounded-full bg-[#f6efe2] px-2.5 py-0.5 text-xs font-medium text-[#C39C45] dark:bg-[#29241b]">
                          {s.category}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#C39C45]" />
                          {s.location}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-serif font-bold text-zinc-900 dark:text-zinc-100">
                        ${s.price}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : isRejected
                              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}
                        >
                          {s.status ? s.status.toUpperCase() : "PENDING"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/services/${s._id}`} target="_blank">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>

                          {!isApproved && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(s, "active")}
                              title="Approve Service"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}

                          {!isRejected && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(s, "rejected")}
                              title="Reject Service"
                              className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(s)}
                            title="Delete Service"
                            className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Inappropriate Service?"
        description={`Are you sure you want to delete "${serviceToDelete?.name}"? It will be removed from all public listings.`}
        confirmText="Yes, Delete Service"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
