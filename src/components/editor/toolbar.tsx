"use client";

import { useState } from "react";
import { useReadme } from "@/store/ReadmeContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  AlignLeft,
  Layout,
  Image as ImageIcon,
  Table as TableIcon,
  Hash,
  Type,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 1.2,
} as const;

export function Toolbar() {
  const { dispatch } = useReadme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isOpen = isHovered || isPinned;

  const menuItems = [
    { type: "header", icon: Hash, label: "Título" },
    { type: "text", icon: AlignLeft, label: "Texto" },
    { type: "badges", icon: Layout, label: "Badges" },
    { type: "techstack", icon: Type, label: "Tech Stack" },
    { type: "image", icon: ImageIcon, label: "Imagem" },
    { type: "table", icon: TableIcon, label: "Tabela" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{
          height: isOpen ? 420 : 52,
        }}
        transition={springConfig}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="sticky top-0 z-50 flex w-[52px] flex-col items-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-2xl will-change-[height]"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPinned(!isPinned)}
          className={`size-[52px] shrink-0 rounded-none transition-colors ${isPinned ? "text-primary" : "text-zinc-400"}`}
        >
          <motion.div animate={{ rotate: isPinned ? 45 : 0 }} transition={springConfig}>
            <Plus className="size-6" />
          </motion.div>
        </Button>

        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key="toolbar-content"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex w-full flex-col items-center pb-4"
            >
              <div className="mb-2 h-px w-8 bg-zinc-800" />

              <div className="flex flex-col gap-3">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.15, type: "spring", stiffness: 300 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-10 rounded-xl text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
                          onClick={() => dispatch({ type: "ADD_BLOCK", payload: item.type as any })}
                        >
                          <item.icon className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="border-zinc-700 bg-zinc-800 text-[10px] font-bold tracking-widest uppercase"
                      >
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </TooltipProvider>
  );
}
