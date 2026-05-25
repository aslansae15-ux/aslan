const STORAGE_KEY = 'aslanDailyQuestState';
const XP_LEVELS = [0, 100, 250, 500, 900, 1400, 2000];
const DEFAULT_TASKS = [
  {id:'q1', emoji:'🧠', name:'Baca jurnal pagi', dur:15, done:false},
  {id:'q2', emoji:'🏃‍♂️', name:'Gerak tubuh 30 menit', dur:30, done:false},
  {id:'q3', emoji:'📝', name:'Cek daftar misi', dur:10, done:false}
];
const DEFAULT_WEEKLY = [
  {id:'w1', emoji:'📚', name:'Selesaikan 3 latihan', xp:50, done:false},
  {id:'w2', emoji:'🌱', name:'Buat rencana mingguan', xp:50, done:false}
];
const DEFAULT_MONTHLY = [
  {id:'m1', emoji:'🎯', name:'Tuntaskan target bulan ini', xp:100, done:false}
];
const DEFAULT_MOTIVATIONS = [
  'Gerak sedikit hari ini, nanti besok jadinya lebih mudah!',
  'Bulan kedua sudah mulai; kamu bisa terus melaju!',
  'Jangan berhenti setelah 30 hari, Aslan — misi tetap berlanjut!',
  'Setiap hari baru adalah kesempatan untuk jadi lebih hebat.'
];

let state = null;
let missionPinInput = '';
let fbRef = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw);
    }
  } catch (err) {
    state = null;
  }
  if (!state || typeof state !== 'object') {
    const today = new Date();
    state = {
      startDate: today.toISOString().slice(0,10),
      dayIndex: 1,
      completedDays: [],
      history: {},
      quests: JSON.parse(JSON.stringify(DEFAULT_TASKS)),
      weeklyMissions: JSON.parse(JSON.stringify(DEFAULT_WEEKLY)),
      monthlyMissions: JSON.parse(JSON.stringify(DEFAULT_MONTHLY)),
      totalXP: 0,
      streak: 0,
      missionUnlocked: false,
      profile: {},
      manualStreak: 0
    };
  }
  // Ensure history object exists (Firebase uses state.history)
  if (!state.history || typeof state.history !== 'object') state.history = {};
  // Migrate old completedDays -> history if history empty but completedDays exists
  try {
    if (Array.isArray(state.completedDays) && Object.keys(state.history).length === 0 && state.startDate) {
      const sd = new Date(state.startDate);
      state.completedDays.forEach(idx => {
        // idx expected to be absoluteIndex (1-based)
        const dayOffset = (idx - 1);
        const d = new Date(sd.getTime());
        d.setDate(sd.getDate() + dayOffset);
        const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
        state.history[key] = { submitted: true };
      });
    }
  } catch(e){/* ignore migration errors */}
  if (!Array.isArray(state.quests)) state.quests = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  if (!Array.isArray(state.weeklyMissions)) state.weeklyMissions = JSON.parse(JSON.stringify(DEFAULT_WEEKLY));
  if (!Array.isArray(state.monthlyMissions)) state.monthlyMissions = JSON.parse(JSON.stringify(DEFAULT_MONTHLY));
  if (!Array.isArray(state.completedDays)) state.completedDays = [];
  if (!state.history || typeof state.history !== 'object') state.history = {};
  if (typeof state.totalXP !== 'number') state.totalXP = 0;
  if (typeof state.streak !== 'number') state.streak = 0;
  if (typeof state.dayIndex !== 'number' || state.dayIndex < 1) state.dayIndex = 1;
  if (typeof state.missionUnlocked !== 'boolean') state.missionUnlocked = false;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // Sync to Firebase if available (updates history and aggregate XP/streak)
  try {
    if (fbRef) {
      const payload = {
        history: state.history || {},
        totalXP: state.totalXP || 0,
        streak: state.streak || 0
      };
      fbRef.update(payload).catch(()=>{});
    }
  } catch(e){}
}

function formatDayLabel() {
  const month = Math.floor((state.dayIndex - 1) / 30) + 1;
  const monthDay = ((state.dayIndex - 1) % 30) + 1;
  return `Bulan ${month} • Hari ${monthDay}`;
}

function renderAll() {
  renderMessages();
  renderMissionLockBanner();
  renderQuestGrid();
  renderSubmitStatus();
  renderWeeklyMissionBox();
  renderMonthlyMissionBox();
  renderStreakInfo();
  renderProfileStats();
  renderProgressTables();
  renderLevelInfo();
  renderDailyMotivation();
}

function renderMessages() {
  const container = document.getElementById('msgContainer');
  if (!container) return;
  container.innerHTML = `<div class="ayah-msg"><div class="msg-header"><div class="msg-avatar">💬</div><div><div class="msg-label">Halo Aslan</div><div style="font-size:11px;color:#E3F2FD;">${formatDayLabel()}</div></div></div><div class="msg-text">Lanjutkan petualanganmu. Bulan kedua terbuka — terus kerjakan misi harianmu sampai selesai!</div></div>`;
}

function renderDailyMotivation() {
  const box = document.getElementById('dailyMotivationText');
  if (!box) return;
  const text = DEFAULT_MOTIVATIONS[(state.dayIndex - 1) % DEFAULT_MOTIVATIONS.length];
  box.textContent = text;
}

function renderMissionLockBanner() {
  const banner = document.getElementById('missionLockBanner');
  if (!banner) return;
  const title = document.getElementById('missionLockTitle');
  const desc = document.getElementById('missionLockDesc');
  const btn = document.getElementById('missionUnlockBtn');

  if (state.missionUnlocked) {
    banner.classList.remove('locked');
    banner.classList.add('unlocked');
    if (title) title.textContent = 'MISI TERBUKA';
    if (desc) desc.textContent = 'Semua misi hari ini sudah bisa kamu kerjakan.';
    if (btn) btn.textContent = '✅ TERBUKA';
  } else {
    banner.classList.remove('unlocked');
    banner.classList.add('locked');
    if (title) title.textContent = 'MISI TERKUNCI';
    if (desc) desc.textContent = `Masukkan PIN untuk mulai mengerjakan misi hari ini! ${formatDayLabel()}`;
    if (btn) btn.textContent = '🔓 BUKA';
  }
}

function renderQuestGrid() {
  const grid = document.getElementById('questGrid');
  if (!grid) return;
  const items = state.quests.map(q => {
    const done = q.done ? 'done' : '';
    const check = q.done ? '✓' : '';
    return `<div class="quest-card ${done}" data-id="${q.id}">
      <div class="quest-icon-wrap">${q.emoji}</div>
      <div class="check-badge">${check}</div>
      <div class="quest-name">${q.name}</div>
      <div class="quest-time">${q.dur} menit</div>
    </div>`;
  }).join('');
  grid.innerHTML = items;
  grid.querySelectorAll('.quest-card').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', () => {
      if (!state.missionUnlocked) {
        showToast('🔒 Buka misi dulu dengan PIN.');
        openMissionPin();
        return;
      }
      toggleQuestDone(id);
    });
  });
}

function toggleQuestDone(id) {
  const task = state.quests.find(q => q.id === id);
  if (!task) return;
  task.done = !task.done;
  save();
  renderQuestGrid();
  renderSubmitStatus();
}

function allDailyDone() {
  return state.quests.length > 0 && state.quests.every(q => q.done);
}

function renderSubmitStatus() {
  const text = document.getElementById('statusText');
  const btn = document.getElementById('submitBtn');
  if (text) text.textContent = `${state.quests.filter(q => q.done).length} dari ${state.quests.length} misi selesai`;
  if (btn) btn.disabled = !allDailyDone() || !state.missionUnlocked;
}

function renderWeeklyMissionBox() {
  const box = document.getElementById('weeklyMissionBox');
  if (!box) return;
  if (!state.weeklyMissions.length) {
    box.innerHTML = '<div class="no-weekly-missions">Belum ada misi mingguan</div>';
    return;
  }
  box.innerHTML = state.weeklyMissions.map(m => {
    const doneClass = m.done ? 'done' : '';
    const mark = m.done ? '✓' : '';
    return `<div class="wm-item ${doneClass}" data-id="${m.id}"><div class="wm-item-check">${mark}</div><div class="wm-item-text">${m.name}</div><div class="wm-item-xp">+${m.xp} XP</div></div>`;
  }).join('');
  box.querySelectorAll('.wm-item').forEach(item => {
    item.addEventListener('click', () => toggleWeeklyDone(item.dataset.id));
  });
}

function toggleWeeklyDone(id) {
  const mission = state.weeklyMissions.find(m => m.id === id);
  if (!mission) return;
  mission.done = !mission.done;
  save();
  renderWeeklyMissionBox();
}

function renderMonthlyMissionBox() {
  const box = document.getElementById('monthlyMissionBox');
  if (!box) return;
  if (!state.monthlyMissions.length) {
    box.innerHTML = '<div class="no-monthly-missions">Belum ada misi bulanan</div>';
    return;
  }
  box.innerHTML = state.monthlyMissions.map(m => {
    const doneClass = m.done ? 'done' : '';
    const mark = m.done ? '✓' : '';
    return `<div class="mm-item ${doneClass}" data-id="${m.id}"><div class="mm-item-check">${mark}</div><div class="mm-item-text">${m.name}</div><div class="mm-item-xp">+${m.xp} XP</div></div>`;
  }).join('');
  box.querySelectorAll('.mm-item').forEach(item => {
    item.addEventListener('click', () => toggleMonthlyDone(item.dataset.id));
  });
}

function toggleMonthlyDone(id) {
  const mission = state.monthlyMissions.find(m => m.id === id);
  if (!mission) return;
  mission.done = !mission.done;
  save();
  renderMonthlyMissionBox();
}

function renderStreakInfo() {
  const streakNum = document.getElementById('streakNum');
  const weekRow = document.getElementById('weekRow');
  // compute streak from full history (computeStreak uses state.history)
  const computed = (window.computeStreak && typeof window.computeStreak === 'function') ? window.computeStreak() : (state.streak||0);
  state.streak = computed;
  if (streakNum) streakNum.textContent = state.streak || 0;
  if (!weekRow) return;
  // last 7 calendar days (Mon-Sun representation as simple dots)
  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
    const done = state.history && state.history[key] && state.history[key].submitted === true;
    last7.push(done);
  }
  weekRow.innerHTML = last7.map(done => `<div class="week-day ${done ? 'done' : ''}"></div>`).join('');
}

function renderProfileStats() {
  const xpTotal = document.getElementById('totalXpDisplay');
  const pStatStreak = document.getElementById('pStatStreak');
  if (xpTotal) xpTotal.textContent = `${state.totalXP} XP`;
  if (pStatStreak) pStatStreak.textContent = `${state.streak}`;
}

function renderLevelInfo() {
  const levelNum = document.getElementById('levelNum');
  const levelName = document.getElementById('levelName');
  const levelNext = document.getElementById('levelNext');
  const levelBarFill = document.getElementById('levelBarFill');
  if (!levelNum || !levelName || !levelNext || !levelBarFill) return;
  let level = 1;
  while (level < XP_LEVELS.length && state.totalXP >= XP_LEVELS[level]) level++;
  const nextThreshold = XP_LEVELS[Math.min(level, XP_LEVELS.length - 1)];
  const currentThreshold = XP_LEVELS[Math.max(0, level - 1)];
  const progress = nextThreshold > currentThreshold ? Math.min(100, Math.round((state.totalXP - currentThreshold) / (nextThreshold - currentThreshold) * 100)) : 100;
  const names = ['Pejuang Pemula', 'Penjelajah Hebat', 'Pahlawan Tangguh', 'Juara Energik', 'Legenda Kecil', 'Raja Mimpi'];
  levelNum.textContent = `Lv. ${level}`;
  levelName.textContent = names[Math.min(level - 1, names.length - 1)];
  levelNext.textContent = state.totalXP >= nextThreshold ? 'Level tertinggi dicapai!' : `Butuh ${nextThreshold - state.totalXP} XP lagi`;
  levelBarFill.style.width = `${progress}%`;
}

function renderProgressTables() {
  const container = document.getElementById('progressTables');
  if (!container) return;
  // Build month cards from earliest history entry to current month
  const historyKeys = state.history ? Object.keys(state.history) : [];
  // If no history, show message
  if (!historyKeys.length) {
    container.innerHTML = '<div class="no-monthly-missions">Belum ada progress tersimpan</div>';
    return;
  }
  // parse keys into Date objects and determine range
  const dates = historyKeys.map(k => {
    const parts = k.split('-').map(p=>parseInt(p,10));
    return new Date(parts[0], (parts[1]||1)-1, parts[2]||1);
  }).filter(d=>!isNaN(d.getTime())).sort((a,b)=>a-b);
  const start = dates[0];
  const end = new Date();
  // produce list of year-month pairs
  const months = [];
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur.getFullYear() < end.getFullYear() || (cur.getFullYear() === end.getFullYear() && cur.getMonth() <= end.getMonth())) {
    months.push(new Date(cur.getTime()));
    cur.setMonth(cur.getMonth() + 1);
  }
  const monthHtml = months.map(m => {
    const y = m.getFullYear();
    const mm = m.getMonth();
    const monthName = m.toLocaleDateString('id-ID',{month:'long',year:'numeric'});
    const daysInMonth = new Date(y, mm+1, 0).getDate();
    const firstDay = new Date(y, mm, 1);
    const offset = (firstDay.getDay() + 6) % 7; // Monday=0
    const cells = [];
    // leading empty cells
    for (let i = 0; i < offset; i++) cells.push(`<div class="progress-day empty"></div>`);
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(y, mm, d);
      const key = dt.getFullYear() + '-' + (dt.getMonth()+1) + '-' + dt.getDate();
      const done = state.history && state.history[key] && state.history[key].submitted === true;
      cells.push(`<div class="progress-day ${done ? 'done' : ''}" title="${key}">${d}</div>`);
    }
    // pad trailing cells to complete the last week
    while (cells.length % 7 !== 0) cells.push(`<div class="progress-day empty"></div>`);
    const doneCount = cells.filter(c => c.indexOf('progress-day')>=0 && c.indexOf('done')>=0).length;
    return `<details class="month-card"><summary style="font-weight:900;margin-bottom:8px;">${monthName} · ${doneCount} / ${daysInMonth} selesai</summary><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;align-items:center;">${['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(h=>`<div style="font-size:11px;font-weight:800;color:#90A4AE;text-align:center;">${h}</div>`).join('')}${cells.join('')}</div></details>`;
  }).join('');
  container.innerHTML = monthHtml;
}

function openMissionPin() {
  const overlay = document.getElementById('missionPinOverlay');
  const display = document.getElementById('missionPinDisplay');
  const hint = document.getElementById('missionPinHint');
  if (!overlay || !display || !hint) return;
  missionPinInput = '';
  display.textContent = '—';
  hint.textContent = 'PIN bisa diisi 4 digit apa saja untuk lanjut.';
  overlay.classList.add('open');
}

function closeMissionPin() {
  const overlay = document.getElementById('missionPinOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
}

function mpPress(num) {
  if (missionPinInput.length >= 4) return;
  missionPinInput += num;
  updatePinDisplay();
}

function mpDel() {
  missionPinInput = missionPinInput.slice(0, -1);
  updatePinDisplay();
}

function updatePinDisplay() {
  const display = document.getElementById('missionPinDisplay');
  if (!display) return;
  display.textContent = missionPinInput.split('').map(() => '•').join('') || '—';
}

function doMissionLogin() {
  if (missionPinInput.length < 1) {
    showToast('Masukkan PIN minimal 1 digit untuk buka misi.');
    return;
  }
  state.missionUnlocked = true;
  save();
  closeMissionPin();
  renderMissionLockBanner();
  renderSubmitStatus();
  showToast('✅ Misi hari ini terbuka! Klik misi untuk menandai selesai.');
}

function confirmSubmit() {
  if (!state.missionUnlocked) {
    showToast('🔒 Buka misi dulu sebelum kunci hari ini.');
    return;
  }
  if (!allDailyDone()) {
    showToast('Selesaikan semua misi harian dulu.');
    return;
  }
  const overlay = document.getElementById('confirmOverlay');
  const xpNum = document.getElementById('confirmXpNum');
  if (overlay) overlay.classList.add('open');
  if (xpNum) xpNum.textContent = `+${calculateTodayXp()} XP`;
}

function calculateTodayXp() {
  let xp = state.quests.filter(q => q.done).length * 20;
  // +10 bonus only if all daily quests done
  if (allDailyDone()) xp += 10;
  xp += state.weeklyMissions.filter(m => m.done).length * 10;
  xp += state.monthlyMissions.filter(m => m.done).length * 10;
  return xp;
}

function submitDay() {
  if (!allDailyDone()) {
    showToast('Selesaikan semua misi harian dulu.');
    return;
  }
  const todayXP = calculateTodayXp();
  // accumulate XP (never reset)
  state.totalXP = (state.totalXP||0) + todayXP;
  // record history entry for today with submitted=true and quest ids
  const now = new Date();
  const key = now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate();
  const entry = { submitted: true };
  state.quests.filter(q => q.done).forEach(q => { entry[q.id] = true; });
  // preserve any existing metadata
  state.history = state.history || {};
  state.history[key] = Object.assign({}, state.history[key] || {}, entry);
  // advance day index and reset daily flags
  state.missionUnlocked = false;
  state.dayIndex = (state.dayIndex || 1) + 1;
  state.quests.forEach(q => q.done = false);
  state.weeklyMissions.forEach(m => m.done = false);
  state.monthlyMissions.forEach(m => m.done = false);
  // recompute streak (computeStreak will use history)
  if (window.computeStreak && typeof window.computeStreak === 'function') state.streak = window.computeStreak();
  save();
  renderAll();
  document.getElementById('confirmOverlay')?.classList.remove('open');
  showToast('✅ Hari dikunci. Bulan baru bisa dilanjutkan besok!');
}

// compute streak by scanning all history keys (consecutive days up to today)
window.computeStreak = function(){
  if (typeof state === 'undefined' || !state.history) return 0;
  // manual override handled by index.html wrapper
  let streak = 0;
  const today = new Date();
  let cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (true) {
    const key = cur.getFullYear() + '-' + (cur.getMonth()+1) + '-' + cur.getDate();
    if (state.history && state.history[key] && state.history[key].submitted === true) {
      streak++;
      // go back one day
      cur.setDate(cur.getDate() - 1);
      // safety cap: 3650 days (10 years)
      if (streak >= 3650) break;
    } else {
      break;
    }
  }
  return streak;
};

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._aslanToastTimeout);
  window._aslanToastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  // attempt to initialize Firebase sync (if firebase SDK present)
  try {
    initFirebaseSync();
  } catch(e){}
  setInterval(() => {
    renderStreakInfo();
    renderProgressTables();
  }, 10000);
});

// Switch visible tab (called from index.html onclicks)
function switchTab(tab) {
  const mapping = {
    'today': 'tab-today',
    'streak': 'tab-streak',
    'badges': 'tab-badges',
    'progress': 'tab-progress',
    'profile': 'tab-profile',
    'savings': 'tab-savings',
    'karakter': 'tab-karakter',
    'ideas': 'tab-ideas',
    'games': 'tab-games'
  };
  // deactivate all tabs
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  // activate the clicked tab element(s)
  const tabEls = document.querySelectorAll(`.tab-${tab}`);
  tabEls.forEach(el => el.classList.add('active'));
  // hide all tab-contents
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
  const targetId = mapping[tab];
  if (targetId) {
    const target = document.getElementById(targetId.replace('tab-','tab-')) || document.getElementById(targetId);
    if (target) target.classList.add('active');
  }
}

function initFirebaseSync() {
  if (!window.firebase || !firebase.database) return;
  try {
    fbRef = firebase.database().ref('aslan_data');
    // initial one-time merge: prefer remote history and merge local
    fbRef.once('value').then(snap => {
      const remote = snap.val();
      if (!remote) return;
      let changed = false;
      if (remote.history && typeof remote.history === 'object') {
        state.history = Object.assign({}, remote.history, state.history || {});
        changed = true;
      }
      if (typeof remote.totalXP === 'number') {
        state.totalXP = remote.totalXP;
        changed = true;
      }
      if (typeof remote.streak === 'number') {
        state.streak = remote.streak;
        changed = true;
      }
      if (changed) { save(); renderAll(); }
    }).catch(()=>{});
    // listen for remote updates and merge non-conflicting history
    fbRef.on('value', snap => {
      const remote = snap.val();
      if (!remote) return;
      let changed = false;
      if (remote.history && typeof remote.history === 'object') {
        Object.keys(remote.history).forEach(k => {
          if (!state.history[k]) { state.history[k] = remote.history[k]; changed = true; }
        });
      }
      if (typeof remote.totalXP === 'number' && remote.totalXP !== state.totalXP) {
        state.totalXP = remote.totalXP; changed = true;
      }
      if (changed) { save(); renderAll(); }
    });
  } catch(e){}
}
