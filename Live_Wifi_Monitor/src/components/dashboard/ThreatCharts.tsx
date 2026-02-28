import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ThreatChartsProps {
  historyData: { time: string; high: number; medium: number; low: number }[];
  distributionData: { name: string; value: number }[];
}

const PIE_COLORS = [
  "hsl(160, 100%, 50%)",
  "hsl(190, 100%, 45%)",
  "hsl(280, 80%, 60%)",
  "hsl(40, 100%, 55%)",
  "hsl(0, 85%, 55%)",
  "hsl(120, 60%, 45%)",
  "hsl(220, 70%, 55%)",
  "hsl(30, 90%, 50%)",
];

export function ThreatCharts({ historyData, distributionData }: ThreatChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Timeline */}
      <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Threat Timeline (12h)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={historyData}>
            <defs>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 85%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(40, 100%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(40, 100%, 55%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(160, 60%, 85%)",
              }}
            />
            <Area type="monotone" dataKey="high" stroke="hsl(0, 85%, 55%)" fill="url(#gradHigh)" strokeWidth={2} />
            <Area type="monotone" dataKey="medium" stroke="hsl(40, 100%, 55%)" fill="url(#gradMed)" strokeWidth={2} />
            <Area type="monotone" dataKey="low" stroke="hsl(160, 100%, 50%)" fill="url(#gradLow)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Threat Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {distributionData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(160, 60%, 85%)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {distributionData.slice(0, 6).map((d, i) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
              <span className="truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
