import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Table as TableIcon } from "lucide-react";

export function TableBlock({ content, onChange }: any) {
  const headers = content.headers || ["Chave", "Descrição"];
  const rows = content.rows || [["Exemplo", "Valor Exemplo"]];

  const updateTable = (newHeaders: string[], newRows: string[][]) => {
    onChange({ ...content, headers: newHeaders, rows: newRows });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Coluna ${headers.length + 1}`];
    const newRows = rows.map((row: string[]) => [...row, ""]);
    updateTable(newHeaders, newRows);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill("");
    updateTable(headers, [...rows, newRow]);
  };

  const removeColumn = (colIndex: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_: any, i: number) => i !== colIndex);
    const newRows = rows.map((row: string[]) => row.filter((_: any, i: number) => i !== colIndex));
    updateTable(newHeaders, newRows);
  };

  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_: any, i: number) => i !== rowIndex);
    updateTable(headers, newRows);
  };

  return (
    <div className="space-y-4 overflow-x-auto pb-2">
      <div className="min-w-[400px] space-y-2">
        <div className="mb-4 flex gap-2">
          {headers.map((header: string, i: number) => (
            <div key={`h-${i}`} className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-1">
                <Input
                  className="bg-muted/50 h-8 text-xs font-bold"
                  value={header}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[i] = e.target.value;
                    updateTable(newHeaders, rows);
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeColumn(i)}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {rows.map((row: string[], rowIndex: number) => (
          <div key={`r-${rowIndex}`} className="flex items-center gap-2">
            {row.map((cell, colIndex) => (
              <Input
                key={`c-${rowIndex}-${colIndex}`}
                className="h-8 flex-1 text-xs"
                value={cell}
                onChange={(e) => {
                  const newRows = [...rows];
                  newRows[rowIndex][colIndex] = e.target.value;
                  updateTable(headers, newRows);
                }}
              />
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeRow(rowIndex)}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="xs" className="text-[10px]" onClick={addColumn}>
          <Plus className="mr-1 size-3" /> Coluna
        </Button>
        <Button variant="outline" size="xs" className="text-[10px]" onClick={addRow}>
          <Plus className="mr-1 size-3" /> Linha
        </Button>
      </div>
    </div>
  );
}
