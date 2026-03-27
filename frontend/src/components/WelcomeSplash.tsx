'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function WelcomeSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#05090f]"
        >
          <div className="absolute inset-0 bg-grid-pattern bg-dots opacity-30" />
          <div className="pointer-events-none absolute -top-16 left-1/2 h-80 w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500/20 via-emerald-400/20 to-indigo-500/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 w-[92%] max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/70 backdrop-blur-xl p-6"
          >
            <div className="mx-auto w-44 h-44">
              <DotLottieReact src="/loading.lottie" autoplay loop />
            </div>
            <p className="text-center text-sm md:text-base text-slate-200 mt-2">
              This is an illustration , the actual software differs
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
