// frontend/src/pages/ReportsPage.jsx
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Anchor, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2,
  XCircle,
  Clock,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { reportService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';
import { APP_CONFIG } from '../utils/constants';

export const ReportsPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async (destination = 'Haldia', vesselClass = 'CAPESIZE', qty = 120000) => {
    setLoading(true);
    try {
      const res = await reportService.generateReport({
        title: 'Overseas Bulk Coking Coal Procurement Audit Brief',
        cargoType: 'Coking Coal',
        cargoQuantity: qty,
        origin: 'Gladstone',
        destination: destination,
        vesselClass: vesselClass,
        generatedBy: 'SAIL Procurement & Chartering Directorate'
      });
      if (res?.success) {
        setReport(res.data);
        addToast('Executive Decision Brief generated successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to generate report', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-ocean-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-ocean-400 uppercase tracking-widest">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>SAIL EXECUTIVE BRIEFING DOSSIER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Chartering Audit Report & Executive Brief
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official procurement dossier with feasibility audit, alternative rankings, and XAI explainability
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleGenerate('Haldia', 'CAPESIZE', 120000)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold text-xs font-mono transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate SIH Benchmark Brief</span>
          </button>

          {report && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-500 text-white font-bold text-xs font-mono transition-colors shadow-md flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          )}
        </div>
      </div>

      {!report && !loading && (
        <div className="p-12 text-center glass-panel rounded-3xl space-y-4">
          <div className="p-4 rounded-full bg-ocean-500/10 border border-ocean-500/20 text-ocean-400 w-fit mx-auto">
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-white">No Active Report Generated</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click the button above to generate a comprehensive, print-ready chartering decision brief for the Ministry of Steel & SAIL review board.
          </p>
        </div>
      )}

      {/* Generated Report Paper Document */}
      {report && (
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none font-sans text-slate-200">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-800 gap-4">
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-ocean-400 uppercase">
                STEEL AUTHORITY OF INDIA LIMITED (SAIL) • MINISTRY OF STEEL
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {report.title}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Report ID: <strong className="text-white">{report.reportId}</strong> • Date: {new Date(report.generatedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400 text-slate-950">
                SIH 2026 OFFICIAL AUDIT
              </span>
            </div>
          </div>

          {/* Section 1: Parameters */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              1. Voyage & Parcel Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Cargo Parcel</span>
                <span className="text-white font-bold">{report.parameters.cargoQuantityMT?.toLocaleString()} MT ({report.parameters.cargoType})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Loading Origin</span>
                <span className="text-white font-bold">{report.parameters.origin} (Australia)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Target Destination</span>
                <span className="text-white font-bold">{report.parameters.destination} (East Coast)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Proposed Vessel</span>
                <span className="text-white font-bold">{report.parameters.vesselClass}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Feasibility & Constraint Audit */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              2. Feasibility Evaluation
            </h3>
            <div className={`p-4 rounded-2xl border ${report.feasibilityResult.isFeasible ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white">Status: {report.feasibilityResult.status}</span>
                <StatusBadge type="feasibility" value={report.feasibilityResult.status} />
              </div>
              {report.feasibilityResult.failedConstraints?.length > 0 && (
                <div className="space-y-1 text-xs text-rose-300 font-mono mt-2">
                  {report.feasibilityResult.failedConstraints.map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Smart Alternatives Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              3. Ranked Strategic Alternatives
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                    <th className="pb-2 font-semibold">Rank</th>
                    <th className="pb-2 font-semibold">Option & Route</th>
                    <th className="pb-2 font-semibold">Vessel</th>
                    <th className="pb-2 font-semibold text-right">Cost / MT</th>
                    <th className="pb-2 font-semibold text-right">Demurrage Risk</th>
                    <th className="pb-2 font-semibold text-right">Potential Saving</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.alternativesSummary?.map((alt, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-2.5 font-bold text-amber-400">{alt.rank}</td>
                      <td className="py-2.5 font-sans font-semibold text-slate-200">{alt.optionName}</td>
                      <td className="py-2.5 text-slate-300">{alt.vessel}</td>
                      <td className="py-2.5 text-right font-bold text-cyan-400">{formatCurrencyPerMT(alt.costPerMT)}</td>
                      <td className="py-2.5 text-right">{alt.demurrageRisk}/100</td>
                      <td className="py-2.5 text-right text-emerald-400 font-bold">+{formatCurrency(alt.savingVsBaselineUSD)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Final Executive Recommendation */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-ocean-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold uppercase text-ocean-400">
                4. Executive Chartering Directive
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Est. Net Benefit: +{formatCurrency(report.executiveRecommendation.potentialSavingUSD)}
              </span>
            </div>

            <h4 className="text-base font-bold text-white">
              {report.executiveRecommendation.decision}
            </h4>

            <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
              {report.executiveRecommendation.why?.map((w, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
            {report.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
