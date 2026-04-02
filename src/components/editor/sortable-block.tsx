"use client";

import { useState, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  ChevronDown,
  Heading,
  Type,
  Layout,
  Cpu,
  Image as ImageIcon,
  Table,
  Terminal,
  SeparatorHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BLOCK_ICONS = {
  header: Heading,
  text: Type,
  badges: Layout,
  techstack: Cpu,
  image: ImageIcon,
  table: Table,
  command: Terminal,
  hr: SeparatorHorizontal,
};

const BLOCK_LABELS: Record<string, string> = {
  header: "header",
  text: "text",
  badges: "badges",
  techstack: "skills",
  image: "image",
  table: "table",
  command: "command",
  hr: "linha",
};

interface SortableBlockProps {
  id: string;
  type: string;
  onRemove: () => void;
  children: ReactNode;
  configContent?: ReactNode;
}

export function SortableBlock({
  id,
  type,
  onRemove,
  children,
  configContent,
}: SortableBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = BLOCK_ICONS[type as keyof typeof BLOCK_ICONS] || Type;
  const displayLabel = BLOCK_LABELS[type] || type;

  return (
    <div
      id={id}
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative mb-6 rounded-xl border border-zinc-800",
        "bg-zinc-900/50 p-6 shadow-2xl shadow-black backdrop-blur-md",
        "transition-all hover:border-zinc-700 hover:bg-zinc-900/80",
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className={cn(
              "cursor-grab rounded p-1 transition-colors",
              "hover:bg-zinc-800 active:cursor-grabbing",
            )}
          >
            <GripVertical className="size-4 text-zinc-600" />
          </div>

          <button
            type="button"
            onClick={() => configContent && setIsExpanded(!isExpanded)}
            className={cn(
              "flex items-center gap-2 rounded px-2 py-0.5 transition-colors",
              configContent
                ? "cursor-pointer hover:bg-zinc-800/50"
                : "cursor-default",
            )}
          >
            <Icon
              className={cn(
                "size-3.5 transition-colors",
                isExpanded ? "text-primary" : "text-zinc-500",
              )}
            />
            <span
              className={cn(
                "text-[10px] font-black tracking-[0.2em] uppercase transition-colors",
                isExpanded ? "text-primary" : "text-zinc-500",
              )}
            >
              {displayLabel}
            </span>
            {configContent && (
              <ChevronDown
                className={cn(
                  "size-3 transition-colors transition-transform duration-300",
                  isExpanded ? "text-primary rotate-180" : "text-zinc-500",
                )}
              />
            )}
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-zinc-600 transition-colors hover:text-red-500"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {isExpanded && configContent && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-top-2 mb-6 w-full",
            "rounded-lg border border-zinc-800/50 bg-black/20 p-2",
          )}
        >
          {configContent}
        </div>
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
