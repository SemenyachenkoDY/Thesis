'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { corpActions } from '@/data/mockData';
import { DownloadSimple, MagnifyingGlass, Circle } from '@phosphor-icons/react';

export default function CorpActionsTab() {
  const [search, setSearch] = useState('');

  const filtered = corpActions.filter(ca =>
    ca.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="flex gap-2">
          {['Все', 'Архив'].map(f => (
            <button key={f} className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: f === 'Все' ? 'var(--accent)' : 'var(--bg-tertiary)', color: f === 'Все' ? 'white' : 'var(--text-secondary)' }}
            >{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm flex-1 max-w-xs"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <MagnifyingGlass size={16} style={{ color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="Поиск" value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm" style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="grid grid-cols-[auto_1fr_140px_80px] gap-3 px-5 py-3 text-xs font-medium uppercase"
          style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}
        >
          <span></span>
          <span>Название документа</span>
          <span>Дата</span>
          <span className="text-center">Скачать</span>
        </div>

        {filtered.map((ca, i) => (
          <motion.div
            key={ca.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 120, damping: 20 }}
            className="grid grid-cols-[auto_1fr_140px_80px] gap-3 px-5 py-3.5 items-center transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <Circle size={8} weight="fill" style={{ color: ca.isRead ? 'var(--text-tertiary)' : 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{ca.title}</span>
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{ca.createdAt}</span>
            <div className="flex justify-center">
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-1.5 rounded-lg">
                <DownloadSimple size={18} style={{ color: 'var(--accent)' }} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="flex justify-center gap-2 mt-4">
        {[1, 2, 3, '...', 9].map((p, i) => (
          <button key={i} className="w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center"
            style={{ background: p === 1 ? 'var(--accent)' : 'var(--bg-tertiary)', color: p === 1 ? 'white' : 'var(--text-secondary)' }}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}
