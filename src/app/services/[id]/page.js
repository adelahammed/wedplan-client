"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { fetchAuthToken, getStoredToken } from "@/lib/jwt";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UILoader, ButtonLoader } from "@/components/ui-loader";
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

export default function ServiceDetailsPage({ params }) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  const router = useRouter();

  const { data: session, isPending: sessionLoading } = useSession();
  const [service, setService] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedImage, setSelectedImage] = React.useState("");

  const [bookingLoading, setBookingLoading] = React.useState(false);
  const [eventDate, setEventDate] = React.useState("");
  const [eventLocation, setEventLocation] = React.useState("");
  const [guestCount, setGuestCount] = React.useState("150");
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    let active = true;

    if (!sessionLoading && !session?.user) {
      router.push(`/signin?callbackUrl=/services/${id}`);
      return;
    }

    if (id && session?.user) {
      Promise.resolve().then(async () => {
        try {
          let token = getStoredToken();
          if (!token) {
            token = await fetchAuthToken(session.user);
          }
          const headers = {};
          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }
          const rawUrl = process.env.NEXT_PUBLIC_SERVER_URL;
          const serverUrl = (rawUrl || "").replace(/\/+$/, "");
          const res = await fetch(
            `${serverUrl}/services/${id}`,
            {
              headers,
              cache: "no-store",
            },
          );
          if (res.ok) {
            const data = await res.json();
            const serviceStatus = (data?.status || "").toLowerCase();
            const currentUserId = session?.user?.id || session?.user?._id;
            const isOwner =
              currentUserId === data?.vendorId ||
              session?.user?.email === data?.vendorEmail;
            const isAdmin = (session?.user?.role || "").toLowerCase() === "admin";

            if (serviceStatus !== "active" && !isOwner && !isAdmin) {
              if (active) {
                setService(null);
                toast.error("This service is currently pending approval and not publicly accessible.");
                router.push("/services");
              }
              return;
            }

            if (active) {
              setService(data);
              if (Array.isArray(data?.images) && data.images.length > 0) {
                setSelectedImage(data.images[0]);
              } else if (data?.image) {
                setSelectedImage(data.image);
              }
            }
          } else {
            if (res.status === 401) {
              router.push(`/signin?callbackUrl=/services/${id}`);
            } else if (res.status === 403) {
              toast.error("This service is currently pending approval and not publicly accessible.");
              router.push("/services");
            }
            if (active) setService(null);
          }
        } catch {
          if (active) setService(null);
        } finally {
          if (active) setLoading(false);
        }
      });
    }

    return () => {
      active = false;
    };
  }, [id, session, sessionLoading, router]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("Please sign in to submit a booking request");
      router.push(`/signin?callbackUrl=/services/${id}`);
      return;
    }

    if (session.user.role === "admin") {
      toast.error("Admins cannot submit customer booking requests");
      return;
    }

    const currentUserId = session.user.id || session.user._id;
    if (
      currentUserId === service.vendorId ||
      session.user.email === service.vendorEmail
    ) {
      toast.error("Vendors cannot book their own services");
      return;
    }

    if (service.status?.toLowerCase() !== "active") {
      toast.error("Only approved and active services are available for booking");
      return;
    }

    if (!eventDate || !eventLocation) {
      toast.error("Please provide both event date and event location");
      return;
    }

    setBookingLoading(true);
    try {
      let token = getStoredToken();
      if (!token) {
        token = await fetchAuthToken(session.user);
      }

      const rawUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const serverUrl = (rawUrl || "").replace(/\/+$/, "");
      const res = await fetch(`${serverUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service._id || service.id,
          eventDate,
          eventLocation,
          guestCount,
          message:
            message || "We would love to discuss availability for our wedding.",
          customerName: session.user.name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Booking request sent successfully! The vendor will review your details.",
        );
        setMessage("");
        setEventDate("");
        setEventLocation("");
        setGuestCount("");
      } else {
        toast.error(data.message || "Failed to submit booking request.");
      }
    } catch {
      toast.error("Failed to submit booking request. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="py-24 bg-[#fdfbf7] dark:bg-[#14120e] min-h-screen flex items-center justify-center">
        <UILoader
          message="Loading Service Details"
          subtext="Fetching high-resolution gallery and vendor rates..."
        />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-24 text-center px-4 bg-[#fdfbf7] dark:bg-[#14120e] min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Service Not Found
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          The requested service ID is invalid or the service may have been unlisted.
        </p>
        <Link href="/services" className="mt-6">
          <Button className="rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38]">
            Browse Other Services
          </Button>
        </Link>
      </div>
    );
  }

  const galleryImages =
    Array.isArray(service.images) && service.images.length > 0
      ? service.images
      : service.image
      ? [service.image]
      : ["/assets/Slider Image (1).jpg"];

  const currentDisplayImage = selectedImage || galleryImages[0];
  const isOwner =
    session?.user &&
    (session.user.id === service.vendorId ||
      session.user.email === service.vendorEmail);
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="py-10 sm:py-16 bg-[#fdfbf7] dark:bg-[#14120e] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-[#C39C45] transition-colors dark:text-zinc-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse Services</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="relative h-[360px] sm:h-[460px] w-full rounded-3xl overflow-hidden border border-[#e7e0d3] bg-zinc-100 shadow-sm dark:border-[#383124]">
                <Image
                  src={currentDisplayImage}
                  alt={service.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-20 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        currentDisplayImage === img
                          ? "border-[#C39C45] shadow-md scale-95"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${service.name} gallery image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#f6efe2] px-3 py-1 text-xs font-semibold text-[#C39C45] dark:bg-[#29241b]">
                  {service.category}
                </span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold border border-emerald-200">
                  {service.status ? service.status.toUpperCase() : "ACTIVE"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {service.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#C39C45]" />
                  {service.location}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs uppercase tracking-wider text-zinc-400 block">
                  Pricing Details
                </span>
                <p className="text-3xl font-serif font-bold text-[#C39C45] mt-0.5">
                  ${service.price}{" "}
                  <span className="text-sm font-sans font-normal text-zinc-500">
                    / estimated starting rate
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-[#e7e0d3] pt-6 dark:border-[#383124]">
              <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                About this Wedding Experience
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                {service.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
              <h3 className="text-xs uppercase tracking-widest font-semibold text-[#C39C45]">
                Vendor & Artist Information
              </h3>
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#f6efe2]">
                    <Image
                      src={service.vendorImage || "/assets/Favicon.png"}
                      alt={service.vendorName || "Vendor"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      {service.vendorName || "Professional Vendor"}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {service.vendorEmail || "Verified Wedding Partner"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <div className="rounded-3xl border border-[#e7e0d3] bg-white p-6 sm:p-8 shadow-xl dark:border-[#383124] dark:bg-[#1c1914]">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                    Send Booking Request
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Direct inquiry with guaranteed 24h vendor response
                  </p>
                </div>
              </div>

              {isOwner ? (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  You are the creator of this service package. Vendors cannot book their own services.
                </div>
              ) : isAdmin ? (
                <div className="mt-6 p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm">
                  Admins cannot submit customer booking requests.
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Target Event Date *
                    </label>
                    <Input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Event Location *
                    </label>
                    <select
                      required
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full rounded-xl border border-[#e7e0d3] bg-white px-3 h-11 text-sm focus-visible:ring-1 focus-visible:ring-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914] text-zinc-800 dark:text-zinc-200"
                    >
                      <option value="" disabled>
                        Select event location
                      </option>
                      {DHAKA_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Estimated Guest Count
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="number"
                        placeholder="150"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                      Additional Message & Special Requests
                    </label>
                    <Textarea
                      placeholder="Provide details about your ceremony timeline, design preferences, or budget parameters..."
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={bookingLoading}
                      className="w-full h-12 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all text-sm"
                    >
                      {bookingLoading ? (
                        <ButtonLoader text="Processing Booking Request..." />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>Send Booking Request</span>
                        </span>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-center justify-center text-xs text-zinc-500">
                    <ShieldCheck className="h-4 w-4 text-[#C39C45]" />
                    <span>Direct inquiry with verified vendor response</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
