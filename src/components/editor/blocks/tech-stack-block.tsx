import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function TechStackBlock({ content, onChange }: any) {
  const techs = content.techs || [];

  const addTech = () => {
    onChange({ ...content, techs: [...techs, "React"] });
  };

  const removeTech = (index: number) => {
    const newTechs = techs.filter((_: any, i: number) => i !== index);
    onChange({ ...content, techs: newTechs });
  };

  const updateTech = (index: number, value: string) => {
    const newTechs = techs.map((t: string, i: number) => (i === index ? value : t));
    onChange({ ...content, techs: newTechs });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {techs.map((tech: string, index: number) => (
          <div key={index} className="group/item flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                className="h-9 pr-8 text-xs"
                value={tech}
                onChange={(e) => updateTech(index, e.target.value)}
                placeholder="Ex: Next.js"
              />
              <img
                src={`https://simpleicons.org/icons/${tech.toLowerCase().replace(/\s/g, "")}.svg`}
                className="absolute top-2.5 right-2 size-4 opacity-20 transition-opacity group-hover/item:opacity-100"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive size-8"
              onClick={() => removeTech(index)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed text-xs"
        onClick={addTech}
      >
        <Plus className="mr-2 size-3" /> Adicionar Tecnologia
      </Button>
    </div>
  );
}
