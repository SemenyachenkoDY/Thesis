'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import { user } from '@/data/mockData';
import { CaretRight, CaretLeft, CheckCircle } from '@phosphor-icons/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [securityView, setSecurityView] = useState<'main' | 'password'>('main');
  
  // Profile State
  const [lastName, setLastName] = useState('Уткин');
  const [firstName, setFirstName] = useState('Виталий');
  const [patronymic, setPatronymic] = useState('Федорович');
  const [phone, setPhone] = useState('+7 (903) 798-30-53');
  const [email, setEmail] = useState('vitalli.utkin@icloud.com');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState({ type: '', msg: '' });

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({ type: '', msg: '' });
  const [confirmRequests, setConfirmRequests] = useState(true);

  // Requirements logic
  const reqLength = newPassword.length >= 8 && newPassword.length <= 16;
  const reqChars = /^[a-zA-Z0-9!?@#\$^&*_+-]+$/.test(newPassword) && newPassword.length > 0;
  const reqDigit = /\d/.test(newPassword);
  const reqUpper = /[A-Z]/.test(newPassword);
  const reqLower = /[a-z]/.test(newPassword);
  const reqSpecial = /[!?@#\$^&*_+-]/.test(newPassword);
  const reqNotOld = newPassword.length > 0 && newPassword !== currentPassword;
  
  const allReqsMet = reqLength && reqChars && reqDigit && reqUpper && reqLower && reqSpecial && reqNotOld;
  const passwordsMatch = newPassword === repeatPassword;
  const canSubmitPassword = allReqsMet && passwordsMatch;
  
  // Fake Client ID for demo
  const mockClientId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  const handleProfileUpdate = async () => {
    setProfileLoading(true);
    setProfileStatus({ type: '', msg: '' });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: mockClientId, 
          name: `${lastName} ${firstName} ${patronymic}`, 
          email, 
          phone 
        }),
      });
      if (!res.ok) throw new Error('Ошибка обновления');
      setProfileStatus({ type: 'success', msg: 'Данные успешно обновлены' });
    } catch (err: any) {
      setProfileStatus({ type: 'error', msg: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!canSubmitPassword) return;
    setSecurityLoading(true);
    setSecurityStatus({ type: '', msg: '' });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mockClientId, currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка смены пароля');
      }
      setSecurityStatus({ type: 'success', msg: 'Пароль успешно изменен' });
      setCurrentPassword('');
      setNewPassword('');
      setRepeatPassword('');
      setTimeout(() => setSecurityView('main'), 2000);
    } catch (err: any) {
      setSecurityStatus({ type: 'error', msg: err.message });
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title="Настройка профиля">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
            >
              Личные данные
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}
            >
              Безопасность и вход
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'profile' ? (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <InputField label="Фамилия" value={lastName} onChange={setLastName} />
                <InputField label="Имя" value={firstName} onChange={setFirstName} />
                <InputField label="Отчество" value={patronymic} onChange={setPatronymic} />
                <InputField label="Телефон" value={phone} onChange={setPhone} />
                
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <InputField label="E-mail" value={email} onChange={setEmail} type="email" />
                    <p className="text-xs text-[var(--warning)] mt-1">ⓘ E-mail не подтверждён</p>
                  </div>
                  <button onClick={handleProfileUpdate} disabled={profileLoading} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border)] transition-colors mb-5">
                    {profileLoading ? '...' : 'Подтвердить'}
                  </button>
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">Логин</label>
                  <p className="font-semibold text-[var(--text-primary)]">VITALYD8</p>
                </div>

                {profileStatus.msg && (
                  <p className={`text-sm ${profileStatus.type === 'success' ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}`}>
                    {profileStatus.msg}
                  </p>
                )}

                <button onClick={handleProfileUpdate} disabled={profileLoading} className="w-full py-3 mt-4 rounded-xl text-sm font-semibold text-white bg-[var(--accent)] transition-opacity" style={{ opacity: profileLoading ? 0.7 : 1 }}>
                  Изменить данные
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                {securityView === 'main' ? (
                  <div className="space-y-2 mt-2">
                    <button onClick={() => setSecurityView('password')} className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Изменить пароль</span>
                      <CaretRight size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Секретный вопрос</span>
                      <CaretRight size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Вход и авторизация</span>
                      <CaretRight size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Устройства <span className="ml-2 px-2 py-0.5 rounded text-xs text-white" style={{ background: 'var(--accent)' }}>791</span></span>
                      <CaretRight size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    
                    <button onClick={() => setConfirmRequests(!confirmRequests)} className="w-full flex items-center justify-between px-4 py-4 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] bg-[var(--bg-elevated)] border" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Подтверждать заявки</span>
                      <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${confirmRequests ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}>
                        <motion.div animate={{ left: confirmRequests ? 16 : 0, position: 'relative' }} className="w-4 h-4 bg-white rounded-full scale-110 drop-shadow" />
                      </div>
                    </button>
                    <p className="px-2 text-xs pt-2" style={{ color: 'var(--text-tertiary)' }}>
                      В случае отключенной опции - автоматически выводить заявки на биржу без повторного подтверждения
                    </p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <button onClick={() => { setSecurityView('main'); setSecurityStatus({type: '', msg: ''}); }} className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80 -mt-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <CaretLeft size={16} /> Назад
                    </button>
                    
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Изменение пароля</h3>
                    
                    <InputField label="" placeholder="Введите текущий пароль" value={currentPassword} onChange={setCurrentPassword} type="password" />

                    <div className="space-y-2 py-2">
                       <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Ваш пароль должен содержать:</p>
                       <ReqItem met={reqLength} text="8-16 символов" />
                       <ReqItem met={reqChars} text="Только латинские буквы, цифры и спец. символы" />
                       <ReqItem met={reqDigit} text="Хотя бы 1 цифру" />
                       <ReqItem met={reqUpper} text="Хотя бы 1 заглавную букву (A-Z)" />
                       <ReqItem met={reqLower} text="Хотя бы 1 строчную букву (a-z)" />
                       <ReqItem met={reqSpecial} text="Хотя бы 1 спец. символ (! ? @ # $ ^ & * _ - +)" />
                       <ReqItem met={reqNotOld} text="Новый пароль не должен совпадать со старым" />
                    </div>

                    <InputField label="" placeholder="Введите новый пароль" value={newPassword} onChange={setNewPassword} type="password" />
                    <InputField label="" placeholder="Повторите новый пароль" value={repeatPassword} onChange={setRepeatPassword} type="password" />
                    
                    {securityStatus.msg && (
                      <p className={`text-sm ${securityStatus.type === 'success' ? 'text-[var(--accent)]' : 'text-[var(--danger)]'}`}>
                        {securityStatus.msg}
                      </p>
                    )}

                    <button 
                      onClick={handlePasswordUpdate} 
                      disabled={securityLoading || !canSubmitPassword} 
                      className={`w-full py-3 mt-4 rounded-xl text-sm font-semibold text-white transition-opacity ${canSubmitPassword ? 'bg-[var(--accent)] hover:opacity-90' : 'bg-[var(--text-tertiary)] opacity-50 cursor-not-allowed'}`}
                    >
                      {securityLoading ? 'Обработка...' : 'Сохранить'}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
}

function InputField({ label, placeholder, value, onChange, type = 'text' }: { label?: string, placeholder?: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-4 py-3 rounded-xl text-sm font-medium outline-none transition-colors"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', background: 'var(--bg-elevated)' }}
        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

function ReqItem({ met, text }: { met: boolean, text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm transition-colors" style={{ color: met ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
      <CheckCircle size={16} weight={met ? "fill" : "regular"} color={met ? "var(--text-primary)" : "var(--text-tertiary)"} />
      <span>{text}</span>
    </div>
  );
}
