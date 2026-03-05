'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { documents as mockDocs, DocumentItem } from '@/data/mockData';
import { MagnifyingGlass, DownloadSimple, XCircle } from '@phosphor-icons/react';
import SigningModal from './SigningModal';
import DocumentViewerModal from './modals/DocumentViewerModal';

const ITEMS_PER_PAGE = 5;

export default function DocumentsTab() {
  const [docs, setDocs] = useState<DocumentItem[]>(mockDocs);
  const [filter, setFilter] = useState('Ожидают подписи');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [signingDoc, setSigningDoc] = useState<DocumentItem | null>(null);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  const filters = ['Ожидают подписи', 'На исполнении', 'Все', 'Архив'];

  const filtered = docs.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase());
    let matchesFilter = true;
    if (filter === 'Ожидают подписи') matchesFilter = d.status === 'SIGNATURE_REQUESTED';
    if (filter === 'На исполнении') matchesFilter = d.status === 'CREATED';
    if (filter === 'Архив') matchesFilter = d.status === 'SIGNED' || d.status === 'EXPIRED';
    
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedDocs = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSign = useCallback((docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'SIGNED' as const, signedAt: new Date().toLocaleString('ru-RU') } : d));
    setSigningDoc(null);
  }, []);

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      
      {/* Top Header: Tabs + Search */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        
        {/* Pills / Sub-Tabs */}
        <div className="flex bg-[var(--bg-secondary)] rounded-full p-1 border border-[var(--border)]">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${filter === f ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {f === 'Ожидают подписи' ? 'Свежие подписи' : f}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full w-full md:w-72 bg-[var(--bg-secondary)] border border-[var(--border)] transition-colors focus-within:border-[var(--text-secondary)]">
          <MagnifyingGlass size={18} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Поиск"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="bg-transparent outline-none flex-1 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <XCircle size={16} weight="fill" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
            </button>
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-[1fr_200px] gap-4 mb-4 px-4">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>Название документа</span>
        <span className="text-[10px] font-bold tracking-widest uppercase text-right mr-10" style={{ color: 'var(--text-tertiary)' }}>Сформирован</span>
      </div>

      {/* List */}
      <div className="flex flex-col mb-8 relative min-h-[300px]">
        <AnimatePresence mode="popLayout">
          {paginatedDocs.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-[1fr_200px] gap-4 items-center px-4 py-5 border-t border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors rounded-xl cursor-pointer group"
              onClick={() => setViewingDoc(doc)}
            >
              <div className="flex flex-col gap-3">
                <span className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>{doc.title}</span>
                {doc.status === 'SIGNATURE_REQUESTED' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSigningDoc(doc); }}
                    className="w-min whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold bg-white text-black shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Подписать
                  </button>
                )}
                {doc.status === 'SIGNED' && (
                  <span className="w-min whitespace-nowrap text-xs font-bold px-3 py-1 rounded-full bg-[var(--accent-muted)] text-[var(--accent)]">
                    Подписан
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-end gap-6 text-right">
                <div>
                   <p className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{doc.createdAt.split(' ')[0]}</p>
                   <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>в {doc.createdAt.split(' ')[1]}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); /* Fake download */ }}
                  className="p-2 -mr-2 rounded-lg text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                  title="Скачать документ"
                >
                  <DownloadSimple size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[var(--text-tertiary)] font-medium">Ничего не найдено</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pt-6 border-t border-[var(--border)]">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            &laquo;
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            &raquo;
          </button>
        </div>
      )}

      {/* Signing Modal */}
      <AnimatePresence>
        {signingDoc && (
          <SigningModal
            document={signingDoc}
            onClose={() => setSigningDoc(null)}
            onSign={() => handleSign(signingDoc.id)}
          />
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingDoc && (
          <DocumentViewerModal
            document={viewingDoc}
            isOpen={!!viewingDoc}
            onClose={() => setViewingDoc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
