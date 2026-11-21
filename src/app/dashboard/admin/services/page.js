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
import { fetchServices, updateService, deleteService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";

export default function AdminServicesPage() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadServices = React.useCallback(async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleStatusChange = async (service, newStatus) => {
    try {
      await updateService(service.id, { status: newStatus });
      toast.success(`Service "${service.name}" marked as ${newStatus}`);
      loadServices();
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
      await deleteService(serviceToDelete.id);
      toast.success(`Service "${serviceToDelete.name}" deleted`);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      loadServices();
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesStatus =
      statusFilter === "All" || s.status.toLowerCase() === statusFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.vendor?.name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Service Approvals
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Manage Vendor Services
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Review vendor submissions, approve new listings, or reject non-compliant packages.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search services or vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {["All", "Pending", "Approved", "Rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                statusFilter === st
                  ? "bg-[#C39C45] text-white shadow-xs"
                  : "bg-white text-zinc-600 border border-[#e7e0d3] hover:bg-[#f6efe2] dark:bg-[#1c1914] dark:border-[#383124] dark:text-zinc-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <UILoader
          message="Loading Vendor Services"
          subtext="Fetching submitted service packages and vendor profiles..."
        />
      ) : filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <p className="text-sm text-zinc-500">No services match the current filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-[#e7e0d3] bg-white shadow-xs overflow-hidden flex flex-col justify-between dark:border-[#383124] dark:bg-[#1c1914]"
            >
              <div>
                <div className="relative h-44 w-full bg-zinc-100">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-xs ${
                        service.status === "Approved"
                          ? "bg-emerald-600 text-white"
                          : service.status === "Rejected"
                          ? "bg-red-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#C39C45]" />
                      {service.location}
                    </span>
                    <span className="text-sm font-bold text-[#C39C45]">
                      {service.price}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                    {service.name}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-[#fdfbf7] dark:bg-[#14120e] border border-[#f0ebe1] dark:border-[#2e281d] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Submitted By</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">{service.vendor?.name}</span>
                    </div>
                    <span className="text-zinc-400">{service.createdDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#f0ebe1] dark:border-[#2e281d] mt-2 flex items-center justify-between gap-2">
                <Link href={`/services/${service.id}`} target="_blank">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs flex items-center gap-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-1.5">
                  {service.status !== "Approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(service, "Approved")}
                      className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Approve
                    </Button>
                  )}
                  {service.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(service, "Rejected")}
                      className="rounded-xl text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(service)}
                    className="rounded-xl text-xs text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete Service "${serviceToDelete?.name}"?`}
        description="Are you sure you want to permanently delete this service package? It will be removed from all public listings and search results."
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
}
