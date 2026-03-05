'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DocumentsTab from '@/components/documents/DocumentsTab';
import ReportsTab from '@/components/documents/ReportsTab';
import CorpActionsTab from '@/components/documents/CorpActionsTab';
import TaxesTab from '@/components/documents/TaxesTab';
import MarginCallTab from '@/components/documents/MarginCallTab';
import CustomSelect from '@/components/ui/CustomSelect';
import { CalendarBlank, MagnifyingGlass } from '@phosphor-icons/react';

const tabs = [
  { key: 'documents', label: 'Документы' },
  { key: 'reports', label: 'Отчёты' },
  { key: 'corp', label: 'Корп. действия' },
  { key: 'taxes', label: 'Налоги' },
  { key: 'margin', label: 'Маржин-колл' },
];

const tabComponents: Record<string, React.ComponentType> = {
  documents: DocumentsTab,
  reports: ReportsTab,
  corp: CorpActionsTab,
  taxes: TaxesTab,
  margin: MarginCallTab,
};

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [reportType, setReportType] = useState('broker');
  const [period, setPeriod] = useState('1m');
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-7xl mx-auto">
      
      {/* LEFT COLUMN: Main content */}
      <div className="flex flex-col gap-6">
        
        {/* Top Tabs */}
        <div className="flex items-center gap-1 mb-2 border-b border-[var(--border)] pb-4 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="relative px-5 py-2 text-lg font-semibold whitespace-nowrap transition-colors"
              style={{ color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="doc-active-tab"
                  className="absolute bottom-[-17px] left-0 right-0 h-[3px] rounded-t-full"
                  style={{ background: 'var(--text-primary)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="flex-1"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Banner */}
        <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6" style={{ background: 'var(--text-secondary)' }}>
           <div>
              <h3 className="text-2xl font-bold text-white mb-2 max-w-xs leading-tight">Ответим на вопросы и объясним всё непонятное</h3>
           </div>
           <div className="flex flex-col items-start gap-4 flex-1 max-w-xs">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Оставьте заявку на обратный звонок, наш менеджер свяжется с вами в удобное вам время.</p>
              <button className="px-6 py-3 rounded-xl bg-white text-black font-bold text-sm tracking-wide hover:scale-[1.02] transition-transform">
                Оставить заявку
              </button>
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Sidebars */}
      <div className="flex flex-col gap-6">
        
        {/* Sidebar 1: Заказать отчёт */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Заказать отчёт</h3>
          <p className="text-xs mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Отчёты по торговому дню могут быть сформированы не ранее окончания текущего рабочего дня. Отчёты по сделкам за период входят в соответствующие отчёты брокера.
          </p>
          
          <div className="space-y-4 mb-6 relative z-20">
            <CustomSelect 
              options={[
                { id: 'broker', label: 'Брокерский отчёт' },
                { id: 'depo', label: 'Отчёт депозитария' },
              ]}
              value={reportType}
              onChange={setReportType}
              placeholder="Вид отчёта"
            />
            
            <div className="relative">
              <CustomSelect 
                options={[
                  { id: '1d', label: 'За сегодня' },
                  { id: '1w', label: 'За неделю' },
                  { id: '1m', label: 'За месяц' },
                  { id: 'all', label: 'За всё время' },
                ]}
                value={period}
                onChange={setPeriod}
                placeholder="Период"
              />
              <CalendarBlank size={16} className="absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
            </div>
          </div>

          <button className="w-full py-3 rounded-xl text-sm font-bold transition-all border border-dashed border-[var(--border)]" style={{ color: 'var(--text-secondary)' }}>
            Заказать отчёт
          </button>
        </div>

        {/* Sidebar 2: Подать документ */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Подать документ</h3>
          
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-full mb-4 bg-[var(--bg-secondary)] border border-[var(--border)] focus-within:border-[var(--text-secondary)] transition-colors">
            <MagnifyingGlass size={16} style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Поиск" className="bg-transparent outline-none flex-1 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
          </div>

          <div className="mb-6 relative z-10">
             <CustomSelect 
               options={[{ id: 'all', label: 'Выберите вид документа' }]}
               value="all"
               onChange={() => {}}
             />
          </div>

          <div className="flex flex-col gap-3">
             <div className="bg-[var(--bg-secondary)] rounded-xl p-4 transition-colors hover:bg-[var(--bg-tertiary)] cursor-pointer group">
               <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Технический протокол</p>
               <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Заполнить</span>
             </div>
             <div className="bg-[var(--bg-secondary)] rounded-xl p-4 transition-colors hover:bg-[var(--bg-tertiary)] cursor-pointer group">
               <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Анкета клиента (физического лица)</p>
               <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Заполнить</span>
             </div>
             <div className="bg-[var(--bg-secondary)] rounded-xl p-4 transition-colors hover:bg-[var(--bg-tertiary)] cursor-pointer group">
               <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Заявление на открытие доп. лицевого счета</p>
               <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Заполнить</span>
             </div>
             <div className="bg-[var(--bg-secondary)] rounded-xl p-4 transition-colors hover:bg-[var(--bg-tertiary)] cursor-pointer group">
               <p className="text-sm font-semibold leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>Выписка о состоянии счёта депо на конец операционного дня</p>
               <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>Заполнить</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
