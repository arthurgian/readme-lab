import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";

export function ImageBlock({ content, onChange }: any) {
  const updateField = (field: string, value: string) => {
    onChange({ ...content, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-muted-foreground text-[10px] font-bold uppercase">
            URL da Imagem
          </Label>
          <Input
            placeholder="https://github.com/user/repo/raw/main/screenshot.png"
            value={content.url || ""}
            onChange={(e) => updateField("url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-[10px] font-bold uppercase">
            Texto Alternativo (Alt)
          </Label>
          <Input
            placeholder="Screenshot"
            value={content.alt || ""}
            onChange={(e) => updateField("alt", e.target.value)}
          />
        </div>
      </div>

      <div className="border-muted bg-muted/30 relative mt-2 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed">
        {content.url ? (
          <img
            src={content.url}
            alt={content.alt}
            className="h-full w-full object-contain p-2"
            onError={(e) =>
              (e.currentTarget.src = "https://placehold.co/600x400?text=Imagem+Nao+Encontrada")
            }
          />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2">
            <ImageIcon className="size-8 opacity-20" />
            <span className="text-xs italic">Insira uma URL para ver o preview</span>
          </div>
        )}
      </div>
    </div>
  );
}
