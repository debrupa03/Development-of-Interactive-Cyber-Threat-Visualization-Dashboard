import { Device } from "@/lib/types";
import { format } from "date-fns";
import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

interface DeviceListProps {
  devices: Device[];
}

const statusConfig = {
  safe: { icon: Wifi, color: "text-primary", bg: "bg-primary/10", label: "Safe" },
  suspicious: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Suspicious" },
  compromised: { icon: WifiOff, color: "text-destructive", bg: "bg-destructive/10", label: "Compromised" },
};

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-card-foreground">Connected Devices</h3>
      </div>
      <div className="divide-y divide-border/50 max-h-[350px] overflow-auto">
        {devices.map(device => {
          const cfg = statusConfig[device.status];
          const Icon = cfg.icon;
          return (
            <div key={device.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
              <div className={`flex-shrink-0 p-2 rounded-md ${cfg.bg}`}>
                <Icon className={`h-4 w-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{device.name}</p>
                <p className="text-[10px] font-mono text-muted-foreground">{device.macAddress} · {device.ipAddress}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                  {cfg.label}
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">{device.signalStrength} dBm</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
