'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import { DocumentItem } from '@/data/mockData';
import { ShieldCheck } from '@phosphor-icons/react';

interface Props {
  document: DocumentItem;
  onClose: () => void;
  onSign: () => void;
}

export default function SigningModal({ document, onClose, onSign }: Props) {
  const [step, setStep] = useState<'confirm' | 'sms' | 'success'>('confirm');
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [attempt, setAttempt] = useState(1);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'sms' && timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, timer]);

  const handleCodeChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val.slice(-1);
    setCode(newCode);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleConfirm = () => {
    const entered = code.join('');
    if (entered === '1234') {
      setStep('success');
      setTimeout(onSign, 1500);
    } else {
      if (attempt >= 3) {
        setError('Превышено количество попыток. Попробуйте позже.');
        return;
      }
      setAttempt(a => a + 1);
      setError(`Неверный код. Попытка ${attempt + 1} из 3`);
      setCode(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Подписание документа">
      {step === 'confirm' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg-tertiary)' }}>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{document.title}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Создан: {document.createdAt}</p>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Для подписания документа мы отправим SMS-код на ваш номер телефона
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setStep('sms'); setTimer(60); }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >
            Отправить SMS-код
          </motion.button>
        </motion.div>
      )}

      {step === 'sms' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Введите код из SMS
          </p>
          <div className="flex gap-3 justify-center mb-4">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(i, e.target.value)}
                className="w-14 h-14 text-center text-2xl font-mono font-bold rounded-xl outline-none transition-colors"
                style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  border: `2px solid ${digit ? 'var(--accent)' : 'var(--border)'}`,
                }}
              />
            ))}
          </div>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-center mb-3 text-danger">{error}</motion.p>
          )}
          <p className="text-xs text-center mb-4" style={{ color: 'var(--text-tertiary)' }}>
            {timer > 0 ? `Повторная отправка через ${timer} сек` : 'Отправить код повторно'}
          </p>
          <p className="text-xs text-center mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Подсказка: код — 1234
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            disabled={code.some(d => !d)}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)' }}
          >
            Подтвердить
          </motion.button>
        </motion.div>
      )}

      {step === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <ShieldCheck size={64} weight="duotone" style={{ color: 'var(--accent)' }} />
          </motion.div>
          <p className="text-lg font-semibold mt-4" style={{ color: 'var(--text-primary)' }}>Документ подписан!</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Fast Sign</p>
        </motion.div>
      )}
    </Modal>
  );
}
