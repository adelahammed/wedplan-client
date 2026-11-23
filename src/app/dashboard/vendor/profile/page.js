"use client";

import * as React from "react";
import Image from "next/image";
import { User, Phone, MapPin, Camera, Save, Briefcase } from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/ui-loader";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function VendorProfileSettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    image: "",
    bio: "",
    businessName: ""
  });

  React.useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active && user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          city: user.location || "",
          image: user.image || "",
          bio: user.bio || "",
          businessName: user.businessName || user.name || ""
        });
      }
    });
    return () => {
      active = false;
    };
  }, [user]);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/profile/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          phone: formData.phone,
          businessName: formData.businessName,
          location: formData.city,
          bio: formData.bio
        })
      });
      if (res.ok) {
        toast.success("Vendor profile and contact details updated successfully!");
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
          Business Profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Vendor Profile Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Edit your public business identity, contact channels, studio location, and client bio.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold text-2xl border-2 border-[#C39C45]">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name || "Vendor"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{(formData.name || "V")[0]}</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Studio Logo / Profile Photo URL
              </label>
              <div className="relative">
                <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Representative Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Business / Studio Name *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Direct Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Operating City / Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="e.g. Manhattan, New York"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Public Business Bio & Studio Story
            </label>
            <Textarea
              rows={4}
              placeholder="Introduce your business background, accolades, awards, capacity, and creative philosophy..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#C39C45] px-8 text-white hover:bg-[#b08b38] h-11 font-medium shadow-sm transition"
            >
              {submitting ? (
                <ButtonLoader text="Saving Vendor Details..." />
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Update Vendor Profile</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
