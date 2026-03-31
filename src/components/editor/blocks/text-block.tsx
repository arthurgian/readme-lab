"use client";

import { Textarea } from "@/components/ui/textarea";
import { TextContent } from "@/types/readme";

interface TextBlockProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
}

export function TextBlock({ content, onChange }: TextBlockProps) {
  return (
    <div className="w-full">
      <Textarea
        value={content.text || ""}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Descrição / Texto"
        className="text-base leading-relaxed"
      />
    </div>
  );
}
