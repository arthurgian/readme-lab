import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "focus-visible:border-primary/50 custom-scrollbar flex min-h-[120px] w-full resize-none rounded-xl border-2 border-zinc-800 bg-zinc-900/20 px-4 py-3 text-base transition-all outline-none placeholder:text-zinc-700 hover:border-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
