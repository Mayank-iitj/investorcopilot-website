'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, Search, FileText, Sparkles, ScanLine } from 'lucide-react';
import AlertPanel from '@/components/AlertPanel';

const DEMO_AUDIT = [
  { id: 1, action: 'SIGNAL', stock: 'RELIANCE.NS', timestamp: '2026-03-26T09:30:00.000Z', output: { direction: 'BUY', confidence: 0.91 }, logic: 'Breakout continuation with rising participation.' },
  { id: 2, action: 'RECOMMENDATION', stock: 'INFY.NS', timestamp: '2026-03-26T09:52:00.000Z', output: { action: 'HOLD', confidence: 0.82 }, logic: 'Balanced regime with mixed directional drivers.' },
  { id: 3, action: 'BACKTEST', stock: 'TCS.NS', timestamp: '2026-03-26T10:04:00.000Z', output: { action: 'BUY', confidence: 0.87 }, logic: 'Synthetic strategy profile indicates stable edge.' },
  { id: 4, action: 'PORTFOLIO', stock: 'HDFCBANK.NS', timestamp: '2026-03-26T10:20:00.000Z', output: { direction: 'SELL', confidence: 0.68 }, logic: 'Risk concentration threshold exceeded.' },
  { id: 5, action: 'SIGNAL', stock: 'BAJFINANCE.NS', timestamp: '2026-03-26T10:40:00.000Z', output: { direction: 'BUY', confidence: 0.89 }, logic: 'Volatility compression resolved to the upside.' },
];

export default function AlertsPage() {
  const [auditLogs] = useState<any[]>(DEMO_AUDIT);
  const [filterType, setFilterType] = useState<string>('');
  const [filterSymbol, setFilterSymbol] = useState<string>('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const typeOk = filterType ? log.action === filterType : true;
      const symbolOk = filterSymbol ? log.stock.toLowerCase().includes(filterSymbol.toLowerCase()) : true;
      return typeOk && symbolOk;
    });
  }, [auditLogs, filterType, filterSymbol]);

  return (
    <div className="min-h-screen bg-[#05090f] pt-24 pb-12 px-6">
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-20" />
      <div className="pointer-events-none fixed -top-24 left-1/2 h-80 w-[55rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-indigo-500/20 blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8 text-cyan-400" />
            Event Canvas
          </h1>
          <p className="mt-1 text-slate-400">Illustrative signal stream and decision timeline for InvestorCopilot demos</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2" style={{ minHeight: 600 }}>
            <AlertPanel maxAlerts={100} showHistorical={false} />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card !p-4"
            >
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[150px]">
                  <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Action Type</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field">
                    <option value="">All Types</option>
                    <option value="SIGNAL">Signals</option>
                    <option value="RECOMMENDATION">Recommendations</option>
                    <option value="BACKTEST">Backtests</option>
                    <option value="PORTFOLIO">Portfolio</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="text-[10px] uppercase tracking-wider mb-1 block text-slate-400">Stock Symbol</label>
                  <input value={filterSymbol} onChange={(e) => setFilterSymbol(e.target.value)} placeholder="e.g. RELIANCE.NS" className="input-field" />
                </div>
                <div className="btn-secondary flex items-center gap-2 select-none"><Search className="w-4 h-4" /> Filtered View</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-300 text-sm"><Sparkles className="w-4 h-4" /> Motion Demo Mode Enabled</div>
              <div className="flex items-center gap-2 text-slate-400 text-xs"><ScanLine className="w-4 h-4" /> No backend calls</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card !p-0 overflow-hidden"
            >
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" /> Decision Timeline
                </h3>
                <span className="text-xs text-slate-400">{filteredLogs.length} entries</span>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-slate-800 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-400">No matching entries for this filter.</p>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredLogs.map((log, i) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-6 py-4 hover:bg-slate-800/50 transition-colors"
                      style={{ borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            log.action === 'SIGNAL' ? 'bg-cyan-500/20 text-cyan-400'
                            : log.action === 'RECOMMENDATION' ? 'bg-violet-500/20 text-violet-400'
                            : log.action === 'BACKTEST' ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                          }`}>{log.action}</span>
                          {log.stock && <Link href={`/stock/${log.stock}`} className="text-sm font-semibold text-cyan-400 hover:underline">{log.stock.replace('.NS', '')}</Link>}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {log.output && (
                        <div className="text-sm text-slate-300">
                          {typeof log.output === 'string' ? <p>{log.output}</p> : (
                            <div className="flex flex-wrap gap-3 text-xs">
                              {log.output.direction && <span className={log.output.direction === 'BUY' ? 'badge-buy' : log.output.direction === 'SELL' ? 'badge-sell' : 'badge-hold'}>{log.output.direction}</span>}
                              {log.output.action && <span className={log.output.action === 'BUY' ? 'badge-buy' : log.output.action === 'SELL' ? 'badge-sell' : 'badge-hold'}>{log.output.action}</span>}
                              {log.output.confidence !== undefined && <span className="text-slate-400">Confidence: {(log.output.confidence * 100).toFixed(0)}%</span>}
                            </div>
                          )}
                        </div>
                      )}
                      {log.logic && <p className="text-xs mt-1 truncate text-slate-500">{log.logic}</p>}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}