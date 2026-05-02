"use client"

import { Buildings, Warning } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  JOB_TYPE_LABELS,
  type ApplicationStatus,
  type JobType,
} from "@/lib/constants"
import { isGhosting, getGhostingDays } from "@/lib/ghosting"
import { Badge } from "@/components/ui/badge"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

interface RecentActivityProps {
  applications: Application[]
}

export function RecentActivity({
  applications,
}: RecentActivityProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-[13px] font-semibold text-foreground mb-1">
        Aktivitas Terbaru
      </h3>
      <p className="text-[11px] text-muted-foreground mb-4">
        5 lamaran terakhir yang diperbarui
      </p>

      {applications.length === 0 ? (
        <p className="py-6 text-center text-[11px] text-muted-foreground/50">
          Belum ada aktivitas
        </p>
      ) : (
        <div className="space-y-2">
          {applications.map((app) => {
            const ghosting = isGhosting(app.last_activity_date, app.status)
            const ghostingDays = getGhostingDays(app.last_activity_date)

            return (
              <div
                key={app.id}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-border px-3 py-2.5 transition-snappy hover:bg-accent/20",
                  ghosting && "border-l-2 border-l-red-500/60"
                )}
              >
                <Buildings
                  weight="duotone"
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate">
                    {app.company_name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {app.role}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 px-1.5 text-[9px] font-medium border",
                      STATUS_COLORS[app.status as ApplicationStatus]
                    )}
                  >
                    {STATUS_LABELS[app.status as ApplicationStatus] ?? app.status}
                  </Badge>
                  {ghosting && (
                    <Warning
                      weight="fill"
                      className="h-3.5 w-3.5 text-red-400 animate-pulse"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
