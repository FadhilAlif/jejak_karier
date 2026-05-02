"use client"

import { useState, useEffect, useCallback } from "react"

import { Header } from "@/components/layout/Header"
import { KanbanBoard } from "@/features/pipeline/components/KanbanBoard"
import { AddJobDialog } from "@/features/pipeline/components/AddJobDialog"
import { useUIStore } from "@/stores/uiStore"

export default function PipelinePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const viewMode = useUIStore((s) => s.viewMode)

  // Keyboard shortcut: Ctrl+K / Cmd+K to open add dialog
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setAddDialogOpen(true)
      }
    },
    []
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <Header
        title="Pipeline Lamaran"
        showViewToggle
        onAddNew={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {viewMode === "kanban" ? (
          <KanbanBoard />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Tampilan daftar — segera hadir
          </div>
        )}
      </div>

      <AddJobDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />
    </>
  )
}
