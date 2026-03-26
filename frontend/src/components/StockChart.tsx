'use client';

import { useEffect, useRef, useState } from 'react';

interface StockChartProps {
  symbol: string;
  height?: number;
}

function generateSeries(symbol: string, points = 90) {
  const seed = symbol.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  let price = 1200 + (seed % 900);
  const data: Array<{ time: string; open: number; high: number; low: number; close: number }> = [];
  const volume: Array<{ time: string; value: number; color: string }> = [];

  for (let i = points; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const time = d.toISOString().slice(0, 10);
    const drift = Math.sin((seed + i) / 8) * 5;
    const noise = ((seed * (i + 3)) % 17) - 8;
    const open = price;
    const close = Math.max(100, open + drift + noise * 0.8);
    const high = Math.max(open, close) + 8 + (i % 4);
    const low = Math.min(open, close) - 8 - (i % 3);
    price = close;

    data.push({
      time,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
    });
    volume.push({
      time,
      value: 18000 + ((seed + i * 41) % 42000),
      color: close >= open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    });
  }

  return { data, volume };
}

export default function StockChart({ symbol, height = 420 }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current) return;
      setLoading(true);
      setError(null);

      try {
        const { createChart, ColorType, CrosshairMode } = await import('lightweight-charts');

        const { data: chartData, volume: volumeData } = generateSeries(symbol);

        if (cancelled) return;

        // Clear previous chart
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }

        const chart = createChart(containerRef.current, {
          width: containerRef.current.clientWidth,
          height,
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#94a3b8',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 11,
          },
          grid: {
            vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
            horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: { color: 'rgba(99, 102, 241, 0.3)', width: 1, style: 2 },
            horzLine: { color: 'rgba(99, 102, 241, 0.3)', width: 1, style: 2 },
          },
          rightPriceScale: {
            borderColor: 'rgba(255, 255, 255, 0.06)',
            scaleMargins: { top: 0.1, bottom: 0.2 },
          },
          timeScale: {
            borderColor: 'rgba(255, 255, 255, 0.06)',
            timeVisible: false,
          },
        });

        chartRef.current = chart;

        if (chartData.length > 0) {
          const candleSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#10b981',
            wickDownColor: '#ef4444',
            wickUpColor: '#10b981',
          });
          candleSeries.setData(chartData);

          const volumeSeries = chart.addHistogramSeries({
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
          });
          chart.priceScale('volume').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
          });
          volumeSeries.setData(volumeData);

          const n = chartData.length;
          candleSeries.setMarkers([
            { time: chartData[n - 28].time, position: 'belowBar', color: '#10b981', shape: 'arrowUp', text: 'Momentum' },
            { time: chartData[n - 17].time, position: 'aboveBar', color: '#ef4444', shape: 'arrowDown', text: 'Pullback' },
            { time: chartData[n - 8].time, position: 'belowBar', color: '#22d3ee', shape: 'circle', text: 'AI Zone' },
          ]);

          chart.timeScale().fitContent();
        } else {
          setError('No chart data available.');
        }

        // Resize observer
        const ro = new ResizeObserver(() => {
          if (containerRef.current && chartRef.current) {
            chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
          }
        });
        ro.observe(containerRef.current);

        setLoading(false);

        return () => {
          cancelled = true;
          ro.disconnect();
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
        };
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [symbol, height]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/5 bg-white/[0.01]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0a0e1a]/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm text-slate-400">Rendering motion chart...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      )}
      <div ref={containerRef} style={{ height }} />
    </div>
  );
}
