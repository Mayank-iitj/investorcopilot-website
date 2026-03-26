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

function buildSignals(symbol: string) {
  const base = symbol.replace('.NS', '');
  const now = Date.now();
  return [
    { id: 1, stock: symbol, type: 'MOMENTUM', direction: 'BUY', strength: 0.91, rule: `${base} trend acceleration aligns across model windows.`, price: 2894.25, created_at: new Date(now - 1000 * 60 * 8).toISOString() },
    { id: 2, stock: symbol, type: 'PULLBACK', direction: 'SELL', strength: 0.63, rule: 'Short-term overextension detected near projected resistance.', price: 2912.8, created_at: new Date(now - 1000 * 60 * 22).toISOString() },
    { id: 3, stock: symbol, type: 'STRUCTURE', direction: 'BUY', strength: 0.84, rule: 'Higher-low structure remains intact with controlled volatility.', price: 2872.5, created_at: new Date(now - 1000 * 60 * 45).toISOString() },
  ];
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = decodeURIComponent(params.symbol as string);
  const displayName = symbol.replace('.NS', '');

  const [signals, setSignals] = useState<any[]>(buildSignals(symbol));
  const [backtestResults, setBacktestResults] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [backtesting, setBacktesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'signals' | 'backtest' | 'recommendation'>('signals');

  useEffect(() => {
    setSignals(buildSignals(symbol));
    setBacktestResults([]);
  }, [symbol]);

  async function handleScan() {
    setScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSignals(buildSignals(symbol));
    setScanning(false);
  }

  async function handleBacktest() {
    setBacktesting(true);
    const results: any[] = [];
    await new Promise((resolve) => setTimeout(resolve, 700));
    for (const strategy of STRATEGIES) {
      const hash = strategy.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const totalTrades = 18 + (hash % 13);
      const winRate = 57 + (hash % 29);
      const winningTrades = Math.round((totalTrades * winRate) / 100);
      results.push({
        strategy,
        symbol,
        total_trades: totalTrades,
        winning_trades: winningTrades,
        win_rate: winRate,
        avg_return_pct: Number((1.2 + (hash % 33) / 10).toFixed(2)),
        max_drawdown_pct: Number((2.8 + (hash % 17) / 3).toFixed(2)),
        sharpe_ratio: Number((0.9 + (hash % 16) / 10).toFixed(2)),
      });
    }
    setBacktestResults(results);
    setActiveTab('backtest');
    setBacktesting(false);
  }

  const tabs = [
    { key: 'signals', label: 'Signals', count: signals.length, icon: Radar },
    { key: 'backtest', label: 'Backtest', count: backtestResults.length, icon: FlaskConical },
    { key: 'recommendation', label: 'AI Verdict', icon: Bot },
  ] as const;

  return (
    <div className="min-h-screen bg-[#05090f] pt-24 pb-12 px-6">
      <div className="fixed inset-0 bg-grid-pattern bg-dots opacity-20" />
      <div className="pointer-events-none fixed -top-24 left-1/2 h-80 w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/25 via-emerald-400/20 to-indigo-500/20 blur-3xl" />
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
