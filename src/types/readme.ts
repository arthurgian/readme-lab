export type BlockType =
  | "header"
  | "text"
  | "badges"
  | "techstack"
  | "image"
  | "table"
  | "command";

export interface HeaderContent {
  title?: string;
  level?: 1 | 2 | 3;
}

export interface TextContent {
  text?: string;
}

export interface BadgeItem {
  label: string;
  color: string;
  style?: "plastic" | "flat" | "flat-square" | "for-the-badge";
  isSelected?: boolean;
  link?: string;
  logoColor?: string;
}
export interface BadgesContent {
  items?: BadgeItem[];
}

export interface TechItem {
  name: string;
  isSelected?: boolean;
  theme?: "dark" | "light";
}

export interface TechStackContent {
  techs?: TechItem[];
}

export interface ImageContent {
  url?: string;
  alt?: string;
  width?: string;
}

export interface TableContent {
  headers?: string[];
  rows?: string[][];
}

export type CommandContent = {
  language?: string;
  command?: string;
};

export type ReadmeBlock =
  | { id: string; type: "header"; content: HeaderContent }
  | { id: string; type: "text"; content: TextContent }
  | { id: string; type: "badges"; content: BadgesContent }
  | { id: string; type: "techstack"; content: TechStackContent }
  | { id: string; type: "image"; content: ImageContent }
  | { id: string; type: "table"; content: TableContent }
  | { id: string; type: "command"; content: CommandContent };

export interface ReadmeState {
  blocks: ReadmeBlock[];
}

export type ReadmeAction =
  | { type: "ADD_BLOCK"; payload: BlockType }
  | { type: "REMOVE_BLOCK"; payload: string }
  | {
      type: "UPDATE_BLOCK_CONTENT";
      payload: {
        id: string;
        content: Partial<
          HeaderContent &
            TextContent &
            BadgesContent &
            TechStackContent &
            ImageContent &
            TableContent &
            CommandContent
        >;
      };
    }
  | { type: "REORDER_BLOCKS"; payload: ReadmeBlock[] };
