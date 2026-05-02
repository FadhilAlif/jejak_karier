"use client"

import { useState, useMemo } from "react"
import {
  ArrowUp,
  ArrowDown,
  Buildings,
  MapPin,
  ArrowSquareOut,
  Warning,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import {
  useApplications,
  useUpdateApplication,
} from "@/features/pipeline/hooks/useApplications"
import {
  STATUS_LABELS,
  STATUS_COLORS,
  JOB_TYPE_LABELS,
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobType,
} from "@/lib/constants"
import { isGhosting, getGhostingDays } from "@/lib/ghosting"
import { useUIStore } from "@/stores/uiStore"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

type SortField = "company_name" | "role" | "status" | "created_at" | "last_activity_date"
type SortDirection = "asc" | "desc"

interface ListViewProps {
  onSelectApp: (id: string) => void
}

export function ListView({ onSelectApp }: ListViewProps): React.JSX.Element {
  const { data: applications = [], isLoading } = useApplications()
  const updateApplication = useUpdateApplication()
  const highlightedAppId = useUIStore((s) => s.highlightedAppId)
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const sorted = useMemo(() => {
    return [...applications].sort((a, b) => {
      const aVal = a[sortField] ?? ""
      const bVal = b[sortField] ?? ""

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [applications, sortField, sortDirection])

  function handleSort(field: SortField): void {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  function handleStatusChange(id: string, newStatus: string): void {
    updateApplication.mutate({ id, status: newStatus })
  }

  function SortIcon({ field }: { field: SortField }): React.JSX.Element | null {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    )
  }

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

  if (applications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Belum ada lamaran. Klik &quot;+ Lamaran Baru&quot; untuk mulai.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <HeaderCell field="company_name" label="Perusahaan" sortField={sortField} onSort={handleSort}>
                <SortIcon field="company_name" />
              </HeaderCell>
              <HeaderCell field="role" label="Posisi" sortField={sortField} onSort={handleSort}>
                <SortIcon field="role" />
              </HeaderCell>
              <HeaderCell field="status" label="Status" sortField={sortField} onSort={handleSort}>
                <SortIcon field="status" />
              </HeaderCell>
              <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                Tipe
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                Lokasi
              </th>
              <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                Gaji
              </th>
              <HeaderCell field="created_at" label="Ditambahkan" sortField={sortField} onSort={handleSort}>
                <SortIcon field="created_at" />
              </HeaderCell>
              <HeaderCell field="last_activity_date" label="Aktivitas Terakhir" sortField={sortField} onSort={handleSort}>
                <SortIcon field="last_activity_date" />
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {sorted.map((app) => {
              const ghosting = isGhosting(app.last_activity_date, app.status)
              const ghostingDays = getGhostingDays(app.last_activity_date)

              return (
                <tr
                  key={app.id}
                  data-app-id={app.id}
                  onClick={() => onSelectApp(app.id)}
                  className={cn(
                    "group cursor-pointer border-b border-border transition-snappy hover:bg-accent/30",
                    ghosting && "border-l-2 border-l-red-500/60",
                    app.id === highlightedAppId && "bg-primary/10 ring-2 ring-inset ring-primary/40"
                  )}
                >
                  {/* Company */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Buildings weight="duotone" className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-[12px] font-medium text-foreground">
                        {app.company_name}
                      </span>
                      {app.job_url && (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 transition-snappy"
                        >
                          <ArrowSquareOut className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-3 py-2.5">
                    <span className="text-[12px] text-muted-foreground">
                      {app.role}
                    </span>
                  </td>

                  {/* Status — inline editable */}
                  <td className="px-3 py-2.5">
                    <Select
                      value={app.status}
                      onValueChange={(val) => handleStatusChange(app.id, val)}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-6 w-[110px] border px-2 text-[10px] font-medium",
                          STATUS_COLORS[app.status as ApplicationStatus]
                        )}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {APPLICATION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Job Type */}
                  <td className="px-3 py-2.5">
                    {app.job_type && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {JOB_TYPE_LABELS[app.job_type as JobType] ?? app.job_type}
                      </Badge>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-3 py-2.5">
                    {app.location && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{app.location}</span>
                      </div>
                    )}
                  </td>

                  {/* Salary */}
                  <td className="px-3 py-2.5">
                    {app.salary_range && (
                      <span className="text-[11px] font-medium text-emerald-400/80">
                        {app.salary_range}
                      </span>
                    )}
                  </td>

                  {/* Created at */}
                  <td className="px-3 py-2.5">
                    <span className="text-[11px] text-muted-foreground">
                      {app.created_at
                        ? new Date(app.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </span>
                  </td>

                  {/* Last activity */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">
                        {app.last_activity_date
                          ? new Date(app.last_activity_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })
                          : "—"}
                      </span>
                      {ghosting && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Warning
                              weight="fill"
                              className="h-3.5 w-3.5 text-red-400 animate-pulse"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Tidak ada aktivitas selama {ghostingDays} hari
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Sortable header cell ───
function HeaderCell({
  field,
  label,
  sortField,
  onSort,
  children,
}: {
  field: SortField
  label: string
  sortField: SortField
  onSort: (field: SortField) => void
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <th className="px-3 py-2 text-left">
      <button
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-1 text-[11px] font-medium transition-snappy",
          sortField === field
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        {children}
      </button>
    </th>
  )
}
