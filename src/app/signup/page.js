"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Lock,
  Mail,
  User,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { ButtonLoader } from "@/components/ui-loader";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("Customer");
  const [password, setPassword] = React.useState("");

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower;

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Password does not meet the security criteria.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries());

    try {
      const { data, error } = await signUp.email({
        ...user,
        callbackURL: "/",
      });

      if (data) {
        toast.success("Account created successfully!");
        router.push("/");
      }

      if (error) {
        toast.error(error.message || "Something went error!");
      }
    } catch {
      toast.error("Something went error!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
      });
    } catch {
      toast.error("Google authentication failed");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] dark:bg-[#14120e]">
      <div className="w-full max-w-lg space-y-8 rounded-3xl border border-[#e7e0d3] bg-white p-8 sm:p-10 shadow-xl dark:border-[#383124] dark:bg-[#1c1914]">
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
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Join WedPlan as an engaged couple or verified wedding vendor
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Account Role
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label
                className={`py-3 px-4 rounded-2xl border text-sm font-medium transition text-center cursor-pointer ${
                  role === "Customer"
                    ? "border-[#C39C45] bg-[#f6efe2] text-[#C39C45] font-semibold dark:bg-[#29241b]"
                    : "border-[#e7e0d3] bg-white text-zinc-600 hover:bg-[#fbf8f2] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Customer"
                  checked={role === "Customer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                Customer
              </label>

              <label
                className={`py-3 px-4 rounded-2xl border text-sm font-medium transition text-center cursor-pointer ${
                  role === "Vendor"
                    ? "border-[#C39C45] bg-[#f6efe2] text-[#C39C45] font-semibold dark:bg-[#29241b]"
                    : "border-[#e7e0d3] bg-white text-zinc-600 hover:bg-[#fbf8f2] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="Vendor"
                  checked={role === "Vendor"}
                  onChange={(e) => setRole(e.target.value)}
                  className="sr-only"
                />
                Vendor
              </label>
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
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>

            <div className="mt-2.5 space-y-1 px-1 text-xs">
              <div
                className={`flex items-center gap-1.5 ${hasMinLen ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Minimum 6 characters</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>One uppercase letter</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${hasLower ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>One lowercase letter</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full h-11 rounded-full bg-[#C39C45] font-medium text-white shadow-md hover:bg-[#b08b38] transition-all"
            >
              {loading ? (
                <ButtonLoader text="Creating account..." />
              ) : (
                "Register Account"
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

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-11 rounded-full border-[#e7e0d3] hover:bg-[#f6efe2] dark:border-[#383124] flex items-center justify-center gap-3 text-sm font-medium"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign Up with Google</span>
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#C39C45] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
