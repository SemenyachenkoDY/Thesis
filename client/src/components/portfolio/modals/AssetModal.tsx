import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretDown } from '@phosphor-icons/react';
import { useState } from 'react';
import CustomSelect from '@/components/ui/CustomSelect';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: any | null;
}

const tabs = ['Детали', 'О компании', 'Дивиденды'];

export default function AssetModal({ isOpen, onClose, asset }: Props) {
  const [activeTab, setActiveTab] = useState('Детали');
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [orderType, setOrderType] = useState('limit');
  
  if (!isOpen || !asset) return null;

  const fmt = (n: number) => n?.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const isPositive = asset.pnl >= 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-[90vw] max-w-5xl bg-[var(--bg-primary)] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        
        {/* LEFT SIDE: Chart & Details */}
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--border)] overflow-y-auto max-h-[85vh]">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white drop-shadow-md"
                style={{ background: asset.color }}
              >
                {asset.ticker.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{asset.name}</h2>
                <p className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{asset.ticker} • {asset.type}</p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-mono border-none outline-none font-bold" style={{ color: 'var(--text-primary)' }}>
                {fmt(asset.currentPrice)} ₽
              </span>
              <span className="text-sm font-semibold" style={{ color: isPositive ? 'var(--accent)' : 'var(--danger)' }}>
                {isPositive ? '↑' : '↓'} 1.25 (0.8%) <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>за сегодня</span>
              </span>
            </div>
          </div>

          {/* Fake Chart Area */}
          <div className="w-full h-64 rounded-2xl mb-6 relative overflow-hidden flex items-end" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="absolute top-4 left-4 flex gap-2">
              {['1Д', '1Н', '1М', '1Г', 'Все'].map(t => (
                <span key={t} className={`text-xs px-2 py-1 rounded cursor-pointer ${t==='1М'?'bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-bold':'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                  {t}
                </span>
              ))}
            </div>
            {/* SVG placeholder for chart */}
            <svg viewBox="0 0 100 40" className="w-full h-3/4 opacity-60" preserveAspectRatio="none">
              <path d="M0,40 L0,30 L10,25 L20,28 L30,15 L40,20 L50,5 L60,10 L70,8 L80,22 L90,15 L100,20 L100,40 Z" fill={asset.color + '33'} />
              <polyline points="0,30 10,25 20,28 30,15 40,20 50,5 60,10 70,8 80,22 90,15 100,20" fill="none" stroke={asset.color} strokeWidth="0.5" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[var(--border)] mb-5">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="pb-3 text-sm font-semibold relative transition-colors"
                style={{ color: activeTab === t ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
              >
                {t}
                {activeTab === t && (
                  <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'var(--text-primary)' }} />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'Детали' && (
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>В портфеле</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{asset.qty} шт. ({fmt(asset.value)} ₽)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Средняя цена покупки</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fmt(asset.buyPrice)} ₽</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Прибыль / Убыток</span>
                <span className="text-sm font-medium" style={{ color: isPositive ? 'var(--accent)' : 'var(--danger)' }}>
                  {isPositive ? '+' : ''}{fmt(asset.pnl)} ₽ ({asset.pnlPercent}%)
                </span>
              </div>
              {asset.nkd !== undefined && (
                <div className="flex flex-col">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>НКД</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fmt(asset.nkd)} ₽</span>
                </div>
              )}
              {asset.go !== undefined && (
                <div className="flex flex-col">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ГО</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fmt(asset.go)} ₽</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Action panel (Book + Form) */}
        <div className="w-full md:w-80 bg-[var(--bg-secondary)] p-6 flex flex-col relative overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Стакан</h3>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsBookOpen(!isBookOpen)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                title="Свернуть/Развернуть стакан"
              >
                <CaretDown 
                  size={18} 
                  weight="bold"
                  className="transition-transform duration-200" 
                  style={{ transform: isBookOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                />
              </button>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg hover:bg-[var(--danger-transparent)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--danger)]"
                title="Закрыть окно"
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {isBookOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-0.5 mb-6 opacity-80 text-[11px] font-mono">
                  {/* Asks (Sell) */}
                  {[...Array(4)].map((_, i) => (
                    <div key={`ask-${i}`} className="flex justify-between items-center py-1 px-2 hover:bg-[var(--danger-transparent)] cursor-pointer rounded transition-colors group">
                      <span style={{ color: 'var(--danger)' }}>{fmt((asset.currentPrice as number) * (1 + (4-i)*0.001))}</span>
                      <div className="flex items-center gap-4">
                         <span style={{ color: 'var(--text-secondary)' }}>{Math.floor(Math.random() * 500) + 10}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="my-2 border-y border-[var(--border)] py-1 text-center font-bold text-sm tracking-widest" style={{ color: 'var(--text-primary)' }}>
                     {fmt(asset.currentPrice)}
                  </div>

                  {/* Bids (Buy) */}
                  {[...Array(4)].map((_, i) => (
                    <div key={`bid-${i}`} className="flex justify-between items-center py-1 px-2 hover:bg-[var(--accent-transparent)] cursor-pointer rounded transition-colors group">
                      <span style={{ color: 'var(--accent)' }}>{fmt((asset.currentPrice as number) * (1 - (i+1)*0.001))}</span>
                      <div className="flex items-center gap-4">
                         <span style={{ color: 'var(--text-secondary)' }}>{Math.floor(Math.random() * 500) + 10}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-primary)] mb-4 flex-1">
             <div className="flex bg-[var(--bg-secondary)] rounded-lg p-1 mb-4">
                 <button className="flex-1 py-1.5 rounded-md text-xs font-bold bg-[var(--accent)] text-white shadow-sm">Покупка</button>
                 <button className="flex-1 py-1.5 rounded-md text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Продажа</button>
             </div>

             <div className="space-y-3">
               <div className="relative z-10">
                  <label className="text-[10px] font-semibold tracking-wider uppercase mb-1 block" style={{ color: 'var(--text-tertiary)' }}>Тип заявки</label>
                  <CustomSelect 
                    options={[
                      { id: 'limit', label: 'Лимитная' },
                      { id: 'market', label: 'Рыночная' }
                    ]}
                    value={orderType}
                    onChange={setOrderType}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>Цена (₽)</label>
                  <input type="text" defaultValue={fmt(asset.currentPrice)} className="w-full mt-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none font-mono" style={{ color: 'var(--text-primary)' }} />
               </div>
               <div>
                  <label className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>Количество (шт)</label>
                  <input type="number" defaultValue={1} className="w-full mt-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm outline-none font-mono" style={{ color: 'var(--text-primary)' }} />
               </div>
             </div>

             <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Сумма</span>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>~ {fmt(asset.currentPrice)} ₽</span>
             </div>
             <button className="w-full py-3 mt-4 rounded-xl text-sm font-bold text-white shadow-md transition-transform active:scale-95" style={{ background: 'var(--accent)' }}>
               Купить
             </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
