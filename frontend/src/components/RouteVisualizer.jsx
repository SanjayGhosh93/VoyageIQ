// frontend/src/components/RouteVisualizer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Navigation, Anchor, Compass, Waves } from 'lucide-react';

export const RouteVisualizer = ({
  origin = 'Gladstone',
  destination = 'Paradip',
  distanceNM = 5100,
  sailingDays = 15.7,
  vesselClass = 'PANAMAX'
}) => {
  return (
    <div className="relative w-full rounded-2xl glass-panel p-5 overflow-hidden border border-ocean-500/20 shadow-xl">
      {/* Background Water Map Styling */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 opacity-90" />
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-ocean-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-ocean-400 font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-ocean-400" />
            <span>MARITIME TRANSIT CORRIDOR</span>
          </div>
          <div className="text-base font-extrabold text-white font-mono mt-0.5">
            {origin} <span className="text-ocean-400">→</span> {destination}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            Distance: <strong className="text-cyan-400">{distanceNM?.toLocaleString()} NM</strong>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            Transit: <strong className="text-amber-400">{sailingDays} Days</strong>
          </div>
        </div>
      </div>

      {/* Interactive Animated Route Track */}
      <div className="relative z-10 py-6 px-4">
        {/* Track Line with gradient and pulse */}
        <div className="relative h-2.5 bg-slate-800/90 rounded-full overflow-hidden flex items-center">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500 via-ocean-400 to-blue-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Origin & Destination Ports Pins + Animated Ship */}
        <div className="relative flex justify-between items-center -mt-6">
          {/* Origin Pin */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
              <Anchor className="w-4 h-4" />
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-white block">{origin}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Loading Port</span>
            </div>
          </div>

          {/* Intermediate Chokepoints */}
          <div className="hidden md:flex flex-col items-center opacity-75">
            <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 text-[10px] font-mono">
              1
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Torres Strait</span>
          </div>

          <div className="hidden md:flex flex-col items-center opacity-75">
            <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 text-[10px] font-mono">
              2
            </div>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">Indian Ocean</span>
          </div>

          {/* Animated Vessel in Motion */}
          <motion.div
            className="absolute top-0 -mt-1 p-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xl shadow-amber-500/30 flex items-center gap-1.5"
            animate={{
              left: ['15%', '80%', '15%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Ship className="w-4 h-4" />
            <span className="text-[10px] font-extrabold font-mono uppercase hidden sm:inline">
              {vesselClass}
            </span>
          </motion.div>

          {/* Destination Pin */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs font-bold text-white block">{destination}</span>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Discharge Port</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualizer;
