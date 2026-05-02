"use client"

import { cn } from "@/lib/utils"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/lib/constants"

interface StatusCount {
  status: ApplicationStatus
  count: number
}

interface ConversionFunnelProps {
  statusCounts: StatusCount[]
  total: number
}

export function ConversionFunnel({
  statusCounts,
  total,
}: ConversionFunnelProps): React.JSX.Element {
  const maxCount = Math.max(...statusCounts.map((s) => s.count), 1)

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-[13px] font-semibold text-foreground mb-1">
        Distribusi Status
      </h3>
      <p className="text-[11px] text-muted-foreground mb-5">
        Sebaran lamaran berdasarkan tahapan pipeline
      </p>

      <div className="space-y-3">
        {statusCounts.map(({ status, count }) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={status} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                      STATUS_COLORS[status]
                    )}
                  >
                    {STATUS_LABELS[status]}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-foreground font-medium">{count}</span>
                  <span className="text-muted-foreground/50">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/30 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500 ease-out",
                    status === "wishlist" && "bg-zinc-500",
                    status === "applied" && "bg-blue-500",
                    status === "assessment" && "bg-amber-500",
                    status === "interview" && "bg-violet-500",
                    status === "offered" && "bg-emerald-500",
                    status === "rejected" && "bg-red-500"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Funnel summary */}
      <div className="mt-5 flex items-center gap-1 text-[10px] text-muted-foreground/50">
        {APPLICATION_STATUSES.filter((s) => s !== "rejected").map((status, idx, arr) => (
          <span key={status} className="flex items-center gap-1">
            <span>{STATUS_LABELS[status]}</span>
            {idx < arr.length - 1 && <span>→</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
