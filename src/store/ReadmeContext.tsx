"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ReadmeState, ReadmeAction, ReadmeBlock, BlockType } from "@/types/readme";
import { v4 as uuidv4 } from "uuid";

const initialState: ReadmeState = {
  blocks: [
    { id: "1", type: "header", content: { title: "Meu Projeto" } },
    { id: "2", type: "text", content: { text: "Descrição do meu projeto" } },
  ],
};

function readmeReducer(state: ReadmeState, action: ReadmeAction): ReadmeState {
  switch (action.type) {
    case "ADD_BLOCK":
      const newBlock: ReadmeBlock = {
        id: uuidv4(),
        type: action.payload,
        content: {},
      };
      return { ...state, blocks: [...state.blocks, newBlock] };

    case "REMOVE_BLOCK":
      return { ...state, blocks: state.blocks.filter((b) => b.id !== action.payload) };

    case "UPDATE_BLOCK_CONTENT":
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.payload.id ? { ...b, content: action.payload.content } : b,
        ),
      };

    case "REORDER_BLOCKS":
      return { ...state, blocks: action.payload };

    default:
      return state;
  }
}

const ReadmeContext = createContext<{
  state: ReadmeState;
  dispatch: React.Dispatch<ReadmeAction>;
} | null>(null);

export function ReadmeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(readmeReducer, initialState);
  return <ReadmeContext.Provider value={{ state, dispatch }}>{children}</ReadmeContext.Provider>;
}

export const useReadme = () => {
  const context = useContext(ReadmeContext);
  if (!context) throw new Error();
  return context;
};
