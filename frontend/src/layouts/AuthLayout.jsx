// frontend/src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Database, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { APP_CONFIG } from '../utils/constants';

export const AuthLayout = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Auto-play was prevented:', error);
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center scale-105 opacity-75 dark:opacity-65 filter brightness-105 contrast-105 transition-opacity duration-500"
        >
          <source
            src="https://res.cloudinary.com/q5farw7j/video/upload/v1788187150/Person_standing_by_cargo_ship_202608301651_online-video-cutter.com.mp4"
            type="video/mp4"
          />
        </video>
        <div
          data-video-overlay="true"
          className="video-overlay absolute inset-0 backdrop-blur-[1px] bg-slate-950/40"
        />
      </div>

      {/* Top Brand Bar */}
      <header className="px-6 py-4 flex items-center justify-between relative z-10 border-b border-slate-700/60 bg-slate-950/75 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900/60 p-1 flex items-center justify-center border border-ocean-500/40 shadow-lg shadow-ocean-500/20 shrink-0 group-hover:border-cyan-400 transition-colors">
            <img src="/app-logo.png" alt="OCEANCHARTER AI" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-tight text-white font-mono flex items-center gap-2">
              <span>OCEANCHARTER AI</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                SIH {APP_CONFIG.problemId}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Ministry of Steel • SAIL Strategic Logistics Terminal
            </div>
          </div>
        </Link>

        {/* Header Right Items: Live DB Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 text-[11px]">Atlas Cloud DB</span>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <ThemeToggle showLabel={false} />
        </div>
      </header>

      {/* Center Form Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-slate-400 relative z-10 border-t border-slate-700/60 bg-slate-950/75 backdrop-blur-md font-mono">
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
          <span className="text-slate-300 font-bold">OCEANCHARTER AI</span>
          <span>•</span>
          <span>SIH 2026 Problem Statement: {APP_CONFIG.problemId}</span>
          <span>•</span>
          <span className="text-slate-400">Ministry of Steel / SAIL Logistics Directorate</span>
          <span>•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Database className="w-3 h-3" /> MongoDB Real-Time Sync
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
