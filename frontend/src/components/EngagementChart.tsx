import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface EngagementChartProps {
  data: Array<{ week: string; active: number; completed: number }>;
}

export function EngagementChart({ data }: EngagementChartProps) {
  if (!data.length) {
    return <p className="empty-state">Nuk ka të dhëna analitike ende.</p>;
  }

  return (
    <div className="chart-card">
      <h3>Ecuria javore e studentëve</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 24, right: 32, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" allowDecimals={false} />
          <Tooltip contentStyle={{ borderRadius: 16, borderColor: "#e2e8f0" }} />
          <Legend />
          <Area type="monotone" dataKey="active" stroke="#6366f1" fill="url(#colorActive)" />
          <Area type="monotone" dataKey="completed" stroke="#22c55e" fill="url(#colorCompleted)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
