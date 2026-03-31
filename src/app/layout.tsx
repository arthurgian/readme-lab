import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google"; // Trocamos Geist_Mono por JetBrains
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ReadmeProvider } from "@/store/ReadmeContext";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "README Lab | Gerador de Markdown",
  description: "Crie READMEs de forma interativa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} h-full font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ReadmeProvider>{children}</ReadmeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
