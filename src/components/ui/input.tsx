import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border-2 border-zinc-800",
        "bg-zinc-900/20 px-4 py-2 text-base transition-all outline-none",
        "focus-visible:border-primary/50 placeholder:text-zinc-700 hover:border-zinc-700",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
