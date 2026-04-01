import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

turndownService.addRule("inlineCode", {
  filter: "code",
  replacement: (content) => {
    const trimmedContent = content.trim();
    return `\`${trimmedContent}\``;
  },
});

export { turndownService };
