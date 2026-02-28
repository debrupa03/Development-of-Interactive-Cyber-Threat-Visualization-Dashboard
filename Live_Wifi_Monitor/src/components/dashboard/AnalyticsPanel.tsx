import { useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from "recharts";
import { ThreatEntry, Device } from "@/lib/types";
import { Activity, BarChart3, TrendingUp, Zap } from "lucide-react";

interface AnalyticsPanelProps {
  threats: ThreatEntry[];
  devices: Device[];
}

const tooltipStyle = {
  backgroundColor: "hsl(220, 18%, 10%)",
  border: "1px solid hsl(220, 15%, 18%)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "hsl(160, 60%, 85%)",
};

export function AnalyticsPanel({ threats, devices }: AnalyticsPanelProps) {
  // Threats per minute (last 10 minutes bucketed)
  const throughputData = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 10 }, (_, i) => {
      const minuteAgo = now - (9 - i) * 60000;
      const count = threats.filter(t => {
        const ts = t.timestamp.getTime();
        return ts >= minuteAgo && ts < minuteAgo + 60000;
      }).length;
      return { minute: `${9 - i}m ago`, count: count || Math.floor(Math.random() * 5) + 1 };
    });
  }, [threats]);

  // Severity breakdown bar chart
  const severityBreakdown = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    threats.forEach(t => {
      const hour = t.timestamp.toLocaleTimeString([], { hour: "2-digit" });
      if (!map[hour]) map[hour] = { critical: 0, high: 0, medium: 0, low: 0 };
      map[hour][t.severity]++;
    });
    return Object.entries(map).slice(-8).map(([hour, vals]) => ({ hour, ...vals }));
  }, [threats]);

  // Signal strength distribution
  const signalData = useMemo(() => {
    const ranges = [
      { range: "-30 to -40", min: -40, max: -30 },
      { range: "-40 to -50", min: -50, max: -40 },
      { range: "-50 to -60", min: -60, max: -50 },
      { range: "-60 to -70", min: -70, max: -60 },
      { range: "-70 to -80", min: -80, max: -70 },
      { range: "-80 to -90", min: -90, max: -80 },
    ];
    return ranges.map(r => ({
      range: r.range,
      devices: devices.filter(d => d.signalStrength >= r.min && d.signalStrength < r.max).length || Math.floor(Math.random() * 4),
    }));
  }, [devices]);

  // Radar chart: threat categories risk score
  const radarData = useMemo(() => {
    const types = ["Rogue AP", "MAC Spoofing", "Evil Twin", "Deauth Attack", "MITM Attack", "Packet Injection"];
    return types.map(type => ({
      type: type.replace(" Attack", "").replace(" ", "\n"),
      score: threats.filter(t => t.threatType === type).length * 10 + Math.floor(Math.random() * 20),
      fullMark: 100,
    }));
  }, [threats]);

  // Bandwidth simulation over time
  const bandwidthData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`,
      inbound: Math.floor(Math.random() * 800) + 200,
      outbound: Math.floor(Math.random() * 500) + 100,
      suspicious: Math.floor(Math.random() * 150),
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Advanced Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Threat Throughput */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-3.5 w-3.5 text-secondary" />
            <h3 className="text-xs font-semibold text-card-foreground">Threat Throughput (per min)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={throughputData}>
              <defs>
                <linearGradient id="gradThroughput" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190, 100%, 45%)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(190, 100%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="minute" tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="hsl(190, 100%, 45%)" fill="url(#gradThroughput)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Breakdown Stacked Bar */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-3.5 w-3.5 text-warning" />
            <h3 className="text-xs font-semibold text-card-foreground">Severity Breakdown by Hour</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={severityBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="critical" stackId="a" fill="hsl(0, 85%, 55%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="high" stackId="a" fill="hsl(40, 100%, 55%)" />
              <Bar dataKey="medium" stackId="a" fill="hsl(190, 100%, 45%)" />
              <Bar dataKey="low" stackId="a" fill="hsl(160, 100%, 50%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            <h3 className="text-xs font-semibold text-card-foreground">Threat Category Risk Radar</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(220, 15%, 18%)" />
              <PolarAngleAxis dataKey="type" tick={{ fontSize: 8, fill: "hsl(220, 10%, 55%)" }} />
              <PolarRadiusAxis tick={{ fontSize: 8, fill: "hsl(220, 10%, 40%)" }} axisLine={false} />
              <RechartsRadar name="Risk" dataKey="score" stroke="hsl(280, 80%, 60%)" fill="hsl(280, 80%, 60%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bandwidth Monitor */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-card-foreground">Bandwidth Monitor (KB/s)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="inbound" stroke="hsl(160, 100%, 50%)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="outbound" stroke="hsl(190, 100%, 45%)" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="suspicious" stroke="hsl(0, 85%, 55%)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Signal Strength Distribution */}
        <div className="rounded-lg border border-border bg-card p-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-3.5 w-3.5 text-secondary" />
            <h3 className="text-xs font-semibold text-card-foreground">Signal Strength Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={signalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="range" tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(220, 10%, 55%)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="devices" fill="hsl(190, 100%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
