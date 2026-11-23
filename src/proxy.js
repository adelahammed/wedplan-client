import { NextResponse } from "next/server";

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/services") {
    return NextResponse.next();
  }

  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_data")?.value ||
    request.cookies.get("__Secure-better-auth.session_data")?.value;

  let session = null;
  if (sessionToken) {
    try {
      const getSessionUrl = new URL("/api/auth/get-session", request.url);
      const res = await fetch(getSessionUrl, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      });
      if (res.ok) {
        session = await res.json();
      }
    } catch {}
  }

  const isAuthenticated = Boolean(session?.user || sessionToken);
  const user = session?.user;
  const role = (user?.role || "customer").toLowerCase();

  const isAuthRoute = pathname === "/signin" || pathname === "/signup";

  if (isAuthRoute) {
    if (isAuthenticated) {
      const callback = request.nextUrl.searchParams.get("callbackUrl");
      if (callback && !callback.startsWith("/signin") && !callback.startsWith("/signup")) {
        return NextResponse.redirect(new URL(callback, request.url));
      }
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    return NextResponse.next();
  }

  const isServiceDetails = pathname.startsWith("/services/");
  const isPayment = pathname.startsWith("/payment");
  const isDashboard = pathname.startsWith("/dashboard");

  const isPrivateRoute = isServiceDetails || isPayment || isDashboard;

  if (isPrivateRoute) {
    if (!isAuthenticated) {
      const target = pathname + search;
      const redirectUrl = new URL("/signin", request.url);
      redirectUrl.searchParams.set("callbackUrl", target);
      return NextResponse.redirect(redirectUrl);
    }

    if (isDashboard) {
      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }

      if (role === "customer" && (pathname.startsWith("/dashboard/vendor") || pathname.startsWith("/dashboard/admin"))) {
        return NextResponse.redirect(new URL("/dashboard/customer", request.url));
      }

      if (role === "vendor" && (pathname.startsWith("/dashboard/customer") || pathname.startsWith("/dashboard/admin"))) {
        return NextResponse.redirect(new URL("/dashboard/vendor", request.url));
      }

      if (role === "admin" && (pathname.startsWith("/dashboard/customer") || pathname.startsWith("/dashboard/vendor"))) {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/payment/:path*",
    "/services/:path+",
    "/signin",
    "/signup",
  ],
};
