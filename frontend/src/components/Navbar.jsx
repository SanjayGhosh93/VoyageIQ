import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  PlayCircle, 
  Presentation, 
  User, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Home,
  Ship,
  Anchor,
  Navigation,
  Calculator,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Clock,
  FileSpreadsheet,
  X,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { ORIGIN_PORTS, DESTINATION_PORTS, VESSEL_CLASSES } from '../utils/constants';

// Comprehensive searchable inventory across the platform
const SEARCH_INDEX = [
  // Core Intelligence Modules
  { title: 'Executive Maritime Dashboard', subtitle: 'Live Freight, Congestion & Fleet Telemetry', category: 'Module', path: '/dashboard', icon: Layers },
  { title: 'Freight Rate Forecasting Engine', subtitle: 'EMA20/50, Volatility & Horizon Curves', category: 'Tool', path: '/forecast', icon: TrendingUp },
  { title: 'Vessel Matcher & Feasibility', subtitle: 'Deterministic Draft & LOA Compliance Engine', category: 'Tool', path: '/vessel-matcher', icon: Ship },
  { title: 'Total Landed Cost Calculator', subtitle: 'Freight, Bunker, Demurrage & Sensitivity', category: 'Tool', path: '/calculator', icon: Calculator },
  { title: 'Route Optimizer & Interactive Map', subtitle: 'Great Circle & Waypoint Corridor Routing', category: 'Tool', path: '/routes', icon: Navigation },
  { title: 'Demurrage Risk Center', subtitle: 'Monsoon, Queue & Berth Risk Radar', category: 'Tool', path: '/risk', icon: ShieldAlert },
  { title: 'Early Warning Radar', subtitle: 'Active Restrictive Alerts & Warnings', category: 'Tool', path: '/alerts', icon: Bell },
  { title: 'Scenario Planner & Simulation', subtitle: 'Spot vs COA vs Time Charter Matrix', category: 'Tool', path: '/scenarios', icon: BarChart3 },
  { title: 'Market Intelligence & Indices', subtitle: 'Baltic Dry (BDI), BPI, Bunker Fuel Trends', category: 'Data', path: '/market', icon: BarChart3 },
  { title: 'Indian East Coast Ports Database', subtitle: 'Bathymetry, Draft & Handling TPH Limits', category: 'Data', path: '/ports', icon: Anchor },
  { title: 'Global Vessel Registry Database', subtitle: 'Capesize, Panamax, Supramax Fleet Specs', category: 'Data', path: '/vessels', icon: Ship },
  { title: 'Idle Management & Laytime', subtitle: 'Deadheading Reduction & Demurrage Mitigation', category: 'Tool', path: '/idle', icon: Clock },
  { title: 'Executive Reports & Briefs', subtitle: 'Official SAIL Logistics Tender Documents', category: 'Reports', path: '/reports', icon: FileSpreadsheet },
  { title: 'SIH 2026 Presentation Deck', subtitle: 'Official 6-Slide POSEIDON-X Slide Deck', category: 'Presentation', path: '/presentation', icon: Presentation },

  // Indian Destination Ports
  ...DESTINATION_PORTS.map((p) => ({
    title: `${p.label || p.value}`,
    subtitle: `Draft: ${p.draft} • Max LOA: ${p.loa}`,
    category: 'East Coast Port',
    path: `/ports?search=${encodeURIComponent(p.value)}`,
    icon: Anchor
  })),

  // Global Origin Ports
  ...ORIGIN_PORTS.map((p) => ({
    title: `${p.label || p.value}`,
    subtitle: `Origin Loading Terminal • ${p.country}`,
    category: 'Origin Port',
    path: `/ports?search=${encodeURIComponent(p.value)}`,
    icon: Anchor
  })),

  // Vessel Classes & Benchmark Ships
  ...VESSEL_CLASSES.map((v) => ({
    title: `${v.label}`,
    subtitle: `Draft: ${v.draft} • LOA: ${v.loa}`,
    category: 'Vessel Class',
    path: `/vessels?class=${v.value}`,
    icon: Ship
  })),

  // Key Named Fleet Vessels & Corridors
  { title: 'MV Ocean Pioneer (Capesize)', subtitle: '180,000 DWT • Draft: 17.5m • LOA: 285m', category: 'Vessel', path: '/vessels', icon: Ship },
  { title: 'MV Star Bulk (Panamax)', subtitle: '75,000 DWT • Draft: 13.8m • LOA: 228m', category: 'Vessel', path: '/vessels', icon: Ship },
  { title: 'MV Pacific Pearl (Supramax)', subtitle: '58,000 DWT • Draft: 12.2m • LOA: 195m', category: 'Vessel', path: '/vessels', icon: Ship },
  { title: 'MV Eastern Wind (Handysize)', subtitle: '32,000 DWT • Draft: 9.8m • LOA: 175m', category: 'Vessel', path: '/vessels', icon: Ship },
  { title: 'Gladstone to Haldia Corridor', subtitle: '5,250 NM • High Coking Coal Volume Route', category: 'Route', path: '/routes', icon: Navigation },
  { title: 'Gladstone to Paradip Corridor', subtitle: '5,100 NM • Mechanized Deepwater Discharge Route', category: 'Route', path: '/routes', icon: Navigation },
  { title: 'Banjarmasin to Vizag Corridor', subtitle: '1,980 NM • Fast Indonesian Thermal Coal Route', category: 'Route', path: '/routes', icon: Navigation },
  { title: 'Vostochny (Russia) to Paradip', subtitle: '5,600 NM • Russian PCI / Coking Coal Corridor', category: 'Route', path: '/routes', icon: Navigation }
];

export const Navbar = ({ onOpenDemo }) => {
  const { user, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const roles = ['Logistics Planner', 'Commercial Charterer', 'Port Operations Manager', 'Executive'];

  // Filter items based on user typing
  const filteredResults = searchQuery.trim()
    ? SEARCH_INDEX.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
        );
      }).slice(0, 8)
    : [];

  // Close search popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (item) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(item.path);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      handleSelectResult(filteredResults[0]);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="h-16 px-6 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-navy-950/70 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-40 transition-colors shadow-sm">
      {/* Left: Global Interactive Search Bar */}
      <div className="flex-1 max-w-xl relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search port, vessel, IMO, route, calculator or tariff..."
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Popover */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            {searchQuery.trim() ? (
              filteredResults.length > 0 ? (
                <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Search Results ({filteredResults.length})
                  </div>
                  <div className="space-y-1 pt-1">
                    {filteredResults.map((item, idx) => {
                      const Icon = item.icon || Layers;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectResult(item)}
                          className="w-full px-3 py-2 rounded-xl text-left flex items-center justify-between hover:bg-ocean-500/10 dark:hover:bg-ocean-500/20 text-slate-800 dark:text-slate-200 group transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-ocean-600 dark:text-cyan-400 group-hover:bg-ocean-500 group-hover:text-white transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-cyan-300">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                              {item.category}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-ocean-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No direct matches for "{searchQuery}"</p>
                  <p className="text-[11px]">Try searching for Paradip, Haldia, Capesize, Freight Forecast, or Demurrage.</p>
                </div>
              )
            ) : (
              <div className="p-3 space-y-2">
                <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Navigation Suggestions
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  {SEARCH_INDEX.slice(0, 6).map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectResult(item)}
                      className="p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <item.icon className="w-3.5 h-3.5 text-ocean-500 shrink-0" />
                      <span className="truncate font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Demo Button, Theme Toggle, User */}
      <div className="flex items-center gap-3">
        {/* Day / Night Mode Toggle */}
        <ThemeToggle />

        {/* Home Portal Button */}
        <Link
          to="/"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80 rounded-xl transition-all shadow-sm"
          title="Back to Home / Landing Page"
        >
          <Home className="w-3.5 h-3.5 text-ocean-600 dark:text-cyan-400" />
          <span>Home</span>
        </Link>

        {/* SIH Judge Presentation Mode Button */}
        <Link
          to="/presentation"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-ocean-600 dark:text-ocean-300 bg-ocean-500/10 dark:bg-ocean-950/60 hover:bg-ocean-500/20 dark:hover:bg-ocean-900/80 border border-ocean-500/30 rounded-xl transition-all shadow-sm"
        >
          <Presentation className="w-3.5 h-3.5 text-ocean-600 dark:text-ocean-400" />
          <span>Judge Presentation</span>
        </Link>

        {/* 1-Click RUN SIH DEMO Button */}
        <button
          onClick={onOpenDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-yellow-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase font-mono">RUN SIH DEMO</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Early Warnings"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-navy-900 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-navy-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>ACTIVE ALERTS</span>
                <Link to="/alerts" onClick={() => setShowNotifications(false)} className="text-ocean-600 dark:text-ocean-400 hover:underline">
                  View All (5)
                </Link>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-slate-700 dark:text-slate-300">
                  <div className="font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                    <span>CRITICAL: Haldia Draft Restr.</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">8.5m max permissible draft. Capesize blocked.</div>
                </div>
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-slate-700 dark:text-slate-300">
                  <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span>HIGH: Freight Bullish Trend</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">EMA20 crossed +8.2% above EMA50.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-ocean-600 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user?.name || 'SAIL Officer'}</div>
              <div className="text-[10px] text-ocean-600 dark:text-ocean-400 font-mono leading-tight flex items-center gap-1">
                <span>{user?.role || 'Logistics Manager'}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 mb-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">{user?.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</div>
                <div className="text-[10px] text-ocean-600 dark:text-ocean-400 mt-1 font-mono">{user?.organization}</div>
              </div>

              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Switch Role (RBAC Simulation)
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    user?.role === r ? 'bg-ocean-500/20 text-ocean-600 dark:text-ocean-300 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {user?.role === r && <ShieldCheck className="w-3.5 h-3.5 text-ocean-500 dark:text-ocean-400" />}
                </button>
              ))}

              <div className="border-t border-slate-200 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
