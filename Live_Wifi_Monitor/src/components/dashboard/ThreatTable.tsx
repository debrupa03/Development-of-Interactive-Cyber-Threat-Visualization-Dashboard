import { ThreatEntry } from "@/lib/types";
import { format } from "date-fns";

interface ThreatTableProps {
  threats: ThreatEntry[];
}

const severityStyles: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-secondary/20 text-secondary border-secondary/30",
  low: "bg-primary/20 text-primary border-primary/30",
};

export function ThreatTable({ threats }: ThreatTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Live Threat Feed
        </h3>
      </div>
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr className="text-muted-foreground">
              <th className="text-left p-3 font-medium">Time</th>
              <th className="text-left p-3 font-medium">Device</th>
              <th className="text-left p-3 font-medium hidden md:table-cell">MAC Address</th>
              <th className="text-left p-3 font-medium">Threat</th>
              <th className="text-left p-3 font-medium">Severity</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Signal</th>
              <th className="text-left p-3 font-medium hidden lg:table-cell">Channel</th>
            </tr>
          </thead>
          <tbody>
            {threats.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b border-border/50 transition-colors hover:bg-muted/30 ${i === 0 ? "animate-in fade-in slide-in-from-top-2 duration-300" : ""}`}
              >
                <td className="p-3 font-mono text-muted-foreground">
                  {format(t.timestamp, "HH:mm:ss")}
                </td>
                <td className="p-3 text-card-foreground font-medium">{t.deviceName}</td>
                <td className="p-3 font-mono text-muted-foreground hidden md:table-cell">{t.macAddress}</td>
                <td className="p-3 text-card-foreground">{t.threatType}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${severityStyles[t.severity]}`}>
                    {t.severity}
                  </span>
                </td>
                <td className="p-3 font-mono text-muted-foreground hidden lg:table-cell">{t.signalStrength} dBm</td>
                <td className="p-3 font-mono text-muted-foreground hidden lg:table-cell">CH {t.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
