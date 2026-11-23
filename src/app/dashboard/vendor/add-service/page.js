"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, PlusCircle, MapPin, DollarSign, X } from "lucide-react";

import { MOCK_CATEGORIES } from "@/lib/api";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "@/components/ui-loader";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

export default function VendorAddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(MOCK_CATEGORIES[0].name);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [location, setLocation] = React.useState("");

  const [imageFiles, setImageFiles] = React.useState([]);
  const [finalImages, setFinalImages] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);

  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (files.length > 5) {
      toast.error("You can upload maximum 5 images.");
      e.target.value = "";
      return;
    }

    setUploading(true);
    setImageFiles(files);
    setFinalImages([]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    try {
      const imgbbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API}`;

      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch(imgbbAPI, {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          if (!response.ok || !result.success || !result.data?.url) {
            throw new Error(result.error?.message || "Image upload failed.");
          }

          return result.data.url;
        }),
      );

      setFinalImages(uploadedImages);
      toast.success("All images uploaded successfully!");
    } catch (error) {
      setFinalImages([]);
      toast.error(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFinalImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });

    const input = document.getElementById("service-file-upload");
    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!finalImages.length) {
      toast.error("Please upload at least one image.");
      return;
    }

    if (uploading) {
      toast.error("Please wait until images finish uploading.");
      return;
    }

    if (!user) {
      toast.error("Please sign in as a vendor to publish a service.");
      return;
    }

    setSubmitting(true);

    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(user);
      }

      const newService = {
        name,
        category,
        price: Number(price) || price,
        location,
        description,
        images: finalImages,
        vendorId: user.id || user._id,
        vendorName: user.name,
        vendorEmail: user.email,
        vendorImage: user.image,
      };

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newService),
        },
      );
      const data = await result.json();

      if (result.ok && (data.acknowledged || data.insertedId || data.success)) {
        toast.success("Service submitted successfully and is pending approval!");
        router.push("/dashboard/vendor/services");
      } else {
        toast.error(data.message || "Failed to add service. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
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
              name="name"
              disabled={submitting}
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
                disabled={submitting}
                name="category"
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
                  disabled={submitting}
                  name="price"
                  type="number"
                  min="0"
                  placeholder="3500"
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
                name="location"
                disabled={submitting}
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
              name="description"
              disabled={submitting}
              rows={4}
              placeholder="Highlight package inclusions, event capacity, setup hours, tasting policies, and special equipment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-[#e7e0d3] dark:border-[#383124]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Service Cover Images (Maximum 5) *
            </label>
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-[#e7e0d3] px-6 pt-5 pb-6 dark:border-[#383124]">
              <div className="w-full space-y-3 text-center">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={preview}
                        className="relative h-32 rounded-xl overflow-hidden shadow-md"
                      >
                        <Image
                          src={preview}
                          alt={`Service image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        {!uploading && !submitting && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition"
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-[#C39C45]" />
                )}

                <div className="flex justify-center text-sm text-zinc-600 dark:text-zinc-400">
                  <label
                    htmlFor="service-file-upload"
                    className={`relative rounded-md font-semibold text-[#C39C45] hover:underline ${
                      uploading || submitting || imageFiles.length >= 5
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    <span>
                      {imageFiles.length > 0
                        ? "Change Selected Images"
                        : "Upload High-Res Photos"}
                    </span>
                    <input
                      id="service-file-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      disabled={
                        uploading || submitting || imageFiles.length >= 5
                      }
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                <p className="text-xs text-zinc-400">
                  PNG, JPG, or WEBP. Maximum 5 images.
                </p>

                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#C39C45]">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#C39C45] border-t-transparent" />
                    Uploading {imageFiles.length} images to ImgBB...
                  </div>
                ) : finalImages.length > 0 ? (
                  <p className="text-xs text-green-600">
                    {finalImages.length} images uploaded successfully!
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting || uploading || !finalImages.length}
              className="w-full h-12 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition text-sm disabled:opacity-50"
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
