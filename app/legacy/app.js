/* ============================================================
   FAST SIGN DASHBOARD — Application Logic v2
   ============================================================ */
(function () {
  'use strict';

  // ─── Mock Data ────────────────────────────────────────────
  const documentsData = [
    {
      id: 'group-765934', type: 'group', title: 'Группа документов №765934', date: '02.02.2026 в 16:10',
      documents: [
        { id: 'doc-1', title: 'Уведомление о конфликте интересов', date: '02.02.2026 в 16:10', status: 'SIGNATURE_REQUESTED', docType: 'application' },
        { id: 'doc-2', title: 'Уведомление о конфликте интересов', date: '02.02.2026 в 16:10', status: 'SIGNATURE_REQUESTED', docType: 'application' },
        { id: 'doc-3', title: 'Поручение на сделку ОТС (Произвольный документ)', date: '02.02.2026 в 16:10', status: 'SIGNATURE_REQUESTED', docType: 'agreement' }
      ]
    },
    { id: 'doc-4', type: 'single', title: 'Технический протокол', date: '05.02.2026 в 03:00', status: 'SIGNATURE_REQUESTED', docType: 'contract' },
    { id: 'doc-5', type: 'single', title: 'Анкета клиента (физического лица)', date: '02.02.2026 в 03:00', status: 'SIGNATURE_REQUESTED', docType: 'application' },
    { id: 'doc-6', type: 'single', title: 'Соглашение об электронном документообороте', date: '28.01.2026 в 14:22', status: 'SIGNED', docType: 'agreement' },
    { id: 'doc-7', type: 'single', title: 'Уведомление о расторжении договора', date: '28.01.2026 в 03:00', status: 'CREATED', docType: 'application' },
    { id: 'doc-8', type: 'single', title: 'Заявление на открытие доп. лицевого счёта', date: '25.01.2026 в 11:45', status: 'SIGNED', docType: 'application' },
    { id: 'doc-9', type: 'single', title: 'Договор на брокерское обслуживание', date: '20.01.2026 в 09:30', status: 'FAILED', docType: 'contract' },
    { id: 'doc-10', type: 'single', title: 'Акт сверки взаиморасчётов', date: '15.01.2026 в 16:05', status: 'EXPIRED', docType: 'agreement' },
  ];

  const docTypesData = [
    { id: 'tech-protocol', title: 'Технический протокол', docType: 'contract' },
    { id: 'client-questionnaire', title: 'Анкета клиента (физического лица)', docType: 'application' },
    { id: 'account-opening', title: 'Заявление на открытие доп. лицевого счёта', docType: 'application' },
    { id: 'depo-statement', title: 'Выписка о состоянии счёта депо', docType: 'agreement' },
    { id: 'edo-agreement', title: 'Соглашение об электронном документообороте', docType: 'agreement' },
    { id: 'broker-contract', title: 'Договор на брокерское обслуживание', docType: 'contract' },
  ];

  const monthlyDynamics = [
    { month: '2025-07', total: 142, completed: 128, returned: 14 },
    { month: '2025-08', total: 167, completed: 154, returned: 11 },
    { month: '2025-09', total: 189, completed: 178, returned: 8 },
    { month: '2025-10', total: 213, completed: 203, returned: 7 },
    { month: '2025-11', total: 198, completed: 191, returned: 5 },
    { month: '2025-12', total: 231, completed: 224, returned: 4 },
    { month: '2026-01', total: 245, completed: 239, returned: 3 },
    { month: '2026-02', total: 178, completed: 174, returned: 2 },
  ];

  const departmentData = [
    { department: 'Корпоративные финансы', count: 487 },
    { department: 'Управление активами', count: 342 },
    { department: 'Комплаенс', count: 289 },
    { department: 'Операционный отдел', count: 234 },
    { department: 'Юридический отдел', count: 178 },
    { department: 'Клиентский сервис', count: 133 },
  ];

  // Reports history
  const reportsHistory = [];

  // ─── Constants / Maps ──────────────────────────────────────
  const MAX_SIGN_ATTEMPTS = 3;
  const STATUS_MAP = {
    CREATED:             { label: 'Создан',           css: 'created' },
    SIGNATURE_REQUESTED: { label: 'Ожидает подписи',  css: 'awaiting' },
    SIGNED:              { label: 'Подписан',          css: 'signed' },
    FAILED:              { label: 'Ошибка',            css: 'failed' },
    EXPIRED:             { label: 'Истёк',             css: 'expired' }
  };
  const REPORT_MAP = {
    'broker':    'Брокерский отчёт',
    'depo':      'Депозитарный отчёт',
    'trade-day': 'Отчёт по торговому дню',
    'deals':     'Отчёт по сделкам за период'
  };

  // ─── Helpers ──────────────────────────────────────────────
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }
  function generateCode() { return Math.floor(100000 + Math.random() * 900000).toString(); }
  function uuid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);}); }
  function escapeAttr(s) { return s.replace(/'/g,"\\'").replace(/"/g,'&quot;'); }
  function findDocById(id) {
    for (const it of documentsData) {
      if (it.type === 'single' && it.id === id) return it;
      if (it.type === 'group') { const f = it.documents.find(d => d.id === id); if (f) return f; }
    }
    return null;
  }
  function canSign(st) { return st === 'SIGNATURE_REQUESTED' || st === 'CREATED'; }
  function monthLabel(iso) {
    const m = {'01':'Янв','02':'Фев','03':'Мар','04':'Апр','05':'Май','06':'Июн',
      '07':'Июл','08':'Авг','09':'Сен','10':'Окт','11':'Ноя','12':'Дек'};
    const p = iso.split('-'); return m[p[1]] + ' ' + p[0].slice(2);
  }
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function nowFormatted() {
    const d = new Date();
    return d.toLocaleDateString('ru-RU') + ' в ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  // ─── Theme ──────────────────────────────────────────────
  function setTheme(t) { document.body.classList.remove('theme-light','theme-dark'); document.body.classList.add('theme-'+t);
    try{localStorage.setItem('edmsTheme',t);}catch(e){} }
  function initTheme() { let s='dark'; try{ const v=localStorage.getItem('edmsTheme'); if(v==='dark'||v==='light') s=v; }catch(e){} setTheme(s); }

  // ─── Toast ──────────────────────────────────────────────
  let toastTimer = null;
  function showToast(txt) { const el=$('#codeToast'); el.textContent=txt; el.classList.add('show');
    if(toastTimer)clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),5000); }

  // ============================================================
  //  CUSTOM SELECT COMPONENT
  // ============================================================
  function initCustomSelects() {
    $$('.custom-select').forEach(sel => {
      const trigger = sel.querySelector('.custom-select__trigger');
      const options = sel.querySelectorAll('.custom-select__option');

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllSelects(sel);
        sel.classList.toggle('open');
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = opt.dataset.val;
          const text = opt.textContent;
          sel.dataset.value = val;
          trigger.innerHTML = '<span>' + text + '</span>';
          options.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          sel.classList.remove('open');
          sel.dispatchEvent(new CustomEvent('change', { detail: { value: val, text: text } }));
        });
      });
    });

    document.addEventListener('click', () => closeAllSelects());
  }

  function closeAllSelects(except) {
    $$('.custom-select.open').forEach(s => { if (s !== except) s.classList.remove('open'); });
  }

  // ============================================================
  //  DATE FIELD COMPONENT
  // ============================================================
  function initDateFields() {
    $$('.date-field').forEach(df => {
      const input = df.querySelector('input[type="date"]');
      const display = df.querySelector('.date-field__display span');
      if (!input || !display) return;

      // Clicking anywhere on the field opens the native picker
      df.addEventListener('click', () => {
        if (input.showPicker) { input.showPicker(); }
        else { input.focus(); input.click(); }
      });

      input.addEventListener('change', () => {
        if (input.value) {
          display.textContent = formatDate(input.value);
          display.classList.remove('date-field__placeholder');
        } else {
          display.textContent = 'Выберите дату';
          display.classList.add('date-field__placeholder');
        }
      });
    });
  }

  // ============================================================
  //  TAB SWITCHING
  // ============================================================
  function initTabs() {
    $$('.sub-nav__item').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const tab = btn.dataset.tab;
        $$('.sub-nav__item').forEach(b => b.classList.remove('sub-nav__item--active'));
        btn.classList.add('sub-nav__item--active');
        $$('.tab-content').forEach(t => t.classList.remove('active'));
        const target = $('#tab-' + tab);
        if (target) {
          target.classList.add('active');
          if (tab === 'analytics') renderAnalytics();
          if (tab === 'reports') renderReportsTable();
        }
      });
    });
  }

  // ============================================================
  //  DOCUMENTS
  // ============================================================
  let activeFilter = 'awaiting';
  let searchQuery = '';

  function getVisibleDocs() {
    let docs = [];
    documentsData.forEach(item => {
      if (item.type === 'group') {
        const filtered = item.documents.filter(d => matchesFilter(d));
        if (filtered.length > 0) docs.push({ ...item, documents: filtered });
      } else {
        if (matchesFilter(item)) docs.push(item);
      }
    });
    if (searchQuery) {
      docs = docs.filter(item => {
        if (item.type === 'group') return item.documents.some(d => d.title.toLowerCase().includes(searchQuery));
        return item.title.toLowerCase().includes(searchQuery);
      });
    }
    return docs;
  }

  function matchesFilter(doc) {
    switch (activeFilter) {
      case 'awaiting': return doc.status === 'SIGNATURE_REQUESTED' || doc.status === 'CREATED';
      case 'in-progress': return doc.status === 'SIGNATURE_REQUESTED';
      case 'archive': return doc.status === 'SIGNED' || doc.status === 'EXPIRED';
      case 'all': return true;
      default: return true;
    }
  }

  function renderDocuments() {
    const listEl = $('#documentsList');
    const docs = getVisibleDocs();
    if (docs.length === 0) {
      listEl.innerHTML = '<div class="docs-empty"><svg class="docs-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/></svg><div class="docs-empty__title">Документы не найдены</div><div class="docs-empty__text">Попробуйте изменить фильтры или поисковый запрос</div></div>';
      return;
    }
    listEl.innerHTML = '';
    docs.forEach(item => {
      if (item.type === 'group') listEl.appendChild(renderGroup(item));
      else listEl.appendChild(renderDocRow(item));
    });
  }

  function renderDocRow(doc) {
    const s = STATUS_MAP[doc.status] || STATUS_MAP.CREATED;
    const signable = canSign(doc.status);
    const el = document.createElement('div');
    el.className = 'doc-row';
    el.innerHTML = '<div class="doc-row__title">' + doc.title + '</div>' +
      '<div class="doc-row__date">' + doc.date + '</div>' +
      '<span class="doc-row__status doc-row__status--' + s.css + '">' + s.label + '</span>' +
      '<div class="doc-row__actions">' +
        '<button class="btn btn--icon btn--ghost" title="Скачать" data-download="' + doc.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg></button>' +
        '<button class="btn btn--sm btn--primary" ' + (signable ? '' : 'disabled') + ' data-sign="' + doc.id + '" data-title="' + escapeAttr(doc.title) + '">' + (doc.status === 'SIGNED' ? 'Подписан' : 'Подписать') + '</button>' +
      '</div>';
    return el;
  }

  function renderGroup(group) {
    const allSigned = group.documents.every(d => d.status === 'SIGNED');
    const el = document.createElement('div');
    el.className = 'doc-group';
    el.innerHTML = '<div class="doc-group__header" data-group-toggle="' + group.id + '">' +
      '<div class="doc-group__title">' + group.title + '</div>' +
      '<div class="doc-group__date">' + group.date + '</div>' +
      '<button class="doc-group__toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg></button></div>' +
      '<div class="doc-group__body">' +
      group.documents.map(doc => {
        const s = STATUS_MAP[doc.status] || STATUS_MAP.CREATED;
        const signable = canSign(doc.status);
        return '<div class="doc-row">' +
          '<div class="doc-row__title">' + doc.title + '</div>' +
          '<div class="doc-row__date">' + doc.date + '</div>' +
          '<span class="doc-row__status doc-row__status--' + s.css + '">' + s.label + '</span>' +
          '<div class="doc-row__actions">' +
            '<button class="btn btn--icon btn--ghost" title="Скачать" data-download="' + doc.id + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg></button>' +
            '<button class="btn btn--sm btn--primary" ' + (signable ? '' : 'disabled') + ' data-sign="' + doc.id + '" data-title="' + escapeAttr(doc.title) + '">' + (doc.status === 'SIGNED' ? 'Подписан' : 'Подписать') + '</button>' +
          '</div></div>';
      }).join('') +
      '<button class="btn btn--primary btn--md btn--full doc-group__sign-all" ' + (allSigned ? 'disabled' : '') +
        ' data-sign-all="' + group.id + '">' + (allSigned ? 'Все подписаны' : 'Подписать все') + '</button>' +
      '</div>';
    return el;
  }

  // ─── Doc Types List ──────────────────────────────────────
  function renderDocTypes() {
    const listEl = $('#docTypesList');
    const optionsEl = $('#docTypeOptions');
    listEl.innerHTML = '';
    optionsEl.innerHTML = '';

    docTypesData.forEach(type => {
      // Side-panel list
      const item = document.createElement('div');
      item.className = 'doc-type-item';
      item.innerHTML = '<span class="doc-type-item__title">' + type.title + '</span>' +
        '<button class="btn btn--sm btn--outline" data-fill="' + type.id + '">Заполнить</button>';
      listEl.appendChild(item);

      // Dropdown option
      const opt = document.createElement('button');
      opt.className = 'custom-select__option';
      opt.dataset.val = type.id;
      opt.textContent = type.title;
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const sel = $('#docTypeSelect');
        sel.dataset.value = type.id;
        sel.querySelector('.custom-select__trigger').innerHTML = '<span>' + type.title + '</span>';
        sel.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        sel.classList.remove('open');
      });
      optionsEl.appendChild(opt);
    });
  }

  // ─── Pagination ──────────────────────────────────────────
  function renderPagination() {
    const el = $('#pagination');
    el.innerHTML = '<button class="pagination__btn" disabled>&laquo;</button>' +
      '<button class="pagination__btn" disabled>&lsaquo;</button>' +
      '<button class="pagination__btn pagination__btn--active">1</button>' +
      '<button class="pagination__btn">2</button>' +
      '<button class="pagination__btn">3</button>' +
      '<span class="pagination__ellipsis">&hellip;</span>' +
      '<button class="pagination__btn">34</button>' +
      '<button class="pagination__btn">&rsaquo;</button>' +
      '<button class="pagination__btn">&raquo;</button>';
  }

  // ============================================================
  //  SIGNING FLOW
  // ============================================================
  let currentSignCode = '', currentDocIds = [], currentDocTitle = '', signAttempts = 0, resendTimer = null, resendSeconds = 59;

  function openSmsModal(title) {
    currentSignCode = generateCode(); signAttempts = 0;
    showToast('Код для подписания: ' + currentSignCode);
    $('#smsTitle').textContent = title;
    $('#smsCodeInput').value = ''; $('#smsError').textContent = '';
    updateAttemptsDisplay(); startResendTimer();
    const m = $('#smsModal'); m.classList.add('open'); m.setAttribute('aria-hidden','false');
    setTimeout(() => $('#smsCodeInput').focus(), 60);
  }
  function closeSmsModal() { const m=$('#smsModal'); m.classList.remove('open'); m.setAttribute('aria-hidden','true'); if(resendTimer)clearInterval(resendTimer); }
  function openSuccessModal(t,s) { $('#successTitle').textContent = t||'Документ подписан'; $('#successSubtitle').textContent = s||'Статус обновлён';
    const m = $('#successModal'); m.classList.add('open'); m.setAttribute('aria-hidden','false'); }
  function closeSuccessModal() { const m=$('#successModal'); m.classList.remove('open'); m.setAttribute('aria-hidden','true'); }

  function startResendTimer() { resendSeconds=59; if(resendTimer)clearInterval(resendTimer); updateHintText();
    resendTimer = setInterval(()=>{ resendSeconds--; if(resendSeconds<=0){ clearInterval(resendTimer); $('#smsHintText').textContent='Отправить код повторно'; } else updateHintText(); },1000); }
  function updateHintText() { $('#smsHintText').textContent = 'Отправить снова через ' + resendSeconds + ' с'; }
  function updateAttemptsDisplay() { const r=MAX_SIGN_ATTEMPTS-signAttempts; $('#smsAttempts').textContent = signAttempts>0 ? 'Осталось попыток: '+r : ''; }

  function confirmSmsCode() {
    const input = $('#smsCodeInput').value.trim(), err=$('#smsError');
    if(!input){ err.textContent='Введите код'; return; }
    signAttempts++;
    if(signAttempts>=MAX_SIGN_ATTEMPTS && input!==currentSignCode){
      err.textContent='Превышен лимит попыток. Документ заблокирован.';
      currentDocIds.forEach(id=>{ const d=findDocById(id); if(d) d.status='FAILED'; });
      setTimeout(()=>{ closeSmsModal(); renderDocuments(); },1500); return;
    }
    if(input!==currentSignCode){ err.textContent='Неверный код. Попробуйте ещё раз.'; updateAttemptsDisplay(); return; }
    currentDocIds.forEach(id=>{ const d=findDocById(id); if(d) d.status='SIGNED'; });
    renderDocuments(); closeSmsModal(); openSuccessModal('Документ подписан', currentDocTitle);
  }

  function signDocument(id, title) { const d=findDocById(id); if(!d||!canSign(d.status))return; currentDocIds=[id]; currentDocTitle=title; openSmsModal('Введите код из СМС для подписания'); }
  function signAllDocuments(gid) { const g=documentsData.find(d=>d.id===gid); if(!g||g.type!=='group')return;
    const u=g.documents.filter(d=>canSign(d.status)).map(d=>d.id); if(!u.length)return; currentDocIds=u; currentDocTitle=g.title; openSmsModal('Введите код из СМС для подписания'); }

  // ============================================================
  //  DOCUMENT CREATION FLOW
  // ============================================================
  let createDocTypeId = '';

  function openCreateDocModal(typeId) {
    const type = docTypesData.find(t => t.id === typeId);
    if (!type) return;
    createDocTypeId = typeId;
    $('#createDocType').textContent = type.title;
    $('#createDocClient').value = uuid();
    $('#createDocContent').value = '';
    const m = $('#createDocModal'); m.classList.add('open'); m.setAttribute('aria-hidden','false');
  }

  function closeCreateDocModal() {
    const m = $('#createDocModal'); m.classList.remove('open'); m.setAttribute('aria-hidden','true');
  }

  function submitCreateDoc() {
    const type = docTypesData.find(t => t.id === createDocTypeId);
    if (!type) return;
    const scenarioSel = $('#createDocScenario');
    const scenario = scenarioSel ? scenarioSel.dataset.value : 'TO_BE';
    const content = $('#createDocContent').value.trim();

    const newDoc = {
      id: 'doc-' + Date.now(),
      type: 'single',
      title: type.title,
      date: nowFormatted(),
      status: 'CREATED',
      docType: type.docType,
      scenario: scenario,
      content: content
    };

    documentsData.unshift(newDoc);
    closeCreateDocModal();
    activeFilter = 'all';
    $$('.filter-pill').forEach(b => b.classList.remove('filter-pill--active'));
    const allBtn = document.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('filter-pill--active');
    renderDocuments();
    openSuccessModal('Документ создан', type.title);
  }

  // ============================================================
  //  REPORT ORDERING
  // ============================================================
  function orderReport() {
    const typeSel = $('#reportTypeSelect');
    const dateInput = $('#reportDateInput');
    const typeVal = typeSel.dataset.value;
    const dateVal = dateInput.value;

    if (!typeVal) { showToast('Выберите вид отчёта'); return; }
    if (!dateVal) { showToast('Выберите период'); return; }

    reportsHistory.unshift({
      id: 'rpt-' + Date.now(),
      type: typeVal,
      typeName: REPORT_MAP[typeVal] || typeVal,
      period: formatDate(dateVal),
      orderedAt: nowFormatted(),
      status: 'Готов'
    });

    // Reset form
    typeSel.dataset.value = '';
    typeSel.querySelector('.custom-select__trigger').innerHTML = '<span class="custom-select__placeholder">Выберите вид отчёта</span>';
    typeSel.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('selected'));
    dateInput.value = '';
    const dateText = $('#reportDateText');
    if (dateText) { dateText.textContent = 'Выберите дату'; dateText.className = 'date-field__placeholder'; }

    openSuccessModal('Отчёт заказан', REPORT_MAP[typeVal] || typeVal);
  }

  function renderReportsTable() {
    const tbody = $('#reportsTableBody');
    const empty = $('#reportsEmpty');
    if (!tbody) return;

    if (reportsHistory.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = reportsHistory.map(r =>
      '<tr><td>' + r.typeName + '</td><td>' + r.period + '</td><td>' + r.orderedAt + '</td>' +
      '<td><span class="doc-row__status doc-row__status--signed">' + r.status + '</span></td></tr>'
    ).join('');
  }

  // ============================================================
  //  EVENT DELEGATION
  // ============================================================
  document.addEventListener('click', (e) => {
    const signBtn = e.target.closest('[data-sign]');
    if (signBtn && !signBtn.disabled) { signDocument(signBtn.dataset.sign, signBtn.dataset.title); return; }
    const signAllBtn = e.target.closest('[data-sign-all]');
    if (signAllBtn && !signAllBtn.disabled) { signAllDocuments(signAllBtn.dataset.signAll); return; }
    const downloadBtn = e.target.closest('[data-download]');
    if (downloadBtn) { showToast('Загрузка документа...'); return; }
    const fillBtn = e.target.closest('[data-fill]');
    if (fillBtn) { openCreateDocModal(fillBtn.dataset.fill); return; }
    const groupToggle = e.target.closest('[data-group-toggle]');
    if (groupToggle) { const g=groupToggle.closest('.doc-group'); if(g) g.classList.toggle('collapsed'); return; }
  });

  // ============================================================
  //  FILTERS & SEARCH
  // ============================================================
  function initFilters() {
    $$('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-pill').forEach(b => b.classList.remove('filter-pill--active'));
        btn.classList.add('filter-pill--active');
        activeFilter = btn.dataset.filter;
        renderDocuments();
      });
    });
  }

  function initSearch() {
    const input = $('#searchInput'), clear = $('#searchClear');
    input.addEventListener('input', () => {
      searchQuery = input.value.trim().toLowerCase();
      clear.classList.toggle('visible', input.value.length > 0);
      renderDocuments();
    });
    clear.addEventListener('click', () => { input.value=''; searchQuery=''; clear.classList.remove('visible'); renderDocuments(); });
  }

  // ============================================================
  //  PROFILE DROPDOWN
  // ============================================================
  function initProfile() {
    const btn=$('#profileBtn'), dd=$('#profileDropdown');
    btn.addEventListener('click', (e) => { e.stopPropagation(); dd.classList.toggle('open'); });
    document.addEventListener('click', () => dd.classList.remove('open'));
    dd.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.profile-dropdown__item');
      if (!item) return;
      setTheme(item.dataset.theme);
      dd.classList.remove('open');
      if ($('#tab-analytics').classList.contains('active')) renderAnalytics();
    });
  }

  // ============================================================
  //  MODALS
  // ============================================================
  function initModals() {
    // SMS
    $('#smsClose').addEventListener('click', closeSmsModal);
    $('#smsModal').addEventListener('click', e => { if(e.target===$('#smsModal')) closeSmsModal(); });
    $('#smsConfirm').addEventListener('click', confirmSmsCode);
    const si=$('#smsCodeInput');
    si.addEventListener('input',()=>{ si.value=si.value.replace(/\D/g,'').slice(0,6); $('#smsError').textContent=''; });
    si.addEventListener('keydown',e=>{ if(e.key==='Enter')confirmSmsCode(); if(e.key==='Escape')closeSmsModal(); });
    // Success
    $('#successClose').addEventListener('click', closeSuccessModal);
    $('#successOk').addEventListener('click', closeSuccessModal);
    $('#successModal').addEventListener('click', e=>{ if(e.target===$('#successModal'))closeSuccessModal(); });
    // Create Doc
    $('#createDocClose').addEventListener('click', closeCreateDocModal);
    $('#createDocCancel').addEventListener('click', closeCreateDocModal);
    $('#createDocSubmit').addEventListener('click', submitCreateDoc);
    $('#createDocModal').addEventListener('click', e=>{ if(e.target===$('#createDocModal'))closeCreateDocModal(); });
    // Report order
    $('#orderReportBtn').addEventListener('click', orderReport);
  }

  // ============================================================
  //  ANALYTICS
  // ============================================================
  function renderAnalytics() { renderKpiCards(); renderDynamicsChart(); renderDepartmentsChart(); renderAnalyticsTable(); }

  function renderKpiCards() {
    const tot = monthlyDynamics.reduce((s,m)=>s+m.total,0);
    const comp = monthlyDynamics.reduce((s,m)=>s+m.completed,0);
    const ret = monthlyDynamics.reduce((s,m)=>s+m.returned,0);
    $('#kpiSuccessVal').textContent = ((comp/tot)*100).toFixed(1) + '%';
    $('#kpiAvgTimeVal').textContent = '1.2 мин';
    $('#kpiReturnsVal').textContent = ((ret/tot)*100).toFixed(1) + '%';
    $('#kpiAttemptsVal').textContent = '1.12';
  }

  function getChartColors() {
    const dk = document.body.classList.contains('theme-dark');
    return {
      primary: '#22c55e', danger: '#ef4444',
      text: dk ? '#94a3b8' : '#64748b',
      grid: dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    };
  }

  function renderDynamicsChart() {
    const canvas = $('#chartDynamics'); if(!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = 220 * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = '220px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const w = rect.width, h = 220, colors = getChartColors(), data = monthlyDynamics;
    const pL=48, pR=16, pT=16, pB=32, cW=w-pL-pR, cH=h-pT-pB;
    const maxVal=Math.max(...data.map(d=>d.total))*1.15;
    const bG=cW/data.length, bW=Math.min(bG*0.35,28), gap=3;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle=colors.grid; ctx.lineWidth=1;
    for(let i=0;i<=5;i++){
      const y=pT+(cH/5)*i; ctx.beginPath(); ctx.moveTo(pL,y); ctx.lineTo(w-pR,y); ctx.stroke();
      ctx.fillStyle=colors.text; ctx.font='11px Outfit,sans-serif'; ctx.textAlign='right';
      ctx.fillText(Math.round(maxVal-(maxVal/5)*i).toString(), pL-8, y+4);
    }
    data.forEach((d,i)=>{
      const x=pL+i*bG+(bG-2*bW-gap)/2;
      const h1=(d.completed/maxVal)*cH, y1=pT+cH-h1;
      ctx.fillStyle=colors.primary; roundedRect(ctx,x,y1,bW,h1,4); ctx.fill();
      const h2=(d.returned/maxVal)*cH, y2=pT+cH-h2;
      ctx.fillStyle=colors.danger; roundedRect(ctx,x+bW+gap,y2,bW,h2,4); ctx.fill();
      ctx.fillStyle=colors.text; ctx.font='11px Outfit,sans-serif'; ctx.textAlign='center';
      ctx.fillText(monthLabel(d.month), x+bW+gap/2, h-8);
    });
    ctx.font='11px Outfit,sans-serif';
    ctx.fillStyle=colors.primary; ctx.fillRect(w-pR-150,pT,10,10);
    ctx.fillStyle=colors.text; ctx.textAlign='left'; ctx.fillText('Подписано',w-pR-136,pT+9);
    ctx.fillStyle=colors.danger; ctx.fillRect(w-pR-65,pT,10,10);
    ctx.fillStyle=colors.text; ctx.fillText('Возврат',w-pR-51,pT+9);
  }

  function renderDepartmentsChart() {
    const canvas = $('#chartDepartments'); if(!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr; canvas.height = 220 * dpr;
    canvas.style.width = rect.width + 'px'; canvas.style.height = '220px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
    const w=rect.width, h=220, colors=getChartColors(), data=departmentData;
    const pL=180, pR=60, pT=8, pB=8;
    const cW=w-pL-pR, bH=Math.min(24,(h-pT-pB-(data.length-1)*6)/data.length), gap=6;
    const maxVal=Math.max(...data.map(d=>d.count))*1.1;
    ctx.clearRect(0,0,w,h);
    const pal=['#22c55e','#16a34a','#15803d','#166534','#14532d','#052e16'];
    data.forEach((d,i)=>{
      const y=pT+i*(bH+gap), bw=(d.count/maxVal)*cW;
      ctx.fillStyle=pal[i%pal.length]; roundedRect(ctx,pL,y,bw,bH,4); ctx.fill();
      ctx.fillStyle=colors.text; ctx.font='12px Outfit,sans-serif'; ctx.textAlign='right';
      ctx.fillText(d.department,pL-10,y+bH/2+4);
      ctx.textAlign='left'; ctx.fillText(d.count.toString(),pL+bw+8,y+bH/2+4);
    });
  }

  function roundedRect(ctx,x,y,w,h,r){
    if(h<2*r)r=h/2; if(w<2*r)r=w/2;
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  }

  function renderAnalyticsTable() {
    const tbody=$('#analyticsTableBody'); if(!tbody)return;
    tbody.innerHTML = monthlyDynamics.map(d => {
      const rate=((d.completed/d.total)*100).toFixed(1);
      return '<tr><td>'+monthLabel(d.month)+'</td><td>'+d.total+'</td><td>'+d.completed+'</td><td>'+d.returned+'</td><td>'+rate+'%</td></tr>';
    }).join('');
  }

  let resizeTimer = null;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if($('#tab-analytics').classList.contains('active')) renderAnalytics(); }, 200); });

  // ============================================================
  //  INIT
  // ============================================================
  function init() {
    initTheme();
    initCustomSelects();
    initDateFields();
    initTabs();
    initFilters();
    initSearch();
    initProfile();
    initModals();
    renderDocuments();
    renderDocTypes();
    renderPagination();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
