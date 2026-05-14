import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { HierarchyBadge } from "@/components/HierarchyBadge";

// Generate mock constituency data
const generateConstituencies = () => {
  const names = [
    "Worli","Bandra West","Andheri East","Thane","Kalyan","Nashik Central","Pune","Nagpur South",
    "Aurangabad Central","Kolhapur North","Solapur","Sangli","Satara","Ratnagiri","Sindhudurg",
    "Chandrapur","Amravati","Akola","Jalgaon","Dhule","Nanded","Latur","Osmanabad","Beed",
    "Parbhani","Hingoli","Washim","Yavatmal","Wardha","Gondia","Bhandara","Gadchiroli",
    "Buldhana","Nandurbar","Ahmednagar","Baramati","Maval","Shirur","Daund","Indapur",
    "Pandharpur","Miraj","Ichalkaranji","Hatkanangle","Shirol","Kagal","Radhanagari","Shahuwadi",
    "Kolhapur South","Karvir","Panhala","Wai","Koregaon","Man","Karad South","Karad North",
    "Patan","Malshiras","Madha","Karmala","Mohol","Akkalkot","South Solapur","North Solapur"
  ];
  const mlaNames = [
    "Aaditya Thackeray","Ashish Shelar","Ramesh Latke","Pratap Sarnaik","Ganpat Gaikwad",
    "Devyani Farande","Chandrakant Patil","Mohan Mate","Pradeep Jaiswal","Rajesh Kshirsagar"
  ];

  return Array.from({ length: 288 }, (_, i) => {
    const nni = Math.round(Math.random() * 80 + 15);
    const change = Math.round((Math.random() - 0.5) * 12 * 10) / 10;
    return {
      id: i + 1,
      name: names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : ''),
      mla: mlaNames[i % mlaNames.length],
      nni,
      change,
      zone: nni >= 65 ? 'victory' : nni >= 50 ? 'safe' : nni >= 35 ? 'danger' : 'defeat',
      alerts: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      region: ['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Konkan', 'Vidarbha'][i % 6],
    };
  });
};

const zoneColors: Record<string, { bg: string; border: string; text: string }> = {
  victory: { bg: 'bg-victory/10', border: 'border-l-victory', text: 'text-victory' },
  safe: { bg: 'bg-safe/10', border: 'border-l-safe', text: 'text-safe' },
  danger: { bg: 'bg-danger/10', border: 'border-l-danger', text: 'text-warning' },
  defeat: { bg: 'bg-defeat/10', border: 'border-l-defeat', text: 'text-danger' },
};

const StateCommandCenter = () => {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const constituencies = useMemo(generateConstituencies, []);

  const filtered = useMemo(() => {
    return constituencies.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.mla.toLowerCase().includes(search.toLowerCase())) return false;
      if (zoneFilter && c.zone !== zoneFilter) return false;
      if (regionFilter && c.region !== regionFilter) return false;
      return true;
    });
  }, [constituencies, search, zoneFilter, regionFilter]);

  const zoneCounts = useMemo(() => {
    const counts = { victory: 0, safe: 0, danger: 0, defeat: 0 };
    constituencies.forEach(c => counts[c.zone as keyof typeof counts]++);
    return counts;
  }, [constituencies]);

  const stateNNI = useMemo(() => {
    return Math.round(constituencies.reduce((a, c) => a + c.nni, 0) / constituencies.length * 10) / 10;
  }, [constituencies]);

  return (
    <div className="space-y-6 px-2 pb-6 animate-in fade-in duration-500">
      {/* State Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HierarchyBadge level="state" label="L1 State" />
          </div>
          <h1 className="text-2xl font-heading tracking-wider text-foreground">State Command Center</h1>
          <p className="text-xs text-muted-foreground font-body">288 Vidhan Sabha Constituencies — Maharashtra 2029</p>
        </div>

        {/* State KPIs */}
        <div className="flex gap-3">
          {[
            { label: 'STATE NNI', value: stateNNI, color: stateNNI >= 50 ? 'text-safe' : 'text-danger' },
            { label: 'CONSTITUENCIES', value: '288', color: 'text-saffron' },
            { label: 'GRATEFUL VOTERS', value: '1.1L', color: 'text-victory' },
            { label: 'CRITICAL ALERTS', value: constituencies.filter(c => c.alerts > 0).length, color: 'text-danger' },
          ].map(kpi => (
            <div className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 px-5 py-4 text-center min-w-[120px]">
              <div className={`text-xl font-mono font-bold font-mono-data ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[9px] font-heading tracking-wider text-muted-foreground">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search constituency or MLA name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-saffron font-body"
          />
        </div>

        <div className="flex gap-1.5">
          {(['all', 'victory', 'safe', 'danger', 'defeat'] as const).map(zone => (
            <button
              key={zone}
              onClick={() => setZoneFilter(zone === 'all' ? null : zone)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-heading tracking-wider transition-all ${
                (zone === 'all' && !zoneFilter) || zoneFilter === zone
                  ? 'bg-saffron text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {zone === 'all' ? `ALL (288)` : `${zone.toUpperCase()} (${zoneCounts[zone as keyof typeof zoneCounts]})`}
            </button>
          ))}
        </div>

        <select
          value={regionFilter || ''}
          onChange={(e) => setRegionFilter(e.target.value || null)}
          className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-xs text-foreground font-body focus:outline-none"
        >
          <option value="">All Regions</option>
          {['Mumbai', 'Pune', 'Nashik', 'Aurangabad', 'Konkan', 'Vidarbha'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Zone Distribution */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden">
        {Object.entries(zoneCounts).map(([zone, count]) => (
          <div
            key={zone}
            className={`${zone === 'victory' ? 'bg-victory' : zone === 'safe' ? 'bg-safe' : zone === 'danger' ? 'bg-danger' : 'bg-defeat'}`}
            style={{ width: `${(count / 288) * 100}%` }}
          />
        ))}
      </div>

      {/* 288 Constituency Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {filtered.map(c => {
          const colors = zoneColors[c.zone];
          return (
            <Link
              key={c.id}
              to="/"
              className={`relative ${colors.bg} rounded-lg border border-border border-l-[6px] ${colors.border} p-3 hover:scale-[1.02] transition-all duration-200 group cursor-pointer`}
            >
              {c.alerts > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-defeat animate-pulse" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-mono text-muted-foreground">#{c.id}</span>
                <span className="text-[9px] font-body text-muted-foreground truncate ml-1">{c.mla}</span>
              </div>
              <div className={`text-2xl font-mono font-bold font-mono-data ${colors.text} mb-0.5`}>{c.nni}</div>
              <div className="text-[9px] text-muted-foreground mb-1">NNI Score</div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-body text-foreground truncate">{c.name}</span>
                <div className={`flex items-center gap-0.5 text-[9px] font-mono ${c.change >= 0 ? 'text-victory' : 'text-danger'}`}>
                  {c.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {c.change > 0 ? '+' : ''}{c.change}
                </div>
              </div>
              <ChevronRight className="absolute bottom-2 right-2 w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default StateCommandCenter;
