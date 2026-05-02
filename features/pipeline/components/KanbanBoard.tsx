"use client"

import { useState, useCallback } from "react"
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd"

import {
  useApplications,
  useUpdateApplication,
} from "@/features/pipeline/hooks/useApplications"
import { KanbanColumn } from "@/features/pipeline/components/KanbanColumn"
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/constants"
import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

export function KanbanBoard(): React.JSX.Element {
  const { data: applications = [], isLoading } = useApplications()
  const updateApplication = useUpdateApplication()
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  // Group applications by status
  const grouped = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      acc[status] = applications.filter((app) => app.status === status)
      return acc
    },
    {} as Record<ApplicationStatus, Application[]>
  )

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination } = result

      if (!destination) return

      const newStatus = destination.droppableId as ApplicationStatus

      // Find the dragged application
      const draggedApp = applications.find((app) => app.id === draggableId)
      if (!draggedApp) return

      // Only update if status changed
      if (draggedApp.status !== newStatus) {
        updateApplication.mutate({
          id: draggableId,
          status: newStatus,
          position: destination.index,
        })
      }
    },
    [applications, updateApplication]
  )

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="text-xs text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-1 gap-3 overflow-x-auto p-4">
        {APPLICATION_STATUSES.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided, snapshot) => (
              <KanbanColumn
                status={status}
                applications={grouped[status]}
                provided={provided}
                isDraggingOver={snapshot.isDraggingOver}
                selectedAppId={selectedAppId}
                onSelectApp={setSelectedAppId}
              />
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}
