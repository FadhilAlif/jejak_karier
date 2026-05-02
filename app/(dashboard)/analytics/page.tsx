import { Header } from "@/components/layout/Header"

export default function AnalyticsPage() {
  return (
    <>
      <Header title="Analitik" />
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Dashboard analitik — segera hadir
          </p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            Funnel konversi, aktivitas mingguan, dan statistik ghosting
          </p>
        </div>
      </div>
    </>
  )
}
