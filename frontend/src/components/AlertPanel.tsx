'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellRing } from 'lucide-react';

interface Alert {
  id: string;
  stock: string;
  type: string;
  direction: string;
  rule: string;
  price?: number;
  timestamp: string;
}

interface AlertPanelProps {
  maxAlerts?: number;
  showHistorical?: boolean;
}

export default function AlertPanel({ maxAlerts = 50, showHistorical = true }: AlertPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  useEffect(() => {
    const baseline: Alert[] = [
      { id: 'b1', stock: 'RELIANCE.NS', type: 'BREAKOUT', direction: 'BUY', rule: 'Range expansion and trend continuation setup detected.', timestamp: new Date().toISOString() },
      { id: 'b2', stock: 'INFY.NS', type: 'MEAN_REVERT', direction: 'SELL', rule: 'Short-term overextension near resistance cluster.', timestamp: new Date(Date.now() - 120000).toISOString() },
      { id: 'b3', stock: 'TCS.NS', type: 'MOMENTUM', direction: 'BUY', rule: 'Momentum acceleration with stable volatility regime.', timestamp: new Date(Date.now() - 300000).toISOString() },
    ];
    setAlerts(baseline.slice(0, maxAlerts));

    const symbols = ['RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 'BAJFINANCE.NS'];
    const rules = [
      'Liquidity sweep complete, continuation structure intact.',
      'Support hold confirmed after intraday pullback.',
      'Adaptive model flags elevated trend confidence.',
      'Volatility compression suggests directional breakout.',
    ];
    const timer = setInterval(() => {
      const direction = Math.random() > 0.45 ? 'BUY' : 'SELL';
      const next: Alert = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        stock: symbols[Math.floor(Math.random() * symbols.length)],
        type: direction === 'BUY' ? 'MOMENTUM' : 'REVERSAL',
        direction,
        rule: rules[Math.floor(Math.random() * rules.length)],
        timestamp: new Date().toISOString(),
      };
      setAlerts((prev) => [next, ...prev].slice(0, maxAlerts));
    }, showHistorical ? 6000 : 8000);

    return () => clearInterval(timer);
  }, [maxAlerts, showHistorical]);

  const filtered = filter === 'ALL' ? alerts : alerts.filter((a) => a.direction === filter);

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><BellRing className="w-5 h-5 text-cyan-300" /> Signal Stream</h3>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse-glow' : 'bg-red-400'}`} />
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              {connected ? 'Simulated Live' : 'Paused'}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          {(['ALL', 'BUY', 'SELL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? 'text-white'
                  : ''
              }`}
              style={filter === f ? { background: '#0e7490', color: '#fff' } : { color: '#94a3b8' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-400">
              {connected ? 'Waiting for alerts...' : 'Connecting...'}
            </p>
          </div>
        ) : (
          filtered.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border transition-all hover:shadow-sm ${
                alert.direction === 'BUY' ? 'border-l-2 border-l-emerald-400' :
                alert.direction === 'SELL' ? 'border-l-2 border-l-red-400' : ''
              }`}
              style={{ borderColor: 'rgba(148,163,184,0.14)', background: 'rgba(15,23,42,0.45)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Link href={`/stock/${alert.stock}`} className="text-sm font-semibold hover:underline text-cyan-300">
                    {alert.stock.replace('.NS', '')}
                  </Link>
                  {alert.direction === 'BUY' && <span className="badge-buy text-[10px]">BUY</span>}
                  {alert.direction === 'SELL' && <span className="badge-sell text-[10px]">SELL</span>}
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(alert.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{alert.rule}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
