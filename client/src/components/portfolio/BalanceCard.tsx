'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { portfolio, user } from '@/data/mockData';
import { ChartPie, CaretDown, Check } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';

interface Props {
  onAnalyticsOpen: () => void;
}

export default function BalanceCard({ onAnalyticsOpen }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState(user.contract);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const accounts = [
    { id: user.contract, name: 'Брокерский счет', value: 64096.32 },
    { id: 'IIS-99120', name: 'ИИС', value: 125000.00 },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      className="rounded-2xl p-6"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          На всех счетах: {fmt(portfolio.allAccountsValue)} ₽
        </span>
      </div>

      {/* Portfolio Switcher */}
      <div className="relative mb-2" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 group"
        >
          <span className="text-sm font-semibold transition-colors group-hover:text-[var(--text-primary)]" style={{ color: 'var(--text-secondary)' }}>
            {accounts.find(a => a.id === activeAccount)?.name || 'Брокерский счет'} · {activeAccount}
          </span>
          <CaretDown size={14} weight="bold" className="transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', color: 'var(--text-tertiary)' }} />
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-64 rounded-xl shadow-lg border z-50 overflow-hidden"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              {accounts.map(acc => (
                <div
                  key={acc.id}
                  onClick={() => { setActiveAccount(acc.id); setDropdownOpen(false); }}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{acc.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{acc.id}</p>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>{fmt(acc.value)} ₽</span>
                     {activeAccount === acc.id && <Check size={14} weight="bold" className="text-accent mt-0.5" />}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.p
        className="text-3xl font-bold font-mono mb-2"
        style={{ color: 'var(--text-primary)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        {fmt(portfolio.totalValue)} ₽
      </motion.p>

      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-sm font-mono"
          style={{ color: portfolio.dailyPnL < 0 ? 'var(--danger)' : 'var(--accent)' }}
        >
          {portfolio.dailyPnL < 0 ? '↓' : '↑'} {fmt(Math.abs(portfolio.dailyPnL))} ₽ ({Math.abs(portfolio.dailyPnLPercent).toFixed(2)}%)
        </span>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>за сегодня</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full cursor-pointer"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
        >
          за всё время
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAnalyticsOpen}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
      >
        <ChartPie size={16} weight="fill" className="text-accent" />
        Аналитика
      </motion.button>
    </motion.div>
  );
}
