import type { Metadata } from 'next';
import './globals.css';
import InternalTopNav from '@/components/InternalTopNav';
import RouteTransition from '@/components/RouteTransition';
import WelcomeSplash from '@/components/WelcomeSplash';

export const metadata: Metadata = {
  title: 'InvestorCopilot — AI Trading Intelligence',
  description: 'Production-grade AI fintech platform with real signals, backtesting, and portfolio analytics.',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#05090f] text-white antialiased">
        <WelcomeSplash />
        <InternalTopNav />
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}