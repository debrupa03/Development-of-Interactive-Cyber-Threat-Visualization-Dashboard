import { useState, useCallback, useMemo } from "react";
import { Device } from "@/lib/types";
import { Search, ShieldCheck, ShieldAlert, ShieldX, Globe, MapPin, Clock, Fingerprint, ExternalLink } from "lucide-react";

interface IpVerificationProps {
  devices: Device[];
}

interface IpResult {
  ip: string;
  status: "clean" | "suspicious" | "malicious";
  riskScore: number;
  country: string;
  city: string;
  isp: string;
  asn: string;
  hostname: string;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
  lastReported: string;
  abuseReports: number;
  checkedAt: Date;
}

// Simulated IP verification
function simulateIpCheck(ip: string): IpResult {
  const hash = ip.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const statuses: IpResult["status"][] = ["clean", "suspicious", "malicious"];
  const status = statuses[hash % 3];
  const countries = ["United States", "Germany", "China", "Russia", "Netherlands", "Brazil", "India", "UK"];
  const cities = ["New York", "Berlin", "Beijing", "Moscow", "Amsterdam", "São Paulo", "Mumbai", "London"];
  const isps = ["Comcast", "Deutsche Telekom", "China Telecom", "Rostelecom", "KPN", "Vivo", "Airtel", "BT"];

  return {
    ip,
    status,
    riskScore: status === "clean" ? Math.floor(Math.random() * 20) : status === "suspicious" ? 40 + Math.floor(Math.random() * 30) : 75 + Math.floor(Math.random() * 25),
    country: countries[hash % countries.length],
    city: cities[hash % cities.length],
    isp: isps[hash % isps.length],
    asn: `AS${10000 + (hash % 50000)}`,
    hostname: `host-${ip.replace(/\./g, "-")}.example.net`,
    isVPN: hash % 5 === 0,
    isProxy: hash % 7 === 0,
    isTor: hash % 13 === 0,
    lastReported: status !== "clean" ? `${Math.floor(Math.random() * 30) + 1} days ago` : "Never",
    abuseReports: status === "clean" ? 0 : Math.floor(Math.random() * 50) + 1,
    checkedAt: new Date(),
  };
}

const statusConfig = {
  clean: { icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", label: "Clean" },
  suspicious: { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Suspicious" },
  malicious: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Malicious" },
};

export function IpVerification({ devices }: IpVerificationProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IpResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = useCallback((ip: string) => {
    setIsChecking(true);
    setTimeout(() => {
      const result = simulateIpCheck(ip);
      setResults(prev => [result, ...prev.filter(r => r.ip !== ip)].slice(0, 20));
      setIsChecking(false);
    }, 800);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) handleCheck(query.trim());
  };

  const handleBulkScan = useCallback(() => {
    setIsChecking(true);
    const ips = devices.map(d => d.ipAddress);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= ips.length) {
        clearInterval(interval);
        setIsChecking(false);
        return;
      }
      const result = simulateIpCheck(ips[i]);
      setResults(prev => [result, ...prev.filter(r => r.ip !== ips[i])].slice(0, 30));
      i++;
    }, 200);
  }, [devices]);

  const riskGradient = (score: number) => {
    if (score < 25) return "bg-primary/20";
    if (score < 50) return "bg-secondary/20";
    if (score < 75) return "bg-warning/20";
    return "bg-destructive/20";
  };

  const riskBarColor = (score: number) => {
    if (score < 25) return "bg-primary";
    if (score < 50) return "bg-secondary";
    if (score < 75) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Fingerprint className="h-5 w-5 text-secondary" />
        <h2 className="text-sm font-bold text-foreground">IP Verification & Threat Intelligence</h2>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSubmit} className="flex-1 min-w-[250px] flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter IP address to verify (e.g. 192.168.1.105)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-secondary/50 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isChecking || !query.trim()}
            className="px-4 py-2 text-xs font-medium rounded-md bg-secondary/20 border border-secondary/30 text-secondary hover:bg-secondary/30 transition-colors disabled:opacity-50"
          >
            {isChecking ? "Checking..." : "Verify"}
          </button>
        </form>
        <button
          onClick={handleBulkScan}
          disabled={isChecking}
          className="px-4 py-2 text-xs font-medium rounded-md bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          Scan All Devices ({devices.length})
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {/* Summary strip */}
          <div className="flex gap-3 text-[10px] font-mono">
            <span className="text-primary">✓ {results.filter(r => r.status === "clean").length} Clean</span>
            <span className="text-warning">⚠ {results.filter(r => r.status === "suspicious").length} Suspicious</span>
            <span className="text-destructive">✕ {results.filter(r => r.status === "malicious").length} Malicious</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {results.map((result) => {
              const cfg = statusConfig[result.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={result.ip + result.checkedAt.getTime()}
                  className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4 space-y-3 transition-all hover:scale-[1.01]`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                      <span className="text-sm font-mono font-bold text-foreground">{result.ip}</span>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Risk Score Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>Risk Score</span>
                      <span className="font-mono font-bold">{result.riskScore}/100</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${riskGradient(result.riskScore)} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${riskBarColor(result.riskScore)} transition-all duration-500`}
                        style={{ width: `${result.riskScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Globe className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{result.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{result.city}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="text-muted-foreground/60">ISP:</span> {result.isp}
                    </div>
                    <div className="text-muted-foreground font-mono">
                      <span className="text-muted-foreground/60">ASN:</span> {result.asn}
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="flex flex-wrap gap-1.5">
                    {result.isVPN && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/20 text-warning border border-warning/20">VPN</span>
                    )}
                    {result.isProxy && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/20 text-warning border border-warning/20">Proxy</span>
                    )}
                    {result.isTor && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/20">Tor Exit</span>
                    )}
                    {result.abuseReports > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/20">
                        {result.abuseReports} abuse reports
                      </span>
                    )}
                    {result.status === "clean" && !result.isVPN && !result.isProxy && !result.isTor && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">No flags</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/60 pt-1 border-t border-border/30">
                    <div className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      Last reported: {result.lastReported}
                    </div>
                    <span className="font-mono">{result.hostname.slice(0, 20)}...</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && (
        <div className="rounded-lg border border-border border-dashed bg-card/50 p-8 text-center">
          <Fingerprint className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">Enter an IP address or scan all connected devices to check threat intelligence</p>
          <p className="text-[10px] text-muted-foreground/50 mt-1 font-mono">Checks IP reputation, geolocation, VPN/Proxy/Tor detection, and abuse reports</p>
        </div>
      )}
    </div>
  );
}
