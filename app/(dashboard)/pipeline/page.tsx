"use client"

import { useState, useEffect, useCallback } from "react"

import { Header } from "@/components/layout/Header"
import { KanbanBoard } from "@/features/pipeline/components/KanbanBoard"
import { ListView } from "@/features/pipeline/components/ListView"
import { AddJobDialog } from "@/features/pipeline/components/AddJobDialog"
import { JobDetailModal } from "@/features/pipeline/components/JobDetailModal"
import { useUIStore } from "@/stores/uiStore"

const HIGHLIGHT_DURATION = 3000

export default function PipelinePage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [detailAppId, setDetailAppId] = useState<string | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const viewMode = useUIStore((s) => s.viewMode)
  const highlightedAppId = useUIStore((s) => s.highlightedAppId)
  const setHighlightedAppId = useUIStore((s) => s.setHighlightedAppId)

  const clearHighlight = useCallback(() => {
    setHighlightedAppId(null)
  }, [setHighlightedAppId])

  useEffect(() => {
    if (!highlightedAppId) return

    if (highlightedAppId === "__add_new__") {
      setHighlightedAppId(null)
      setAddDialogOpen(true)
      return
    }

    setDetailAppId(highlightedAppId)
    setDetailOpen(true)

    const timer = setTimeout(() => {
      setHighlightedAppId(null)
    }, HIGHLIGHT_DURATION)

    return () => clearTimeout(timer)
  }, [highlightedAppId, setHighlightedAppId, clearHighlight])

  // Scroll to highlighted card
  useEffect(() => {
    if (!highlightedAppId || highlightedAppId === "__add_new__") return

    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-app-id="${highlightedAppId}"]`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [highlightedAppId])

  function handleSelectApp(id: string): void {
    setDetailAppId(id)
    setDetailOpen(true)
  }

  function handleDetailOpenChange(open: boolean): void {
    setDetailOpen(open)
    if (!open) {
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