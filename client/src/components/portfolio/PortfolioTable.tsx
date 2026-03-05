'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { stocks, portfolioEvents, portfolioOrders } from '@/data/mockData';
import { MagnifyingGlass } from '@phosphor-icons/react';
import AssetModal from './modals/AssetModal';

const assetFilters = ['Все активы', 'Акции', 'Облигации', 'Фьючерсы', 'Валюты и металлы', 'Фонды', 'Опционы'];
const subTabs = ['Мой портфель', 'События', 'Заявки'];

export default function PortfolioTable() {
  const [activeFilter, setActiveFilter] = useState('Все активы');
  const [activeSubTab, setActiveSubTab] = useState('Мой портфель');
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  type SortKey = 'name' | 'qty' | 'buyPrice' | 'currentPrice' | 'value' | 'pnl';
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.ticker.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'Все активы' || s.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Group stocks by type if "Все активы" is selected, otherwise just use a single flat group
  const groupedStocks = activeFilter === 'Все активы'
    ? filteredStocks.reduce((acc, stock) => {
        if (!acc[stock.type]) acc[stock.type] = [];
        acc[stock.type].push(stock);
        return acc;
      }, {} as Record<string, typeof stocks>)
    : { [activeFilter]: filteredStocks };

  // Sort each group
  Object.keys(groupedStocks).forEach(group => {
    groupedStocks[group].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubTab === 'Мой портфель' && (
            <div>
              {/* Filter Pills + Search */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {assetFilters.map(f => (
                    <motion.button
                      key={f}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveFilter(f)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full md:w-64 transition-colors"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <MagnifyingGlass size={16} style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Поиск"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-sm placeholder:text-[var(--text-tertiary)]"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Grouped Rendering */}
              {Object.entries(groupedStocks).map(([groupName, groupStocks]) => {
                if (groupStocks.length === 0) return null;
                return (
                  <div key={groupName} className="mb-8">
                    {/* Header Name */}
                    {activeFilter === 'Все активы' && (
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        {groupName} <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{groupStocks.length}</span>
                      </h3>
                    )}
                    
                    {/* Table Header */}
                    <div className="text-[10px] font-semibold uppercase grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3 mb-1 select-none"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <span className="cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('name')}>Название {getSortIcon('name')}</span>
                      <span className="text-right cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('qty')}>Количество {getSortIcon('qty')}</span>
                      <span className="text-right cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('buyPrice')}>Цена покупки {getSortIcon('buyPrice')}</span>
                      <span className="text-right cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('currentPrice')}>Текущая цена {getSortIcon('currentPrice')}</span>
                      <span className="text-right cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('value')}>Стоимость {getSortIcon('value')}</span>
                      <span className="text-right cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('pnl')}>Прибыль/Убыток {getSortIcon('pnl')}</span>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col gap-1">
                      {groupStocks.map((stock, i) => (
                        <motion.div
                          key={stock.ticker}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * i, type: 'spring', stiffness: 120, damping: 20 }}
                          className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-3.5 rounded-xl items-center transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer"
                          whileHover={{ x: 4 }}
                          onClick={() => setSelectedAsset(stock)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 drop-shadow-sm"
                              style={{ background: stock.color }}
                            >
                              {stock.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>{stock.name}</p>
                              <p className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{stock.ticker}</p>
                            </div>
                          </div>
                          <span className="text-right font-mono text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {stock.qty.toLocaleString('ru-RU')}
                          </span>
                          <span className="text-right font-mono text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {fmt(stock.buyPrice)} ₽
                          </span>
                          <span className="text-right font-mono text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {fmt(stock.currentPrice)} ₽
                          </span>
                          <span className="text-right font-mono text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {fmt(stock.value)} ₽
                          </span>
                          <span
                            className="text-right font-mono text-[13px] font-bold"
                            style={{ color: stock.pnl >= 0 ? 'var(--accent)' : 'var(--danger)' }}
                          >
                            {stock.pnl >= 0 ? '↑' : '↓'} {fmt(Math.abs(stock.pnl))} ₽ ({Math.abs(stock.pnlPercent).toFixed(2)}%)
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeSubTab === 'События' && (
            <div className="space-y-6">
              {['Сегодня', 'Вчера'].map(dateGroup => {
                const groupEvents = portfolioEvents.filter(e => e.dateGroup === dateGroup);
                if (groupEvents.length === 0) return null;
                return (
                  <div key={dateGroup}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text-tertiary)' }}>{dateGroup}</h4>
                    <div className="flex flex-col gap-1">
                      {groupEvents.map(event => (
                        <div key={event.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-[var(--accent)]">
                               {event.ticker.slice(0, 2)}
                             </div>
                             <div>
                               <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                               <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{event.ticker}</p>
                             </div>
                          </div>
                          <span className="font-mono text-[13px] font-bold" style={{ color: event.isPositive === null ? 'var(--text-primary)' : event.isPositive ? 'var(--accent)' : 'var(--danger)' }}>
                            {event.value > 0 ? '+' : ''}{fmt(event.value)} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeSubTab === 'Заявки' && (
            <div className="space-y-6">
              {['Сегодня', 'Вчера'].map(dateGroup => {
                const groupOrders = portfolioOrders.filter(e => e.dateGroup === dateGroup);
                if (groupOrders.length === 0) return null;
                return (
                  <div key={dateGroup}>
                    <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--text-tertiary)' }}>{dateGroup}</h4>
                    <div className="flex flex-col gap-1">
                      {groupOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${order.status === 'Исполнена' ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-transparent)]' : 'border-[var(--text-tertiary)] text-[var(--text-secondary)] bg-[var(--bg-tertiary)]'}`}>
                               {order.status === 'Исполнена' ? '✓' : '×'}
                             </div>
                             <div>
                               <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{order.title}</p>
                               <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.ticker} · {order.qty} шт. по {fmt(order.price)} ₽</p>
                             </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{order.status}</p>
                            <p className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>Общая сумма: {fmt(Math.abs(order.value))} ₽</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <AssetModal 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
        asset={selectedAsset} 
      />
    </motion.div>
  );
}
