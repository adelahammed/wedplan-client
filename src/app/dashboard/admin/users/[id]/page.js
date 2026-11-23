"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  Trash2,
  CheckCircle2,
  Ban,
  Briefcase
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function AdminUserDetailsPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadUser = React.useCallback(async () => {
    if (!currentUser || !id) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [currentUser, id]);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && currentUser) {
        loadUser();
      }
    });
    return () => {
      active = false;
    };
  }, [currentUser, loadUser]);

  const handleToggleBlock = async () => {
    if (!user) return;
    const nextBlockedState = !user.isBlocked;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}/block`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ isBlocked: nextBlockedState })
        }
      );
      if (res.ok) {
        toast.success(`User is now ${nextBlockedState ? "Blocked" : "Active"}`);
        loadUser();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.ok) {
        toast.success("User removed successfully");
        router.push("/dashboard/admin/users");
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <UILoader
        message="Loading User Record"
        subtext="Fetching member security history and permissions..."
      />
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          User Record Not Found
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          The requested user account may have been deleted.
        </p>
        <Link href="/dashboard/admin/users" className="mt-4 inline-block">
          <Button variant="outline" className="rounded-full">
            Back to Users Directory
          </Button>
        </Link>
      </div>
    );
  }

  const isBlocked = Boolean(user.isBlocked);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-[#C39C45] transition-colors dark:text-zinc-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Users</span>
        </Link>

        <div className="flex items-center gap-2">
          {user.role?.toLowerCase() !== "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleBlock}
              className={`rounded-full text-xs font-semibold ${
                isBlocked
                  ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  : "border-amber-300 text-amber-700 hover:bg-amber-50"
              }`}
            >
              {isBlocked ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>Unblock Account</span>
                </>
              ) : (
                <>
                  <Ban className="h-3.5 w-3.5 mr-1" />
                  <span>Block Account</span>
                </>
              )}
            </Button>
          )}

          {user.role?.toLowerCase() !== "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="rounded-full text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>Delete User</span>
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-serif font-bold text-3xl">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <span>{(user.name || "U")[0].toUpperCase()}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {user.name || "Anonymous Member"}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  user.role?.toLowerCase() === "admin"
                    ? "bg-purple-50 text-purple-700"
                    : user.role?.toLowerCase() === "vendor"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {user.role ? user.role.toUpperCase() : "CUSTOMER"}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
              Account Attributes
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Account ID:</span>
                <span className="font-mono text-xs">{user._id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Status:</span>
                <span className={`font-semibold ${isBlocked ? "text-red-600" : "text-emerald-600"}`}>
                  {isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Subscription Plan:</span>
                <span className="font-semibold text-[#C39C45]">
                  {user.subscriptionPlan ? user.subscriptionPlan.toUpperCase() : "FREE"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Registration Date:</span>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-400">
              Activity & Metrics
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Published Services:</span>
                <span className="font-semibold">{user.servicesCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Booking Requests:</span>
                <span className="font-semibold">{user.bookingsCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Business Name:</span>
                <span>{user.businessName || "Not Provided"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Remove Member Account?"
        description={`Are you sure you want to delete ${user?.name}? This action will permanently remove their records.`}
        confirmText="Yes, Delete Account"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
