'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { documents as mockDocs, DocumentItem } from '@/data/mockData';
import { FileText, PencilSimple } from '@phosphor-icons/react';
import SigningModal from './SigningModal';

export default function DocumentsTab() {
  const [docs, setDocs] = useState<DocumentItem[]>(mockDocs);
  const [filter, setFilter] = useState('Ожидают подписи');
  const [signingDoc, setSigningDoc] = useState<DocumentItem | null>(null);

  const filters = ['Ожидают подписи', 'На исполнении', 'Все', 'Архив'];

  const filtered = docs.filter(d => {
    if (filter === 'Ожидают подписи') return d.status === 'SIGNATURE_REQUESTED';
    if (filter === 'На исполнении') return d.status === 'CREATED';
    if (filter === 'Архив') return d.status === 'SIGNED' || d.status === 'EXPIRED';
    return true;
  });

  // Group by groupId
  const groups = filtered.reduce((acc, doc) => {
    const key = doc.groupId || doc.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {} as Record<string, DocumentItem[]>);

  const handleSign = useCallback((docId: string) => {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: 'SIGNED' as const, signedAt: new Date().toLocaleString('ru-RU') } : d));
    setSigningDoc(null);
  }, []);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filters.map(f => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
            }}
          >
            {f}
            {f === 'Ожидают подписи' && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--accent)', color: 'white' }}
              >
                {docs.filter(d => d.status === 'SIGNATURE_REQUESTED').length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Document Groups */}
      <div className="flex flex-col gap-3">
        {Object.entries(groups).map(([groupKey, groupDocs], gi) => (
          <motion.div
            key={groupKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05, type: 'spring', stiffness: 120, damping: 20 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          >
            {groupDocs.length > 1 && (
              <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                  Группа #{groupKey.slice(-6)} · {groupDocs.length} документа
                </span>
              </div>
            )}
            {groupDocs.map((doc, di) => (
              <div
                key={doc.id}
                className="px-5 py-4 flex items-center justify-between transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ borderTop: di > 0 ? '1px solid var(--border)' : 'none' }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--accent-muted)' }}
                  >
                    <FileText size={18} weight="duotone" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{doc.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {doc.createdAt}
                      {doc.signedAt && <span className="ml-2 text-accent">✓ Подписан {doc.signedAt}</span>}
                    </p>
                  </div>
                </div>
                {doc.status === 'SIGNATURE_REQUESTED' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSigningDoc(doc)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium shrink-0 ml-3"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <PencilSimple size={14} weight="bold" />
                    Подписать
                  </motion.button>
                )}
                {doc.status === 'SIGNED' && (
                  <span className="text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-3"
                    style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}
                  >✓ Подписан</span>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-tertiary)' }}>
          <p className="text-sm">Нет документов в этой категории</p>
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
    </div>
  );
}
