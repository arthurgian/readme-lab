"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeExtension from "@tiptap/extension-code";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { useEffect, useState, useRef } from "react";
import { TextContent } from "@/types/readme";
import { cn } from "@/lib/utils";
import { FormatEventDetail } from "./text-toolbar";
import { Check, X } from "lucide-react";

interface TextBlockProps {
  id: string;
  content: TextContent;
  onChange: (content: TextContent) => void;
}

export function TextBlock({ id, content, onChange }: TextBlockProps) {
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
      }),
      CodeExtension.extend({
        excludes: "",
      }).configure({
        HTMLAttributes: {
          class: cn(
            "rounded-md bg-zinc-800/80 px-1.5 py-0.5",
            "font-mono text-sm text-foreground",
            "border border-zinc-700",
          ),
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-400 underline cursor-pointer",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose list-none p-0 my-4",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-3 my-2",
        },
      }),
    ],
    content: content.text || "",
    immediatelyRender: false,
    editorProps: {
      handleKeyDown: (view, event) => {
        if (!editor) return false;

        if (event.key === "Tab" && !event.shiftKey) {
          if (editor.can().sinkListItem("taskItem")) {
            editor.chain().focus().sinkListItem("taskItem").run();
            return true;
          }
          if (editor.can().sinkListItem("listItem")) {
            editor.chain().focus().sinkListItem("listItem").run();
            return true;
          }
        }

        if (event.key === "Tab" && event.shiftKey) {
          if (editor.can().liftListItem("taskItem")) {
            editor.chain().focus().liftListItem("taskItem").run();
            return true;
          }
          if (editor.can().liftListItem("listItem")) {
            editor.chain().focus().liftListItem("listItem").run();
            return true;
          }
        }

        return false;
      },
      attributes: {
        class: cn(
          "min-h-[120px] w-full rounded-xl border-2 border-zinc-800",
          "bg-zinc-900/20 px-4 py-3 text-base outline-none transition-all",
          "focus:border-primary/50 hover:border-zinc-700",
          "prose prose-invert max-w-none selection:bg-primary/30",
          "[&_code]:before:content-[''] [&_code]:after:content-['']",

          "[&_ul]:pl-5 [&_ol]:pl-5",
          "[&_li_p]:my-0.5",

          "[&_ul_ul]:list-[circle]",
          "[&_ol_ol]:list-[lower-roman]",

          "[&_.tiptap>ul[data-type='taskList']]:pl-0",
          "[&_ul[data-type='taskList']_ul]:pl-6",

          "[&_li[data-type='taskItem']>label]:mt-1.5",
          "[&_li[data-type='taskItem']>label>input]:accent-primary [&_li[data-type='taskItem']>label>input]:size-4 [&_li[data-type='taskItem']>label>input]:cursor-pointer",
          "[&_li[data-type='taskItem']>div]:flex-1 [&_li[data-type='taskItem']>div>p]:m-0",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange({ ...content, text: editor.getHTML() });
    },
    onTransaction: ({ editor }) => {
      window.dispatchEvent(
        new CustomEvent(`format-state-${id}`, {
          detail: {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            code: editor.isActive("code"),
            link: editor.isActive("link"),
            bulletList: editor.isActive("bulletList"),
            orderedList: editor.isActive("orderedList"),
            taskList: editor.isActive("taskList"),
            isSelectionEmpty: editor.state.selection.empty,
          },
        }),
      );
    },
  });

  const handleApplyLink = () => {
    if (linkUrl.trim() === "") {
      editor?.chain().focus().unsetLink().run();
    } else {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
    }
    setShowLinkMenu(false);
    setLinkUrl("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLinkMenu(false);
      }
    };

    if (showLinkMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLinkMenu]);

  useEffect(() => {
    if (!editor) return;

    const handleFormatEvent = (e: Event) => {
      const customEvent = e as CustomEvent<FormatEventDetail>;
      const { type } = customEvent.detail;

      if (type === "bold") editor.chain().focus().toggleBold().run();
      if (type === "italic") editor.chain().focus().toggleItalic().run();
      if (type === "code") editor.chain().focus().toggleCode().run();

      if (type === "bulletList")
        editor.chain().focus().toggleBulletList().run();
      if (type === "orderedList")
        editor.chain().focus().toggleOrderedList().run();
      if (type === "taskList") editor.chain().focus().toggleTaskList().run();

      if (type === "link") {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
        } else {
          setLinkUrl(editor.getAttributes("link").href || "");
          setShowLinkMenu(true);
        }
      }
    };

    window.addEventListener(`format-${id}`, handleFormatEvent);
    return () => window.removeEventListener(`format-${id}`, handleFormatEvent);
  }, [id, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "h-[120px] w-full animate-pulse rounded-xl border-2 border-zinc-800 bg-zinc-900/10",
        )}
      />
    );
  }

  return (
    <div className="group flex w-full flex-col gap-2">
      <div className="relative">
        <div className="group relative w-full">
          {showLinkMenu && (
            <div
              ref={menuRef}
              className="border-primary/50 animate-in fade-in zoom-in-95 absolute -top-16 right-0 z-50 flex items-center gap-1 rounded-xl border-2 bg-zinc-950 p-1.5 shadow-2xl shadow-black/80 duration-200"
            >
              <input
                autoFocus
                type="text"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-64 bg-transparent px-2 py-2 text-xs text-zinc-200 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleApplyLink()}
              />
              <button
                onClick={handleApplyLink}
                className="text-primary rounded-lg p-1.5 transition-colors hover:bg-zinc-800/80"
              >
                <Check className="size-3.5" />
              </button>
              <button
                onClick={() => setShowLinkMenu(false)}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800/80 hover:text-red-400"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          <EditorContent editor={editor} />
        </div>
        <div
          className={cn(
            "bg-primary/40 group-within:w-full absolute -bottom-px left-0 h-0.5 w-0 transition-all duration-500",
          )}
        />
      </div>
    </div>
  );
}
