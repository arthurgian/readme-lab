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

function HeaderActions() {
  const { state } = useReadme();

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

  return (
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
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-background text-foreground selection:bg-primary/30 flex h-screen flex-col font-sans">
      <header className="bg-card/30 flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="border-primary/20 bg-primary/10 rounded-lg border p-1.5 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <FileCode className="text-primary size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] leading-none font-black tracking-[0.2em] text-white uppercase">
              README Lab
            </span>
          </div>
        </div>

        <HeaderActions />
      </header>

      <main className="bg-background flex flex-1 flex-col overflow-hidden lg:flex-row">
        <section className="custom-scrollbar bg-background flex-1 overflow-y-auto border-r border-zinc-800 lg:flex-[1.4]">
          <div className="flex min-h-full px-6 pt-8 pb-6 sm:px-12 sm:pt-8 sm:pb-12">
            <div className="relative flex w-full items-start gap-4 sm:gap-12">
              <aside className="sticky top-8 hidden h-[calc(100vh-8rem)] w-40 shrink-0 flex-col items-center xl:flex">
                <div className="flex w-full shrink-0 justify-center border-b border-zinc-800/80 pb-6">
                  <Toolbar />
                </div>

                <div className="custom-scrollbar w-full flex-1 overflow-y-auto pt-6 pb-6">
                  <Outline />
                </div>
              </aside>

              <div className="max-w-3xl min-w-0 flex-1 pb-32">
                <div className="w-full">
                  <BlockList />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="custom-scrollbar flex-1 overflow-y-auto bg-black px-6 pt-8 pb-6 shadow-[inset_20px_0_40px_rgba(0,0,0,0.5)] sm:px-12 sm:pt-8 sm:pb-12">
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

      <div className="fixed right-6 bottom-6 z-50 xl:hidden">
        <Toolbar isMobile />
      </div>
    </div>
  );
}
