export type BlockType =
  | "header"
  | "text"
  | "badges"
  | "techstack"
  | "image"
  | "table";

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
}

export interface BadgesContent {
  items?: BadgeItem[];
}

export interface TechStackContent {
  techs?: string[];
}

export interface ImageContent {
  url?: string;
  alt?: string;
}

export interface TableContent {
  headers?: string[];
  rows?: string[][];
}

export type ReadmeBlock =
  | { id: string; type: "header"; content: HeaderContent }
  | { id: string; type: "text"; content: TextContent }
  | { id: string; type: "badges"; content: BadgesContent }
  | { id: string; type: "techstack"; content: TechStackContent }
  | { id: string; type: "image"; content: ImageContent }
  | { id: string; type: "table"; content: TableContent };

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
            TableContent
        >;
      };
    }
  | { type: "REORDER_BLOCKS"; payload: ReadmeBlock[] };
