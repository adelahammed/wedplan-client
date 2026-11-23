"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  Award,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import { fetchServices, MOCK_CATEGORIES } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UILoader } from "@/components/ui-loader";

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [services, setServices] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("featured");

  const locations = [
    "All",
    "Manhattan, New York",
    "Brooklyn, New York",
    "Greenwich, Connecticut",
    "Hudson Valley, New York",
    "Jersey City, New Jersey",
    "SoHo, New York",
    "Queens, New York",
  ];

  const categoryList = ["All", ...MOCK_CATEGORIES.map((c) => c.name)];

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/service-list`,
          {
            cache: "no-store",
          },
        );
        const data = await res.json();
        setServices(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredServices = React.useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "All" ||
        service.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLocation =
        selectedLocation === "All" ||
        service.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.vendor?.name.toLowerCase().includes(query) ||
        service.location.toLowerCase().includes(query);

      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [services, selectedCategory, selectedLocation, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("All");
    setSortBy("featured");
  };

  return (
    <div className="py-12 sm:py-16 bg-[#fdfbf7] dark:bg-[#14120e] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C39C45]">
            Curated Artisans & Venues
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
            Browse Wedding Services
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Explore premier wedding venues, fine art photographers, bespoke
            florists, master caterers, and bridal stylists for your special day.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-[#e7e0d3] bg-white p-5 shadow-xs dark:border-[#383124] dark:bg-[#1c1914]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search services by name or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#e7e0d3] focus-visible:ring-[#C39C45] dark:border-[#383124] h-11"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e7e0d3] bg-white px-3.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-200"
              >
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-11 rounded-xl border border-[#e7e0d3] bg-white px-3.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-[#C39C45] dark:border-[#383124] dark:bg-[#1c1914] dark:text-zinc-200"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc === "All" ? "All Locations" : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0ebe1] dark:border-[#2e281d] text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span>
                Showing{" "}
                <strong className="text-zinc-900 dark:text-zinc-100">
                  {filteredServices.length}
                </strong>{" "}
                available services
              </span>
              {(selectedCategory !== "All" ||
                selectedLocation !== "All" ||
                searchQuery) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[#C39C45] hover:underline font-medium ml-2"
                >
                  Reset all filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categoryList.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    selectedCategory === cat
                      ? "bg-[#C39C45] text-white font-medium"
                      : "bg-[#f6efe2] text-zinc-700 hover:bg-[#ebdcc4] dark:bg-[#29241b] dark:text-zinc-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <UILoader
            message="Fetching Services"
            subtext="Filtering verified venues, photographers, and artisans..."
          />
        ) : filteredServices.length === 0 ? (
          <div className="my-16 text-center rounded-3xl border border-dashed border-[#e7e0d3] bg-white p-12 dark:border-[#383124] dark:bg-[#1c1914]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#C39C45] dark:bg-[#29241b]">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              No Services Found
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              We could not find any wedding services matching your current
              filters. Try expanding your search query or clearing selected
              categories.
            </p>
            <div className="mt-6">
              <Button
                onClick={resetFilters}
                className="rounded-full bg-[#C39C45] px-6 text-white hover:bg-[#b08b38]"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e7e0d3] bg-white shadow-xs hover:shadow-xl transition-all duration-300 dark:border-[#383124] dark:bg-[#1c1914]"
              >
                <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      {service.category}
                    </span>
                  </div>
                  {service.vendor?.isPremium && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 rounded-full bg-[#C39C45] px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
                        <Award className="h-3.5 w-3.5" />
                        Premium
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#C39C45]" />
                      {service.location}
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
                          src={service.vendorImage || "/assets/Favicon.png"}
                          alt={service.vendorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-400">Vendor</span>
                        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-[130px]">
                          {service.vendorName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">
                        Starting at
                      </span>
                      <span className="text-lg font-serif font-bold text-[#C39C45]">
                        {service.price}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/services/${service._id}`}
                      className="block w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-[#C39C45]/40 text-[#C39C45] hover:bg-[#C39C45] hover:text-white transition-all font-medium"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-20 flex justify-center">
          <UILoader message="Loading Services Catalogue..." />
        </div>
      }
    >
      <BrowseServicesContent />
    </React.Suspense>
  );
}
