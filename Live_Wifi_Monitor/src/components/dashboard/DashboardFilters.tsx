import { Search, Filter, Download, Play, Pause } from "lucide-react";
import { Severity, ThreatType } from "@/lib/types";

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterSeverity: Severity | "all";
  setFilterSeverity: (s: Severity | "all") => void;
  filterType: ThreatType | "all";
  setFilterType: (t: ThreatType | "all") => void;
  isScanning: boolean;
  toggleScanning: () => void;
  exportLogs: () => void;
}

const severities: (Severity | "all")[] = ["all", "critical", "high", "medium", "low"];
const threatTypes: (ThreatType | "all")[] = [
  "all", "Rogue AP", "MAC Spoofing", "Evil Twin", "Deauth Attack",
  "MITM Attack", "Packet Injection", "Unauthorized Access", "Signal Jamming"
];

export function DashboardFilters({
  searchQuery, setSearchQuery,
  filterSeverity, setFilterSeverity,
  filterType, setFilterType,
  isScanning, toggleScanning, exportLogs,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search device, MAC, SSID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
        />
      </div>

      {/* Severity */}
      <select
        value={filterSeverity}
        onChange={e => setFilterSeverity(e.target.value as Severity | "all")}
        className="text-xs bg-muted border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        {severities.map(s => (
          <option key={s} value={s}>{s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>

      {/* Threat Type */}
      <select
        value={filterType}
        onChange={e => setFilterType(e.target.value as ThreatType | "all")}
        className="text-xs bg-muted border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 hidden sm:block"
      >
        {threatTypes.map(t => (
          <option key={t} value={t}>{t === "all" ? "All Types" : t}</option>
        ))}
      </select>

      {/* Actions */}
      <button
        onClick={toggleScanning}
        className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border font-medium transition-colors ${
          isScanning
            ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
            : "bg-muted border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {isScanning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {isScanning ? "Scanning" : "Paused"}
      </button>

      <button
        onClick={exportLogs}
        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-md border border-border bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Download className="h-3 w-3" />
        Export
      </button>
    </div>
  );
}
