"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { fetchAuthToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, User, CheckCircle2, UploadCloud, X } from "lucide-react";
import { ButtonLoader } from "@/components/ui-loader";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("Customer");
  const [password, setPassword] = React.useState("");

  const [imageFile, setImageFile] = React.useState(null);
  const [finalImage, setFinalImage] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const fileInputRef = React.useRef(null);

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  const isPasswordValid = hasMinLen && hasUpper && hasLower;

  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = async (e) => {
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

    setFinalImage("");
    setImageFile(file);
    setUploading(true);

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API;
      if (!apiKey) {
        throw new Error("ImgBB API key is missing.");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error?.message || "Image upload failed.");
      }

      setFinalImage(result.data.url);
      toast.success("Profile photo uploaded successfully!");
    } catch (error) {
      setFinalImage("");
      toast.error(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFinalImage("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password must be at least 6 characters with one uppercase and one lowercase letter.");
      return;
    }

    if (uploading) {
      toast.error("Please wait until image upload finishes.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const formUser = Object.fromEntries(formData.entries());

    const params = new URLSearchParams(window.location.search);
    const callback = params.get("callbackUrl");

    try {
      const userRole = role.toLowerCase();
      const { data, error } = await signUp.email({
        name: formUser.name,
        email: formUser.email,
        password: formUser.password,
        role: userRole,
        image: finalImage || undefined,
        callbackURL: callback || "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      if (data) {
        await fetchAuthToken({ email: formUser.email, role: userRole });
        toast.success("Account created successfully!");
        if (callback) {
          router.push(callback);
        } else {
          router.push(`/dashboard/${userRole}`);
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const selectedRole = role.toLowerCase();
      if (typeof window !== "undefined") {
        localStorage.setItem("wedplan_oauth_role", selectedRole);
        document.cookie = `wedplan_oauth_role=${selectedRole}; path=/; max-age=3600; SameSite=Lax`;
      }
      const params = new URLSearchParams(window.location.search);
      const callback = params.get("callbackUrl") || `/dashboard/${selectedRole}`;
      await signIn.social({
        provider: "google",
        callbackURL: callback,
      });
    } catch {
      toast.error("Google authentication failed.");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-xl dark:border-[#383124] dark:bg-[#1c1914]">
        <div className="text-center">
          <div className="mx-auto relative h-12 w-44 mb-4">
            <Image
              src="/assets/WEDPLAN Gold Serif Logo.png"
              alt="WedPlan"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Join WedPlan as an engaged couple or professional wedding vendor
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Customer", "Vendor"].map((item) => (
                <label
                  key={item}
                  className={`flex items-center justify-center rounded-xl border p-3 text-sm font-medium cursor-pointer transition ${
                    role === item
                      ? "border-[#C39C45] bg-[#f6efe2] text-[#C39C45] font-semibold dark:bg-[#29241b]"
                      : "border-[#e7e0d3] text-zinc-600 hover:border-[#C39C45]/50 dark:border-[#383124] dark:text-zinc-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={item}
                    checked={role === item}
                    onChange={() => setRole(item)}
                    className="sr-only"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Sophia Montgomery"
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="sophia@example.com"
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Upload Profile Photo
            </label>
            <div className="mt-1 flex justify-center rounded-2xl border-2 border-dashed border-[#e7e0d3] px-6 pt-5 pb-6 dark:border-[#383124]">
              <div className="w-full space-y-3 text-center">
                {imagePreview ? (
                  <div className="relative mx-auto h-28 w-28 rounded-full overflow-hidden shadow-md">
                    <Image
                      src={imagePreview}
                      alt="Profile photo preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    {!uploading && !loading && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <UploadCloud className="mx-auto h-10 w-10 text-[#C39C45]" />
                )}

                <div className="flex justify-center text-sm text-zinc-600 dark:text-zinc-400">
                  <label
                    htmlFor="photo-upload"
                    className={`relative rounded-md font-semibold text-[#C39C45] hover:underline ${
                      uploading || loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                    }`}
                  >
                    <span>{imagePreview ? "Change Photo" : "Upload File"}</span>
                    <input
                      ref={fileInputRef}
                      id="photo-upload"
                      name="photo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading || loading}
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-zinc-400">PNG, JPG, WEBP up to 5MB</p>
                {uploading && (
                  <p className="text-xs text-[#C39C45] animate-pulse">
                    Uploading image to ImgBB...
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>

            <div className="mt-2 space-y-1 text-xs">
              <div
                className={`flex items-center gap-1.5 ${
                  hasMinLen ? "text-emerald-600" : "text-zinc-400"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>At least 6 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasUpper ? "text-emerald-600" : "text-zinc-400"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>One uppercase letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  hasLower ? "text-emerald-600" : "text-zinc-400"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>One lowercase letter</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || uploading || !isPasswordValid}
              className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all text-sm"
            >
              {loading ? (
                <ButtonLoader text="Creating Your Account..." />
              ) : (
                <span>Complete Registration</span>
              )}
            </Button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e7e0d3] dark:border-[#383124]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-zinc-400 dark:bg-[#1c1914]">
              Or register with
            </span>
          </div>
        </div>

        <div>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-11 rounded-full border-[#e7e0d3] bg-white hover:bg-[#f6efe2] text-zinc-800 font-medium transition dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-200"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            <span>Google as {role}</span>
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#C39C45] hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
