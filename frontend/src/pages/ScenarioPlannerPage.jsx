// frontend/src/pages/ScenarioPlannerPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Layers,
  FileSpreadsheet,
  Sliders,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingState } from '../components/LoadingState';
import { scenarioService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ORIGIN_PORTS, DESTINATION_PORTS, VESSEL_CLASSES, CARGO_TYPES } from '../utils/constants';
import { formatCurrency, formatCurrencyPerMT } from '../utils/formatters';

export const ScenarioPlannerPage = () => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addToast } = useToast();

  const [newScenario, setNewScenario] = useState({
    title: 'Custom Procurement Scenario',
    cargoType: 'Coking Coal',
    cargoQuantityMT: 75000,
    originPort: 'Gladstone',
    destinationPort: 'Paradip',
    vesselClass: 'PANAMAX',
    contractType: 'Time Charter'
  });

  const fetchScenarios = async () => {
    setLoading(true);
    try {
      const res = await scenarioService.getScenarios();
      if (res?.success) {
        setScenarios(res.data);
      }
    } catch (err) {
      console.error('Failed to load scenarios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await scenarioService.createScenario(newScenario);
      if (res?.success) {
        setScenarios([res.data, ...scenarios]);
        setShowCreateModal(false);
        addToast('New charter scenario created and evaluated!', 'success');
      }
    } catch (err) {
      addToast('Failed to create scenario', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await scenarioService.deleteScenario(id);
      setScenarios(scenarios.filter((s) => s._id !== id));
      addToast('Scenario deleted from comparison workspace', 'info');
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  const handleDuplicate = async (s) => {
    try {
      const copyPayload = {
        ...s,
        title: `${s.title} (Copy)`
      };
      delete copyPayload._id;
      delete copyPayload.createdAt;
      delete copyPayload.updatedAt;

      const res = await scenarioService.createScenario(copyPayload);
      if (res?.success) {
        setScenarios([res.data, ...scenarios]);
        addToast('Scenario duplicated successfully', 'success');
      }
    } catch (err) {
      addToast('Duplication failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-sky-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            <GitCompare className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            <span>SAIL STRATEGIC SCENARIO COMPARATOR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Chartering Scenario Planner & Tradeoff Matrix
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Side-by-side evaluation of vessel classes, draft compatibility, total landed cost, and demurrage exposure
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-extrabold text-xs font-mono transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Scenario</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Aggregating comparative landed costs and voyage parameters..." />
      ) : (
        <>
          {/* Side-by-Side Comparison Matrix Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Scenario Comparison Matrix ({scenarios.length} Scenarios)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Sorted by Overall Optimization Score
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Scenario</th>
                    <th className="pb-3 font-semibold">Feasibility</th>
                    <th className="pb-3 font-semibold">Vessel</th>
                    <th className="pb-3 font-semibold">Route</th>
                    <th className="pb-3 font-semibold text-right">Freight</th>
                    <th className="pb-3 font-semibold text-right">Demurrage</th>
                    <th className="pb-3 font-semibold text-right">Risk Score</th>
                    <th className="pb-3 font-semibold text-right">Total Landed</th>
                    <th className="pb-3 font-semibold text-right">Cost / MT</th>
                    <th className="pb-3 font-semibold text-right">Score</th>
                    <th className="pb-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {scenarios.map((s, idx) => (
                    <tr key={s._id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 pr-2 font-sans font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[180px]">{s.title}</span>
                          {s.tag === 'BEST_VALUE' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-bold text-[9px] font-mono shrink-0">
                              BEST VALUE
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3">
                        <StatusBadge type="feasibility" value={s.feasibilityStatus} />
                      </td>

                      <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{s.vesselClass}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{s.originPort} → {s.destinationPort}</td>
                      <td className="py-3 text-right text-slate-700 dark:text-slate-300">${s.freightRateUSDPerMT?.toFixed(2)}</td>
                      <td className="py-3 text-right text-rose-600 dark:text-rose-400">{formatCurrency(s.demurrageExposureUSD)}</td>
                      <td className="py-3 text-right">
                        <span className={`font-bold ${s.riskScore > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {s.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(s.totalLandedCostUSD)}</td>
                      <td className="py-3 text-right font-extrabold text-cyan-600 dark:text-cyan-400">
                        {formatCurrencyPerMT(s.costPerMT)}
                      </td>
                      <td className="py-3 text-right font-extrabold text-slate-900 dark:text-white">
                        {s.optimizationScore}/100
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleDuplicate(s)}
                            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            title="Duplicate Scenario"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Delete Scenario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Charter Scenario</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Scenario Title</label>
                <input
                  type="text"
                  value={newScenario.title}
                  onChange={(e) => setNewScenario({ ...newScenario, title: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Parcel (MT)</label>
                  <input
                    type="number"
                    value={newScenario.cargoQuantityMT}
                    onChange={(e) => setNewScenario({ ...newScenario, cargoQuantityMT: Number(e.target.value) })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cargo Type</label>
                  <select
                    value={newScenario.cargoType}
                    onChange={(e) => setNewScenario({ ...newScenario, cargoType: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {CARGO_TYPES.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Origin Port</label>
                  <select
                    value={newScenario.originPort}
                    onChange={(e) => setNewScenario({ ...newScenario, originPort: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {ORIGIN_PORTS.map((p) => (
                      <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900">{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Destination Port</label>
                  <select
                    value={newScenario.destinationPort}
                    onChange={(e) => setNewScenario({ ...newScenario, destinationPort: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {DESTINATION_PORTS.map((p) => (
                      <option key={p.value} value={p.value} className="bg-white dark:bg-slate-900">{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vessel Class</label>
                  <select
                    value={newScenario.vesselClass}
                    onChange={(e) => setNewScenario({ ...newScenario, vesselClass: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    {VESSEL_CLASSES.map((v) => (
                      <option key={v.value} value={v.value} className="bg-white dark:bg-slate-900">{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contract Type</label>
                  <select
                    value={newScenario.contractType}
                    onChange={(e) => setNewScenario({ ...newScenario, contractType: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Spot Voyage" className="bg-white dark:bg-slate-900">Spot Voyage</option>
                    <option value="Time Charter" className="bg-white dark:bg-slate-900">Time Charter</option>
                    <option value="COA" className="bg-white dark:bg-slate-900">COA</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono transition-colors"
                >
                  Evaluate & Save Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPlannerPage;