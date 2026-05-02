"use client"

import {
  MapPin,
  Buildings,
  ArrowSquareOut,
  Warning,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { JOB_TYPE_LABELS, type JobType } from "@/lib/constants"
import { isGhosting, getGhostingDays } from "@/lib/ghosting"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

interface JobCardProps {
  application: Application
  isDragging: boolean
  isSelected: boolean
  onSelect: () => void
}

export function JobCard({
  application,
  isDragging,
  isSelected,
  onSelect,
}: JobCardProps): React.JSX.Element {
  const ghosting = isGhosting(application.last_activity_date, application.status)
  const ghostingDays = getGhostingDays(application.last_activity_date)

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full cursor-grab rounded-md border border-border bg-card p-3 text-left transition-snappy",
        "hover:border-border/80 hover:bg-accent/30",
        isDragging && "rotate-1 scale-[1.02] shadow-lg shadow-black/20 border-primary/30",
        isSelected && "ring-1 ring-primary/40 border-primary/30",
        ghosting && "border-l-2 border-l-red-500/60"
      )}
    >
      {/* Company */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Buildings weight="duotone" className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="text-[12px] font-medium text-foreground leading-tight">
            {application.company_name}
          </span>
        </div>

        {/* Ghosting warning */}
        {ghosting && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Warning
                weight="fill"
                className="h-3.5 w-3.5 shrink-0 text-red-400 animate-pulse"
              />
            </TooltipTrigger>
            <TooltipContent className="text-xs">
              Tidak ada aktivitas selama {ghostingDays} hari
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Role */}
      <p className="mt-1 text-[11px] text-muted-foreground leading-tight">
        {application.role}
      </p>

      {/* Meta Row */}
      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
        {/* Job Type Badge */}
        {application.job_type && (
          <Badge
            variant="secondary"
            className="h-4 px-1.5 text-[9px] font-medium"
          >
            {JOB_TYPE_LABELS[application.job_type as JobType] ?? application.job_type}
          </Badge>
        )}

        {/* Location */}
        {application.location && (
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5" />
            <span>{application.location}</span>
          </div>
        )}

        {/* URL indicator */}
        {application.job_url && (
          <ArrowSquareOut className="h-2.5 w-2.5 text-muted-foreground/50" />
        )}
      </div>

      {/* Salary */}
      {application.salary_range && (
        <p className="mt-1.5 text-[10px] font-medium text-emerald-400/80">
          {application.salary_range}
        </p>
      )}
    </button>
  )
}
