import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JejakKarier — Smart Job Tracker",
  description:
    "Kelola pipeline lamaran kerja dengan cerdas. Kanban board, ghosting alerts, dan analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "dark",
        geistSans.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <TooltipProvider delayDuration={200}>
            {children}
          </TooltipProvider>
        </QueryProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "bg-card border-border text-card-foreground",
          }}
        />
      </body>
    </html>
  );
}
