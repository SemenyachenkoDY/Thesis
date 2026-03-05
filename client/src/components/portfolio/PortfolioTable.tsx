'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { stocks } from '@/data/mockData';
import { MagnifyingGlass } from '@phosphor-icons/react';

const assetFilters = ['Все активы', 'Акции', 'Облигации', 'Фьючерсы', 'Валюты и металлы', 'Фонды', 'Опционы'];
const subTabs = ['Мой портфель', 'События', 'Заявки'];

export default function PortfolioTable() {
  const [activeFilter, setActiveFilter] = useState('Все активы');
  const [activeSubTab, setActiveSubTab] = useState('Мой портфель');
  const [search, setSearch] = useState('');

  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filtered = stocks.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8"
    >
      {/* Sub-tabs */}
      <div className="flex items-center gap-6 mb-6">
        {subTabs.map(tab => (
          <motion.button
            key={tab}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSubTab(tab)}
            className="text-xl font-semibold transition-colors"
            style={{ color: activeSubTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Currency Balances */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[ { flag: '🇷🇺', label: 'Рубли', amount: '26 625,78 ₽' }, { flag: '🇨🇳', label: 'Китайский юань', amount: '639,58 ¥' } ].map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            <span className="text-xl">{c.flag}</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.amount}</span>
          </div>
        ))}
      </div>

      {/* Filter Pills + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {assetFilters.map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                background: activeFilter === f ? 'var(--bg-tertiary)' : 'transparent',
                color: activeFilter === f ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {f}
            </motion.button>
          ))}
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full md:w-64"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <MagnifyingGlass size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Table Header */}
      <div className="text-xs font-medium uppercase grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-2 mb-1"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <span>Название ↑</span>
        <span className="text-right">Количество ↑</span>
        <span className="text-right">Цена покупки ↑</span>
        <span className="text-right">Текущая цена ↑</span>
        <span className="text-right">Стоимость ↑</span>
        <span className="text-right">Прибыль/Убыток ↑</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1">
        {filtered.map((stock, i) => (
          <motion.div
            key={stock.ticker}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * i + 0.5, type: 'spring', stiffness: 120, damping: 20 }}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 rounded-xl items-center transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer"
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: stock.color }}
              >
                {stock.ticker.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{stock.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stock.ticker}</p>
              </div>
            </div>
            <span className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
              {stock.qty.toLocaleString('ru-RU')}
            </span>
            <span className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
              {fmt(stock.buyPrice)} ₽
            </span>
            <span className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
              {fmt(stock.currentPrice)} ₽
            </span>
            <span className="text-right font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
              {fmt(stock.value)} ₽
            </span>
            <span
              className="text-right font-mono text-sm"
              style={{ color: stock.pnl >= 0 ? 'var(--accent)' : 'var(--danger)' }}
            >
              {stock.pnl >= 0 ? '↑' : '↓'} {fmt(Math.abs(stock.pnl))} ₽ ({Math.abs(stock.pnlPercent).toFixed(2)}%)
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
