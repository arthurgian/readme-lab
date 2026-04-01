"use client";

import { CommandContent } from "@/types/readme";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

interface CommandBlockProps {
  id: string;
  content: CommandContent;
  onChange: (content: CommandContent) => void;
}

export function CommandBlock({ id, content, onChange }: CommandBlockProps) {
  const language = content.language || "sh";
  const command = content.command || "";

  return (
    <div className="group flex w-full flex-col gap-2">
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl border-2 border-zinc-800",
          "bg-zinc-950 px-4 py-3 transition-all",
          "focus-within:border-primary/50 hover:border-zinc-700",
        )}
      >
        <div className="mr-3 flex items-center gap-2 border-r border-zinc-800 pr-3 select-none">
          <Terminal className="size-4 text-zinc-500" />
          <span className="font-mono text-xs text-zinc-500">{language}</span>
        </div>

        <input
          type="text"
          placeholder="npm install..."
          value={command}
          onChange={(e) => onChange({ ...content, command: e.target.value })}
          className="flex-1 bg-transparent font-mono text-sm text-zinc-200 outline-none placeholder:text-zinc-700"
        />
      </div>
    </div>
  );
}
