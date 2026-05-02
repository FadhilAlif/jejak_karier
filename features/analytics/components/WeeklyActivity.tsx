"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface WeeklyData {
  week: string
  count: number
}

interface WeeklyActivityProps {
  data: WeeklyData[]
}

export function WeeklyActivity({
  data,
}: WeeklyActivityProps): React.JSX.Element {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-[13px] font-semibold text-foreground mb-1">
        Aktivitas Mingguan
      </h3>
      <p className="text-[11px] text-muted-foreground mb-5">
        Lamaran yang ditambahkan per minggu (8 minggu terakhir)
      </p>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={24} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#fafafa",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}
              formatter={(value: unknown) => [`${String(value)} lamaran`, "Jumlah"]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.count > 0
                      ? `rgba(99, 102, 241, ${0.3 + (entry.count / maxCount) * 0.7})`
                      : "rgba(255,255,255,0.05)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
