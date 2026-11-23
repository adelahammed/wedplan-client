"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  UserX,
  UserCheck,
  Trash2,
  Eye,
  Shield,
  Filter,
  CheckCircle,
  Ban
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!currentUser) return;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (roleFilter !== "All") queryParams.append("role", roleFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Failed to load registered users");
    } finally {
      setLoading(false);
    }
  }, [currentUser, search, roleFilter]);

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && currentUser) {
        loadData();
      }
    });
    return () => {
      active = false;
    };
  }, [currentUser, loadData]);

  const handleToggleBlock = async (u) => {
    const nextBlockedState = !u.isBlocked;
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${u._id}/block`,
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
        toast.success(
          `User ${u.name} is now ${nextBlockedState ? "Blocked" : "Active"}`
        );
        loadData();
      } else {
        toast.error("Failed to update user status");
      }
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const openDeleteDialog = (u) => {
    setUserToDelete(u);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(currentUser);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.ok) {
        toast.success(`User ${userToDelete.name} was removed from the system`);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        loadData();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            Account Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Registered Users
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Audit user permissions, moderate vendor access, and prevent malicious activities.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Customer", "Vendor", "Admin"].map((r) => (
            <Button
              key={r}
              variant={roleFilter.toLowerCase() === r.toLowerCase() ? "default" : "outline"}
              size="sm"
              onClick={() => setRoleFilter(r)}
              className={`rounded-full text-xs font-semibold ${
                roleFilter.toLowerCase() === r.toLowerCase()
                  ? "bg-[#C39C45] text-white hover:bg-[#b08b38]"
                  : "border-[#e7e0d3] text-zinc-600 dark:border-[#383124] dark:text-zinc-300"
              }`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <UILoader
          message="Loading User Directory"
          subtext="Fetching member profiles, roles, and status verification..."
        />
      ) : users.length === 0 ? (
        <div className="my-12 rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
            No matching users found
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Try revising your search term or role filter.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-[#e7e0d3] bg-white overflow-hidden shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fcfaf5] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-[#f0ebe1] dark:bg-[#201c16] dark:border-[#2e281d]">
                <tr>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Role</th>
                  <th className="py-4 px-6 font-semibold">Platform Status</th>
                  <th className="py-4 px-6 font-semibold">Joined Date</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ebe1] dark:divide-[#2e281d]">
                {users.map((u) => {
                  const isBlocked = Boolean(u.isBlocked);
                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-[#faf7f0] dark:hover:bg-[#231e18] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-serif font-bold text-base">
                            {u.image ? (
                              <Image
                                src={u.image}
                                alt={u.name || "User"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span>{(u.name || "U")[0].toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {u.name || "Anonymous User"}
                            </p>
                            <p className="text-xs text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            u.role?.toLowerCase() === "admin"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                              : u.role?.toLowerCase() === "vendor"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                          }`}
                        >
                          {u.role ? u.role.toUpperCase() : "CUSTOMER"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            !isBlocked
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          {!isBlocked ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <Ban className="h-3 w-3" />
                              Blocked
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-xs text-zinc-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/dashboard/admin/users/${u._id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-500 hover:text-[#C39C45] hover:bg-[#f6efe2] dark:hover:bg-[#29241b]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          {u.role?.toLowerCase() !== "admin" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleBlock(u)}
                              title={isBlocked ? "Unblock user" : "Block user"}
                              className={`h-8 w-8 ${
                                isBlocked
                                  ? "text-emerald-600 hover:bg-emerald-50"
                                  : "text-amber-600 hover:bg-amber-50"
                              }`}
                            >
                              {isBlocked ? (
                                <UserCheck className="h-4 w-4" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {u.role?.toLowerCase() !== "admin" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(u)}
                              className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
        title="Remove User Account?"
        description={`Are you sure you want to delete ${userToDelete?.name}'s account? All profile references will be permanently purged.`}
        confirmText="Yes, Remove Account"
        loading={actionLoading}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
