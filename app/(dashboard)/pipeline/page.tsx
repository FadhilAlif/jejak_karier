"use client"

import { useState } from "react"

import { Header } from "@/components/layout/Header"
import { KanbanBoard } from "@/features/pipeline/components/KanbanBoard"
import { ListView } from "@/features/pipeline/components/ListView"
import { AddJobDialog } from "@/features/pipeline/components/AddJobDialog"
import { JobDetailModal } from "@/features/pipeline/components/JobDetailModal"
import { useUIStore } from "@/stores/uiStore"

export default function PipelinePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailAppId, setDetailAppId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const viewMode = useUIStore((s) => s.viewMode)

  function handleSelectApp(id: string): void {
    setDetailAppId(id)
    setDetailOpen(true)
  }

  function handleDetailOpenChange(open: boolean): void {
    setDetailOpen(open)
    if (!open) {
      // Delay clearing ID so the close animation completes
      setTimeout(() => setDetailAppId(null), 300)
    }
  }

  return (
    <>
      <Header
        title="Pipeline Lamaran"
        showViewToggle
        onAddNew={() => setAddDialogOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {viewMode === "kanban" ? (
          <KanbanBoard onSelectApp={handleSelectApp} />
        ) : (
          <ListView onSelectApp={handleSelectApp} />
        )}
      </div>

      <AddJobDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      <JobDetailModal
        applicationId={detailAppId}
        open={detailOpen}
        onOpenChange={handleDetailOpenChange}
      />
    </>
  )
}
