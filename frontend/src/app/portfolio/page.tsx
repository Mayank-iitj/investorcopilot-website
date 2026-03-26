'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Hexagon, TrendingUp, Shield, PieChart as PieChartIcon, Plus, Upload, X, BarChart3, FlaskConical } from 'lucide-react';

interface Holding { symbol: string; quantity: number; avg_buy_price: number; buy_date: string; sector?: string; }

const SAMPLE_HOLDINGS: Holding[] = [
  { symbol: 'RELIANCE.NS', quantity: 20, avg_buy_price: 2450, buy_date: '2024-06-15', sector: 'Energy' },
  { symbol: 'TCS.NS', quantity: 15, avg_buy_price: 3800, buy_date: '2024-03-10', sector: 'IT' },
  { symbol: 'HDFCBANK.NS', quantity: 30, avg_buy_price: 1550, buy_date: '2024-01-20', sector: 'Banking' },
  { symbol: 'INFY.NS', quantity: 25, avg_buy_price: 1450, buy_date: '2024-05-05', sector: 'IT' },
  { symbol: 'ITC.NS', quantity: 100, avg_buy_price: 430, buy_date: '2024-02-18', sector: 'FMCG' },
];

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formSymbol, setFormSymbol] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDate, setFormDate] = useState('');

  useEffect(() => { loadPortfolio(); }, []);

  async function loadPortfolio() {
    try { const res = await fetch('/api/portfolio/1'); const data = await res.json(); if (data.holdings?.length > 0) { setHoldings(data.holdings); setPortfolioId(data.id); } } catch {}
  }

  async function savePortfolio(h: Holding[]) {
    setLoading(true);
    try { const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(h) }); const data = await res.json(); setPortfolioId(data.portfolio_id); setHoldings(h); } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function runAnalysis() {
    if (!portfolioId) return; setAnalyzing(true);
    try { const res = await fetch(`/api/portfolio-analysis?portfolio_id=${portfolioId}`); setAnalysis(await res.json()); } catch (e) { console.error(e); }
    setAnalyzing(false);
  }

  function addHolding() {
    if (!formSymbol || !formQty || !formPrice) return;
    const sym = formSymbol.toUpperCase().includes('.NS') ? formSymbol.toUpperCase() : `${formSymbol.toUpperCase()}.NS`;
    const newH = [...holdings, { symbol: sym, quantity: parseInt(formQty), avg_buy_price: parseFloat(formPrice), buy_date: formDate || new Date().toISOString().split('T')[0] }];
    setHoldings(newH); setFormSymbol(''); setFormQty(''); setFormPrice(''); setFormDate(''); setShowForm(false); savePortfolio(newH);
  }

  function removeHolding(idx: number) { const u = holdings.filter((_, i) => i !== idx); setHoldings(u); if (u.length > 0) savePortfolio(u); }

  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return; setLoading(true);
    try { const fd = new FormData(); fd.append('file', file); const res = await fetch('/api/portfolio/upload-csv?name=Default', { method: 'POST', body: fd }); const data = await res.json(); if (data.holdings) { setHoldings(data.holdings); setPortfolioId(data.portfolio_id); } } catch (e) { console.error(e); }
    setLoading(false);
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);
  const sectorMap: Record<string, number> = {};
  for (const h of holdings) { const s = h.sector || 'Unknown'; sectorMap[s] = (sectorMap[s] || 0) + h.quantity * h.avg_buy_price; }
  const sectorData = Object.entries(sectorMap).map(([name, val]) => ({ name, value: totalInvested > 0 ? (val / totalInvested) * 100 : 0 }));

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-12 px-6">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <PieChartIcon className="w-8 h-8 text-cyan-400" />
              Portfolio
            </h1>
            <p className="mt-1 text-slate-400">Manage holdings, track allocation, and measure risk</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Holding
            </button>
            <button onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
            {holdings.length === 0 && <button onClick={() => savePortfolio(SAMPLE_HOLDINGS)} className="btn-secondary">Load Sample</button>}
          </div>
        </motion.div>

        {/* Add Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <h3 className="text-sm font-semibold mb-3 text-white">Add Holding</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Symbol</label>
                <input value={formSymbol} onChange={(e) => setFormSymbol(e.target.value)} placeholder="RELIANCE" className="input-field" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Quantity</label>
                <input type="number" value={formQty} onChange={(e) => setFormQty(e.target.value)} placeholder="10" className="input-field" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Avg Buy Price</label>
                <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="2500" className="input-field" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Buy Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="input-field" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={addHolding} className="btn-primary flex-1">Add</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary"><X className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Holdings Table */}
        {holdings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card !p-0 overflow-hidden"
          >
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Holdings <span className="text-sm font-normal ml-2 text-slate-400">{holdings.length} stocks</span>
              </h3>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Total Invested</p>
                <p className="text-lg font-bold font-mono text-white">₹{totalInvested.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="table-header">Stock</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Avg Price</th>
                    <th className="table-header">Invested</th>
                    <th className="table-header">Buy Date</th>
                    <th className="table-header">Sector</th>
                    <th className="table-header w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="table-cell"><Link href={`/stock/${h.symbol}`} className="font-semibold text-cyan-400 hover:underline">{h.symbol.replace('.NS', '')}</Link></td>
                      <td className="table-cell font-mono text-white">{h.quantity}</td>
                      <td className="table-cell font-mono text-white">₹{h.avg_buy_price.toLocaleString('en-IN')}</td>
                      <td className="table-cell font-mono font-medium text-white">₹{(h.quantity * h.avg_buy_price).toLocaleString('en-IN')}</td>
                      <td className="table-cell text-xs text-slate-400">{h.buy_date || '—'}</td>
                      <td className="table-cell"><span className="px-2 py-0.5 rounded-full text-xs bg-cyan-500/20 text-cyan-400">{h.sector || 'Unknown'}</span></td>
                      <td className="table-cell"><button onClick={() => removeHolding(i)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all text-sm">✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics */}
        {holdings.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" /> Portfolio Analytics
              </h2>
              <button onClick={runAnalysis} disabled={analyzing || !portfolioId} className="btn-primary disabled:opacity-50 flex items-center gap-2">
                {analyzing ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" /> Analyzing...</> : <><FlaskConical className="w-4 h-4" /> Run Full Analysis</>}
              </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Sector Allocation</h3>
                <div className="space-y-4">
                  {sectorData.map((sector, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">{sector.name}</span>
                        <span className="text-sm font-mono text-cyan-400">{sector.value.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sector.value}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" /> Risk Metrics
                </h3>
                {analysis ? (
                  <div className="grid grid-cols-2 gap-4">
                    {analysis.xirr !== undefined && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">XIRR</p>
                        <p className={`text-2xl font-bold font-mono ${analysis.xirr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{(analysis.xirr * 100).toFixed(2)}%</p>
                      </div>
                    )}
                    {analysis.portfolio_volatility !== undefined && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">Volatility</p>
                        <p className="text-2xl font-bold font-mono text-amber-400">{(analysis.portfolio_volatility * 100).toFixed(2)}%</p>
                      </div>
                    )}
                    {analysis.portfolio_beta !== undefined && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">Beta</p>
                        <p className={`text-2xl font-bold font-mono ${analysis.portfolio_beta > 1 ? 'text-red-400' : 'text-emerald-400'}`}>{analysis.portfolio_beta.toFixed(3)}</p>
                      </div>
                    )}
                    {analysis.risk_concentration && (
                      <div className="p-4 rounded-xl bg-slate-800/50">
                        <p className="text-[10px] uppercase tracking-wider mb-1 text-slate-400">Concentration</p>
                        <p className={`text-2xl font-bold font-mono ${analysis.risk_concentration === 'HIGH' ? 'text-red-400' : analysis.risk_concentration === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>{analysis.risk_concentration}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10"><p className="text-sm text-slate-400">Click "Run Full Analysis" to compute risk metrics.</p></div>
                )}
              </motion.div>
            </div>
          </>
        )}

        {/* Empty State */}
        {holdings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No Portfolio Yet</h2>
            <p className="mb-6 max-w-md mx-auto text-slate-400">Add holdings manually, upload a CSV, or load a sample portfolio.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Holdings
              </button>
              <button onClick={() => savePortfolio(SAMPLE_HOLDINGS)} className="btn-secondary">Load Sample</button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}