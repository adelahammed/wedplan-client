"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
  ExternalLink,
  Power,
  PowerOff,
  Briefcase,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import { MOCK_CATEGORIES } from "@/lib/api";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UILoader, ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const DHAKA_LOCATIONS = [
  "Gulshan, Dhaka",
  "Mirpur, Dhaka",
  "Bashundhara, Dhaka",
  "Uttara, Dhaka",
  "Banani, Dhaka",
  "Dhanmondi, Dhaka",
  "Mohammadpur, Dhaka",
  "New Market, Dhaka",
  "Dhaka, Bangladesh",
];

function VendorServicesContent() {
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

  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [serviceToDelete, setServiceToDelete] = React.useState(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState(null);
  const [editLoading, setEditLoading] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!user) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const vendorId = user.id || user._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/vendor/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load your services.");
    } finally {
      setLoading(false);
    }
  }, [user, setServices]);

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

  const handleToggleActive = async (service) => {
    const currentStatus = (service.status || "pending").toLowerCase();
    if (currentStatus === "pending") {
      toast.error("This service is currently pending approval by Admin. Once approved, you can pause or activate it.");
      return;
    }
    if (currentStatus === "rejected") {
      toast.error("This service was rejected by Admin and cannot be activated.");
      return;
    }

    const nextStatus = currentStatus === "active" ? "paused" : "active";
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${service._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(
          nextStatus === "active"
            ? `Service "${service.name}" is now Active`
            : `Service "${service.name}" is now Paused`
        );
        loadData();
      } else {
        toast.error(data.message || "Failed to update service status.");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openEditModal = (service) => {
    const existingImages = Array.isArray(service.images)
      ? [...service.images]
      : service.image
      ? [service.image]
      : [];
    setEditingService({
      ...service,
      images: existingImages,
      location: service.location || DHAKA_LOCATIONS[0],
    });
    setEditDialogOpen(true);
  };

  const handleAddEditImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API;
      if (!apiKey) throw new Error("ImgBB API key is missing.");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setEditingService((prev) => ({
        ...prev,
        images: [...(prev?.images || []), result.data.url],
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveEditImage = (indexToRemove) => {
    setEditingService((prev) => ({
      ...prev,
      images: (prev?.images || []).filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    if (!editingService.images || editingService.images.length === 0) {
      toast.error("Please keep at least one image for your service.");
      return;
    }

    setEditLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${editingService._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editingService.name,
            category: editingService.category,
            price: Number(editingService.price) || editingService.price,
            location: editingService.location,
            description: editingService.description,
            images: editingService.images,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Service updated successfully!");
        setEditDialogOpen(false);
        setEditingService(null);
        loadData();
      } else {
        toast.error(data.message || "Failed to update service");
      }
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
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services/${serviceToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        toast.success(`Service "${serviceToDelete.name}" was deleted`);
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete service");
      }
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const status = (s.status || "pending").toLowerCase();
    if (activeFilter === "active") return status === "active";
    if (activeFilter === "pending") return status === "pending";
    if (activeFilter === "rejected") return status === "rejected";
    return true;
  });

  const filterTabs = [
    { id: "all", label: "All Services", count: services.length },
    {
      id: "active",
      label: "Active Services",
      count: services.filter((s) => (s.status || "").toLowerCase() === "active").length,
    },
    {
      id: "pending",
      label: "Pending Services",
      count: services.filter((s) => (s.status || "pending").toLowerCase() === "pending").length,
    },
    {
      id: "rejected",
      label: "Rejected Services",
      count: services.filter((s) => (s.status || "").toLowerCase() === "rejected").length,
    },
  ];

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

      <div className="flex flex-wrap gap-2 border-b border-[#e7e0d3] pb-4 dark:border-[#383124]">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveFilter(tab.id);
              router.push(`/dashboard/vendor/services?status=${tab.id}`, { scroll: false });
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
          message="Loading Your Services"
          subtext="Fetching your published packages and pricing..."
        />
      ) : filteredServices.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
            <Briefcase className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No Services Found
          </h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            {activeFilter === "all"
              ? "You have not listed any wedding services yet. Add your first venue, photography package, or catering offering now."
              : `No services found matching the "${activeFilter}" status.`}
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
          {filteredServices.map((service) => {
            const coverImage =
              Array.isArray(service.images) && service.images.length > 0
                ? service.images[0]
                : service.image || "/assets/Slider Image (1).jpg";
            const currentStatus = (service.status || "pending").toLowerCase();
            const isServiceActive = currentStatus === "active";
            const isPaused = currentStatus === "paused";
            const isPending = currentStatus === "pending";
            const isRejected = currentStatus === "rejected";

            return (
              <div
                key={service._id}
                className={`rounded-2xl border bg-white shadow-xs overflow-hidden flex flex-col justify-between transition dark:bg-[#1c1914] ${
                  !isServiceActive
                    ? "border-zinc-300 opacity-90 dark:border-zinc-800"
                    : "border-[#e7e0d3] dark:border-[#383124]"
                }`}
              >
                <div>
                  <div className="relative h-44 w-full bg-zinc-100">
                    <Image
                      src={coverImage}
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
                          isServiceActive
                            ? "bg-emerald-600 text-white"
                            : isPaused
                            ? "bg-zinc-600 text-white"
                            : isRejected
                            ? "bg-red-600 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {service.status ? service.status.toUpperCase() : "PENDING"}
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
                        ${service.price}
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
                  {isPending || isRejected ? (
                    <span className="text-[11px] font-medium text-zinc-400">
                      {isPending ? "Pending Admin Approval" : "Service Rejected"}
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(service)}
                      className={`rounded-xl text-xs flex items-center gap-1.5 ${
                        isServiceActive
                          ? "text-zinc-600 hover:text-amber-600"
                          : "text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {isServiceActive ? (
                        <>
                          <PowerOff className="h-3.5 w-3.5 text-zinc-400" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Power className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Activate</span>
                        </>
                      )}
                    </Button>
                  )}

                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(service)}
                      className="h-8 w-8 rounded-lg text-zinc-500 hover:text-[#C39C45] hover:bg-[#f6efe2] dark:hover:bg-[#29241b]"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteModal(service)}
                      className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Link href={`/services/${service._id}`} target="_blank">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1c1914] dark:border-[#383124] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Edit Wedding Service
            </DialogTitle>
          </DialogHeader>

          {editingService && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Service Name
                </label>
                <Input
                  required
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value,
                      })
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
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                    Price ($)
                  </label>
                  <Input
                    required
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: e.target.value,
                      })
                    }
                    className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Location
                </label>
                <select
                  required
                  value={editingService.location}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      location: e.target.value,
                    })
                  }
                  className="w-full h-10 rounded-xl border border-[#e7e0d3] bg-white px-3 text-xs outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#14120e] dark:text-zinc-200"
                >
                  {DHAKA_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <Textarea
                  required
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Service Portfolio Photos
                </label>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {(editingService.images || []).map((imgUrl, idx) => (
                    <div
                      key={imgUrl + idx}
                      className="relative h-20 rounded-xl overflow-hidden border border-[#e7e0d3] dark:border-[#383124]"
                    >
                      <Image
                        src={imgUrl}
                        alt="Service Image"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(idx)}
                        className="absolute right-1 top-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-[#e7e0d3] bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:border-[#C39C45] dark:border-[#383124] dark:bg-[#14120e] dark:text-zinc-300">
                    <UploadCloud className="h-3.5 w-3.5 text-[#C39C45]" />
                    <span>{uploadingImage ? "Uploading to ImgBB..." : "Add Photo with ImgBB"}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAddEditImage}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <DialogFooter className="pt-4 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading || uploadingImage}
                  className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex items-center gap-1.5"
                >
                  {editLoading ? (
                    <ButtonLoader text="Saving..." />
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Service Package?"
        description={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be reversed.`}
        confirmText="Yes, Delete Service"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function VendorMyServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24">
          <UILoader
            message="Loading Vendor Portfolio"
            subtext="Please wait..."
          />
        </div>
      }
    >
      <VendorServicesContent />
    </React.Suspense>
  );
}
