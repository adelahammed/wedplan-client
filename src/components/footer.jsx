import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
    { name: "Sign In", href: "/signin" },
    { name: "Create Account", href: "/signup" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const categoryLinks = [
    {
      name: "Photography & Videography",
      href: "/services?category=Photography+%26+Videography",
    },
    { name: "Wedding Venues", href: "/services?category=Wedding+Venues" },
    {
      name: "Decoration & Florist",
      href: "/services?category=Decoration+%26+Florist",
    },
    { name: "Catering Services", href: "/services?category=Catering+Services" },
    { name: "Makeup & Styling", href: "/services?category=Makeup+%26+Styling" },
  ];

  return (
    <footer className="border-t border-[#e7e0d3] bg-[#fbf8f2] text-zinc-700 dark:border-[#383124] dark:bg-[#12100d] dark:text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-48">
                <Image
                  src="/assets/WEDPLAN Gold Serif Logo.png"
                  alt="WedPlan"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              WedPlan is your premier luxury wedding planning concierge. We
              connect discerning couples with verified world-class venues,
              photographers, florists, and artisans.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#C39C45]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C39C45]/30 bg-white hover:bg-[#C39C45] hover:text-white transition-all dark:bg-[#1c1914]"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C39C45]/30 bg-white hover:bg-[#C39C45] hover:text-white transition-all dark:bg-[#1c1914]"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C39C45]/30 bg-white hover:bg-[#C39C45] hover:text-white transition-all dark:bg-[#1c1914]"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C39C45]/30 bg-white hover:bg-[#C39C45] hover:text-white transition-all dark:bg-[#1c1914]"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C39C45]">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-[#C39C45] transition-colors dark:text-zinc-400 dark:hover:text-[#C39C45]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C39C45]">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5">
              {categoryLinks.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-zinc-600 hover:text-[#C39C45] transition-colors dark:text-zinc-400 dark:hover:text-[#C39C45]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C39C45]">
              Contact Information
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C39C45] shrink-0 mt-0.5" />
                <span>
                  450 Lexington Avenue, Grand Central, New York, NY 10017
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#C39C45] shrink-0" />
                <a
                  href="tel:+12125558900"
                  className="transition hover:text-[#C39C45]"
                >
                  +1 (212) 555-8900
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#C39C45] shrink-0" />
                <a
                  href="mailto:concierge@wedplan.com"
                  className="transition hover:text-[#C39C45]"
                >
                  concierge@wedplan.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#e7e0d3] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:border-[#383124] dark:text-zinc-400">
          <p>© {currentYear} WedPlan Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with{" "}
            <Heart className="h-3.5 w-3.5 text-[#C39C45] fill-[#C39C45]" /> for
            extraordinary celebrations
          </p>
        </div>
      </div>
    </footer>
  );
}
