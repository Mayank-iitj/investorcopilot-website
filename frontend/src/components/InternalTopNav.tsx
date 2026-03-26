'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, CandlestickChart, Github, LayoutDashboard, Menu, PieChart, Sparkles, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/features', label: 'Features', icon: Sparkles },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/portfolio', label: 'Portfolio', icon: PieChart },
  { href: '/stock/RELIANCE.NS', label: 'Stock', icon: CandlestickChart },
];

function isInternalPath(pathname: string): boolean {
  return pathname.startsWith('/features') || pathname.startsWith('/alerts') || pathname.startsWith('/portfolio') || pathname.startsWith('/stock');
}

export default function InternalTopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!isInternalPath(pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-1 bg-gradient-to-br from-cyan-500/70 to-emerald-400/70 rounded-xl">
            <img src="/favicon.jpg" alt="InvestorCopilot" className="w-7 h-7 rounded-lg object-cover" />
          </div>
          <span className="text-base font-semibold text-white">InvestorCopilot</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href.replace('/RELIANCE.NS', ''));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm border transition-all duration-300 ease-out flex items-center gap-2 ${
                  active
                    ? 'bg-cyan-500 text-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900/70 text-slate-300 border-slate-700 hover:border-cyan-500/60 hover:text-cyan-300 hover:bg-slate-800/80'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://github.com/Mayank-iitj/investorcopilot.git"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg text-sm border bg-slate-900/70 text-slate-300 border-slate-700 hover:border-cyan-500/40 hover:text-white transition-all flex items-center gap-2"
            aria-label="Open InvestorCopilot repository"
          >
            <img src="/favicon.jpg" alt="InvestorCopilot icon" className="w-4 h-4 rounded object-cover" />
            <Github className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg border border-slate-700 text-slate-300"
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800 px-6 py-3 flex flex-col gap-2 bg-slate-950/95">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800/70 flex items-center gap-2"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/Mayank-iitj/investorcopilot.git"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800/70 flex items-center gap-2"
          >
            <img src="/favicon.jpg" alt="InvestorCopilot icon" className="w-4 h-4 rounded object-cover" />
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}