"use client";

import { useReadme } from "@/store/ReadmeContext";
import { ReadmeBlock } from "@/types/readme";

export function Outline() {
  const { state } = useReadme();

  const headers = state.blocks.filter(
    (block): block is Extract<ReadmeBlock, { type: "header" }> => {
      return block.type === "header" && !!block.content.title;
    },
  );

  return (
    <nav className="custom-scrollbar flex max-h-[calc(100vh-120px)] flex-col gap-8 overflow-y-auto pr-2">
      <div className="flex shrink-0 items-center gap-3">
        <div className="h-px w-2 bg-zinc-800" />
        <span className="text-[9px] font-black tracking-[0.3em] text-zinc-600 uppercase">
          Index
        </span>
      </div>

      <ul className="ml-1 flex flex-col gap-4 border-l border-zinc-900 pl-4">
        {headers.map((h) => (
          <li key={h.id}>
            <button className="group flex flex-col text-left transition-all">
              <span className="group-hover:text-primary line-clamp-1 text-[11px] font-medium text-zinc-500">
                {h.content.title}
              </span>
              <div className="bg-primary/40 mt-1 h-0.5 w-0 transition-all group-hover:w-4" />
            </button>
          </li>
        ))}

        {headers.length === 0 && (
          <li className="text-[10px] leading-tight text-zinc-700 italic">
            Nenhum título <br /> detectado...
          </li>
        )}
      </ul>
    </nav>
  );
}
