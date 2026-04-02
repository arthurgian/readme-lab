"use client";

import { useReadme } from "@/store/ReadmeContext";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
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
  Plus,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Toolbar({ isMobile = false }: { isMobile?: boolean }) {
  const { dispatch } = useReadme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
    <TooltipProvider>
      <div
        className={cn(
          "flex w-full",
          isMobile ? "justify-end" : "justify-center",
        )}
        ref={menuRef}
      >
        <div
          className={cn(
            "flex flex-col items-center",
            isMobile && "flex-col-reverse",
          )}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "z-10 flex size-12 shrink-0 items-center justify-center rounded-full border shadow-lg transition-transform duration-300 ease-out active:scale-95",
              isOpen
                ? "border-primary/50 bg-primary/20 text-primary rotate-45 shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100",
            )}
          >
            <Plus className="size-6" />
          </button>

          <div
            className={cn(
              "grid transition-all duration-500 ease-out",
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  "flex w-16 flex-col items-center gap-3 rounded-full border border-zinc-800/80 bg-zinc-900/80 py-3 shadow-2xl backdrop-blur-md",
                  isMobile ? "mt-1 mb-4" : "mt-4 mb-1",
                )}
              >
                {items.map((item) => (
                  <Tooltip key={item.type}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95",
                          "text-zinc-400 hover:scale-110 hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                        )}
                        onClick={() => {
                          dispatch({
                            type: "ADD_BLOCK",
                            payload: item.type as any,
                          });
                          setIsOpen(false);
                        }}
                      >
                        <item.icon className="size-5" strokeWidth={1.5} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side={isMobile ? "left" : "right"}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
