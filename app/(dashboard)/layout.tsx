"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { CommandPalette } from "@/components/layout/CommandPalette"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <CommandPalette />
    </div>
  )
}
