"use client";

import { useReadme } from "@/store/ReadmeContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Heading1, Heading2, Heading3 } from "lucide-react";

import { SortableBlock } from "./sortable-block";
import { HeaderBlock } from "./blocks/header-block";
import { TextBlock } from "./blocks/text-block";
import { BadgeBlock } from "./blocks/badge-block";
import { TechStackBlock } from "./blocks/tech-stack-block";
import { ImageBlock } from "./blocks/image-block";
import { TableBlock } from "./blocks/table-block";
import { ReadmeBlock } from "@/types/readme";
import { cn } from "@/lib/utils";
import { TextToolbar } from "./blocks/text-toolbar";
import { CommandBlock } from "./blocks/command-block";

export function BlockList() {
  const { state, dispatch } = useReadme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.blocks.findIndex(
        (block) => block.id === active.id,
      );
      const newIndex = state.blocks.findIndex((block) => block.id === over.id);
      const newOrder = arrayMove(state.blocks, oldIndex, newIndex);
      dispatch({ type: "REORDER_BLOCKS", payload: newOrder });
    }
  };

  const renderBlockConfig = (block: ReadmeBlock) => {
    const updateContent = (newContent: any) => {
      dispatch({
        type: "UPDATE_BLOCK_CONTENT",
        payload: {
          id: block.id,
          content: { ...block.content, ...newContent },
        },
      });
    };

    switch (block.type) {
      case "header": {
        const currentLevel = block.content.level || 1;
        return (
          <div className="flex w-full items-center gap-2">
            <span
              className={cn(
                "hidden px-2 text-[9px] font-bold uppercase",
                "tracking-widest text-zinc-600 sm:inline",
              )}
            >
              Level
            </span>
            <div className="flex flex-1 gap-1">
              {[1, 2, 3].map((lvl) => {
                const Icon =
                  lvl === 1 ? Heading1 : lvl === 2 ? Heading2 : Heading3;
                const isActive = currentLevel === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => updateContent({ level: lvl as 1 | 2 | 3 })}
                    className={cn(
                      "flex h-8 flex-1 items-center justify-center gap-2 rounded-md border transition-all",
                      isActive
                        ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                        : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                    )}
                  >
                    <Icon
                      className={cn("size-3.5", isActive && "stroke-[3px]")}
                    />
                    <span className="text-[10px] font-bold">H{lvl}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case "text": {
        return <TextToolbar blockId={block.id} />;
      }

      case "command": {
        const currentLang = block.content.language || "sh";
        const languages = ["sh", "bash", "npm", "yarn", "js"];

        return (
          <div className="flex w-full items-center gap-2">
            <span
              className={cn(
                "hidden px-2 text-[9px] font-bold uppercase",
                "tracking-widest text-zinc-600 sm:inline",
              )}
            >
              Language
            </span>
            <div className="flex flex-1 gap-1">
              {languages.map((lang) => {
                const isActive = currentLang === lang;

                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => updateContent({ language: lang })}
                    className={cn(
                      "flex h-8 flex-1 items-center justify-center rounded-md border text-[10px] font-bold transition-all",
                      isActive
                        ? "bg-primary/20 text-primary border-primary/40 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                        : "border-transparent text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300",
                    )}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderEditor = (block: ReadmeBlock) => {
    const updateContent = (newContent: any) => {
      dispatch({
        type: "UPDATE_BLOCK_CONTENT",
        payload: { id: block.id, content: newContent },
      });
    };

    switch (block.type) {
      case "header":
        return <HeaderBlock content={block.content} onChange={updateContent} />;
      case "text":
        return (
          <TextBlock
            id={block.id}
            content={block.content}
            onChange={updateContent}
          />
        );
      case "badges":
        return <BadgeBlock content={block.content} onChange={updateContent} />;
      case "techstack":
        return (
          <TechStackBlock content={block.content} onChange={updateContent} />
        );
      case "image":
        return <ImageBlock content={block.content} onChange={updateContent} />;
      case "table":
        return <TableBlock content={block.content} onChange={updateContent} />;
      case "command":
        return (
          <CommandBlock
            id={block.id}
            content={block.content}
            onChange={updateContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      <DndContext
        id="readme-lab-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {state.blocks.map((block) => (
            <SortableBlock
              key={block.id}
              id={block.id}
              type={block.type}
              configContent={renderBlockConfig(block)}
              onRemove={() =>
                dispatch({ type: "REMOVE_BLOCK", payload: block.id })
              }
            >
              {renderEditor(block)}
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
