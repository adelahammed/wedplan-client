"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

export function UILoader({
  message = "Loading...",
  subtext = "Please wait while we prepare your wedding details",
  className = "py-16"
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 ${className}`}>
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-[#C39C45]/20 animate-ping"></div>
        <div className="w-14 h-14 rounded-full border-3 border-transparent border-t-[#C39C45] border-r-[#C39C45] animate-spin"></div>
        <div className="absolute flex items-center justify-center w-8 h-8 rounded-full bg-[#C39C45]/10 text-[#C39C45]">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg font-serif font-medium text-zinc-900 dark:text-zinc-100">
        {message}
      </h3>
      {subtext && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          {subtext}
        </p>
      )}
    </div>
  );
}

export function ButtonLoader({ text = "Processing..." }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>{text}</span>
    </span>
  );
}
