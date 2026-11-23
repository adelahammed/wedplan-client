"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { fetchAuthToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { ButtonLoader } from "@/components/ui-loader";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries());

    const params = new URLSearchParams(window.location.search);
    const callback = params.get("callbackUrl");

    try {
      const { data, error } = await signIn.email({
        ...user,
        callbackURL: callback || "/",
      });

      if (error) {
        toast.error(error.message || "Invalid credentials!");
        return;
      }

      if (data) {
        await fetchAuthToken({ email: user.email });
        toast.success("Sign in successful!");
        const role = data.user?.role?.toLowerCase() || "customer";
        if (callback) {
          router.push(callback);
        } else {
          router.push(`/dashboard/${role}`);
        }
      }
    } catch {
      toast.error("Something went wrong during sign in!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const callback = params.get("callbackUrl") || "/";
      await signIn.social({
        provider: "google",
        callbackURL: callback,
      });
    } catch {
      toast.error("Google authentication failed");
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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sign in to access your wedding itinerary and vendor quotes
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all text-sm"
            >
              {loading ? (
                <ButtonLoader text="Verifying Credentials..." />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
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
              Or continue with
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
            <span>Google Account</span>
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
          Do not have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#C39C45] hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
