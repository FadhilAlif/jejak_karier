"use client"

import { useRef } from "react"
import { Draggable, type DroppableProvided } from "@hello-pangea/dnd"

import { cn } from "@/lib/utils"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  type ApplicationStatus,
} from "@/lib/constants"
import { JobCard } from "@/features/pipeline/components/JobCard"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

interface KanbanColumnProps {
  status: ApplicationStatus
  applications: Application[]
  provided: DroppableProvided
  isDraggingOver: boolean
  onSelectApp: (id: string) => void
}

export function KanbanColumn({
  status,
  applications,
  provided,
  isDraggingOver,
  onSelectApp,
}: KanbanColumnProps): React.JSX.Element {
  // Track mouse position to differentiate click vs drag
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null)

  return (
    <div
      className={cn(
        "flex h-full w-[280px] min-w-[280px] flex-col rounded-lg",
        isDraggingOver && "ring-1 ring-primary/20"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 px-2 py-2.5">
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
            STATUS_COLORS[status]
          )}
        >
          {STATUS_LABELS[status]}
        </div>
        <span className="text-[11px] text-muted-foreground">
          {applications.length}
        </span>
      </div>

      {/* Cards Area */}
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={cn(
          "flex flex-1 flex-col gap-1.5 overflow-y-auto rounded-md p-1 transition-colors duration-150",
          isDraggingOver && "bg-accent/30"
        )}
      >
        {applications.map((app, index) => (
          <Draggable key={app.id} draggableId={app.id} index={index}>
            {(draggableProvided, draggableSnapshot) => (
              <div
                ref={draggableProvided.innerRef}
                {...draggableProvided.draggableProps}
                {...draggableProvided.dragHandleProps}
                onPointerDown={(e) => {
                  mouseDownPos.current = { x: e.clientX, y: e.clientY }
                }}
                onClick={(e) => {
                  // Only treat as click if mouse didn't move much (not a drag)
                  if (mouseDownPos.current) {
                    const dx = Math.abs(e.clientX - mouseDownPos.current.x)
                    const dy = Math.abs(e.clientY - mouseDownPos.current.y)
                    if (dx < 5 && dy < 5) {
                      onSelectApp(app.id)
                    }
                  }
                  mouseDownPos.current = null
                }}
              >
                <JobCard
                  application={app}
                  isDragging={draggableSnapshot.isDragging}
                />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}

        {/* Empty state */}
        {applications.length === 0 && !isDraggingOver && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-[11px] text-muted-foreground/50">
              Tarik kartu ke sini
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
