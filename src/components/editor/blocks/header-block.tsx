"use client";

import { Input } from "@/components/ui/input";
import { HeaderContent } from "@/types/readme";

interface HeaderBlockProps {
  content: HeaderContent;
  onChange: (content: HeaderContent) => void;
}

export function HeaderBlock({ content, onChange }: HeaderBlockProps) {
  return (
    <div className="w-full">
      <Input
        value={content.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        placeholder="Digite o título da seção..."
        className="text-lg font-bold tracking-tight"
      />
    </div>
  );
}
