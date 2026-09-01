import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Anchor, 
  TrendingUp, 
  Ship, 
  ShieldAlert, 
  ShieldCheck,
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Compass, 
  Navigation, 
  DollarSign, 
  Layers,
  FileSpreadsheet,
  Award,
  Video
} from 'lucide-react';
import { RouteVisualizer } from '../components/RouteVisualizer';
import { SihDemoModal } from '../components/SihDemoModal';
import { IntroVideoSplash } from '../components/IntroVideoSplash';
import { ThemeToggle } from '../components/ThemeToggle';
import { APP_CONFIG } from '../utils/constants';

export const LandingPage = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Auto-play was prevented by browser policy:', error);
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-ocean-500 selection:text-white relative overflow-x-hidden">
      {/* Full Page Edge-to-Edge Background Video */}
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
        
        {/* Soft Translucent Overlay */}
        <div
          data-video-overlay="true"
          className="video-overlay absolute inset-0 backdrop-blur-[0.5px]"
        />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-navy-950/70 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900/40 p-1 flex items-center justify-center border border-ocean-500/30 shadow-lg shadow-ocean-500/25 shrink-0">
              <img src="/app-logo.png" alt="OCEANCHARTER AI" className="w-full h-full object-contain filter drop-shadow" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white font-mono">
              OCEANCHARTER AI
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Day / Night Mode Toggle */}
            <ThemeToggle />

            <button
              onClick={() => setShowIntro(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold transition-all hover:border-cyan-400"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span>Watch Intro</span>
            </button>

            <Link
              to="/presentation"
              className="hidden sm:inline-flex text-xs font-semibold text-ocean-300 hover:text-white transition-colors"
            >
              Judge Deck
            </Link>
            <button
              onClick={() => setDemoOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>RUN SIH DEMO</span>
            </button>
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white font-semibold text-xs font-mono transition-colors shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[88vh] flex items-center pt-8 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              Predict Freight.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                Optimize Vessels.
              </span>{' '}
              Reduce Demurrage.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 dark:text-slate-200 max-w-2xl leading-relaxed drop-shadow-md font-medium">
              {APP_CONFIG.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/vessel-matcher')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm font-mono tracking-wide transition-all shadow-xl shadow-ocean-500/30 flex items-center gap-2 transform hover:scale-[1.02] border border-cyan-300/40"
              >
                <span>RUN SMART CHARTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-white border border-slate-700/80 font-bold text-sm font-mono transition-all flex items-center gap-2 shadow-xl backdrop-blur-md"
              >
                <span>EXPLORE DASHBOARD</span>
              </button>

              <button
                onClick={() => setShowIntro(true)}
                className="px-4 py-3.5 rounded-2xl bg-ocean-950/60 hover:bg-ocean-900/80 text-ocean-300 border border-ocean-500/40 font-bold text-sm font-mono transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Video className="w-4 h-4 text-cyan-400" />
                <span>WATCH ANIMATION</span>
              </button>
            </div>

            {/* SAIL Trust badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-xs text-slate-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Engineered for SAIL Coking Coal & Raw Material Procurement</span>
            </div>
          </div>

          {/* Hero Right Interactive Visualization & Floating Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-2 rounded-3xl glass-panel-glow">
              {/* Route Corridor Visualizer Australia -> East Coast India */}
              <RouteVisualizer
                origin="Gladstone (AU)"
                destination="Paradip (IN)"
                distanceNM={5100}
                sailingDays={15.7}
                vesselClass="PANAMAX"
              />

              {/* 4 Floating Cards */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Floating Card 1: Freight Forecast */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg flex flex-col justify-between"
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Freight Forecast</div>
                  <div className="text-xl font-extrabold text-amber-400 font-mono mt-1">+8.2%</div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase mt-1">ILLUSTRATIVE SIMULATION</div>
                </motion.div>

                {/* Floating Card 2: Demurrage Risk */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg flex flex-col justify-between"
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Demurrage Risk</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">24 / 100</div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase mt-1">LOW EXPOSURE</div>
                </motion.div>

                {/* Floating Card 3: Recommended Vessel */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-ocean-500/30 shadow-lg flex flex-col justify-between"
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Recommended Vessel</div>
                  <div className="text-lg font-extrabold text-cyan-400 font-mono mt-1">Panamax</div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase mt-1">DRAFT COMPLIANT</div>
                </motion.div>

                {/* Floating Card 4: Potential Saving */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg flex flex-col justify-between"
                >
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Potential Saving</div>
                  <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">+$218,500</div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase mt-1">ILLUSTRATIVE SIMULATION</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 3 Pillar Value Proposition */}
      <section className="py-16 px-6 bg-white/50 dark:bg-navy-900/50 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-xs font-mono font-bold text-ocean-600 dark:text-ocean-400 uppercase tracking-widest">
              END-TO-END MARITIME LOGISTICS INTELLIGENCE
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Don’t Just Check Freight Rates. Check True Feasibility.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Traditional chartering looks only at $/MT. OceanCharter AI analyzes draft depths, LOA, Hooghly river silting, demurrage penalties, and automatically reroutes when voyages fail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 w-fit">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Predictive Freight AI</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                JavaScript-native time-series forecasting across 730 days of data. Evaluates EMA20/50 crossovers, volatility, and recommends Spot vs Time Charter.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 w-fit">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Impossible Scenario Solver</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                When a Capesize attempts Haldia discharge, the engine rejects it with exact draft and LOA diagnostics and immediately generates 4 ranked alternatives.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-panel space-y-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 w-fit">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Total Landed Cost Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Combines ocean freight, bunker fuel burn, port dues, handling, lightering, and expected demurrage with live What-If sensitivity sliders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Global SIH Modal */}
      <SihDemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Cinematic Intro Animation Video Overlay */}
      <AnimatePresence>
        {showIntro && (
          <IntroVideoSplash onFinish={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-navy-950/80 backdrop-blur-xl py-6 px-6 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-slate-800 dark:text-slate-200 font-mono font-bold">
            <Anchor className="w-4 h-4 text-ocean-600 dark:text-cyan-400" />
            <span>OCEANCHARTER AI</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-ocean-600 dark:text-cyan-300 font-normal">SIH 2026 Problem ID: {APP_CONFIG.problemId}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Dispatch Engine Active</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Ministry of Steel • SAIL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
