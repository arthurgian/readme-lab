"use client";

import { TableContent } from "@/types/readme";
import { ReadmeBlock } from "@/types/readme";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface TableConfiguratorProps {
  block: ReadmeBlock;
  updateContent: (content: Partial<TableContent>) => void;
}

const parseMarks = (text: string) => {
  let t = text.trim();
  const marks = { bold: false, italic: false, code: false };

  let changed = true;
  while (changed) {
    changed = false;

    if (t.startsWith("**") && t.endsWith("**") && t.length >= 4) {
      marks.bold = true;
      t = t.slice(2, -2);
      changed = true;
    } else if (
      t.startsWith("*") &&
      t.endsWith("*") &&
      t.length >= 2 &&
      !t.startsWith("**")
    ) {
      marks.italic = true;
      t = t.slice(1, -1);
      changed = true;
    } else if (t.startsWith("`") && t.endsWith("`") && t.length >= 2) {
      marks.code = true;
      t = t.slice(1, -1);
      changed = true;
    }
  }

  return { marks, plain: t };
};

const applyMarks = (
  plain: string,
  marks: { bold: boolean; italic: boolean; code: boolean },
) => {
  let t = plain;

  if (marks.code) t = `\`${t}\``;
  if (marks.italic) t = `*${t}*`;
  if (marks.bold) t = `**${t}**`;

  return t;
};

export function TableConfigurator({
  block,
  updateContent,
}: TableConfiguratorProps) {
  const content = block.content as TableContent;
  const headers = content.headers || [];
  const rows = content.rows || [];
  const selectedCells = content.selectedCells || [];
  const alignments = content.alignments || [];

  const hasSelection = selectedCells.length > 0;
  const selectedCols = Array.from(new Set(selectedCells.map((cell) => cell.c)));

  const isSelectionTextEmpty =
    !hasSelection ||
    selectedCells.every(({ r, c }) => {
      const text = r === -1 ? headers[c] : rows[r]?.[c] || "";
      return text.trim() === "";
    });

  const aggregatedMarks = (() => {
    if (!hasSelection || isSelectionTextEmpty)
      return { bold: false, italic: false, code: false };

    const cellsWithText = selectedCells.filter(({ r, c }) => {
      const text = r === -1 ? headers[c] : rows[r]?.[c] || "";
      return text.trim() !== "";
    });

    if (cellsWithText.length === 0)
      return { bold: false, italic: false, code: false };

    const allMarks = cellsWithText.map(({ r, c }) => {
      const text = r === -1 ? headers[c] : rows[r]?.[c] || "";
      return parseMarks(text).marks;
    });

    return {
      bold: allMarks.every((m) => m.bold),
      italic: allMarks.every((m) => m.italic),
      code: allMarks.every((m) => m.code),
    };
  })();

  const isAlignActive = (align: "left" | "center" | "right") => {
    if (!hasSelection) return false;
    return selectedCols.every((col) => (alignments[col] || "left") === align);
  };

  const toggleMark = (markKey: "bold" | "italic" | "code") => {
    if (!hasSelection) return;

    const newHeaders = [...headers];
    const newRows = rows.map((r) => [...r]);
    const isCurrentlyActive = aggregatedMarks[markKey];

    selectedCells.forEach(({ r, c }) => {
      const text = r === -1 ? newHeaders[c] : newRows[r][c];

      if (text.trim() === "") return;

      const { marks, plain } = parseMarks(text);

      marks[markKey] = !isCurrentlyActive;

      const newText = applyMarks(plain, marks);

      if (r === -1) newHeaders[c] = newText;
      else newRows[r][c] = newText;
    });

    updateContent({ headers: newHeaders, rows: newRows });
  };

  const applyAlignment = (align: "left" | "center" | "right") => {
    if (!hasSelection) return;

    const newAlignments = [...alignments];
    selectedCols.forEach((colIndex) => {
      newAlignments[colIndex] = align;
    });

    updateContent({ alignments: newAlignments });
  };

  const formatTools: {
    id: "bold" | "italic" | "code";
    icon: React.ElementType;
    label: string;
  }[] = [
    { id: "bold", icon: Bold, label: "Bold" },
    { id: "italic", icon: Italic, label: "Italic" },
    { id: "code", icon: Code, label: "Code" },
  ];

  const alignTools = [
    { id: "left" as const, icon: AlignLeft, label: "Left" },
    { id: "center" as const, icon: AlignCenter, label: "Center" },
    { id: "right" as const, icon: AlignRight, label: "Right" },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <span className="hidden w-[50px] shrink-0 px-2 text-[9px] font-bold tracking-widest text-zinc-600 uppercase sm:inline">
          Format
        </span>
        <div className="flex flex-1 gap-1">
          {formatTools.map((tool) => {
            const isActive = aggregatedMarks[tool.id];

            const isDisabled = isSelectionTextEmpty;

            return (
              <button
                key={tool.id}
                type="button"
                disabled={isDisabled}
                onClick={() => toggleMark(tool.id)}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center gap-2 rounded-md border transition-all",
                  isActive
                    ? "border-primary/40 bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                    : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                  isDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-20 grayscale",
                )}
              >
                <tool.icon
                  className={cn("size-3.5", isActive && "stroke-[3px]")}
                />
                <span className="text-[10px] font-bold">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex w-full items-center gap-2">
        <span className="hidden w-[50px] shrink-0 px-2 text-[9px] font-bold tracking-widest text-zinc-600 uppercase sm:inline">
          Align
        </span>
        <div className="flex flex-1 gap-1">
          {alignTools.map((tool) => {
            const isActive = isAlignActive(tool.id);

            const isDisabled = !hasSelection;

            return (
              <button
                key={tool.id}
                type="button"
                disabled={isDisabled}
                onClick={() => applyAlignment(tool.id)}
                className={cn(
                  "flex h-8 flex-1 items-center justify-center gap-2 rounded-md border transition-all",
                  isActive
                    ? "border-primary/40 bg-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                    : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                  isDisabled &&
                    "pointer-events-none cursor-not-allowed opacity-20 grayscale",
                )}
              >
                <tool.icon
                  className={cn("size-3.5", isActive && "stroke-[3px]")}
                />
                <span className="text-[10px] font-bold">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
