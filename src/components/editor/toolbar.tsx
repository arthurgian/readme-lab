"use client";

import { useReadme } from "@/store/ReadmeContext";
import { Button } from "@/components/ui/button";
import { Type, AlignLeft, Layout, Image as ImageIcon, Table, Hash } from "lucide-react";

export function Toolbar() {
  const { dispatch } = useReadme();

  const items = [
    { type: "header", icon: Hash, label: "H1" },
    { type: "text", icon: AlignLeft, label: "Texto" },
    { type: "badges", icon: Layout, label: "Badges" },
    { type: "techstack", icon: Type, label: "Stack" },
    { type: "image", icon: ImageIcon, label: "Imagem" },
    { type: "table", icon: Table, label: "Tabela" },
  ];

  return (
    <div className="flex w-full items-center gap-1 rounded-xl border border-zinc-800/50 bg-zinc-900/60 p-1 shadow-sm backdrop-blur-md transition-colors hover:border-zinc-700/50">
      <div className="flex shrink-0 items-center pr-2 pl-3 opacity-60">
        <span className="text-[9px] font-semibold tracking-[0.25em] text-zinc-500 uppercase select-none">
          Insert
        </span>
      </div>
      <div className="h-3 w-px shrink-0 bg-zinc-800/80" />
      <div className="flex flex-1 gap-1 pl-1">
        {items.map((item) => (
          <Button
            key={item.type}
            variant="ghost"
            size="sm"
            className="h-8 flex-1 gap-1.5 px-0 text-[11px] text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white sm:gap-2 sm:px-2"
            onClick={() => dispatch({ type: "ADD_BLOCK", payload: item.type as any })}
          >
            <item.icon className="size-3.5 shrink-0" />
            <span className="hidden truncate sm:inline">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
