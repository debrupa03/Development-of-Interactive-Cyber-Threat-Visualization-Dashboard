import { Shield, AlertTriangle, Wifi, Monitor, Radio } from "lucide-react";

interface StatsCardsProps {
  totalThreats: number;
  criticalCount: number;
  highCount: number;
  activeDevices: number;
  compromisedDevices: number;
  isScanning: boolean;
}

export function StatsCards({ totalThreats, criticalCount, highCount, activeDevices, compromisedDevices, isScanning }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Threats",
      value: totalThreats,
      icon: Shield,
      accent: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20",
    },
    {
      label: "Critical",
      value: criticalCount,
      icon: AlertTriangle,
      accent: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
    {
      label: "High Severity",
      value: highCount,
      icon: Radio,
      accent: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
    },
    {
      label: "Active Devices",
      value: activeDevices,
      icon: Monitor,
      accent: "text-secondary",
      bg: "bg-secondary/10",
      border: "border-secondary/20",
    },
    {
      label: "Compromised",
      value: compromisedDevices,
      icon: Wifi,
      accent: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-lg border ${card.border} ${card.bg} p-4 transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-2">
            <card.icon className={`h-4 w-4 ${card.accent}`} />
            {card.label === "Total Threats" && isScanning && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </div>
          <p className={`text-2xl font-bold font-mono ${card.accent}`}>{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
