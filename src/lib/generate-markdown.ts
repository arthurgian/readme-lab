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

        case "badges": {
          return (block.content.items || [])
            .map((item) => {
              const style = item.style || "for-the-badge";

              const logoColor = item.logoColor || "FFFFFF";

              const imgUrl = `https://img.shields.io/badge/${encodeURIComponent(item.label)}-${item.color}?style=${style}&logo=${encodeURIComponent(item.label.toLowerCase())}&logoColor=${logoColor}`;

              const markdownImage = `![${item.label}](${imgUrl})`;

              if (item.link && item.link.trim() !== "") {
                return `[${markdownImage}](${item.link.trim()})`;
              }

              return markdownImage;
            })
            .join(" ");
        }

        case "techstack": {
          const rawTechs = block.content.techs || [];

          const validTechs = rawTechs
            .map((t: any) => {
              const name = typeof t === "string" ? t : t?.name || "";
              const theme = typeof t === "object" && t.theme ? t.theme : "dark";
              return {
                slug: name.toLowerCase().replace(/[^a-z0-9]/g, ""),
                theme,
              };
            })
            .filter((t: any) => t.slug.trim().length > 0);

          if (validTechs.length === 0) return "";

          const groups: { theme: string; slugs: string[] }[] = [];
          let currentGroup = {
            theme: validTechs[0].theme,
            slugs: [validTechs[0].slug],
          };

          for (let i = 1; i < validTechs.length; i++) {
            if (validTechs[i].theme === currentGroup.theme) {
              currentGroup.slugs.push(validTechs[i].slug);
            } else {
              groups.push(currentGroup);
              currentGroup = {
                theme: validTechs[i].theme,
                slugs: [validTechs[i].slug],
              };
            }
          }
          groups.push(currentGroup);

          const markdownLinks = groups
            .map(
              (g) =>
                `[![My Skills](https://skillicons.dev/icons?i=${g.slugs.join(",")}&theme=${g.theme})](https://skillicons.dev)`,
            )
            .join(" ");

          return `\n\n${markdownLinks}`;
        }

        case "image": {
          if (!block.content.url) return "";

          const url = block.content.url;
          const alt = block.content.alt || "image";
          const width = block.content.width;

          if (width) {
            return `<p>\n  <img src="${url}" alt="${alt}" width="${width}" />\n</p>`;
          }

          return `![${alt}](${url})`;
        }

        case "table": {
          const headers = block.content.headers || [];
          const rows = block.content.rows || [];
          const alignments = block.content.alignments || [];

          if (headers.length === 0) return "";

          const headerRow = `| ${headers.map((h: string) => h || " ").join(" | ")} |`;

          const separatorRow = `| ${headers
            .map((_, i) => {
              const align = alignments[i];
              if (align === "center") return ":---:";
              if (align === "right") return "---:";
              return "---";
            })
            .join(" | ")} |`;

          const dataRows = rows
            .map(
              (row: string[]) =>
                `| ${row.map((cell) => cell || " ").join(" | ")} |`,
            )
            .join("\n");

          return `\n\n${headerRow}\n${separatorRow}\n${dataRows}`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}
