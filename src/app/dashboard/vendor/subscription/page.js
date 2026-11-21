"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Sparkles, Shield, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorSubscriptionPage() {
  const plans = [
    {
      name: "Starter Artisan",
      price: "$0",
      period: "forever free",
      description: "Ideal for new boutique wedding vendors and independent sole-proprietor artisans.",
      badge: "Standard",
      features: [
        "Up to 2 Active Service Listings",
        "Standard Search Listing Placement",
        "Direct Customer Inquiries via Email",
        "Basic Vendor Profile Page",
        "Community Support Access"
      ],
      cta: "Current Free Tier",
      ctaVariant: "outline",
      isCurrent: true,
      href: "#"
    },
    {
      name: "Platinum Signature",
      price: "$49",
      period: "per month (billed monthly)",
      description: "Designed for premier ballrooms, fine art studios, and luxury floral ateliers demanding maximum bookings.",
      badge: "Most Popular",
      features: [
        "Unlimited Active Service Listings",
        "Featured Hero & Category Search Top Placement",
        "Gold 'Verified Luxury Vendor' Verification Badge",
        "0% Commission on Confirmed Bookings",
        "Analytics Dashboard with Visitor Impressions",
        "Dedicated VIP Concierge Account Manager",
        "SMS Instant Client Booking Alerts"
      ],
      cta: "Upgrade to Platinum",
      ctaVariant: "default",
      isCurrent: false,
      href: "/payment?plan=Platinum+Signature&amount=49"
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#C39C45]">
          Vendor Monetization & Growth
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
          Subscription Packages
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Scale your bridal inquiry pipeline with prominent ranking, verified trust seals, and unlimited package listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
              !p.isCurrent
                ? "border-2 border-[#C39C45] bg-white shadow-2xl relative dark:bg-[#1c1914]"
                : "border border-[#e7e0d3] bg-white shadow-xs dark:border-[#383124] dark:bg-[#1c1914]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C39C45]">
                  {p.badge}
                </span>
                {!p.isCurrent && (
                  <span className="flex items-center gap-1 rounded-full bg-[#C39C45] px-2.5 py-0.5 text-xs font-semibold text-white">
                    <Sparkles className="h-3 w-3" />
                    Recommended
                  </span>
                )}
              </div>

              <h3 className="mt-3 text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                {p.name}
              </h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {p.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  {p.price}
                </span>
                <span className="text-xs text-zinc-500">/{p.period}</span>
              </div>

              <div className="mt-8 space-y-3 border-t border-[#f0ebe1] dark:border-[#2e281d] pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Included Features:
                </p>
                {p.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <Check className="h-4 w-4 text-[#C39C45] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              {p.isCurrent ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full rounded-full border-zinc-200 text-zinc-400"
                >
                  {p.cta}
                </Button>
              ) : (
                <Link href={p.href} className="block w-full">
                  <Button className="w-full h-12 rounded-full bg-[#C39C45] text-white hover:bg-[#b08b38] font-medium shadow-md transition-all flex items-center justify-center gap-2">
                    <span>{p.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
