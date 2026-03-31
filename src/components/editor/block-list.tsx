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
import { SortableBlock } from "./sortable-block";
import { HeaderBlock } from "./blocks/header-block";
import { TextBlock } from "./blocks/text-block";
import { BadgeBlock } from "./blocks/badge-block";
import { TechStackBlock } from "./blocks/tech-stack-block";
import { ImageBlock } from "./blocks/image-block";
import { TableBlock } from "./blocks/table-block";

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
      const oldIndex = state.blocks.findIndex((block) => block.id === active.id);
      const newIndex = state.blocks.findIndex((block) => block.id === over.id);

      const newOrder = arrayMove(state.blocks, oldIndex, newIndex);
      dispatch({ type: "REORDER_BLOCKS", payload: newOrder });
    }
  };

  const renderEditor = (block: any) => {
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
        return <TextBlock content={block.content} onChange={updateContent} />;
      case "badges":
        return <BadgeBlock content={block.content} onChange={updateContent} />;
      case "techstack":
        return <TechStackBlock content={block.content} onChange={updateContent} />;
      case "image":
        return <ImageBlock content={block.content} onChange={updateContent} />;
      case "table":
        return <TableBlock content={block.content} onChange={updateContent} />;
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
              onRemove={() => dispatch({ type: "REMOVE_BLOCK", payload: block.id })}
            >
              {renderEditor(block)}
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
