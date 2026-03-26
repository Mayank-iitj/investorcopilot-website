'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Radar, FlaskConical, Bot, Search, BarChart3 } from 'lucide-react';
import StockChart from '@/components/StockChart';
import SignalCard from '@/components/SignalCard';
import BacktestTable from '@/components/BacktestTable';
import RecommendationPanel from '@/components/RecommendationPanel';

const STRATEGIES = ['ma_crossover', 'rsi', 'macd', 'breakout', 'volume_spike'];

export default function StockDetailPage() {
  const params = useParams();
  const symbol = decodeURIComponent(params.symbol as string);
  const displayName = symbol.replace('.NS', '');

  const [signals, setSignals] = useState<any[]>([]);
  const [backtestResults, setBacktestResults] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [backtesting, setBacktesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'signals' | 'backtest' | 'recommendation'>('signals');

  useEffect(() => { fetchSignals(); }, [symbol]);

  async function fetchSignals() {
    try {
      const res = await fetch(`/api/signals?symbol=${symbol}`);
      const data = await res.json();
      setSignals(data.signals || []);
    } catch (e) { console.error(e); }
  }

  async function handleScan() {
    setScanning(true);
    try { await fetch(`/api/signals/scan?symbol=${symbol}`, { method: 'POST' }); await fetchSignals(); } catch (e) { console.error(e); }
    setScanning(false);
  }

  async function handleBacktest() {
    setBacktesting(true);
    const results: any[] = [];
    try {
      for (const strategy of STRATEGIES) {
        const res = await fetch(`/api/backtest/run?strategy=${strategy}&symbol=${symbol}&years=2&hold_days=10`, { method: 'POST' });
        const data = await res.json();
        if (data.strategy_name) {
          results.push({ strategy: data.strategy_name, symbol: data.symbol, total_trades: data.total_trades, winning_trades: data.winning_trades, win_rate: data.win_rate_pct, avg_return_pct: data.avg_return_pct, max_drawdown_pct: data.max_drawdown_pct, sharpe_ratio: data.sharpe_ratio });
        }
      }
      setBacktestResults(results); setActiveTab('backtest');
    } catch (e) { console.error(e); }
    setBacktesting(false);
  }

  const tabs = [
    { key: 'signals', label: 'Signals', count: signals.length, icon: Radar },
    { key: 'backtest', label: 'Backtest', count: backtestResults.length, icon: FlaskConical },
    { key: 'recommendation', label: 'AI Verdict', icon: Bot },
  ] as const;

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-12 px-6">
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span>Stock</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{displayName}</h1>
            <p className="text-sm font-mono mt-0.5 text-slate-400">{symbol}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleScan} disabled={scanning} className="btn-primary disabled:opacity-50 flex items-center gap-2">
              {scanning ? <><div className="w-4 h-4 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" /> Scanning...</> : <><Search className="w-4 h-4" /> Scan Signals</>}
            </button>
            <button onClick={handleBacktest} disabled={backtesting} className="btn-secondary disabled:opacity-50 flex items-center gap-2">
              {backtesting ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" /> Running...</> : <><BarChart3 className="w-4 h-4" /> Run Backtests</>}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card !p-2"
        >
          <StockChart symbol={symbol} height={440} />
        </motion.div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all border flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-cyan-500 text-slate-900 border-cyan-400'
                  : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {'count' in tab && tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.key ? 'bg-slate-900/20 text-slate-900' : 'bg-cyan-500/15 text-cyan-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'signals' && (
            signals.length === 0 ? (
              <div className="glass-card text-center py-12">
                <p className="text-3xl mb-2">📡</p>
                <p className="text-slate-400">No signals detected yet. Click "Scan Signals" to analyze this stock.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {signals.map((sig) => (
                  <SignalCard key={sig.id} stock={sig.stock} type={sig.type} direction={sig.direction} strength={sig.strength} rule={sig.rule} price={sig.price} created_at={sig.created_at} />
                ))}
              </div>
            )
          )}
          {activeTab === 'backtest' && <BacktestTable results={backtestResults} title={`Backtest Results - ${displayName}`} />}
          {activeTab === 'recommendation' && <RecommendationPanel symbol={symbol} />}
        </div>
      </div>
    </div>
  );
}
