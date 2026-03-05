'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { currencies } from '@/data/mockData';
import { useEffect, useState } from 'react';

export default function CurrencyTicker() {
  const [liveCurrencies, setLiveCurrencies] = useState(currencies);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCurrencies(prev => prev.map(c => {
        // Randomly adjust price by small amount (+- 0.5% max)
        const fluctuation = (Math.random() - 0.5) * (c.rate * 0.005);
        const newRate = c.rate + fluctuation;
        const newChange = c.change + fluctuation;
        const isNowPositive = newChange >= 0;
        
        return {
          ...c,
          rate: Math.max(0.01, newRate), // Prevent negative rates
          change: newChange,
          isPositive: isNowPositive,
          changePercent: c.changePercent === undefined 
                         ? (newChange / (newRate - newChange)) * 100 
                         : c.changePercent + (fluctuation / newRate) * 100
        };
      }));
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtMinMax = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-4 mt-6 mb-6"
    >
      {liveCurrencies.map((c, i) => (
        <motion.div
          key={c.code}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i + 0.3, type: 'spring', stiffness: 150, damping: 20 }}
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl w-full sm:w-auto"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3 w-40">
            <span className="text-2xl drop-shadow-sm">{c.flag}</span>
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
              <span className="text-[11px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{c.code}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold min-w-16 text-right" style={{ color: 'var(--text-primary)' }}>
              <AnimatePresence mode='wait'>
                <motion.span
                  key={c.rate}
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                >
                  {fmtMinMax(c.rate)}₽
                </motion.span>
              </AnimatePresence>
            </span>
            <span
              className="font-mono text-xs font-semibold px-2 py-1 rounded bg-opacity-10 min-w-24 text-center"
              style={{ 
                color: c.isPositive ? 'var(--accent)' : 'var(--danger)',
                background: c.isPositive ? 'var(--accent-transparent)' : 'var(--danger-transparent)',
              }}
            >
              <AnimatePresence mode='wait'>
                <motion.span
                   key={c.change}
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  {c.isPositive ? '↑' : '↓'} {fmtMinMax(Math.abs(c.change))}
                  {c.changePercent ? ` (${c.changePercent.toFixed(2)}%)` : ''}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
