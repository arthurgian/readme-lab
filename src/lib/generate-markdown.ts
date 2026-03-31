import { ReadmeBlock } from "@/types/readme";

export function generateMarkdown(blocks: ReadmeBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `# ${block.content.title || "Título do Projeto"}`;

        case "text":
          return `${block.content.text || "Descrição"}`;

        case "badges":
          return (block.content.items || [])
            .map(
              (item: any) =>
                `![${item.label}](https://img.shields.io/badge/${encodeURIComponent(item.label)}-${item.color}?style=for-the-badge&logo=${item.label.toLowerCase()}&logoColor=white)`,
            )
            .join(" ");

        case "techstack": {
          const techList = (block.content.techs || []).join(",");
          if (!techList) return "## Tech Stack";

          return `## Tech Stack\n\n[![My Skills](https://skillicons.dev/icons?i=${techList.toLowerCase().replace(/\s/g, "")})](https://skillicons.dev)`;
        }

        case "image": {
          const url = block.content.url || "";
          const alt = block.content.alt || "image";
          if (!url) return "";
          return `<p align="center">\n  <img src="${url}" alt="${alt}" width="50%" />\n</p>`;
        }

        case "table": {
          const headers = block.content.headers || [];
          const rows = block.content.rows || [];
          if (headers.length === 0) return "";

          const headerRow = `| ${headers.join(" | ")} |`;
          const separator = `| ${headers.map(() => "---").join(" | ")} |`;
          const bodyRows = rows.map((row: string[]) => `| ${row.join(" | ")} |`).join("\n");

          return `${headerRow}\n${separator}\n${bodyRows}`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
