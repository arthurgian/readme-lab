"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReadmeBlock } from "@/types/readme";

const BADGE_PRESETS = [
  {
    id: "frontend",
    label: "Front-end",
    items: [
      { label: "React", color: "61DAFB", slug: "react" },
      { label: "Next.js", color: "000000", slug: "nextdotjs" },
      { label: "TypeScript", color: "3178C6", slug: "typescript" },
      { label: "Tailwind CSS", color: "06B6D4", slug: "tailwindcss" },
    ],
  },
  {
    id: "backend",
    label: "Back-end",
    items: [
      { label: "Node.js", color: "339933", slug: "nodedotjs" },
      { label: "Python", color: "3776AB", slug: "python" },
      { label: "PostgreSQL", color: "4169E1", slug: "postgresql" },
      { label: "Docker", color: "2496ED", slug: "docker" },
    ],
  },
  {
    id: "social",
    label: "Social",
    items: [
      { label: "LinkedIn", color: "0A66C2", slug: "linkedin" },
      { label: "GitHub", color: "181717", slug: "github" },
      { label: "Twitter", color: "1DA1F2", slug: "twitter" },
      { label: "Discord", color: "5865F2", slug: "discord" },
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    items: [
      { label: "Flutter", color: "02569B", slug: "flutter" },
      { label: "React Native", color: "61DAFB", slug: "react" },
      { label: "Swift", color: "F05138", slug: "swift" },
      { label: "Kotlin", color: "7F52FF", slug: "kotlin" },
    ],
  },
];

interface BadgeConfiguratorProps {
  block: ReadmeBlock;
  updateContent: (content: any) => void;
}

export function BadgeConfigurator({
  block,
  updateContent,
}: BadgeConfiguratorProps) {
  const [confirmPreset, setConfirmPreset] = useState<
    (typeof BADGE_PRESETS)[0] | null
  >(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const styles = ["plastic", "flat", "flat-square", "for-the-badge"];
  // @ts-ignore
  const items = block.content.items || [];
  const hasSelectedItems = items.some((item: any) => item.isSelected);

  const applyStyle = (styleType: string) => {
    const newItems = items.map((item: any) => {
      if (!hasSelectedItems || item.isSelected) {
        return { ...item, style: styleType };
      }
      return item;
    });
    updateContent({ items: newItems });
  };

  const confirmAddPreset = () => {
    if (!confirmPreset) return;

    const existingLabels = items.map((i: any) => i.label.toLowerCase());

    const newBadges = confirmPreset.items
      .filter((i) => !existingLabels.includes(i.label.toLowerCase()))
      .map((i) => ({ ...i, style: "for-the-badge", isSelected: false }));

    updateContent({ items: [...items, ...newBadges] });
    setConfirmPreset(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setConfirmPreset(null);
      }
    }

    if (confirmPreset) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [confirmPreset]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center gap-2">
        <span className="hidden px-2 text-[9px] font-bold tracking-widest text-zinc-600 uppercase sm:inline">
          Style {hasSelectedItems ? "(Selected)" : "(All)"}
        </span>
        <div className="flex flex-1 gap-1">
          {styles.map((s) => {
            const formattedString = s.replace(/-/g, " ");
            const displayLabel =
              formattedString.charAt(0).toUpperCase() +
              formattedString.slice(1);

            return (
              <button
                key={s}
                type="button"
                onClick={() => applyStyle(s)}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center rounded-md border text-[10px] font-bold transition-all",
                  "active:bg-primary/20 active:text-primary border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                )}
              >
                {displayLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full items-center gap-2">
        <span className="hidden px-2 text-[9px] font-bold tracking-widest text-zinc-600 uppercase sm:inline">
          Presets
        </span>
        <div className="flex flex-1 gap-1">
          {BADGE_PRESETS.map((preset, index) => {
            const isConfirming = confirmPreset?.id === preset.id;

            return (
              <div key={preset.id} className="relative flex flex-1">
                <button
                  type="button"
                  onClick={() => setConfirmPreset(preset)}
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-md border text-[10px] font-bold transition-all",
                    isConfirming
                      ? "border-primary/40 bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                      : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                  )}
                >
                  {preset.label}
                </button>

                {isConfirming && (
                  <div
                    ref={tooltipRef}
                    className={cn(
                      "animate-in fade-in zoom-in-95 absolute top-full z-[100] mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl",
                      index > 1 ? "right-0" : "left-0",
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-300">
                        Adicionar {preset.label}?
                      </span>
                      <button
                        onClick={() => setConfirmPreset(null)}
                        className="rounded p-0.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                      >
                        <X className="size-5" />
                      </button>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {preset.items.map((b) => {
                        const exists = items.some(
                          (i: any) =>
                            i.label.toLowerCase() === b.label.toLowerCase(),
                        );
                        return (
                          <span
                            key={b.label}
                            className={cn(
                              "flex items-center gap-1.5 rounded border px-2 py-1 font-mono text-[9px] tracking-tight uppercase",
                              exists
                                ? "border-red-900/50 bg-red-950/30 text-red-500/50 line-through"
                                : "border-zinc-800 bg-zinc-900 text-zinc-300",
                            )}
                          >
                            {!exists ? (
                              <span
                                className="size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: `#${b.color}` }}
                              />
                            ) : (
                              <X className="size-2.5 shrink-0" />
                            )}
                            {b.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2">
                      <button
                        onClick={confirmAddPreset}
                        className="border-primary/50 bg-primary/20 text-primary hover:bg-primary/30 flex-1 rounded border py-1.5 text-[10px] font-bold transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmPreset(null)}
                        className="flex-1 rounded border border-zinc-700 bg-zinc-800 py-1.5 text-[10px] font-bold text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
