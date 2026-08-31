// frontend/src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  TrendingUp,
  Ship,
  Calculator,
  Navigation,
  ShieldAlert,
  BellRing,
  GitCompare,
  BarChart3,
  Anchor,
  Database,
  Clock,
  FileSpreadsheet,
  Presentation,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home Landing', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Freight Forecast', path: '/forecast', icon: TrendingUp },
  { name: 'Vessel Matcher', path: '/vessel-matcher', icon: Ship },
  { name: 'Chartering Calculator', path: '/calculator', icon: Calculator },
  { name: 'Route Optimizer', path: '/routes', icon: Navigation },
  { name: 'Risk Center', path: '/risk', icon: ShieldAlert },
  { name: 'Early Warnings', path: '/alerts', icon: BellRing, badge: '5' },
  { name: 'Scenario Planner', path: '/scenarios', icon: GitCompare },
  { name: 'Market Intelligence', path: '/market', icon: BarChart3 },
  { name: 'Port Intelligence', path: '/ports', icon: Anchor },
  { name: 'Vessel Database', path: '/vessels', icon: Database },
  { name: 'Idle Management', path: '/idle', icon: Clock },
  { name: 'Reports & Briefs', path: '/reports', icon: FileSpreadsheet },
  { name: 'Presentation Mode', path: '/presentation', icon: Presentation }
];

export const Sidebar = ({ onOpenDemo }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative z-30 flex flex-col bg-white/75 dark:bg-navy-950/75 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 shadow-xl ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-transparent">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-slate-900/40 p-1 flex items-center justify-center border border-ocean-500/30 shadow-lg shadow-ocean-500/20 shrink-0">
            <img src="/app-logo.png" alt="OCEANCHARTER AI" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-mono">
              OCEANCHARTER AI
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-ocean-600 to-ocean-700 text-white shadow-lg shadow-ocean-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
