import { Label } from "@/components/ui/label";

interface TextBlockProps {
  content: { text?: string };
  onChange: (content: any) => void;
}

export function TextBlock({ content, onChange }: TextBlockProps) {
  return (
    <div className="space-y-2">
      <Label>Descrição / Texto</Label>
      <textarea
        className="border-input focus-visible:ring-ring flex min-h-[100px] w-full rounded-lg border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
        value={content.text || ""}
        onChange={(e) => onChange({ ...content, text: e.target.value })}
        placeholder="Escreva o conteúdo da seção..."
      />
    </div>
  );
}
