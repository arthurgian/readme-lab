import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function BadgeBlock({ content, onChange }: any) {
  const items = content.items || [];

  const addItem = () => {
    onChange({ ...content, items: [...items, { label: "React", color: "61DAFB" }] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onChange({ ...content, items: newItems });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = items.map((item: any, i: number) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ ...content, items: newItems });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {items.map((item: any, index: number) => (
          <div key={index} className="bg-muted flex items-center gap-2 rounded-lg border p-2">
            <Input
              className="h-7 w-24 text-xs"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
            />
            <Input
              className="h-7 w-16 font-mono text-xs"
              value={item.color}
              onChange={(e) => updateItem(index, "color", e.target.value.replace("#", ""))}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeItem(index)}
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full text-xs" onClick={addItem}>
        <Plus className="mr-2 size-3" /> Adicionar Badge
      </Button>
    </div>
  );
}
