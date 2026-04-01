import { ReadmeBlock } from "@/types/readme";
import { turndownService } from "./turndown";

export function generateMarkdown(blocks: ReadmeBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `${"#".repeat(block.content.level || 1)} ${block.content.title || "Título do Projeto"}`;

        case "text": {
          const htmlContent = block.content.text || "";
          const markdownText = turndownService.turndown(htmlContent);
          return markdownText || "";
        }

        case "command": {
          const lang = block.content.language || "sh";
          const command = block.content.command || "";
          if (!command) return "";
          return `\`\`\`${lang}\n${command}\n\`\`\``;
        }

        case "badges":
          return (block.content.items || [])
            .map(
              (item) =>
                `![${item.label}](https://img.shields.io/badge/${encodeURIComponent(item.label)}-${item.color}?style=for-the-badge&logo=${item.label.toLowerCase()}&logoColor=white)`,
            )
            .join(" ");

        case "techstack": {
          const techList = (block.content.techs || []).join(",");
          if (!techList) return "## Tech Stack";
          return `## Tech Stack\n\n[![My Skills](https://skillicons.dev/icons?i=${techList.toLowerCase().replace(/\s/g, "")})](https://skillicons.dev)`;
        }

        case "image": {
          if (!block.content.url) return "";
          return `<p align="center">\n  <img src="${block.content.url}" alt="${block.content.alt || "image"}" width="50%" />\n</p>`;
        }

        case "table": {
          const { headers = [], rows = [] } = block.content;
          if (headers.length === 0) return "";
          const headerRow = `| ${headers.join(" | ")} |`;
          const separator = `| ${headers.map(() => "---").join(" | ")} |`;
          const bodyRows = rows
            .map((row) => `| ${row.join(" | ")} |`)
            .join("\n");
          return `${headerRow}\n${separator}\n${bodyRows}`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
