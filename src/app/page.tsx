"use client";

import { BlockList } from "@/components/editor/block-list";
import { MarkdownRenderer } from "@/components/preview/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Copy, FileCode, Download } from "lucide-react";
import { useReadme } from "@/store/ReadmeContext";
import { generateMarkdown } from "@/lib/generate-markdown";
import { Toolbar } from "@/components/editor/toolbar";
import { useState, useEffect } from "react";
import { Outline } from "@/components/editor/outline";

export default function Home() {
  const { state } = useReadme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    const md = generateMarkdown(state.blocks);
    navigator.clipboard.writeText(md);
  };

  const handleDownload = () => {
    const md = generateMarkdown(state.blocks);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div className="bg-background text-foreground selection:bg-primary/30 flex h-screen flex-col font-sans">
      <header className="bg-card/30 flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 rounded-lg border p-1.5 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <FileCode className="text-primary size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] leading-none font-black tracking-[0.2em] text-white uppercase">
              README Lab
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Copy className="mr-2 size-4" /> Copiar MD
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-zinc-50 text-black shadow-lg hover:bg-zinc-200"
          >
            <Download className="mr-2 size-4" /> Exportar .md
          </Button>
        </div>
      </header>

      <main className="bg-background flex flex-1 flex-col overflow-hidden lg:flex-row">
        <section className="custom-scrollbar bg-background flex-1 overflow-y-auto border-r border-zinc-800 lg:flex-[1.4]">
          <div className="flex min-h-full p-6 sm:p-12">
            <div className="relative flex w-full items-start gap-4 sm:gap-12">
              <aside className="sticky top-4 hidden w-40 shrink-0 xl:block">
                <Outline />
              </aside>

              <div className="max-w-3xl min-w-0 flex-1">
                <div className="sticky top-4 z-50 mb-8 w-full">
                  <Toolbar />
                </div>

                <div className="w-full">
                  <BlockList />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="custom-scrollbar flex-1 overflow-y-auto bg-black p-6 shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)] sm:p-12">
          <div className="mx-auto max-w-[700px]">
            <div className="mb-6 flex items-center gap-2 opacity-20">
              <span className="text-[10px] font-black tracking-widest text-white uppercase">
                Live Preview
              </span>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>
            <MarkdownRenderer />
          </div>
        </section>
      </main>
    </div>
  );
}
