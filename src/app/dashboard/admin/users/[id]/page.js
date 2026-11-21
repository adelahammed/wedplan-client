"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Trash2,
  CheckCircle2,
  Ban
} from "lucide-react";
import { fetchUserById, updateUserStatus, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";

export default function AdminUserDetailsPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadUser = React.useCallback(async () => {
    try {
      const data = await fetchUserById(id);
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleToggleBlock = async () => {
    if (!user) return;
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    try {
      await updateUserStatus(user.id, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      loadUser();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      await deleteUser(user.id);
      toast.success("User permanently deleted");
      router.push("/dashboard/admin/users");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <UILoader
        message="Loading User Profile"
        subtext="Fetching user credentials, account history, and status..."
      />
    );
  }

  if (!user) {
    return (
      <div className="py-16 text-center space-y-4">
        <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          User Not Found
        </h3>
        <p className="text-sm text-zinc-500">The user account does not exist or was deleted.</p>
        <Link href="/dashboard/admin/users">
          <Button variant="outline">Return to Users List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#C39C45] transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Manage Users</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
              Account Record
            </span>
            <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              User Profile: {user.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleToggleBlock}
              className={`rounded-full ${
                user.status === "Active"
                  ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {user.status === "Active" ? (
                <span className="flex items-center gap-2">
                  <Ban className="h-4 w-4" />
                  Block Account
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Unblock Account
                </span>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete User</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 shadow-xs text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-serif text-3xl font-bold shadow-md">
            {user.image ? (
              <Image src={user.image} alt={user.name} fill className="object-cover" />
            ) : (
              <span>{user.name[0]}</span>
            )}
          </div>
          <h2 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            {user.name}
          </h2>
          <p className="text-xs text-zinc-500 mt-1">{user.email}</p>
          <div className="mt-4 flex justify-center gap-2">
            <span className="rounded-full bg-[#f6efe2] px-3 py-1 text-xs font-semibold text-[#C39C45] dark:bg-[#29241b]">
              {user.role}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                user.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl border border-[#e7e0d3] bg-white p-7 shadow-xs space-y-6 dark:border-[#383124] dark:bg-[#1c1914]">
          <div>
            <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50 border-b border-[#f0ebe1] dark:border-[#2e281d] pb-3">
              User Information & Bio
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {user.bio || "No biography provided for this user."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdfbf7] dark:bg-[#14120e] border border-[#e7e0d3] dark:border-[#383124]">
              <Mail className="h-5 w-5 text-[#C39C45]" />
              <div>
                <span className="text-[11px] text-zinc-400 block">Email Address</span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdfbf7] dark:bg-[#14120e] border border-[#e7e0d3] dark:border-[#383124]">
              <Phone className="h-5 w-5 text-[#C39C45]" />
              <div>
                <span className="text-[11px] text-zinc-400 block">Phone Number</span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user.phone || "+1 (555) 000-0000"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdfbf7] dark:bg-[#14120e] border border-[#e7e0d3] dark:border-[#383124]">
              <MapPin className="h-5 w-5 text-[#C39C45]" />
              <div>
                <span className="text-[11px] text-zinc-400 block">Location City</span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user.city || "Not specified"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#fdfbf7] dark:bg-[#14120e] border border-[#e7e0d3] dark:border-[#383124]">
              <Calendar className="h-5 w-5 text-[#C39C45]" />
              <div>
                <span className="text-[11px] text-zinc-400 block">Registration Date</span>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{user.registeredDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete User "${user.name}"?`}
        description="Are you sure you want to permanently delete this user? This will revoke all their platform access immediately."
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
}
