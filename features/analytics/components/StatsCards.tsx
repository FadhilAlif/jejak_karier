"use client"

import {
  Briefcase,
  Warning,
  TrendUp,
  ChartBar,
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

interface StatsCardsProps {
  totalApplications: number
  ghostingCount: number
  overallConversion: number
  appliedToInterview: number
}

export function StatsCards({
  totalApplications,
  ghostingCount,
  overallConversion,
  appliedToInterview,
}: StatsCardsProps): React.JSX.Element {
  const cards = [
    {
      label: "Total Lamaran",
      value: totalApplications,
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Perlu Follow-up",
      value: ghostingCount,
      icon: Warning,
      color: ghostingCount > 0 ? "text-red-400" : "text-zinc-500",
      bgColor: ghostingCount > 0 ? "bg-red-400/10" : "bg-zinc-400/10",
      suffix: ghostingCount > 0 ? "⚠️" : "",
    },
    {
      label: "Tingkat Konversi",
      value: `${overallConversion.toFixed(0)}%`,
      icon: TrendUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Lolos ke Interview",
      value: `${appliedToInterview.toFixed(0)}%`,
      icon: ChartBar,
      color: "text-violet-400",
      bgColor: "bg-violet-400/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-4 transition-snappy hover:bg-accent/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  card.bgColor
                )}
              >
                <Icon weight="duotone" className={cn("h-4 w-4", card.color)} />
              </div>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {card.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}
