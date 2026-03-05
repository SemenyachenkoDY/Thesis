'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import DocumentsTab from '@/components/documents/DocumentsTab';
import ReportsTab from '@/components/documents/ReportsTab';
import CorpActionsTab from '@/components/documents/CorpActionsTab';
import TaxesTab from '@/components/documents/TaxesTab';
import MarginCallTab from '@/components/documents/MarginCallTab';

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
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div>
      {/* Sub navigation */}
      <div className="flex items-center gap-1.5 mb-6 rounded-2xl p-1.5 overflow-x-auto"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {tabs.map(tab => (
          <motion.button
            key={tab.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors"
            style={{ color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="doc-tab"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'var(--bg-tertiary)' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Superset Link */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5"
        style={{ background: 'var(--accent-muted)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>📊</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Аналитический дашборд Fast Sign доступен в{' '}
          <a href="http://localhost:8088/dashboard/fast-sign/" target="_blank" rel="noopener noreferrer"
            className="font-medium underline" style={{ color: 'var(--accent)' }}
          >
            Apache Superset
          </a>
        </span>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
