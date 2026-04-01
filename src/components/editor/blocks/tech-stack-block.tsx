"use client";

import { useState } from "react";
import { TechStackContent, TechItem } from "@/types/readme";
import { cn } from "@/lib/utils";
import { Plus, X, Square, CheckSquare, Trash2 } from "lucide-react";
import { SUPPORTED_SKILLS } from "@/constants/skills";

interface TechItemRowProps {
  tech: TechItem;
  index: number;
  updateTech: (index: number, value: string) => void;
  removeTech: (index: number) => void;
  toggleSelect: (index: number) => void;
}

function TechItemRow({
  tech,
  index,
  updateTech,
  removeTech,
  toggleSelect,
}: TechItemRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const safeValue = tech.name || "";

  const matchedIcon = SUPPORTED_SKILLS.find(
    (i) =>
      i.label.toLowerCase() === safeValue.toLowerCase() ||
      i.slug === safeValue.toLowerCase(),
  );

  const finalSlug = matchedIcon?.slug || "";

  const filtered = SUPPORTED_SKILLS.filter(
    (b) =>
      b.label.toLowerCase().includes(safeValue.toLowerCase()) ||
      b.slug.includes(safeValue.toLowerCase()),
  ).slice(0, 30);

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-lg border border-zinc-800",
        "bg-zinc-900/50 p-1.5 px-3 transition-all",
        "focus-within:border-primary/50 focus-within:bg-zinc-900",
        "hover:border-zinc-700",
        tech.isSelected && "border-primary/50 bg-primary/5",
      )}
    >
      <button
        type="button"
        onClick={() => toggleSelect(index)}
        className="hover:text-primary shrink-0 text-zinc-600 transition-colors"
      >
        {tech.isSelected ? (
          <CheckSquare className="text-primary size-4" />
        ) : (
          <Square className="size-4" />
        )}
      </button>

      <div className="h-4 w-px shrink-0 bg-zinc-800" />

      <div className="flex size-4 shrink-0 items-center justify-center overflow-hidden">
        {finalSlug ? (
          <img
            src={`https://skillicons.dev/icons?i=${finalSlug}&theme=${tech.theme || "dark"}`}
            className="size-4 object-contain opacity-50 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
            onError={(e) => (e.currentTarget.style.display = "none")}
            alt=""
          />
        ) : (
          <div className="size-3.5 rounded-full bg-zinc-800" />
        )}
      </div>

      <div className="relative flex-1">
        <input
          className="w-full bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
          value={safeValue}
          onChange={(e) => {
            updateTech(index, e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Ex: React"
        />

        {isOpen && safeValue.trim().length > 0 && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-[100] mt-2 w-56 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl">
            {filtered.length > 0 ? (
              <div className="custom-scrollbar max-h-40 overflow-y-auto pr-1">
                {filtered.map((b) => (
                  <div
                    key={b.slug}
                    className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateTech(index, b.label);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://skillicons.dev/icons?i=${b.slug}`}
                        alt=""
                        className="size-4"
                      />
                      <span className="truncate">{b.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-2 py-3 text-center text-[10px] text-zinc-500">
                Sem sugestões.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-4 w-px shrink-0 bg-zinc-800" />

      <button
        type="button"
        className="shrink-0 rounded p-1 text-zinc-600 opacity-50 transition-all group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
        onClick={() => removeTech(index)}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

interface TechStackBlockProps {
  content: TechStackContent;
  onChange: (content: TechStackContent) => void;
}

export function TechStackBlock({ content, onChange }: TechStackBlockProps) {
  const techs = content.techs || [];

  const selectedCount = techs.filter((t) => t.isSelected).length;
  const isAllSelected = techs.length > 0 && selectedCount === techs.length;

  const addTech = () => {
    onChange({
      ...content,
      techs: [...techs, { name: "", isSelected: false, theme: "dark" }],
    });
  };

  const removeTech = (index: number) => {
    onChange({ ...content, techs: techs.filter((_, i) => i !== index) });
  };

  const removeSelectedTechs = () => {
    onChange({ ...content, techs: techs.filter((t) => !t.isSelected) });
  };

  const toggleSelectAll = () => {
    onChange({
      ...content,
      techs: techs.map((t) => ({ ...t, isSelected: !isAllSelected })),
    });
  };

  const updateTech = (index: number, value: string) => {
    onChange({
      ...content,
      techs: techs.map((t, i) => (i === index ? { ...t, name: value } : t)),
    });
  };

  const toggleSelect = (index: number) => {
    onChange({
      ...content,
      techs: techs.map((t, i) =>
        i === index ? { ...t, isSelected: !t.isSelected } : t,
      ),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {techs.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {techs.map((tech, index) => (
            <TechItemRow
              key={index}
              tech={tech}
              index={index}
              updateTech={updateTech}
              removeTech={removeTech}
              toggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {techs.length > 0 && (
          <button
            type="button"
            onClick={toggleSelectAll}
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

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={removeSelectedTechs}
            className={cn(
              "animate-in fade-in slide-in-from-left-2 flex items-center justify-center gap-2 rounded-lg border border-red-900/50",
              "bg-red-950/30 px-4 py-3 text-xs font-medium text-red-500 transition-all",
              "hover:border-red-900 hover:bg-red-900/50 hover:text-red-400",
              "active:scale-[0.98]",
            )}
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Deletar</span> ({selectedCount})
          </button>
        )}

        <button
          type="button"
          onClick={addTech}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800",
            "py-3 text-xs font-medium text-zinc-500 transition-all",
            "hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300",
            "active:scale-[0.98]",
          )}
        >
          <Plus className="size-3.5" /> Adicionar Tecnologia
        </button>
      </div>
    </div>
  );
}
