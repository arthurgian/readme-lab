"use client";

import { BlockList } from "@/components/editor/block-list";
import { MarkdownRenderer } from "@/components/preview/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Copy, FileCode, Download } from "lucide-react";
import { useReadme } from "@/store/ReadmeContext";
import { generateMarkdown } from "@/lib/generate-markdown";
import { Toolbar } from "@/components/editor/toolbar";
import { useState, useEffect } from "react";

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
            <span className="text-muted-foreground mt-1 text-[9px] leading-none font-medium">
              v1.0.0 — Beta
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

      <main className="flex flex-1 overflow-hidden">
        <section className="scrollbar-hide bg-background flex-1 overflow-y-auto border-r border-zinc-800">
          <div className="flex min-h-full justify-center p-12">
            <div className="relative flex w-full max-w-3xl items-start gap-12">
              <div className="sticky top-0 z-50 w-[52px] shrink-0">
                <Toolbar />
              </div>

              <div className="min-w-0 flex-1">
                <BlockList />
              </div>
            </div>
          </div>
        </section>

        <section className="scrollbar-hide flex-[1.3] overflow-y-auto bg-black p-12 shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)]">
          <div className="mx-auto max-w-2xl">
            <div className="pointer-events-none mb-8 flex items-center gap-2 opacity-30 grayscale">
              <span className="ml-2 font-mono text-[10px]">Preview</span>
            </div>

            <MarkdownRenderer />
          </div>
        </section>
      </main>
    </div>
  );
}
