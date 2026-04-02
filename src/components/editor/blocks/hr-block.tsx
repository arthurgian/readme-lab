"use client";

import { cn } from "@/lib/utils";

export function HrBlock() {
  return (
    <div
      className={cn(
        "w-full rounded-xl border-2 border-zinc-800",
        "flex items-center justify-center gap-4 bg-zinc-900/20 px-4 py-8",
        "group cursor-default select-none",
      )}
    >
      <div className="h-px flex-1 bg-zinc-800 transition-colors group-hover:bg-zinc-700" />
    </div>
  );
}
