"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useReadme } from "@/store/ReadmeContext";
import { generateMarkdown } from "@/lib/generate-markdown";

export function MarkdownRenderer() {
  const { state } = useReadme();
  const markdown = generateMarkdown(state.blocks);

  return (
    <div
      className={
        "prose prose-zinc dark:prose-invert max-w-none text-left font-sans " +
        "[&_pre]:border-border [&_td]:border-border [&_th]:border-border " +
        "[&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline " +
        "[&_code]:rounded [&_code]:bg-zinc-800/50 [&_code]:px-1.5 [&_code]:py-0.5 " +
        "[&_code]:font-mono [&_code]:text-[13px] [&_code]:text-zinc-200 " +
        "[&_code]:before:content-none [&_code]:after:content-none " +
        "[&_h1]:mt-0 [&_h1]:border-b [&_h1]:pb-2 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight " +
        "[&_h2]:border-b [&_h2]:pb-1 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight " +
        "[&_h3]:text-xl [&_h3]:font-semibold [&_img]:m-0 [&_img]:inline-block [&_img]:max-w-full " +
        "[&_p]:text-left [&_p]:leading-relaxed [&_p]:text-zinc-400 [&_pre]:border [&_pre]:bg-zinc-900 " +
        "[&_pre]:p-4 [&_table]:w-full [&_table]:border-collapse [&_table]:font-mono [&_table]:text-[13px] " +
        "[&_td]:border [&_td]:p-2 [&_th]:border [&_th]:bg-zinc-900 [&_th]:p-2 " +
        "[&_ol_ol]:list-[lower-roman] [&_ul_ul]:list-[circle] " +
        "[&_ul.contains-task-list]:list-none [&_ul.contains-task-list]:pl-0 " +
        "[&_li.task-list-item]:relative [&_li.task-list-item]:pl-6 " +
        "[&_li.task-list-item_ul]:mt-1 [&_li.task-list-item_ul]:pl-4 " +
        "[&_li.task-list-item>input]:accent-primary [&_li.task-list-item>input]:absolute [&_li.task-list-item>input]:top-1.5 [&_li.task-list-item>input]:left-0 [&_li.task-list-item>input]:m-0 " +
        "[&_li.task-list-item>p]:m-0"
      }
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          input: ({ node, checked, ...props }) => {
            if (props.type === "checkbox") {
              return (
                <input
                  {...props}
                  type="checkbox"
                  checked={checked || false}
                  readOnly
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
