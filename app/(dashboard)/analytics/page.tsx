"use client"

import { Header } from "@/components/layout/Header"
import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { StatsCards } from "@/features/analytics/components/StatsCards"
import { ConversionFunnel } from "@/features/analytics/components/ConversionFunnel"
import { WeeklyActivity } from "@/features/analytics/components/WeeklyActivity"
import { RecentActivity } from "@/features/analytics/components/RecentActivity"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <>
        <Header title="Analitik" />
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            <p className="text-xs text-muted-foreground">Memuat analitik...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Analitik" />
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-5">
          {/* Stats Cards Row */}
          <StatsCards
            totalApplications={analytics.totalApplications}
            ghostingCount={analytics.ghostingCount}
            overallConversion={analytics.conversionRates.overallConversion}
            appliedToInterview={analytics.conversionRates.appliedToInterview}
          />

          {/* Charts Row */}
          <div className="grid gap-5 lg:grid-cols-2">
            <ConversionFunnel
              statusCounts={analytics.statusCounts}
              total={analytics.totalApplications}
            />
            <WeeklyActivity data={analytics.weeklyActivity} />
          </div>

          {/* Recent Activity */}
          <RecentActivity applications={analytics.recentActivity} />
        </div>
      </ScrollArea>
    </>
  )
}
