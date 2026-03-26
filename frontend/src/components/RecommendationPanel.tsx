'use client';

import { useState, useEffect } from 'react';
import { Bot, RefreshCcw } from 'lucide-react';

interface RecommendationPanelProps {
  symbol: string;
  portfolioId?: number;
}

interface Recommendation {
  symbol: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string[];
  active_signals: number;
  backtested_strategies: number;
}

export default function RecommendationPanel({ symbol, portfolioId }: RecommendationPanelProps) {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecommendation() {
    setLoading(true); setError(null);
    try {
      const url = `/api/recommendation/${symbol}${portfolioId ? `?portfolio_id=${portfolioId}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.error) setError(data.error); else setRec(data);
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  useEffect(() => { fetchRecommendation(); }, [symbol, portfolioId]);

  const actionConfig = {
    BUY: { bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80', gradient: 'linear-gradient(135deg, #22c55e, #4ade80)', icon: '📈' },
    SELL: { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171', gradient: 'linear-gradient(135deg, #ef4444, #f87171)', icon: '📉' },
    HOLD: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', icon: '⏸️' },
  };

  if (loading) {
    return (
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /> AI Recommendation</h3>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 rounded-full animate-spin border-cyan-500/20 border-t-cyan-400" />
            <span className="text-sm text-slate-400">Analyzing {symbol.replace('.NS', '')}...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !rec) {
    return (
      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /> AI Recommendation</h3>
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">{error || 'Scan the stock first to generate a recommendation.'}</p>
          <button onClick={fetchRecommendation} className="btn-primary mt-4 text-sm inline-flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const config = actionConfig[rec.action] || actionConfig.HOLD;
  const confidencePct = Math.round(rec.confidence * 100);

  return (
    <div className="glass-card relative overflow-hidden">
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Bot className="w-5 h-5 text-cyan-400" /> AI Recommendation</h3>
          <button onClick={fetchRecommendation} className="text-xs hover:underline text-slate-400 hover:text-white inline-flex items-center gap-1">
            <RefreshCcw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
               style={{ background: config.bg, border: `1px solid ${config.border}` }}>
            {config.icon}
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: config.text }}>{rec.action}</p>
            <p className="text-xs mt-0.5 text-slate-500">
              {rec.active_signals} signals · {rec.backtested_strategies} strategies
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-slate-500">Confidence</span>
            <span className="text-sm font-mono font-bold" style={{ color: config.text }}>{confidencePct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-slate-700/80">
            <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${confidencePct}%`, background: config.gradient }} />
          </div>
        </div>

        {rec.reasoning?.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wider mb-3 text-slate-500">Reasoning Chain</p>
            <div className="space-y-2">
              {rec.reasoning.map((reason, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                       style={{ background: config.bg, color: config.text, border: `1px solid ${config.border}` }}>
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
