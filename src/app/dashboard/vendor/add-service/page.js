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
import { ButtonLoader, UILoader } from "@/components/ui-loader";
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

export default function VendorAddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [checkingLimit, setCheckingLimit] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState(MOCK_CATEGORIES[0].name);
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [location, setLocation] = React.useState(DHAKA_LOCATIONS[0]);

  const [imageFiles, setImageFiles] = React.useState([]);
  const [finalImages, setFinalImages] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!user?.email) return;

    Promise.resolve().then(async () => {
      try {
        let token = getStoredToken();
        if (!token) {
          token = await fetchAuthToken(user);
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/services/vendor/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );
        if (res.ok) {
          const list = await res.json();
          const isPremium = Boolean(user.premium || user.subscriptionPlan === "Premium");
          if (!isPremium && Array.isArray(list) && list.length >= 3) {
            toast.error("Free plan limit reached (maximum 3 services). Upgrade to Premium to list more services.");
            router.push("/payment?plan=Platinum+Signature&amount=150");
            return;
          }
        }
      } catch {
      } finally {
        if (active) {
          setCheckingLimit(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [user, router]);

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

      if (result.status === 403 || data.limitReached) {
        toast.error(data.message || "Free plan limit reached. Upgrade to Premium.");
        router.push("/payment?plan=Platinum+Signature&amount=150");
        return;
      }

      if (result.ok && (data.acknowledged || data.insertedId || data.success)) {
        toast.success("Service submitted successfully and is pending approval!");
        router.push("/dashboard/vendor/services");
      } else {
        toast.error(data.message || "Failed to add service. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingLimit) {
    return (
      <div className="py-24">
        <UILoader
          text="Verifying subscription tier..."
          subtext="Checking available service slots for your vendor account."
        />
      </div>
    );
  }

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
              Service Package Name *
            </label>
            <Input
              required
              name="name"
              disabled={submitting}
              placeholder="e.g. Grand Crystal Ballroom Wedding Package"
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e7e0d3] bg-white px-3.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-200"
              >
                {MOCK_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Starting Price (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={submitting}
                  name="price"
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
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <select
                required
                name="location"
                disabled={submitting}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e7e0d3] bg-white text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-200"
              >
                {DHAKA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
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
                    className="relative cursor-pointer rounded-md font-semibold text-[#C39C45] hover:underline"
                  >
                    <span>Upload portfolio photos</span>
                    <input
                      id="service-file-upload"
                      name="images"
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={uploading || submitting}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-zinc-500">
                  PNG, JPG, WEBP up to 5MB each (Max 5 photos)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="rounded-full bg-[#C39C45] px-8 text-white hover:bg-[#b08b38] h-12 font-medium shadow-md transition"
            >
              {submitting ? (
                <ButtonLoader text="Submitting Service Offering..." />
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Submit Service for Admin Review</span>
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
