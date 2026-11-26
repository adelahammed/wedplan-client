"use client";

import * as React from "react";
import Image from "next/image";
import { User, Camera, Save, Upload, X } from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/ui-loader";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function CustomerProfileSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [submitting, setSubmitting] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    image: "",
    bio: "",
  });

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          bio: user.bio || "",
        });
      }
    });
    return () => {
      active = false;
    };
  }, [user]);

  const handleImageUpload = async (e) => {
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

    setUploading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API;
      if (!apiKey) {
        throw new Error("ImgBB API key is missing.");
      }

      const bodyFormData = new FormData();
      bodyFormData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: bodyFormData,
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setFormData((prev) => ({ ...prev, image: result.data.url }));
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      toast.error(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }
      const userId = user.id || user._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/profile/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            image: formData.image,
            bio: formData.bio,
          }),
        },
      );
      if (res.ok) {
        toast.success("Profile settings updated successfully!");
      } else {
        toast.error("Failed to update profile settings");
      }
    } catch {
      toast.error("Failed to update profile settings");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
          Personal Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Customer Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage your identity and wedding planning preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold text-2xl border-2 border-[#C39C45] shrink-0">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name || "Customer"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{(formData.name || "C")[0]}</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-3">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Profile Photo
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-full border-[#e7e0d3] dark:border-[#383124] text-xs font-medium h-9 px-4 hover:border-[#C39C45]"
                >
                  {uploading ? (
                    <ButtonLoader text="Uploading..." />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-3.5 w-3.5 text-[#C39C45]" />
                      <span>Upload with ImgBB</span>
                    </span>
                  )}
                </Button>

                {formData.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleRemoveImage}
                    className="rounded-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-9 px-3"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Supports PNG, JPG, or WEBP up to 5MB.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Wedding Vision & Notes
            </label>
            <Textarea
              rows={4}
              placeholder="Tell vendors about your vision, themes, color palette, or estimated timeline..."
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="rounded-full bg-[#C39C45] px-8 text-white hover:bg-[#b08b38] h-11 font-medium shadow-sm transition"
            >
              {submitting ? (
                <ButtonLoader text="Saving Profile Settings..." />
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Update Profile Details</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
