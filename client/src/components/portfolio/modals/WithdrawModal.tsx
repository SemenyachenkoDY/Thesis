'use client';

import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { portfolio } from '@/data/mockData';

interface Props { isOpen: boolean; onClose: () => void; }

export default function WithdrawModal({ isOpen, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const fmt = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Вывод денег">
          <div className="px-3 py-2 rounded-full text-sm inline-block mb-4" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>По реквизитам</div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs mb-4" style={{ background: 'var(--accent-muted)', color: 'var(--text-secondary)' }}>
            ⓘ После оформления запроса на вывод денежные средства поступят на ваш счёт в течение следующего рабочего дня
          </div>
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
              <div><p className="text-sm" style={{ color: 'var(--text-primary)' }}>Банковский счёт</p></div>
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <input type="number" placeholder="Сумма" value={amount} onChange={e => setAmount(e.target.value)} className="bg-transparent outline-none flex-1 text-sm" style={{ color: 'var(--text-primary)' }} />
                <span className="text-sm font-mono" style={{ color: 'var(--text-tertiary)' }}>₽</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>ⓘ Можно вывести до {fmt(portfolio.planned)} ₽</p>
            </div>
            <div className="text-xs max-w-[180px]" style={{ color: 'var(--text-tertiary)' }}>
              При выводе будут удержаны комиссии по вашему тарифу и накопленный налог на доход.
            </div>
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-3" style={{ background: 'var(--accent)' }}>Вывести</button>
        </Modal>
      )}
    </AnimatePresence>
  );
}
