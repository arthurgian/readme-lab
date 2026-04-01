"use client";

import { useState, useEffect, useRef } from "react";
import { BadgesContent, BadgeItem } from "@/types/readme";
import { cn } from "@/lib/utils";
import { Plus, X, Square, CheckSquare, Trash2, Link } from "lucide-react";
import { HexColorPicker } from "react-colorful";

const PRESET_BADGES = [
  { label: "React", color: "61DAFB", slug: "react" },
  { label: "Next.js", color: "000000", slug: "nextdotjs" },
  { label: "TypeScript", color: "3178C6", slug: "typescript" },
  { label: "JavaScript", color: "F7DF1E", slug: "javascript" },
  { label: "Node.js", color: "339933", slug: "nodedotjs" },
  { label: "Python", color: "3776AB", slug: "python" },
  { label: "Tailwind CSS", color: "06B6D4", slug: "tailwindcss" },
  { label: "HTML5", color: "E34F26", slug: "html5" },
  { label: "CSS3", color: "1572B6", slug: "css3" },
  { label: "Git", color: "F05032", slug: "git" },
  { label: "GitHub", color: "181717", slug: "github" },
  { label: "Docker", color: "2496ED", slug: "docker" },
];

const QUICK_SWATCHES = [
  "FFFFFF",
  "181717",
  "3178C6",
  "4FC08D",
  "E34F26",
  "F7DF1E",
  "8B5CF6",
  "EC4899",
];

let globalIconsCache: { label: string; color: string; slug: string }[] = [
  ...PRESET_BADGES,
];

function useSimpleIcons() {
  const [icons, setIcons] = useState(globalIconsCache);
  const [loading, setLoading] = useState(
    globalIconsCache.length <= PRESET_BADGES.length,
  );

  useEffect(() => {
    if (globalIconsCache.length > 500) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    fetch(
      "https://cdn.jsdelivr.net/npm/simple-icons@latest/data/simple-icons.json",
      { signal: abortController.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error " + res.status);
        return res.json();
      })
      .then((data) => {
        const rawIcons = Array.isArray(data) ? data : data.icons || [];

        if (Array.isArray(rawIcons) && rawIcons.length > 0) {
          const formatted = rawIcons.map((icon: any) => ({
            label: icon.title || icon.name || "",
            color: icon.hex || "000000",
            slug: icon.slug || "",
          }));

          globalIconsCache = formatted;
          setIcons(formatted);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Falha no fetch, usando presets:", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => abortController.abort();
  }, []);

  return { icons, loading };
}

interface BadgeAutocompleteProps {
  value: string;
  onChangeLabel: (val: string) => void;
  onSelectBadge: (label: string, color: string) => void;
}

function BadgeAutocomplete({
  value,
  onChangeLabel,
  onSelectBadge,
}: BadgeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { icons, loading } = useSimpleIcons();

  const safeValue = value || "";

  const filtered = icons
    .filter((b) => b.label.toLowerCase().includes(safeValue.toLowerCase()))
    .slice(0, 30);

  return (
    <div className="relative min-w-0 flex-1">
      <input
        className="w-full bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
        placeholder="Busque (ex: React)"
        value={safeValue}
        onChange={(e) => {
          onChangeLabel(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />

      {isOpen && safeValue.trim().length > 0 && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-[100] mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl">
          {filtered.length > 0 ? (
            <div className="custom-scrollbar max-h-40 overflow-y-auto pr-1">
              {filtered.map((b, i) => (
                <div
                  key={`${b.slug}-${i}`}
                  className="flex cursor-pointer items-center justify-between rounded px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectBadge(b.label, b.color);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {b.slug ? (
                      <img
                        src={`https://cdn.simpleicons.org/${b.slug}/white`}
                        alt={b.label}
                        className="size-3.5 shrink-0 object-contain"
                      />
                    ) : (
                      <div className="size-3.5 shrink-0 rounded-full bg-zinc-800" />
                    )}
                    <span className="truncate">{b.label}</span>
                  </div>

                  <div
                    className="size-2.5 shrink-0 rounded-full border border-zinc-700/50"
                    style={{ backgroundColor: `#${b.color}` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-3 text-center text-[10px] leading-tight text-zinc-500">
              {loading ? (
                <span className="animate-pulse">Buscando...</span>
              ) : (
                <>
                  Nenhuma sugestão encontrada.
                  <br />
                  <span className="mt-1 block font-bold text-zinc-400">
                    "{safeValue}"
                  </span>
                  será criada como personalizada.
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface BadgeItemRowProps {
  item: BadgeItem;
  index: number;
  updateItem: (index: number, field: keyof BadgeItem, value: any) => void;
  updateItemFields: (index: number, fields: Partial<BadgeItem>) => void;
  removeItem: (index: number) => void;
  toggleSelect: (index: number) => void;
}

function BadgeItemRow({
  item,
  index,
  updateItem,
  updateItemFields,
  removeItem,
  toggleSelect,
}: BadgeItemRowProps) {
  const [showColors, setShowColors] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowColors(false);
      }
    }
    if (showColors) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColors]);

  const logoHex = item.logoColor || "FFFFFF";
  const bgHex = item.color || "000000";

  const getSafeColor = (hex: string) => {
    const clean = hex.replace("#", "");
    return clean.length === 6 || clean.length === 3 ? `#${clean}` : "#000000";
  };

  const handleHexChange = (field: "color" | "logoColor", value: string) => {
    const sanitizedHex = value.replace(/[^0-9A-Fa-f]/g, "").toUpperCase();
    updateItem(index, field, sanitizedHex);
  };

  return (
    <div
      className={cn(
        "group flex flex-col gap-1.5 rounded-lg border border-zinc-800",
        "bg-zinc-900/50 p-1.5 transition-all",
        "focus-within:border-primary/50 focus-within:bg-zinc-900",
        "hover:border-zinc-700",
        item.isSelected && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggleSelect(index)}
          className="hover:text-primary shrink-0 text-zinc-600 transition-colors"
        >
          {item.isSelected ? (
            <CheckSquare className="text-primary size-4" />
          ) : (
            <Square className="size-4" />
          )}
        </button>

        <div className="h-4 w-px shrink-0 bg-zinc-800" />

        <BadgeAutocomplete
          value={item.label}
          onChangeLabel={(val) => updateItem(index, "label", val)}
          onSelectBadge={(label, color) =>
            updateItemFields(index, { label, color })
          }
        />

        <div className="h-4 w-px shrink-0 bg-zinc-800" />

        <div className="relative flex shrink-0 items-center" ref={popoverRef}>
          <button
            type="button"
            onClick={() => setShowColors(!showColors)}
            className="focus:ring-primary/50 flex items-center -space-x-1.5 rounded-full p-0.5 transition-all hover:space-x-0.5 hover:bg-zinc-800 focus:ring-1 focus:outline-none"
            title="Configurar Cores"
          >
            <div
              className="z-10 size-4 rounded-full border-2 border-zinc-900"
              style={{ backgroundColor: `#${logoHex}` }}
            />
            <div
              className="z-0 size-4 rounded-full border-2 border-zinc-900"
              style={{ backgroundColor: `#${bgHex}` }}
            />
          </button>

          {showColors && (
            <div
              className={cn(
                "animate-in fade-in zoom-in-95 absolute bottom-full z-[110] mb-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl",
                index % 2 === 0 ? "left-0" : "right-0",
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">
                  Cores da Badge
                </span>
                <button
                  onClick={() => setShowColors(false)}
                  className="text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <div className="mb-5 space-y-3">
                <span className="text-[9px] font-bold tracking-wider text-zinc-500">
                  COR DO FUNDO
                </span>

                <HexColorPicker
                  color={getSafeColor(bgHex)}
                  onChange={(color) => handleHexChange("color", color)}
                  style={{ width: "100%", height: "120px" }}
                />

                <div className="focus-within:border-primary/50 focus-within:ring-primary/50 flex items-center gap-2 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50 p-1.5 focus-within:ring-1">
                  <div
                    className="size-4 shrink-0 rounded-[4px] border border-zinc-700/50"
                    style={{ backgroundColor: `#${bgHex}` }}
                  />
                  <div className="flex flex-1 items-center gap-1">
                    <span className="font-mono text-xs text-zinc-600">#</span>
                    <input
                      className="w-full bg-transparent font-mono text-xs text-zinc-200 uppercase outline-none placeholder:text-zinc-700"
                      placeholder="HEX"
                      maxLength={6}
                      value={bgHex}
                      onChange={(e) => handleHexChange("color", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {QUICK_SWATCHES.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleHexChange("color", color)}
                      className="size-4 rounded-full border border-zinc-700/50 transition-transform hover:scale-125"
                      style={{ backgroundColor: `#${color}` }}
                      title={`#${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] font-bold tracking-wider text-zinc-500">
                  COR DO ÍCONE (LOGO)
                </span>

                <HexColorPicker
                  color={getSafeColor(logoHex)}
                  onChange={(color) => handleHexChange("logoColor", color)}
                  style={{ width: "100%", height: "120px" }}
                />

                <div className="focus-within:border-primary/50 focus-within:ring-primary/50 flex items-center gap-2 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50 p-1.5 focus-within:ring-1">
                  <div
                    className="size-4 shrink-0 rounded-[4px] border border-zinc-700/50"
                    style={{ backgroundColor: `#${logoHex}` }}
                  />
                  <div className="flex flex-1 items-center gap-1">
                    <span className="font-mono text-xs text-zinc-600">#</span>
                    <input
                      className="w-full bg-transparent font-mono text-xs text-zinc-200 uppercase outline-none placeholder:text-zinc-700"
                      placeholder="HEX"
                      maxLength={6}
                      value={logoHex}
                      onChange={(e) =>
                        handleHexChange("logoColor", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {QUICK_SWATCHES.map((color) => (
                    <button
                      key={`logo-${color}`}
                      onClick={() => handleHexChange("logoColor", color)}
                      className="size-4 rounded-full border border-zinc-700/50 transition-transform hover:scale-125"
                      style={{ backgroundColor: `#${color}` }}
                      title={`#${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="ml-1 shrink-0 rounded p-1 text-zinc-600 opacity-50 transition-all group-hover:opacity-100 hover:bg-zinc-800 hover:text-red-400"
          onClick={() => removeItem(index)}
        >
          <X className="size-3" />
        </button>
      </div>

      <div className="flex items-center gap-2 pr-1 pl-7 opacity-40 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Link className="size-3 shrink-0 text-zinc-500" />
        <input
          type="url"
          className="w-full min-w-0 bg-transparent font-mono text-[9px] text-zinc-400 outline-none placeholder:text-zinc-700"
          placeholder="URL opcional (ex: https://site.com)"
          value={item.link || ""}
          onChange={(e) => updateItem(index, "link", e.target.value)}
        />
      </div>
    </div>
  );
}

interface BadgeBlockProps {
  content: BadgesContent;
  onChange: (content: BadgesContent) => void;
}

export function BadgeBlock({ content, onChange }: BadgeBlockProps) {
  const items = content.items || [];
  const selectedCount = items.filter((item) => item.isSelected).length;
  const isAllSelected = items.length > 0 && selectedCount === items.length;

  const addItem = () => {
    onChange({
      ...content,
      items: [
        ...items,
        {
          label: "",
          color: "000000",
          style: "for-the-badge",
          isSelected: false,
          link: "",
          logoColor: "FFFFFF",
        },
      ],
    });
  };

  const toggleSelectAll = () => {
    const newItems = items.map((item) => ({
      ...item,
      isSelected: !isAllSelected,
    }));
    onChange({ ...content, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange({ ...content, items: newItems });
  };

  const removeSelectedItems = () => {
    const newItems = items.filter((item) => !item.isSelected);
    onChange({ ...content, items: newItems });
  };

  const updateItem = (index: number, field: keyof BadgeItem, value: any) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...content, items: newItems });
  };

  const updateItemFields = (index: number, fields: Partial<BadgeItem>) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, ...fields } : item,
    );
    onChange({ ...content, items: newItems });
  };

  const toggleSelect = (index: number) => {
    const item = items[index];
    updateItem(index, "isSelected", !item.isSelected);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((item, index) => (
            <BadgeItemRow
              key={index}
              item={item}
              index={index}
              updateItem={updateItem}
              updateItemFields={updateItemFields}
              removeItem={removeItem}
              toggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {items.length > 0 && (
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
            onClick={removeSelectedItems}
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
          onClick={addItem}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800",
            "py-3 text-xs font-medium text-zinc-500 transition-all",
            "hover:border-zinc-700 hover:bg-zinc-900/50 hover:text-zinc-300",
            "active:scale-[0.98]",
          )}
        >
          <Plus className="size-3.5" /> Adicionar Badge
        </button>
      </div>
    </div>
  );
}
