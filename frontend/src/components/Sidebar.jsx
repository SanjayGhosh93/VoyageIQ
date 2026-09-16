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
  ChevronLeft,
  ChevronRight,
  Compass,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home Landing', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Freight Forecast', path: '/forecast', icon: TrendingUp },
  { name: 'Vessel Matcher', path: '/vessel-matcher', icon: Ship },
  { name: 'Chartering Calculator', path: '/calculator', icon: Calculator },
  { name: 'Route Optimizer', path: '/routes', icon: Navigation },
  { name: 'Route Radar', path: '/route-radar', icon: Compass },
  { name: 'Risk Center', path: '/risk', icon: ShieldAlert },
  { name: 'Early Warnings', path: '/alerts', icon: BellRing, badge: '5' },
  { name: 'Scenario Planner', path: '/scenarios', icon: GitCompare },
  { name: 'Market Intelligence', path: '/market', icon: BarChart3 },
  { name: 'Port Intelligence', path: '/ports', icon: Anchor },
  { name: 'Vessel Database', path: '/vessels', icon: Database },
  { name: 'Idle Management', path: '/idle', icon: Clock }
];

export const Sidebar = ({ onOpenDemo, isOpenMobile, onCloseMobile }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container: Off-canvas drawer on mobile/tablet (<lg), static on desktop (>=lg) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:z-30 flex flex-col bg-white/95 dark:bg-slate-950/95 lg:bg-white/75 lg:dark:bg-slate-950/75 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 shadow-2xl lg:shadow-xl ${
          // Mobile transform
          isOpenMobile ? 'translate-x-0 w-72 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop collapsed or expanded width
          collapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-transparent shrink-0">
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-900/40 p-1 flex items-center justify-center border border-sky-500/30 shadow-lg shadow-sky-500/20 shrink-0">
              <img src="/app-logo.png" alt="OCEANCHARTER AI" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            {(!collapsed || isOpenMobile) && (
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-mono">
                OCEANCHARTER AI
              </span>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden lg:block"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 overscroll-contain">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-600/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
                title={collapsed && !isOpenMobile ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {(!collapsed || isOpenMobile) && <span className="flex-1 truncate">{item.name}</span>}
                {(!collapsed || isOpenMobile) && item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white font-mono">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;