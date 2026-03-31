import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeaderBlockProps {
  content: { title?: string };
  onChange: (content: any) => void;
}

export function HeaderBlock({ content, onChange }: HeaderBlockProps) {
  return (
    <div className="space-y-2">
      <Label>Título (H1)</Label>
      <Input
        value={content.title || ""}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        placeholder="Ex: Projeto Acadêmico"
      />
    </div>
  );
}
