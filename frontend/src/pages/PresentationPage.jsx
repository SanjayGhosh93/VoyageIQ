// frontend/src/pages/PresentationPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Anchor, 
  Maximize2, 
  Minimize2,
  Clock,
  Compass,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Database,
  Shield,
  Layers,
  CheckCircle2,
  TrendingUp,
  Ship,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Target,
  Leaf,
  BarChart,
  User,
  Bell,
  Monitor
} from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export const PresentationPage = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const totalSlides = 6;

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-900 flex flex-col justify-between overflow-hidden p-2 sm:p-4 selection:bg-ocean-500 selection:text-white">
      {/* Top Deck Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-950/90 text-white border border-slate-800 shadow-md relative z-20 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 p-1 flex items-center justify-center border border-ocean-500/40 shadow-md">
            <img src="/app-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm font-mono tracking-tight text-white">
                SIH 2026 • POSEIDON-X
              </span>
              <span className="px-2 py-0.5 rounded bg-ocean-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-ocean-500/30">
                PS: 26006
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F)'}</span>
          </button>

          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 transition-colors"
          >
            Exit Deck
          </Link>

          <button
            onClick={() => navigate('/vessel-matcher')}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono transition-all shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive App</span>
          </button>
        </div>
      </header>

      {/* Slide Presentation Canvas (16:9 Presentation Format) */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full max-w-7xl mx-auto overflow-hidden">
        <div className="w-full aspect-[16/9] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between border border-slate-300 text-slate-900 relative">
          
          <AnimatePresence mode="wait">
            {/* ========================================================= */}
            {/* SLIDE 1: Title Slide */}
            {/* ========================================================= */}
            {currentSlideIndex === 0 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-8 sm:p-12 relative bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden"
              >
                {/* Background Geometric Watermarks */}
                <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-slate-200/40 pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-slate-300/40 pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-slate-200/30 pointer-events-none" />

                {/* Top Header */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-full text-center">
                    <h1 className="text-3xl sm:text-5xl font-serif tracking-wide text-[#1a4a75] font-bold">
                      SMART INDIA HACKATHON 2026
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2 font-sans tracking-tight">
                      Intelligent Freight & Chartering Platform
                    </h2>
                  </div>
                  {/* SIH Logo Badge */}
                  <div className="absolute right-0 top-0 flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[10px] font-bold font-mono">
                        SIH
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono tracking-tight text-center leading-tight">
                      SMART INDIA<br />HACKATHON<br />2026
                    </span>
                  </div>
                </div>

                {/* Main Content: Left Details + Right Brain Lightbulb Visual */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto relative z-10 pt-4">
                  {/* Left Bullet List */}
                  <div className="md:col-span-7 space-y-3.5 text-slate-800 text-sm sm:text-base font-medium">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">• Problem Statement ID-</span>
                      <span className="font-bold text-[#1a5b8c] font-mono text-base sm:text-lg">26006</span>
                    </div>

                    <div className="flex items-start gap-2 leading-relaxed">
                      <span className="font-bold text-slate-900 shrink-0">• Problem Statement Title-</span>
                      <span className="text-[#1a5b8c] font-semibold">
                        Development of an Intelligent Freight Forecasting Model for Optimized Vessel Chartering and Bulk Cargo Procurement from overseas to East Coast of India
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">• Theme-</span>
                      <span className="text-[#1a5b8c] font-semibold">Transportation & Logistics</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">• PS Category-</span>
                      <span className="text-[#1a5b8c] font-semibold">Software</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">• Team ID-</span>
                      <span className="text-[#1a5b8c] font-mono">SIH2026-T8842</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">• Team Name-</span>
                      <span className="text-[#1a5b8c] font-bold tracking-wider font-mono">POSEIDON-X</span>
                    </div>
                  </div>

                  {/* Right Brain Bulb Watermark Visual */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center relative">
                    <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-amber-50 via-cyan-50 to-emerald-50 border-2 border-slate-200/80 flex flex-col items-center justify-center p-6 shadow-inner relative">
                      {/* Brain / Circuit Graphic representation */}
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-16 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-l-full flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                          <Cpu className="w-8 h-8 text-amber-100" />
                        </div>
                        <div className="w-16 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-r-full flex flex-col items-center justify-center text-white text-[9px] font-mono font-bold shadow-md p-1 leading-tight">
                          <span>1010</span>
                          <span>0101</span>
                          <span>1010</span>
                          <span>0101</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-lg text-slate-800 tracking-widest font-mono">SIH</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Diagonal Ribbon */}
                <div className="absolute bottom-0 right-0 w-80 h-12 bg-[#6b9e9b] transform -skew-x-12 origin-bottom-right" />
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* SLIDE 2: Proposed Solution & Workflow */}
            {/* ========================================================= */}
            {currentSlideIndex === 1 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-slate-50 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">POSEIDON-X</span>
                    <span className="text-xl font-bold text-slate-900">Intelligent Freight & Chartering Platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[9px] font-bold font-mono">
                      SIH
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono leading-tight">
                      SMART INDIA<br />HACKATHON 2026
                    </span>
                  </div>
                </div>

                {/* Two Column Layout: Left Proposed Solution + Right Workflow */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start my-auto pt-3">
                  {/* Left Column: Proposed Solution & Problem & Innovation */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Proposed Solution */}
                    <div className="space-y-2.5">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <span>Proposed Solution</span>
                      </h3>

                      <div className="space-y-2 text-xs sm:text-[13px] text-slate-800 leading-snug">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Freight Forecasting-</strong> Predict freight rates and find the{' '}
                            <span className="text-amber-600 font-semibold">best time to charter.</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Ship className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Smart Vessel Matching-</strong> Find the{' '}
                            <span className="text-amber-600 font-semibold">right vessel for the cargo and destination port.</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Cost Optimization-</strong> Compare{' '}
                            <span className="text-amber-600 font-semibold">freight + transshipment + demurrage</span> to find a lower-cost option.
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                          <div>
                            <strong>Risk Alerts-</strong> Give early warnings for{' '}
                            <span className="text-amber-600 font-semibold">port congestion, weather and fuel-price changes.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Problem & Innovation */}
                    <div className="pt-2 border-t border-slate-200">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                        <Layers className="w-4 h-4 text-cyan-600" />
                        <span>Problem & Innovation</span>
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-800 font-medium">
                        <li>• <strong>High Freight Cost</strong> → Predict the right charter time</li>
                        <li>• <strong>Wrong Vessel</strong> → Match vessel with port & cargo</li>
                        <li>• <strong>Port Delays</strong> → Check port restrictions early</li>
                        <li>• <strong>High Demurrage</strong> → Predict delay & idle risk</li>
                        <li>• <strong>Scattered Data</strong> → One integrated decision platform</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Workflow Interactive Diagram */}
                  <div className="md:col-span-7 bg-slate-100/80 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h3 className="text-center font-bold text-base text-orange-600 underline tracking-wide">
                      Workflow
                    </h3>

                    {/* Top Row: Cargo Request & Dashboard & Auth */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-300 text-[11px] shadow-sm">
                        <div className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                          <span>CARGO REQUEST</span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          • Cargo type & quantity || Origin || Destination || Delivery window
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#4a7a96] text-white text-[11px] shadow-sm">
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <BarChart className="w-3.5 h-3.5 text-cyan-200" />
                          <span>DASHBOARD</span>
                        </div>
                        <p className="text-[10px] text-cyan-100 leading-tight">
                          • Freight<br />• Vessels<br />• Risk
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-cyan-100 border border-cyan-200 text-[11px] text-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                        <User className="w-5 h-5 text-slate-800 mb-0.5" />
                        <span className="font-bold text-[10px]">Registration / Login</span>
                      </div>
                    </div>

                    {/* Middle Row: AI Engine & Notifications & Database */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-orange-500 text-white text-[11px] shadow-sm">
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <Cpu className="w-3.5 h-3.5 text-amber-200" />
                          <span>AI ENGINE</span>
                        </div>
                        <p className="text-[10px] text-orange-100 leading-tight">
                          • Freight Forecast<br />• Vessel–Port Matching<br />• Cost Optimization<br />• Risk Analysis
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-200 text-slate-800 text-[11px] shadow-sm">
                        <div className="font-bold flex items-center gap-1 mb-1 text-slate-900">
                          <Bell className="w-3.5 h-3.5 text-amber-600" />
                          <span>NOTIFICATIONS</span>
                        </div>
                        <p className="text-[10px] text-slate-700 leading-tight">
                          • Rate increase<br />• Port congestion<br />• Weather risk<br />• Demurrage risk
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#4a7a96] text-white text-[11px] shadow-sm">
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <Database className="w-3.5 h-3.5 text-cyan-200" />
                          <span>DATABASE & AUDIT</span>
                        </div>
                        <p className="text-[10px] text-cyan-100 leading-tight">
                          • Historical decision<br />• Forecast results
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Best Options & Prototype */}
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-[11px] shadow-sm">
                        <div className="font-bold flex items-center gap-1 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                          <span>BEST OPTIONS</span>
                        </div>
                        <p className="text-[10px] text-emerald-100 leading-tight font-mono">
                          Vessel || Charter Window || Route || Total Cost
                        </p>
                      </div>

                      <div 
                        onClick={() => navigate('/dashboard')}
                        className="cursor-pointer p-2 rounded-xl bg-white border border-slate-300 flex items-center justify-between text-xs hover:border-ocean-500 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-ocean-600" />
                          <span className="font-bold text-slate-900 font-mono text-[11px]">Interactive Prototype</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* SLIDE 3: Technical Approach */}
            {/* ========================================================= */}
            {currentSlideIndex === 2 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-white relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">POSEIDON-X</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide text-center">
                    TECHNICAL APPROACH
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[9px] font-bold font-mono">
                      SIH
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono leading-tight">
                      SMART INDIA<br />HACKATHON 2026
                    </span>
                  </div>
                </div>

                {/* 4 Pillars Architecture Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto pt-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 text-sm">1. Data Ingestion & Live Feeds</span>
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded font-bold">
                        Baltic + AIS + Weather
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      <li>• Baltic Dry Index (BDI) & Baltic Panamax Index (BPI) freight indices</li>
                      <li>• AIS live vessel tracking & automated port queue monitoring</li>
                      <li>• IMD Monsoon Swell, wind force & wave height APIs</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 text-sm">2. AI Time-Series Forecasting</span>
                      <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                        EMA20/50 + XGBoost
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      <li>• 730-day historical dataset modeling Australia/Indonesia coal</li>
                      <li>• EMA20 vs EMA50 trend regime classification (Bullish/Bearish)</li>
                      <li>• 95% Confidence Trajectory Envelopes (7d, 14d, 30d, 60d, 90d)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 text-sm">3. Deterministic Bathymetry Engine</span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                        Under Keel Clearance
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      <li>• Checks Draft, LOA, Beam, and Lock Limits at East Coast Ports</li>
                      <li>• Instant rejection of draft-gated voyages (e.g. Capesize at Haldia)</li>
                      <li>• Automated Smart Alternative Generator (Paradip / Dhamra / Sandheads)</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-900 text-sm">4. Multi-Objective Cost Solver</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-bold">
                        Landed Cost/MT
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      <li>• Full financial calculus: Ocean Freight + Bunker + Dues + Demurrage</li>
                      <li>• What-If Sensitivity Sliders for real-time risk stress testing</li>
                      <li>• Comprehensive Explainable AI (XAI) confidence audit trails</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* SLIDE 4: Feasibility and Viability */}
            {/* ========================================================= */}
            {currentSlideIndex === 3 && (
              <motion.div
                key="slide-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-slate-50 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">POSEIDON-X</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide text-center">
                    FEASIBILITY AND VIABILITY
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[9px] font-bold font-mono">
                      SIH
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono leading-tight">
                      SMART INDIA<br />HACKATHON 2026
                    </span>
                  </div>
                </div>

                {/* 3 Pillar Cards Matching PPT Template */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto pt-6 items-stretch">
                  {/* Pillar 1: Feasibility Analysis */}
                  <div className="bg-[#e2edf2] rounded-2xl p-5 pt-8 relative flex flex-col justify-between shadow-md border border-cyan-200/60">
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-[#1da1c2] border-4 border-white flex items-center justify-center shadow-lg">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-center font-bold text-base text-slate-900 mb-3">
                        Feasibility Analysis
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-[13px] text-slate-800 leading-relaxed font-medium">
                        <li>
                          • <span className="text-orange-600 font-bold">AI&web technologies</span> are readily available
                        </li>
                        <li>
                          • <strong>Historical data</strong> can support forecasting
                        </li>
                        <li>
                          • Prototype needs <span className="text-orange-600 font-bold">no specialized hardware</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 2: Challenges & Risks */}
                  <div className="bg-[#85adb4] text-slate-900 rounded-2xl p-5 pt-8 relative flex flex-col justify-between shadow-md border border-teal-300/60">
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b808e] border-4 border-white flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-center font-bold text-base text-slate-950 mb-3">
                        Challenges & Risks
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-[13px] text-slate-900 leading-relaxed font-medium">
                        <li>
                          • Limited <span className="font-bold underline text-white">real-time freight data</span>
                        </li>
                        <li>
                          Freight rates can change unexpectedly
                        </li>
                        <li>
                          • <strong>Weather & monsoon</strong> disruptions
                        </li>
                        <li>
                          Port congestion may cause demurrage
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Pillar 3: Overcome Challenges */}
                  <div className="bg-[#1f4a75] text-white rounded-2xl p-5 pt-8 relative flex flex-col justify-between shadow-md border border-blue-900/40">
                    <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-[#70b347] border-4 border-white flex items-center justify-center shadow-lg">
                      <Compass className="w-6 h-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-center font-bold text-base text-white mb-3">
                        Overcome Challenges
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-[13px] text-slate-100 leading-relaxed font-medium">
                        <li>
                          • Combine <span className="text-orange-400 font-bold">ML + rule-based constraints</span>
                        </li>
                        <li>
                          • Use <span className="text-orange-400 font-bold">risk scores & early alerts</span>
                        </li>
                        <li>
                          Continuously update and validate data
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* SLIDE 5: Impact and Benefits */}
            {/* ========================================================= */}
            {currentSlideIndex === 4 && (
              <motion.div
                key="slide-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-slate-50 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">POSEIDON-X</span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide">
                      IMPACT AND BENEFITS
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[9px] font-bold font-mono">
                      SIH
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono leading-tight">
                      SMART INDIA<br />HACKATHON 2026
                    </span>
                  </div>
                </div>

                {/* 4 Pillars with Circles + Target Audience on Right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-auto pt-6 items-stretch">
                  {/* 4 Columns (Col Span 9) */}
                  <div className="md:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Environmental */}
                    <div className="bg-[#e8f0f2] rounded-2xl p-3.5 pt-7 relative flex flex-col shadow-sm border border-slate-200 text-center">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">Environmental</h4>
                      <p className="text-[11px] text-slate-700 leading-snug font-medium text-left">
                        • Reduce vessel waiting, fuel use, and emissions through better voyage and cargo planning.
                      </p>
                    </div>

                    {/* Strategic */}
                    <div className="bg-[#dce9eb] rounded-2xl p-3.5 pt-7 relative flex flex-col shadow-sm border border-slate-200 text-center">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-cyan-700 border-2 border-white flex items-center justify-center shadow">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">Strategic</h4>
                      <p className="text-[11px] text-slate-700 leading-snug font-medium text-left">
                        • Use data to make smarter & faster decisions.<br />
                        • Get early alerts about freight and port changes.
                      </p>
                    </div>

                    {/* Operational */}
                    <div className="bg-[#c8dfe3] rounded-2xl p-3.5 pt-7 relative flex flex-col shadow-sm border border-slate-200 text-center">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center shadow">
                        <Ship className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">Operational</h4>
                      <p className="text-[11px] text-slate-700 leading-snug font-medium text-left">
                        • Reduce vessel waiting time and port delays.<br />
                        • Choose the right vessel for each port.
                      </p>
                    </div>

                    {/* Economic */}
                    <div className="bg-[#b3d3db] rounded-2xl p-3.5 pt-7 relative flex flex-col shadow-sm border border-slate-200 text-center">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1.5">Economic</h4>
                      <p className="text-[11px] text-slate-800 leading-snug font-medium text-left">
                        • <strong>Reduce Costs:</strong> Lower freight and demurrage costs.<br />
                        • <strong>Improve Decisions:</strong> Make better vessel and cargo planning decisions.
                      </p>
                    </div>
                  </div>

                  {/* Target Audience (Col Span 3) */}
                  <div className="md:col-span-3 bg-[#cadce0] rounded-2xl p-4 pt-7 relative flex flex-col shadow-sm border border-slate-300 text-center">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Target Audience</h4>
                    <ul className="text-[11px] text-slate-800 space-y-1.5 font-medium text-left leading-tight">
                      <li>• SAIL & Indian Steel Companies.</li>
                      <li>• Chartering & Procurement Teams.</li>
                      <li>• Logistics & Supply Chain Managers.</li>
                      <li>• Port & Maritime Operations Teams.</li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Diagonal Ribbon */}
                <div className="absolute bottom-0 right-0 w-96 h-10 bg-[#1f4a75] transform -skew-x-12 origin-bottom-right" />
              </motion.div>
            )}

            {/* ========================================================= */}
            {/* SLIDE 6: Research and References */}
            {/* ========================================================= */}
            {currentSlideIndex === 5 && (
              <motion.div
                key="slide-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-slate-50 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xl font-extrabold text-slate-900 font-mono tracking-wider">POSEIDON-X</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide text-center">
                    RESEARCH AND REFERENCES
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white text-[9px] font-bold font-mono">
                      SIH
                    </div>
                    <span className="text-[9px] font-bold text-slate-700 font-mono leading-tight">
                      SMART INDIA<br />HACKATHON 2026
                    </span>
                  </div>
                </div>

                {/* 3 Research Branches */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto pt-6">
                  {/* Problem & Industry Research */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-200 pb-1.5 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-600" />
                      <span>Problem & Industry Research</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <li>• SAIL / Ministry of Steel resources (PDF)</li>
                      <li>• Maritime & bulk-cargo reports</li>
                      <li>• National Steel Policy 2017</li>
                    </ul>
                  </div>

                  {/* AI & Technical Research */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-200 pb-1.5 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-amber-600" />
                      <span>AI & Technical Research</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <li>• Research papers on freight-rate forecasting</li>
                      <li>• XGBoost / Prophet documentation</li>
                      <li>• Vessel–port optimization research</li>
                      <li>• Kpler – Dry Bulk Analytics (Reference for dry-bulk freight analytics, vessel tracking)</li>
                    </ul>
                  </div>

                  {/* Data Sources */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-200 pb-1.5 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Data Sources</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <li>• Baltic Exchange — Freight indices (BDI / BPI)</li>
                      <li>• Vessel/AIS data provider</li>
                      <li>• Port & congestion data</li>
                      <li>• Weather & fuel-price APIs</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide Footer Template Signature Bar */}
          <div className="bg-[#0072bc] text-white px-6 py-1.5 flex items-center justify-between text-[11px] font-sans font-medium relative z-20">
            <span>@SIH Idea submission- Template</span>
            <span className="font-bold">{currentSlideIndex + 1}</span>
          </div>
        </div>
      </main>

      {/* Bottom Deck Switcher & Navigation Controls */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2 rounded-xl bg-slate-950/90 text-white border border-slate-800 shadow-md relative z-20 mt-2">
        {/* Slide Thumbnail Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-0.5">
          {[1, 2, 3, 4, 5, 6].map((num, idx) => (
            <button
              key={num}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                currentSlideIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow font-extrabold scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Slide {num}
            </button>
          ))}
        </div>

        {/* Previous / Next Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-5 py-1.5 rounded-lg bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-400 hover:to-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-mono font-extrabold transition-all shadow flex items-center gap-1"
          >
            <span>{currentSlideIndex === totalSlides - 1 ? 'End' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default PresentationPage;

