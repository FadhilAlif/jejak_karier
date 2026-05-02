"use client"

import { useMemo } from "react"

import { useApplications } from "@/features/pipeline/hooks/useApplications"
import { isGhosting } from "@/lib/ghosting"
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/constants"

import type { Tables } from "@/types/supabase"

type Application = Tables<"applications">

interface StatusCount {
  status: ApplicationStatus
  count: number
}

interface WeeklyData {
  week: string
  count: number
}

interface AnalyticsData {
  totalApplications: number
  statusCounts: StatusCount[]
  ghostingCount: number
  weeklyActivity: WeeklyData[]
  conversionRates: {
    appliedToInterview: number
    interviewToOffered: number
    overallConversion: number
  }
  recentActivity: Application[]
}

export function useAnalytics(): {
  data: AnalyticsData
  isLoading: boolean
} {
  const { data: applications = [], isLoading } = useApplications()

  const analytics = useMemo<AnalyticsData>(() => {
    // Status distribution
    const statusCounts: StatusCount[] = APPLICATION_STATUSES.map((status) => ({
      status,
      count: applications.filter((a) => a.status === status).length,
    }))

    // Ghosting count
    const ghostingCount = applications.filter((a) =>
      isGhosting(a.last_activity_date, a.status)
    ).length

    // Weekly activity (last 8 weeks)
    const now = new Date()
    const weeklyActivity: WeeklyData[] = []
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)

      const count = applications.filter((a) => {
        if (!a.created_at) return false
        const created = new Date(a.created_at)
        return created >= weekStart && created < weekEnd
      }).length

      weeklyActivity.push({
        week: weekStart.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        count,
      })
    }

    // Conversion rates
    const applied = applications.filter((a) =>
      ["applied", "assessment", "interview", "offered"].includes(a.status)
    ).length
    const interviewed = applications.filter((a) =>
      ["interview", "offered"].includes(a.status)
    ).length
    const offered = applications.filter((a) => a.status === "offered").length

    const total = applications.length

    const conversionRates = {
      appliedToInterview: applied > 0 ? (interviewed / applied) * 100 : 0,
      interviewToOffered: interviewed > 0 ? (offered / interviewed) * 100 : 0,
      overallConversion: total > 0 ? (offered / total) * 100 : 0,
    }

    // Recent activity (last 5 updated)
    const recentActivity = [...applications]
      .sort((a, b) => {
        const aDate = a.last_activity_date ?? a.created_at ?? ""
        const bDate = b.last_activity_date ?? b.created_at ?? ""
        return bDate.localeCompare(aDate)
      })
      .slice(0, 5)

    return {
      totalApplications: total,
      statusCounts,
      ghostingCount,
      weeklyActivity,
      conversionRates,
      recentActivity,
    }
  }, [applications])

  return { data: analytics, isLoading }
}
