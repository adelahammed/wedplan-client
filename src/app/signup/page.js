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
import { Lock, Mail, User, CheckCircle2, UploadCloud, X, UserCheck, Briefcase } from "lucide-react";
import { ButtonLoader } from "@/components/ui-loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("Customer");
  const [password, setPassword] = React.useState("");

  const [imageFile, setImageFile] = React.useState(null);
  const [finalImage, setFinalImage] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const [googleRoleDialogOpen, setGoogleRoleDialogOpen] = React.useState(false);
  const [googleRole, setGoogleRole] = React.useState("Customer");
  const [googleSubmitting, setGoogleSubmitting] = React.useState(false);

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
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formUser = Object.fromEntries(formData.entries());
    form.reset();
    setPassword("");
    handleRemoveImage();
    setRole("Customer");

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

  const handleOpenGoogleModal = () => {
    setGoogleRole(role);
    setGoogleRoleDialogOpen(true);
  };

  const proceedGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    try {
      const selectedRole = googleRole.toLowerCase();
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
      setGoogleSubmitting(false);
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
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Full Name *
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
              Email Address *
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
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div
                className={`flex items-center gap-1.5 text-[11px] ${
                  hasMinLen
                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${hasMinLen ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-300"}`}
                />
                <span>Min 6 Chars</span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[11px] ${
                  hasUpper
                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${hasUpper ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-300"}`}
                />
                <span>Uppercase</span>
              </div>
              <div
                className={`flex items-center gap-1.5 text-[11px] ${
                  hasLower
                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                    : "text-zinc-400"
                }`}
              >
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${hasLower ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-300"}`}
                />
                <span>Lowercase</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Profile Photo (Optional)
            </label>
            <div className="flex flex-col gap-3">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#e7e0d3] dark:border-[#383124] group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {!uploading && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
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
                        <UploadCloud className="h-3.5 w-3.5 text-[#C39C45]" />
                        <span>Upload Photo</span>
                      </span>
                    )}
                  </Button>
                  <span className="text-[11px] text-zinc-500">
                    PNG, JPG, or WEBP up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || uploading || !isPasswordValid}
              className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all text-sm disabled:opacity-50"
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
            onClick={handleOpenGoogleModal}
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
            <span>Google Account</span>
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

      <Dialog open={googleRoleDialogOpen} onOpenChange={setGoogleRoleDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-[#1c1914] dark:border-[#383124]">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Choose Account Type
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-1">
              Select your role before proceeding to Google authentication.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={() => setGoogleRole("Customer")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition ${
                googleRole === "Customer"
                  ? "border-[#C39C45] bg-[#f6efe2] text-[#C39C45] dark:border-[#C39C45] dark:bg-[#2e2617]"
                  : "border-[#e7e0d3] bg-white text-zinc-700 hover:border-zinc-300 dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-300"
              }`}
            >
              <UserCheck className="h-6 w-6 mb-2 text-[#C39C45]" />
              <span className="font-semibold text-sm">Customer</span>
              <span className="text-[11px] text-zinc-500 mt-1">Book wedding services & venues</span>
            </button>

            <button
              type="button"
              onClick={() => setGoogleRole("Vendor")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition ${
                googleRole === "Vendor"
                  ? "border-[#C39C45] bg-[#f6efe2] text-[#C39C45] dark:border-[#C39C45] dark:bg-[#2e2617]"
                  : "border-[#e7e0d3] bg-white text-zinc-700 hover:border-zinc-300 dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-300"
              }`}
            >
              <Briefcase className="h-6 w-6 mb-2 text-[#C39C45]" />
              <span className="font-semibold text-sm">Vendor</span>
              <span className="text-[11px] text-zinc-500 mt-1">List packages & receive inquiries</span>
            </button>
          </div>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setGoogleRoleDialogOpen(false)}
              className="rounded-full flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={googleSubmitting}
              onClick={proceedGoogleSignIn}
              className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] flex-1"
            >
              {googleSubmitting ? (
                <ButtonLoader text="Redirecting..." />
              ) : (
                <span>Continue as {googleRole}</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
