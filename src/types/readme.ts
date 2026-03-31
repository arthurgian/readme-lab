export type BlockType = "header" | "text" | "badges" | "techstack" | "image" | "table";

export interface ReadmeBlock {
  id: string;
  type: BlockType;
  content: any;
}

export interface ReadmeState {
  blocks: ReadmeBlock[];
}

export type ReadmeAction =
  | { type: "ADD_BLOCK"; payload: BlockType }
  | { type: "REMOVE_BLOCK"; payload: string }
  | { type: "UPDATE_BLOCK_CONTENT"; payload: { id: string; content: any } }
  | { type: "REORDER_BLOCKS"; payload: ReadmeBlock[] };
