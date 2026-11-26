"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MapPin,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import { fetchServices, MOCK_CATEGORIES, MOCK_TIPS } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { UILoader } from "@/components/ui-loader";
import { useSession } from "@/lib/auth-client";

const sliderImages = [
  "/assets/Slider Image (1).jpg",
  "/assets/Slider Image (2).jpg",
  "/assets/Slider Image (3).jpg",
  "/assets/Slider Image (4).jpg",
];

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [featuredServices, setFeaturedServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/service-list`,
          {
            cache: "no-store",
          },
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFeaturedServices(data.slice(0, 6));
          } else {
            const fallback = await fetchServices();
            setFeaturedServices(fallback.slice(0, 6));
          }
        } else {
          const fallback = await fetchServices();
          setFeaturedServices(fallback.slice(0, 6));
        }
      } catch {
        const fallback = await fetchServices();
        setFeaturedServices(fallback.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
    );
  };

  const handleServiceClick = (serviceId) => {
    if (!session?.user) {
      router.push(`/signin?callbackUrl=/services/${serviceId}`);
    } else {
      router.push(`/services/${serviceId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[88vh] min-h-[580px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={sliderImages[currentSlide]}
                alt="WedPlan Wedding Luxury"
                fill
                priority
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md text-xs sm:text-sm font-medium tracking-wide text-amber-200 mb-6"
          >
            <Sparkles className="h-4 w-4 text-[#C39C45]" />
            <span>Exclusively Curated Luxury Wedding Planning</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.15]"
          >
            Your Dream Wedding, <br />
            <span className="text-[#C39C45] italic font-normal">
              Flawlessly Orchestrated
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-200 font-light leading-relaxed"
          >
            Discover prestigious venues, elite photographers, bespoke florists,
            and master caterers. Every detail meticulously vetted for your most
            memorable celebration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/services">
              <Button className="h-13 rounded-full bg-[#C39C45] px-8 text-base font-medium text-white shadow-lg hover:bg-[#b08b38] transition-all hover:scale-105">
                Explore Wedding Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="hidden sm:flex absolute left-6 z-20 h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/60 transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="hidden sm:flex absolute right-6 z-20 h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md hover:bg-black/60 transition"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      <section className="py-20 sm:py-28 bg-[#fdfbf7] dark:bg-[#14120e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C39C45]">
                Curated Excellence
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                Featured Wedding Services
              </h2>
              <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Browse handpicked selections from our verified artisans, venues,
                and luxury service partners.
              </p>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-flex items-center text-sm font-semibold text-[#C39C45] hover:underline"
            >
              <span>View Full Directory</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <UILoader
              message="Curating Featured Packages"
              subtext="Loading top-rated wedding venues and artists..."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredServices.map((service, index) => {
                const coverImg =
                  Array.isArray(service.images) && service.images.length > 0
                    ? service.images[0]
                    : service.image || "/assets/Slider Image (1).jpg";
                const vendorName =
                  service.vendorName ||
                  service.vendor?.name ||
                  "Wedding Artisan";
                const vendorImg =
                  service.vendorImage ||
                  service.vendor?.avatar ||
                  "/assets/Favicon.png";
                const serviceId = service._id || service.id;

                return (
                  <motion.div
                    key={serviceId}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7e0d3] bg-white shadow-xs hover:shadow-xl transition-all duration-300 dark:border-[#383124] dark:bg-[#1c1914]"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                      <Image
                        src={coverImg}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-[#C39C45]" />
                          {service.location}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          5.0
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-zinc-900 group-hover:text-[#C39C45] transition-colors dark:text-zinc-50 line-clamp-1">
                        {service.name}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#f0ebe1] dark:border-[#2e281d] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="relative h-8 w-8 rounded-full overflow-hidden bg-[#f6efe2]">
                            <Image
                              src={vendorImg}
                              alt={vendorName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-zinc-400">
                              Vendor
                            </span>
                            <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-[130px]">
                              {vendorName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 block">
                            Starting at
                          </span>
                          <span className="text-lg font-serif font-bold text-[#C39C45]">
                            ${service.price}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Button
                          onClick={() => handleServiceClick(serviceId)}
                          variant="outline"
                          className="w-full rounded-xl border-[#C39C45]/40 text-[#C39C45] hover:bg-[#C39C45] hover:text-white transition-all font-medium"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-14 text-center">
            <Link href="/services">
              <Button className="h-12 rounded-full bg-[#C39C45] px-8 text-base font-medium text-white shadow-md hover:bg-[#b08b38] transition">
                Browse All Wedding Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#f8f5ee] dark:bg-[#1a1712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C39C45]">
              Tailored Disciplines
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Browse by Wedding Category
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              Select your essential requirements to explore verified
              professionals specializing in every touchpoint of your wedding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group relative flex h-60 flex-col justify-end overflow-hidden rounded-2xl p-6 transition-all shadow-xs hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  </div>
                  <div className="relative z-10 text-white">
                    <h3 className="mt-1 text-2xl font-serif font-bold group-hover:text-amber-200 transition">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-300 line-clamp-2 font-light">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#fdfbf7] dark:bg-[#14120e] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative h-[480px] sm:h-[560px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#2e281d]">
                <Image
                  src="/assets/Why us image.jpg"
                  alt="Why Choose WedPlan Wedding Concierge"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-4 rounded-2xl bg-white p-5 shadow-2xl dark:bg-[#1c1914] border border-[#e7e0d3] dark:border-[#383124]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C39C45]/15 text-[#C39C45]">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                    100%
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Verified Vendors
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6"
            >
              <div>
                <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C39C45]">
                  Unmatched Distinction
                </span>
                <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                  Why Choose WedPlan?
                </h2>
                <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Planning a wedding should be as joyous and romantic as the
                  vows you exchange. WedPlan takes the guesswork out of vendor
                  hiring with transparent portfolios, insured guarantees, and
                  direct communication.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8f5ee] dark:bg-[#1a1712] border border-[#e7e0d3] dark:border-[#2e281d]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C39C45] text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      Rigorously Screened & Verified Vendors
                    </h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      We audit each vendor&apos;s portfolio, customer reviews,
                      liability insurance, and professionalism before granting
                      platform listing privileges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8f5ee] dark:bg-[#1a1712] border border-[#e7e0d3] dark:border-[#2e281d]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C39C45] text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      Seamless Booking & Direct Requests
                    </h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Request custom quotes, select dates, and receive prompt
                      responses straight from business owners without hidden
                      intermediary markups.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#f8f5ee] dark:bg-[#1a1712] border border-[#e7e0d3] dark:border-[#2e281d]">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C39C45] text-white">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-serif font-bold text-zinc-900 dark:text-zinc-100">
                      Comprehensive Couple & Vendor Dashboards
                    </h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      Track booking statuses, service agreements, payment
                      schedules, and profile updates within a modern, unified
                      control center.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#f8f5ee] dark:bg-[#1a1712]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C39C45]">
              Expert Wisdom
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
              Wedding Planning Tips & Guides
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              Industry insights, budget checklists, and timeline strategies
              crafted by experienced bridal directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_TIPS.map((tip, idx) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col justify-between rounded-2xl border border-[#e7e0d3] bg-white p-6 shadow-xs hover:shadow-lg transition-all dark:border-[#383124] dark:bg-[#1c1914]"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-4">
                    <span className="rounded-full bg-[#f6efe2] text-[#C39C45] px-2.5 py-0.5 font-semibold dark:bg-[#29241b]">
                      {tip.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {tip.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    {tip.summary}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
