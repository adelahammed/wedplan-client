"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  ExternalLink,
  Power,
  PowerOff,
  Briefcase,
  ArrowRight,
  Save,
  X
} from "lucide-react";
import { fetchServices, updateService, deleteService, MOCK_CATEGORIES } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { UILoader, ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";

export default function VendorMyServicesPage() {
  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState(null);
  const [editLoading, setEditLoading] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleActive = async (service) => {
    const newActiveState = !service.isActive;
    try {
      await updateService(service.id, { isActive: newActiveState });
      toast.success(
        newActiveState
          ? `Service "${service.name}" is now Active`
          : `Service "${service.name}" is paused (Inactive)`
      );
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditModal = (service) => {
    setEditingService({ ...service });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingService) return;
    setEditLoading(true);
    try {
      await updateService(editingService.id, {
        name: editingService.name,
        category: editingService.category,
        price: editingService.price,
        location: editingService.location,
        description: editingService.description
      });
      toast.success("Service updated successfully!");
      setEditDialogOpen(false);
      setEditingService(null);
      loadData();
    } catch {
      toast.error("Failed to update service");
    } finally {
      setEditLoading(false);
    }
  };

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteService(serviceToDelete.id);
      toast.success(`Service "${serviceToDelete.name}" was deleted`);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      loadData();
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Portfolio Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            My Wedding Services
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Edit your live service packages, pause availability, or create new offerings.
          </p>
        </div>
        <Link href="/dashboard/vendor/add-service">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add Service</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <UILoader
          message="Loading Your Services"
          subtext="Fetching your published packages and pricing..."
        />
      ) : services.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
            <Briefcase className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No Services Published
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            You have not listed any wedding services yet. Add your first venue, photography package, or catering offering now.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/vendor/add-service">
              <Button className="rounded-full bg-[#C39C45] px-6 text-white hover:bg-[#b08b38] flex items-center gap-2 mx-auto">
                <PlusCircle className="h-4 w-4" />
                <span>Add Service</span>
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`rounded-2xl border bg-white shadow-xs overflow-hidden flex flex-col justify-between transition dark:bg-[#1c1914] ${
                service.isActive === false
                  ? "border-zinc-300 opacity-75 dark:border-zinc-800"
                  : "border-[#e7e0d3] dark:border-[#383124]"
              }`}
            >
              <div>
                <div className="relative h-44 w-full bg-zinc-100">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
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
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        service.isActive !== false
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-600 text-white"
                      }`}
                    >
                      {service.isActive !== false ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#C39C45]" />
                      {service.location}
                    </span>
                    <span className="text-base font-serif font-bold text-[#C39C45]">
                      {service.price}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50 line-clamp-1">
                    {service.name}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#f0ebe1] dark:border-[#2e281d] mt-2 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(service)}
                  className={`rounded-xl text-xs flex items-center gap-1.5 ${
                    service.isActive !== false
                      ? "text-zinc-600 hover:text-amber-600"
                      : "text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  {service.isActive !== false ? (
                    <>
                      <PowerOff className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Power className="h-3.5 w-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(service)}
                    className="rounded-xl text-xs flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-[#C39C45]" />
                    <span>Update</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(service)}
                    className="rounded-xl text-xs text-red-600 hover:bg-red-50"
                    aria-label={`Delete service ${service.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingService && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg bg-white dark:bg-[#1c1914] border-[#e7e0d3] dark:border-[#383124] rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                Update Service Package
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Service Name
                </label>
                <Input
                  required
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full h-10 rounded-xl border border-[#e7e0d3] bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#14120e] dark:text-zinc-200"
                  >
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                    Price / Rate
                  </label>
                  <Input
                    required
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: e.target.value })
                    }
                    className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Location / City
                </label>
                <Input
                  required
                  value={editingService.location}
                  onChange={(e) =>
                    setEditingService({ ...editingService, location: e.target.value })
                  }
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Package Description
                </label>
                <Textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
                />
              </div>

              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-xl bg-[#C39C45] text-white hover:bg-[#b08b38]"
                >
                  {editLoading ? <ButtonLoader text="Saving Changes..." /> : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete Service "${serviceToDelete?.name}"?`}
        description="Are you sure you want to permanently delete this wedding service? This will cancel any pending booking requests for this service."
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
