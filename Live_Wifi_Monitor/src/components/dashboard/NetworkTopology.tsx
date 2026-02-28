import { useEffect, useRef, useState, useMemo } from "react";
import { Device } from "@/lib/types";
import { Wifi, Router, Monitor, Smartphone, Tablet, Tv, Speaker, Gamepad2, Camera, ThermometerSun } from "lucide-react";

interface NetworkTopologyProps {
  devices: Device[];
}

interface NodePosition {
  x: number;
  y: number;
  device: Device;
}

const DEVICE_ICONS: Record<string, React.ElementType> = {
  "iPhone": Smartphone,
  "Galaxy": Smartphone,
  "Pixel": Smartphone,
  "OnePlus": Smartphone,
  "MacBook": Monitor,
  "Windows": Monitor,
  "Surface": Monitor,
  "Chromebook": Monitor,
  "iPad": Tablet,
  "Echo": Speaker,
  "Ring": Camera,
  "Nest": ThermometerSun,
  "SmartTV": Tv,
  "PS5": Gamepad2,
  "Unknown": Wifi,
};

function getIcon(name: string) {
  for (const [key, Icon] of Object.entries(DEVICE_ICONS)) {
    if (name.includes(key)) return Icon;
  }
  return Monitor;
}

const statusColors = {
  safe: { fill: "hsl(160, 100%, 50%)", glow: "hsl(160, 100%, 50%)" },
  suspicious: { fill: "hsl(40, 100%, 55%)", glow: "hsl(40, 100%, 55%)" },
  compromised: { fill: "hsl(0, 85%, 55%)", glow: "hsl(0, 85%, 55%)" },
};

export function NetworkTopology({ devices }: NetworkTopologyProps) {
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const nodes: NodePosition[] = useMemo(() => {
    const cx = 300, cy = 200;
    const radius = 140;
    return devices.map((device, i) => {
      const angle = (i / devices.length) * Math.PI * 2 - Math.PI / 2;
      const jitter = ((i * 37) % 7 - 3) * 5;
      return {
        x: cx + Math.cos(angle) * (radius + jitter),
        y: cy + Math.sin(angle) * (radius + jitter),
        device,
      };
    });
  }, [devices]);

  const routerX = 300, routerY = 200;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <Router className="h-4 w-4 text-primary" />
          Network Topology
        </h3>
        <div className="flex items-center gap-3 text-[10px]">
          {(["safe", "suspicious", "compromised"] as const).map(s => (
            <div key={s} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[s].fill }} />
              <span className="text-muted-foreground capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-hidden" style={{ minHeight: 400 }}>
        <svg viewBox="0 0 600 400" className="w-full h-full" style={{ minHeight: 400 }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(160, 100%, 50%)" strokeOpacity="0.04" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="routerGlow">
              <stop offset="0%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(160, 100%, 50%)" stopOpacity="0" />
            </radialGradient>
            {/* Threat hotspot gradients */}
            {nodes.filter(n => n.device.status === "compromised").map((n, i) => (
              <radialGradient key={`hotspot-${i}`} id={`hotspot-${n.device.id}`}>
                <stop offset="0%" stopColor="hsl(0, 85%, 55%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(0, 85%, 55%)" stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>

          <rect width="600" height="400" fill="url(#grid)" />

          {/* Router glow */}
          <circle cx={routerX} cy={routerY} r="80" fill="url(#routerGlow)" />

          {/* Scanning ring */}
          <circle
            cx={routerX}
            cy={routerY}
            r={60 + (pulsePhase % 60)}
            fill="none"
            stroke="hsl(160, 100%, 50%)"
            strokeOpacity={Math.max(0, 0.15 - (pulsePhase % 60) / 400)}
            strokeWidth="1"
          />

          {/* Connections */}
          {nodes.map(node => {
            const colors = statusColors[node.device.status];
            const isHovered = hoveredDevice === node.device.id;
            return (
              <line
                key={`line-${node.device.id}`}
                x1={routerX}
                y1={routerY}
                x2={node.x}
                y2={node.y}
                stroke={colors.fill}
                strokeOpacity={isHovered ? 0.6 : 0.15}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray={node.device.status === "compromised" ? "4 4" : "none"}
              />
            );
          })}

          {/* Threat hotspots */}
          {nodes.filter(n => n.device.status === "compromised").map(node => (
            <circle
              key={`hotspot-${node.device.id}`}
              cx={node.x}
              cy={node.y}
              r="35"
              fill={`url(#hotspot-${node.device.id})`}
            >
              <animate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite" />
            </circle>
          ))}

          {/* Router node */}
          <g>
            <circle cx={routerX} cy={routerY} r="22" fill="hsl(220, 18%, 10%)" stroke="hsl(160, 100%, 50%)" strokeWidth="2" />
            <foreignObject x={routerX - 10} y={routerY - 10} width="20" height="20">
              <div className="flex items-center justify-center w-full h-full">
                <Router className="h-4 w-4 text-primary" />
              </div>
            </foreignObject>
            <text x={routerX} y={routerY + 36} textAnchor="middle" fill="hsl(160, 100%, 50%)" fontSize="9" fontFamily="JetBrains Mono">
              ROUTER
            </text>
          </g>

          {/* Device nodes */}
          {nodes.map(node => {
            const colors = statusColors[node.device.status];
            const isHovered = hoveredDevice === node.device.id;
            const Icon = getIcon(node.device.name);
            const signalPct = Math.max(0, Math.min(100, (node.device.signalStrength + 90) * (100 / 60)));

            return (
              <g
                key={node.device.id}
                onMouseEnter={() => setHoveredDevice(node.device.id)}
                onMouseLeave={() => setHoveredDevice(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring for suspicious/compromised */}
                {node.device.status !== "safe" && (
                  <circle cx={node.x} cy={node.y} r="18" fill="none" stroke={colors.fill} strokeOpacity="0.3" strokeWidth="1">
                    <animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? 16 : 14}
                  fill="hsl(220, 18%, 10%)"
                  stroke={colors.fill}
                  strokeWidth={isHovered ? 2 : 1.5}
                  style={{ transition: "r 0.2s, stroke-width 0.2s" }}
                />

                {/* Icon */}
                <foreignObject x={node.x - 8} y={node.y - 8} width="16" height="16">
                  <div className="flex items-center justify-center w-full h-full" style={{ color: colors.fill }}>
                    <Icon style={{ width: 12, height: 12 }} />
                  </div>
                </foreignObject>

                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + 24}
                  textAnchor="middle"
                  fill={colors.fill}
                  fontSize="7"
                  fontFamily="JetBrains Mono"
                  opacity={isHovered ? 1 : 0.7}
                >
                  {node.device.name}
                </text>

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={node.x - 65}
                      y={node.y - 62}
                      width="130"
                      height="42"
                      rx="4"
                      fill="hsl(220, 18%, 10%)"
                      stroke={colors.fill}
                      strokeWidth="1"
                      strokeOpacity="0.5"
                    />
                    <text x={node.x - 58} y={node.y - 46} fill="hsl(160, 60%, 85%)" fontSize="7" fontFamily="JetBrains Mono">
                      {node.device.ipAddress} · {node.device.signalStrength}dBm
                    </text>
                    <text x={node.x - 58} y={node.y - 36} fill="hsl(220, 10%, 55%)" fontSize="7" fontFamily="JetBrains Mono">
                      MAC: {node.device.macAddress}
                    </text>
                    <text x={node.x - 58} y={node.y - 26} fontSize="7" fontFamily="JetBrains Mono" fill={colors.fill}>
                      Status: {node.device.status.toUpperCase()}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
