"use client";

import { useReadme } from "@/store/ReadmeContext";
import { cn } from "@/lib/utils";
import {
  Type,
  AlignLeft,
  Layout,
  Image as ImageIcon,
  Table,
  Hash,
  Terminal,
  SeparatorHorizontal,
  Cpu,
} from "lucide-react";

export function Toolbar() {
  const { dispatch } = useReadme();

  const items = [
    { type: "header", icon: Hash, label: "Header" },
    { type: "text", icon: AlignLeft, label: "Texto" },
    { type: "command", icon: Terminal, label: "Comando" },
    { type: "badges", icon: Layout, label: "Badges" },
    { type: "techstack", icon: Cpu, label: "Skills" },
    { type: "image", icon: ImageIcon, label: "Imagem" },
    { type: "table", icon: Table, label: "Tabela" },
    { type: "hr", icon: SeparatorHorizontal, label: "Linha" },
  ];

  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 p-1",
        "rounded-xl border border-zinc-800/50 bg-zinc-900/60",
        "shadow-sm backdrop-blur-md transition-colors",
        "hover:border-zinc-700/50",
      )}
    >
      <div className="flex shrink-0 items-center pr-2 pl-3 opacity-60">
        <span className="text-[9px] font-semibold tracking-[0.25em] text-zinc-500 uppercase select-none">
          Insert
        </span>
      </div>

      <div className="h-4 w-px shrink-0 bg-zinc-800/80" />

      <div className="custom-scrollbar flex flex-1 gap-1 overflow-x-auto pl-1">
        {items.map((item) => (
          <button
            key={item.type}
            type="button"
            className={cn(
              "flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 transition-all",
              "text-[11px] font-medium text-zinc-400",
              "hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.98]",
              "sm:gap-2 sm:px-3",
            )}
            onClick={() =>
              dispatch({ type: "ADD_BLOCK", payload: item.type as any })
            }
          >
            <item.icon className="size-3.5 shrink-0" />
            <span className="hidden truncate sm:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
