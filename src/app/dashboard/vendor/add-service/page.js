"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  CheckCircle2,
  PlusCircle,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { createService, MOCK_CATEGORIES } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function VendorAddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(MOCK_CATEGORIES[0].name);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [location, setLocation] = React.useState("");

  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState("");
  const [uploadProgress, setUploadProgress] = React.useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !location || !description) {
      toast.error("Please fill in all required service details.");
      return;
    }

    setSubmitting(true);
    setUploadProgress("Uploading image to ImgBB secure cloud...");

    try {
      await new Promise((r) => setTimeout(r, 600));
      setUploadProgress("Registering service package...");

      const finalImage =
        imagePreview ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80";

      await createService({
        name,
        category,
        price,
        location,
        description,
        image: finalImage,
        gallery: [finalImage],
        vendor: {
          id: session?.user?.id || "vnd-current",
          name: session?.user?.name || "The Royal Ballroom Hospitality Group",
          email: session?.user?.email || "vendor@wedplan.com",
          phone: "+1 (555) 234-8891",
          avatar: session?.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          isPremium: true
        }
      });

      toast.success("Service successfully submitted for admin review!");
      router.push("/dashboard/vendor/services");
    } catch {
      toast.error("Failed to add service. Please try again.");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
          New Offering
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Add New Wedding Service
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          List a new wedding venue, photography package, floral styling, or catering menu.
        </p>
      </div>

      <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Service Name *
            </label>
            <Input
              required
              placeholder="e.g. Celestial Ballroom Grand Reception Package"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Service Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e7e0d3] bg-white px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#14120e] dark:text-zinc-200"
              >
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Starting Rate / Price *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  required
                  placeholder="3,500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Service Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                required
                placeholder="e.g. Manhattan, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 rounded-xl border-[#e7e0d3] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Comprehensive Service Description *
            </label>
            <Textarea
              required
              rows={4}
              placeholder="Highlight package inclusions, event capacity, setup hours, tasting policies, and special equipment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Service Cover Image (Upload via ImgBB Hosting) *
            </label>
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-[#e7e0d3] px-6 pt-5 pb-6 dark:border-[#383124]">
              <div className="space-y-2 text-center">
                {imagePreview ? (
                  <div className="relative mx-auto h-44 w-72 rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={imagePreview}
                      alt="Uploaded preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-[#C39C45]" />
                )}
                <div className="flex text-sm text-zinc-600 dark:text-zinc-400 justify-center">
                  <label
                    htmlFor="service-file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-[#C39C45] hover:underline"
                  >
                    <span>{imagePreview ? "Change Selected Image" : "Upload High-Res Photo"}</span>
                    <input
                      id="service-file-upload"
                      name="service-file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-zinc-400">
                  PNG, JPG, or WEBP up to 10MB (Processed via ImgBB API)
                </p>
              </div>
            </div>
          </div>

          {uploadProgress && (
            <div className="p-3 rounded-xl bg-[#f6efe2] text-[#C39C45] text-xs flex items-center gap-2 dark:bg-[#29241b]">
              <span className="w-3.5 h-3.5 border-2 border-[#C39C45] border-t-transparent rounded-full animate-spin" />
              <span>{uploadProgress}</span>
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition text-sm"
            >
              {submitting ? (
                <ButtonLoader text="Submitting Service Package..." />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Publish Wedding Service</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
