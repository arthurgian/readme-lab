"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface SortableBlockProps {
  id: string;
  type: string;
  onRemove: () => void;
  children: ReactNode;
}

export function SortableBlock({ id, type, onRemove, children }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative mb-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-2xl shadow-black backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="hover:bg-muted cursor-grab rounded p-1 active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground/50 size-4" />
          </div>
          <span className="text-primary bg-primary/10 rounded px-2 py-0.5 text-[10px] font-black tracking-[0.2em] uppercase">
            {type}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive size-8 transition-colors"
          onClick={onRemove}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {children}
    </div>
  );
}
