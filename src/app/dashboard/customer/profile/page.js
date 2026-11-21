"use client";

import * as React from "react";
import Image from "next/image";
import { User, Phone, MapPin, Camera, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/ui-loader";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function CustomerProfileSettingsPage() {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "Sophia Montgomery",
    email: "sophia.montgomery@example.com",
    phone: "+1 (555) 234-8891",
    city: "New York, NY",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio: "Bride-to-be planning our dream autumn wedding ceremony and reception in Central Park."
  });

  React.useEffect(() => {
    if (session?.user) {
      queueMicrotask(() => {
        setFormData((prev) => ({
          ...prev,
          name: session.user.name || prev.name,
          email: session.user.email || prev.email,
          image: session.user.image || prev.image
        }));
      });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Profile settings updated successfully!");
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
          Update your bridal contact information, location, and wedding vision bio.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#f0ebe1] dark:border-[#2e281d]">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#f6efe2] text-[#C39C45] flex items-center justify-center font-bold text-2xl border-2 border-[#C39C45]">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt={formData.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{formData.name[0]}</span>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Profile Image URL
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
                Full Name *
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
                Phone Number
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Current City / Region
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="e.g. New York, NY"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Personal Wedding Bio & Vision
            </label>
            <Textarea
              rows={4}
              placeholder="Tell vendors about your wedding style, vision, preferred dates, and design inspirations..."
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
                <ButtonLoader text="Saving Changes..." />
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  <span>Save Profile Settings</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
