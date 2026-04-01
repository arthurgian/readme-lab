"use client";

import { ImageContent } from "@/types/readme";
import { cn } from "@/lib/utils";
import { ImageIcon, Link2, Type } from "lucide-react";

interface ImageBlockProps {
  content: ImageContent;
  onChange: (content: ImageContent) => void;
}

export function ImageBlock({ content, onChange }: ImageBlockProps) {
  const updateField = (field: keyof ImageContent, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div
          className={cn(
            "group flex items-center gap-2 rounded-lg border border-zinc-800",
            "bg-zinc-900/50 p-2 px-3 transition-all",
            "focus-within:border-primary/50 focus-within:bg-zinc-900",
            "hover:border-zinc-700",
          )}
        >
          <Link2 className="group-focus-within:text-primary/70 size-4 shrink-0 text-zinc-500 transition-colors" />
          <div className="h-4 w-px shrink-0 bg-zinc-800" />
          <input
            type="url"
            className="w-full min-w-0 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
            placeholder="URL da imagem (https://...)"
            value={content.url || ""}
            onChange={(e) => updateField("url", e.target.value)}
          />
        </div>

        <div
          className={cn(
            "group flex items-center gap-2 rounded-lg border border-zinc-800",
            "bg-zinc-900/50 p-2 px-3 transition-all",
            "focus-within:border-primary/50 focus-within:bg-zinc-900",
            "hover:border-zinc-700",
          )}
        >
          <Type className="group-focus-within:text-primary/70 size-4 shrink-0 text-zinc-500 transition-colors" />
          <div className="h-4 w-px shrink-0 bg-zinc-800" />
          <input
            type="text"
            className="w-full min-w-0 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
            placeholder="Texto alternativo (Alt)"
            value={content.alt || ""}
            onChange={(e) => updateField("alt", e.target.value)}
          />
        </div>
      </div>

      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-4 transition-colors hover:bg-zinc-900/50">
        {content.url ? (
          <img
            src={content.url}
            alt={content.alt || "Preview da imagem"}
            className="max-h-full w-auto max-w-[40%] object-contain opacity-90 transition-opacity hover:opacity-100"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/600x400/18181b/52525b?text=Imagem+Nao+Encontrada")
            }
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-600">
            <ImageIcon className="size-8 opacity-20" />
            <span className="text-xs font-medium tracking-wide opacity-50">
              Preview da Imagem
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
