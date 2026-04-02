"use client";

import { useReadme } from "@/store/ReadmeContext";
import { ReadmeBlock } from "@/types/readme";
import { cn } from "@/lib/utils";
import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  Terminal,
  Layout,
  Cpu,
  Image as ImageIcon,
  Table,
  SeparatorHorizontal,
} from "lucide-react";

const getBlockDisplayInfo = (block: ReadmeBlock) => {
  switch (block.type) {
    case "header": {
      const level = block.content.level || 1;
      const Icon = level === 1 ? Heading1 : level === 2 ? Heading2 : Heading3;

      const className =
        level === 1
          ? "text-[12px] font-bold text-zinc-300"
          : level === 2
            ? "text-[11px] font-semibold text-zinc-400 ml-2"
            : "text-[11px] font-medium text-zinc-500 ml-4";

      const iconClass = level === 1 ? "text-zinc-400" : "text-zinc-600";

      return {
        icon: Icon,
        label: block.content.title || "Sem título",
        className,
        iconClass,
      };
    }
    case "text":
      return {
        icon: Type,
        label: "Texto",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "command":
      return {
        icon: Terminal,
        label: "Comando",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "badges":
      return {
        icon: Layout,
        label: "Badges",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "techstack":
      return {
        icon: Cpu,
        label: "Skills",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "image":
      return {
        icon: ImageIcon,
        label: "Imagem",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "table":
      return {
        icon: Table,
        label: "Tabela",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    case "hr":
      return {
        icon: SeparatorHorizontal,
        label: "Divisor",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
    default:
      return {
        icon: Type,
        label: "Bloco",
        className: "text-[10px] text-zinc-600 font-normal ml-4",
        iconClass: "text-zinc-700",
      };
  }
};

export function Outline() {
  const { state } = useReadme();
  const blocks = state.blocks;

  const scrollToBlock = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add("ring-2", "ring-primary/50", "border-primary/50");

      if ((element as any)._flashTimeout) {
        clearTimeout((element as any)._flashTimeout);
      }

      (element as any)._flashTimeout = setTimeout(() => {
        element.classList.remove(
          "ring-2",
          "ring-primary/50",
          "border-primary/50",
        );
      }, 1000);
    }
  };

  return (
    <nav className="custom-scrollbar flex w-full flex-col gap-6 pr-2">
      <div className="flex shrink-0 items-center gap-3">
        <div className="h-px w-2 bg-zinc-800" />
        <span className="text-[9px] font-black tracking-[0.3em] text-zinc-600 uppercase">
          Índice
        </span>
      </div>

      <ul className="ml-1 flex flex-col gap-3 border-l border-zinc-900 pl-4">
        {blocks.map((block) => {
          const {
            icon: Icon,
            label,
            className,
            iconClass,
          } = getBlockDisplayInfo(block);

          return (
            <li key={block.id} className="w-full">
              <button
                onClick={() => scrollToBlock(block.id)}
                className="group flex w-full cursor-pointer flex-col text-left transition-all"
              >
                <div className={cn("flex items-center gap-2", className)}>
                  <Icon
                    className={cn(
                      "group-hover:text-primary size-3 shrink-0 transition-colors",
                      iconClass,
                    )}
                  />
                  <span className="group-hover:text-primary line-clamp-1 transition-colors">
                    {label}
                  </span>
                </div>
                <div
                  className={cn(
                    "group-hover:bg-primary/40 mt-1 h-0.5 w-0 transition-all duration-300",
                    block.type === "header" && block.content.level === 1
                      ? "group-hover:w-8"
                      : "ml-5 group-hover:w-4",
                  )}
                />
              </button>
            </li>
          );
        })}

        {blocks.length === 0 && (
          <li className="text-[10px] leading-tight text-zinc-700 italic">
            O documento está <br /> vazio...
          </li>
        )}
      </ul>
    </nav>
  );
}
