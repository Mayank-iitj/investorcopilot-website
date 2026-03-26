'use client';

import Link from 'next/link';

interface SignalProps {
  id?: number;
  stock: string;
  type: string;
  direction: 'BUY' | 'SELL';
  strength: number | null;
  rule: string;
  price: number | null;
  created_at: string;
  compact?: boolean;
}

export default function SignalCard({
  stock, type, direction, strength, rule, price, created_at, compact = false,
}: SignalProps) {
  const isBuy = direction === 'BUY';

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
        isBuy ? 'signal-buy' : 'signal-sell'
      } ${compact ? '!p-3' : ''}`}
      style={{ borderColor: 'rgba(148, 163, 184, 0.14)' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Link
            href={`/stock/${stock}`}
            className="font-semibold hover:underline transition-colors text-white"
          >
            {stock.replace('.NS', '')}
          </Link>
          <span className={isBuy ? 'badge-buy' : 'badge-sell'}>{direction}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
            {type.replace(/_/g, ' ')}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {new Date(created_at).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      </div>

      {strength !== null && strength !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider w-14 text-slate-500">Strength</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-700/80">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(Math.abs(strength) * 100, 100)}%`,
                background: isBuy
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
            />
          </div>
          <span className="text-xs font-mono w-10 text-right text-slate-300">
            {(strength * 100).toFixed(0)}%
          </span>
        </div>
      )}

      <p className="text-sm mt-2 leading-relaxed text-slate-300">{rule}</p>

      {price && (
        <p className="text-xs font-mono mt-1.5 text-slate-500">
          Price: ₹{price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
}
