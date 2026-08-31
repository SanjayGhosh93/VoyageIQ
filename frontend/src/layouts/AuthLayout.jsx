// frontend/src/layouts/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Anchor, ShieldCheck, Sparkles } from 'lucide-react';
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
          className="video-overlay absolute inset-0 backdrop-blur-[0.5px]"
        />
      </div>

      {/* Top Brand Bar */}
      <header className="p-6 flex items-center justify-between relative z-10 border-b border-slate-700/60 bg-navy-950/60 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900/40 p-1 flex items-center justify-center border border-ocean-500/30 shadow-lg shadow-ocean-500/20 shrink-0">
            <img src="/app-logo.png" alt="OCEANCHARTER AI" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-mono">
            OCEANCHARTER AI
          </span>
        </Link>

        {/* Day / Night Theme Switcher */}
        <ThemeToggle showLabel={true} />
      </header>

      {/* Center Form Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 relative z-10 border-t border-slate-700/60 bg-navy-950/60 backdrop-blur-md font-mono">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span>OCEANCHARTER AI</span>
          <span>•</span>
          <span>SIH 2026: {APP_CONFIG.problemId}</span>
          <span>•</span>
          <span>Ministry of Steel • SAIL</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
