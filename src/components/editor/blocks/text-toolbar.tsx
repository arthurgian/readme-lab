"use client";

import { useState, useEffect } from "react";
import { Bold, Italic, Code, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextToolbarProps {
  blockId: string;
}

type FormatState = {
  bold: boolean;
  italic: boolean;
  code: boolean;
  link: boolean;
  isSelectionEmpty: boolean;
};

export type FormatEventDetail = {
  type: keyof FormatState;
};

export function TextToolbar({ blockId }: TextToolbarProps) {
  const [activeFormats, setActiveFormats] = useState<FormatState>({
    bold: false,
    italic: false,
    code: false,
    link: false,
    isSelectionEmpty: true,
  });

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<FormatState>;
      setActiveFormats(customEvent.detail);
    };
    window.addEventListener(`format-state-${blockId}`, handleStateChange);
    return () =>
      window.removeEventListener(`format-state-${blockId}`, handleStateChange);
  }, [blockId]);

  const handleFormat = (type: keyof FormatState) => {
    const event = new CustomEvent<FormatEventDetail>(`format-${blockId}`, {
      detail: { type },
    });
    window.dispatchEvent(event);
  };

  const tools = [
    { id: "bold" as const, icon: Bold, label: "Bold" },
    { id: "italic" as const, icon: Italic, label: "Italic" },
    { id: "code" as const, icon: Code, label: "Code" },
    { id: "link" as const, icon: LinkIcon, label: "Link" },
  ];

  return (
    <div className="flex w-full items-center gap-2">
      <span className="hidden px-2 text-[9px] font-bold tracking-widest text-zinc-600 uppercase sm:inline">
        Format
      </span>
      <div className="flex flex-1 gap-1">
        {tools.map((tool) => {
          const isActive = activeFormats[tool.id];

          const isDisabled =
            tool.id === "link" &&
            activeFormats.isSelectionEmpty &&
            !activeFormats.link;

          return (
            <button
              key={tool.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleFormat(tool.id)}
              className={cn(
                "flex h-8 flex-1 items-center justify-center gap-2 rounded-md border transition-all",
                isActive
                  ? "border-primary/40 bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                  : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                isDisabled &&
                  "pointer-events-none cursor-not-allowed opacity-20 grayscale",
              )}
            >
              <tool.icon
                className={cn("size-3.5", isActive && "stroke-[3px]")}
              />
              <span className="text-[10px] font-bold">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
