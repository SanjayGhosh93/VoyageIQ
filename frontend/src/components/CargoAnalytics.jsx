// frontend/src/components/CargoAnalytics.jsx
import React, { useEffect, useState, useMemo } from 'react';

export function CargoAnalytics() {
  const [cargoData, setCargoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/market/cargo')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load dataset');
        return res.json();
      })
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          setCargoData(resData.data);
        } else if (Array.isArray(resData)) {
          setCargoData(resData);
        } else {
          setCargoData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter with defensive null/undefined checks
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return cargoData;
    const term = searchTerm.toLowerCase();

    return cargoData.filter((row) => {
      const itemMatch = row?.item ? String(row.item).toLowerCase().includes(term) : false;
      const yearMatch = row?.year ? String(row.year).includes(term) : false;
      return itemMatch || yearMatch;
    });
  }, [cargoData, searchTerm]);

  // Recalculate summary metrics dynamically based on filtered subset
  const totalVolume = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (Number(curr?.total) || Number(curr?.volume_mt) || 0), 0);
  }, [filteredData]);

  const totalBulkCarrier = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + (Number(curr?.dry_cargo_bulk_carrier) || Number(curr?.volume_mt) || 0), 0);
  }, [filteredData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <span className="animate-pulse font-medium">Loading Maritime Cargo Dataset...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-mono">
        Error loading MySQL dataset: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-sky-400">Maritime Cargo Movement Dataset</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Source: MySQL Local DB (`cargo_dataset` table)</p>
        </div>
        <input
          type="text"
          placeholder="Filter by year or item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 transition-colors w-full md:w-64"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Filtered Records</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{filteredData.length} Rows</p>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Aggregate Cargo Handled</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{totalVolume.toLocaleString()} MT</p>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Dry Cargo Bulk Total</p>
          <p className="text-2xl font-bold text-sky-400 font-mono mt-1">{totalBulkCarrier.toLocaleString()} MT</p>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto max-h-[520px] rounded-xl border border-slate-800 shadow-inner">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
            <tr>
              <th className="p-3">Year</th>
              <th className="p-3">Item / Cargo Type</th>
              <th className="p-3 text-right">Dry Bulk Carrier / Volume</th>
              <th className="p-3 text-right">Oil Tanker</th>
              <th className="p-3 text-right">Off-shore Supply</th>
              <th className="p-3 text-right font-bold text-sky-400">Total Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50 font-mono">
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-sky-400">{row.year ?? '-'}</td>
                  <td className="p-3 text-slate-200 font-sans font-medium">{row.item || row.cargo_type || 'N/A'}</td>
                  <td className="p-3 text-right text-slate-300">{(Number(row.dry_cargo_bulk_carrier) || Number(row.volume_mt) || 0).toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-300">{(Number(row.oil_tanker) || 0).toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-300">{(Number(row.off_shore_supply) || 0).toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-white">{(Number(row.total) || Number(row.volume_mt) || 0).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500 font-mono">
                  No matching cargo records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}