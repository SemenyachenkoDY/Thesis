import { motion, AnimatePresence } from 'framer-motion';
import { X, DownloadSimple, Printer } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  document: any | null; // using any for now, could be DocumentItem or ReportItem
}

export default function DocumentViewerModal({ isOpen, onClose, document }: Props) {
  const [viewMode, setViewMode] = useState<'html' | 'pdf'>('html');

  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-[95vw] max-w-5xl h-[85vh] bg-[var(--bg-primary)] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{document.title}</h2>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>ID: {document.id} · Сформирован: {document.createdAt}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-1">
              <button 
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'html' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                onClick={() => setViewMode('html')}
              >
                HTML
              </button>
              <button 
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'pdf' ? 'bg-[var(--bg-primary)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                onClick={() => setViewMode('pdf')}
              >
                PDF
              </button>
            </div>

            <div className="flex items-center gap-2 border-l border-[var(--border)] pl-4">
              <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Печать">
                <Printer size={20} />
              </button>
              <button className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Скачать">
                <DownloadSimple size={20} />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--danger-transparent)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--danger)] ml-2">
                <X size={20} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Viewer Content */}
        <div className="flex-1 overflow-auto p-8 bg-[#F8F9FA] relative">
          {viewMode === 'html' ? (
            <div className="max-w-3xl mx-auto bg-white p-12 shadow-sm rounded border border-gray-200">
              <div className="animate-pulse">
                 {/* Fake Document Content Skeleton */}
                 <div className="flex justify-between items-start mb-12">
                   <div className="w-32 h-10 bg-gray-200 rounded"></div>
                   <div className="w-48 h-24 bg-gray-200 rounded"></div>
                 </div>
                 
                 <div className="h-8 bg-gray-200 w-3/4 rounded mb-8"></div>
                 
                 <div className="space-y-4 mb-8">
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                 </div>

                 <div className="w-full h-48 bg-gray-100 border border-gray-200 rounded mb-8 mt-12"></div>

                 <div className="flex justify-between mt-16 pt-8 border-t border-gray-200">
                    <div className="w-40 h-12 bg-gray-200 rounded"></div>
                    <div className="w-40 h-12 bg-gray-200 rounded"></div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xl">PDF</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Просмотр PDF</h3>
                  <p className="text-sm text-gray-500 max-w-sm mt-1">Отображение PDF документа. В реальном приложении здесь будет <code>&lt;object&gt;</code> или <code>pdf.js</code> canvas.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
