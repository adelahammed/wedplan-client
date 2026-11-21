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
import { fetchUsers, updateUserStatus, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { UILoader } from "@/components/ui-loader";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("All");

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleBlock = async (user) => {
    const newStatus = user.status === "Active" ? "Blocked" : "Active";
    try {
      await updateUserStatus(user.id, newStatus);
      toast.success(`User ${user.name} is now ${newStatus}`);
      loadData();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.name} was removed from the system`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadData();
    } catch {
      toast.error("Failed to remove user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "All" || u.role.toLowerCase() === roleFilter.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
            User Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            View registered couples, vendors, and manage account statuses.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {["All", "Customer", "Vendor", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                roleFilter === r
                  ? "bg-[#C39C45] text-white shadow-xs"
                  : "bg-white text-zinc-600 border border-[#e7e0d3] hover:bg-[#f6efe2] dark:bg-[#1c1914] dark:border-[#383124] dark:text-zinc-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <UILoader
          message="Loading Registered Users"
          subtext="Fetching user profiles, roles, and status..."
        />
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e7e0d3] bg-white p-12 text-center dark:border-[#383124] dark:bg-[#1c1914]">
          <p className="text-sm text-zinc-500">No users match your current filter parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-[#e7e0d3] bg-white p-5 shadow-xs flex flex-col justify-between dark:border-[#383124] dark:bg-[#1c1914]"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold text-lg">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span>{user.name[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-50">
                        {user.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 border-t border-[#f0ebe1] dark:border-[#2e281d] pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Account Role:</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Location:</span>
                    <span>{user.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Registered:</span>
                    <span>{user.registeredDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#f0ebe1] dark:border-[#2e281d] flex items-center justify-between gap-2">
                <Link href={`/dashboard/admin/users/${user.id}`}>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs flex items-center gap-1.5 border-[#e7e0d3] hover:text-[#C39C45]">
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </Button>
                </Link>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleBlock(user)}
                    className={`rounded-xl text-xs ${
                      user.status === "Active"
                        ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    }`}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(user)}
                    className="rounded-xl text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    aria-label={`Remove user ${user.name}`}
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
        title={`Remove User "${userToDelete?.name}"?`}
        description="Are you sure you want to permanently delete this user account? All corresponding booking history and vendor listings will be removed."
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </div>
  );
}
