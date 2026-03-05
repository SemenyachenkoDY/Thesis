'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { portfolio } from '@/data/mockData';

interface Props { isOpen: boolean; onClose: () => void; }

export default function TransferModal({ isOpen, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Перевод между счетами">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Откуда</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center"><span className="text-xs">💰</span></div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>ЕДП МО-01</p>
                <p className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{fmt(portfolio.planned)} ₽</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>Куда</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <div className="w-8 h-8 rounded-full bg-[var(--accent-muted)] flex items-center justify-center"><span className="text-xs">🏦</span></div>
              <div>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>ИИС</p>
                <p className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>0 ₽</p>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
              <input type="number" placeholder="Сумма" value={amount} onChange={e => setAmount(e.target.value)} className="bg-transparent outline-none flex-1 text-sm" style={{ color: 'var(--text-primary)' }} />
              <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>₽</span>
            </div>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'var(--accent)' }}>Перевести</button>
        </Modal>
      )}
    </AnimatePresence>
  );
}
