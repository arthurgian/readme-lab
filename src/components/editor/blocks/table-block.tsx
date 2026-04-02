"use client";

import { useState, useEffect } from "react";
import { TableContent } from "@/types/readme";
import { cn } from "@/lib/utils";
import { Plus, Trash2, X, Square, CheckSquare } from "lucide-react";

interface TableBlockProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
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

export function TableBlock({ content, onChange }: TableBlockProps) {
  const headers = content.headers || ["", ""];
  const rows = content.rows || [["", ""]];
  const selectedCells = content.selectedCells || [];
  const alignments = content.alignments || [];

  const [selectedRowLines, setSelectedRowLines] = useState<number[]>([]);

  useEffect(() => {
    if (!content.headers) {
      onChange({ headers: ["", ""], rows: [["", ""]] });
    }
  }, [content.headers, onChange]);

  const updateTable = (newHeaders: string[], newRows: string[][]) => {
    onChange({ ...content, headers: newHeaders, rows: newRows });
  };

  const handleCellClick = (e: React.MouseEvent, r: number, c: number) => {
    let newSelected = [...selectedCells];
    const existsIndex = newSelected.findIndex(
      (cell) => cell.r === r && cell.c === c,
    );

    if (e.ctrlKey || e.metaKey) {
      if (existsIndex >= 0) newSelected.splice(existsIndex, 1);
      else newSelected.push({ r, c });
    } else {
      if (existsIndex < 0 || newSelected.length > 1) {
        newSelected = [{ r, c }];
      }
    }
    onChange({ ...content, selectedCells: newSelected });
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.r === r && cell.c === c);
  };

  const addColumn = () => {
    const newHeaders = [...headers, ""];
    const newRows = rows.map((row) => [...row, ""]);
    updateTable(newHeaders, newRows);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill("");
    updateTable(headers, [...rows, newRow]);
  };

  const removeColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== colIndex);
    const newRows = rows.map((row) => row.filter((_, i) => i !== colIndex));
    const cleanSelections = selectedCells.filter((cell) => cell.c !== colIndex);
    const newAlignments = alignments.filter((_, i) => i !== colIndex);
    onChange({
      ...content,
      headers: newHeaders,
      rows: newRows,
      alignments: newAlignments,
      selectedCells: cleanSelections,
    });
  };

  const toggleSelectLine = (rowIndex: number) => {
    setSelectedRowLines((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex],
    );
  };

  const toggleSelectAllLines = () => {
    if (selectedRowLines.length === rows.length) setSelectedRowLines([]);
    else setSelectedRowLines(rows.map((_, i) => i));
  };

  const removeSelectedRows = () => {
    const newRows = rows.filter((_, i) => !selectedRowLines.includes(i));
    if (newRows.length === 0)
      updateTable(headers, [new Array(headers.length).fill("")]);
    else updateTable(headers, newRows);
    setSelectedRowLines([]);
  };

  const isAllSelected =
    rows.length > 0 && selectedRowLines.length === rows.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="custom-scrollbar overflow-x-auto pb-2">
        <div className="flex w-max min-w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2">
            {rows.length > 1 && (
              <div className="w-5 shrink-0" aria-hidden="true" />
            )}

            {headers.map((header, colIndex) => {
              const { marks, plain } = parseMarks(header);
              const align = alignments[colIndex] || "left";

              return (
                <div
                  key={`h-${colIndex}`}
                  onClick={(e) => handleCellClick(e, -1, colIndex)}
                  className={cn(
                    "group flex min-w-[90px] flex-1 items-center gap-2 rounded-lg border",
                    "bg-zinc-800/40 p-1.5 px-3 transition-all",
                    isCellSelected(-1, colIndex)
                      ? "border-primary ring-primary/50 ring-1"
                      : "border-zinc-800 hover:border-zinc-700",
                  )}
                >
                  <input
                    className={cn(
                      "w-full min-w-0 bg-transparent text-xs text-zinc-100 outline-none placeholder:text-zinc-500",
                      "font-bold",
                      marks.italic && "italic",
                      marks.code && "font-mono tracking-tight text-zinc-300",
                      align === "center" && "text-center",
                      align === "right" && "text-right",
                    )}
                    value={plain}
                    placeholder={`Coluna ${colIndex + 1}`}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[colIndex] = applyMarks(e.target.value, marks);
                      updateTable(newHeaders, rows);
                    }}
                  />
                  {headers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColumn(colIndex);
                      }}
                      className="shrink-0 rounded p-1 text-zinc-600 opacity-50 transition-all group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            {rows.map((row, rowIndex) => {
              const isLineSelected = selectedRowLines.includes(rowIndex);
              return (
                <div
                  key={`r-${rowIndex}`}
                  className="flex w-full items-center gap-2"
                >
                  {rows.length > 1 && (
                    <div className="flex w-5 shrink-0 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectLine(rowIndex)}
                        className="hover:text-primary text-zinc-600 transition-colors"
                      >
                        {isLineSelected ? (
                          <CheckSquare className="text-primary size-4" />
                        ) : (
                          <Square className="size-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Células */}
                  {row.map((cell, colIndex) => {
                    const { marks, plain } = parseMarks(cell);
                    const align = alignments[colIndex] || "left";

                    return (
                      <div
                        key={`c-${rowIndex}-${colIndex}`}
                        onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
                        className={cn(
                          "flex min-w-[90px] flex-1 items-center rounded-lg border",
                          "bg-zinc-900/50 p-1.5 px-3 transition-all",
                          isCellSelected(rowIndex, colIndex)
                            ? "border-primary bg-primary/5 ring-primary/50 ring-1"
                            : "border-zinc-800 hover:border-zinc-700",
                          isLineSelected &&
                            !isCellSelected(rowIndex, colIndex) &&
                            "border-primary/50 bg-primary/5",
                        )}
                      >
                        <input
                          className={cn(
                            "w-full min-w-0 bg-transparent text-xs text-zinc-300 outline-none placeholder:text-zinc-600",
                            marks.bold && "font-bold text-zinc-100",
                            marks.italic && "italic",
                            marks.code &&
                              "font-mono tracking-tight text-zinc-200",
                            align === "center" && "text-center",
                            align === "right" && "text-right",
                          )}
                          value={plain}
                          placeholder="..."
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[rowIndex] = [...newRows[rowIndex]];
                            newRows[rowIndex][colIndex] = applyMarks(
                              e.target.value,
                              marks,
                            );
                            updateTable(headers, newRows);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {rows.length > 1 && (
          <button
            type="button"
            onClick={toggleSelectAllLines}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-medium transition-all active:scale-[0.98]",
              isAllSelected
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:text-zinc-300",
            )}
          >
            {isAllSelected ? (
              <CheckSquare className="size-3.5" />
            ) : (
              <Square className="size-3.5" />
            )}
            {isAllSelected ? "Desmarcar" : "Todos"}
          </button>
        )}

        {selectedRowLines.length > 0 && (
          <button
            type="button"
            onClick={removeSelectedRows}
            className={cn(
              "animate-in fade-in slide-in-from-left-2 flex items-center justify-center gap-2 rounded-lg border border-red-900/50",
              "bg-red-950/30 px-4 py-3 text-xs font-medium text-red-500 transition-all",
              "hover:border-red-900 hover:bg-red-900/50 hover:text-red-400 active:scale-[0.98]",
            )}
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Deletar</span> (
            {selectedRowLines.length})
          </button>
        )}

        <button
          type="button"
          onClick={addColumn}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800",
            "py-3 text-xs font-medium text-zinc-500 transition-all hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300 active:scale-[0.98]",
          )}
        >
          <Plus className="size-3.5" /> Adicionar Coluna
        </button>

        <button
          type="button"
          onClick={addRow}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800",
            "py-3 text-xs font-medium text-zinc-500 transition-all hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300 active:scale-[0.98]",
          )}
        >
          <Plus className="size-3.5" /> Adicionar Linha
        </button>
      </div>
    </div>
  );
}
