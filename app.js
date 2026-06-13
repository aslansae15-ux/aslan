// CONFIG
const ADMIN_PW='9380', MISSION_PIN='2705', SAVINGS_PW='9380';
const XP_PER=20, XP_BONUS=10;
const DAYS_ID=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const MONTHS_ID=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONTHS_LONG=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS_LONG=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const LEVELS=[
  {min:0,max:99,num:1,name:'Pejuang Pemula'},
  {min:100,max:249,num:2,name:'Petualang Muda'},
  {min:250,max:499,num:3,name:'Ksatria Belajar'},
  {min:500,max:799,num:4,name:'Pahlawan Ilmu'},
  {min:800,max:1199,num:5,name:'Pejuang Sejati'},
  {min:1200,max:1799,num:6,name:'Pendekar Hebat'},
  {min:1800,max:2499,num:7,name:'Master Quest'},
  {min:2500,max:9999,num:8,name:'LEGENDA KELUARGA'},
];
const DAILY_MOTIVATIONS=[
  '"Setiap langkah kecil hari ini adalah pondasi hebatmu di masa depan! 🚀"',
  '"Orang sukses bukan yang tidak pernah gagal, tapi yang selalu bangkit! 💪"',
  '"Kamu lebih kuat dari yang kamu kira, Aslan! Buktikan hari ini! ⚡"',
  '"Satu misi selesai = satu langkah lebih dekat ke impianmu! 🎯"',
  '"Anak yang rajin hari ini adalah pemimpin yang hebat esok hari! 👑"',
  '"Rezeki datang pada yang bersungguh-sungguh! Semangat misi hari ini! 🌟"',
  '"Disiplin adalah jembatan antara tujuan dan pencapaian! 🌉"',
  '"Setiap hari adalah kesempatan baru untuk jadi lebih baik! ✨"',
  '"Jangan tunggu sempurna untuk mulai — mulailah dulu, baru sempurnakan! 💫"',
  '"Yang membedakan juara dan bukan juara hanya satu: konsistensi! 🥇"',
  '"Mimpimu layak untuk diperjuangkan! Semangat Aslan! 🌈"',
];
const KARAKTER_LIST=[
  {id:'jujur',emoji:'🤝',name:'Jujur'},{id:'sabar',emoji:'😌',name:'Sabar'},
  {id:'rajin',emoji:'💪',name:'Rajin'},{id:'berani',emoji:'🦁',name:'Berani'},
  {id:'dermawan',emoji:'🤲',name:'Dermawan'},{id:'sopan',emoji:'🙏',name:'Sopan'},
  {id:'mandiri',emoji:'⚡',name:'Mandiri'},{id:'penyayang',emoji:'❤️',name:'Penyayang'},
  {id:'kreatif',emoji:'🎨',name:'Kreatif'},{id:'teladan',emoji:'🌟',name:'Teladan'},
];
// IDEA feature removed - emojis previously used for idea modal
const DEFAULT_QUESTS=[
  {id:'english',emoji:'🌍',name:'Bahasa Inggris',dur:30,bg:'#E3F2FD',bc:'#90CAF9'},
  {id:'guitar',emoji:'🎸',name:'Belajar Gitar',dur:30,bg:'#FFF8E1',bc:'#FFD54F'},
  {id:'mengaji',emoji:'📖',name:'Mengaji',dur:30,bg:'#F3E5F5',bc:'#CE93D8'},
];
const COLOR_POOL=[
  {bg:'#E8F5E9',bc:'#81C784'},{bg:'#FCE4EC',bc:'#F48FB1'},
  {bg:'#E0F7FA',bc:'#4DD0E1'},{bg:'#FBE9E7',bc:'#FFAB91'},
  {bg:'#EDE7F6',bc:'#B39DDB'},{bg:'#F9FBE7',bc:'#DCE775'},
  {bg:'#E3F2FD',bc:'#90CAF9'},{bg:'#FFF8E1',bc:'#FFD54F'},
];
const DEFAULT_MSG='"Hei Aslan! Ayah bangga sama kamu. Selesaikan semua misi hari ini dan kamu jadi Hero Keluarga! Yuk semangat! 💪🔥"';
const DEFAULT_BUNDA_MSG='"Aslan sayang Bunda! Jangan lupa makan, minum air yang cukup, dan tetap semangat belajar ya, nak! Bunda selalu sayang kamu! ❤️🤗"';
const DEFAULT_KARAKTER_MOTIVATION='Terus tunjukkan karakter terbaikmu setiap hari, Aslan! 💪\nAyah & Bunda selalu bangga sama kamu! ❤️';
const TANK_UNLOCK_XP=400;
const AUTO_BADGE_IDS=['first','perfect','streak3','streak7','streak14','streak15','streak30','streak40','streak50','streak60','xp100','xp300','xp1000','xp1500','xp2500','xp4000','xp5000','xp6000','quest3','quest20','quest50','hero'];

let state={
  history:{},totalXP:0,badges:{},
  quests:DEFAULT_QUESTS,ayahMsg:DEFAULT_MSG,bundaMsg:DEFAULT_BUNDA_MSG,
  customBadges:[],
  profile:{name:'Aslan Adika Prada',birthdate:'',class:'Kelas 3 SD',photo:null},
  savings:{transactions:[],goal:null},
  karakterAwarded:[],jurnal:{},
  karakterMotivation:DEFAULT_KARAKTER_MOTIVATION,
  // ideas removed
  weeklyMissions:[],monthlyMissions:[],
  weeklyProgress:{},monthlyProgress:{},
  manualStreak:0,
};

// SESSION MISSION UNLOCK
let missionUnlocked = false;
let missionPinVal = '';

function updateMissionPinDisplay(){
  const el=document.getElementById('missionPinDisplay');
  el.textContent=missionPinVal.length?'●'.repeat(missionPinVal.length):'—';
}
function mpPress(c){
  if(missionPinVal.length>=6)return;
  missionPinVal+=c;
  updateMissionPinDisplay();
  document.getElementById('missionPinDisplay').classList.remove('err');
  document.getElementById('missionPinHint').textContent='';
}
function mpDel(){
  missionPinVal=missionPinVal.slice(0,-1);
  updateMissionPinDisplay();
  document.getElementById('missionPinDisplay').classList.remove('err');
  document.getElementById('missionPinHint').textContent='';
}
function openMissionPin(){
  missionPinVal='';
  updateMissionPinDisplay();
  document.getElementById('missionPinHint').textContent='';
  document.getElementById('missionPinDisplay').classList.remove('err');
  document.getElementById('missionPinOverlay').classList.add('open');
}
function closeMissionPin(){
  missionPinVal='';
  updateMissionPinDisplay();
  document.getElementById('missionPinOverlay').classList.remove('open');
}
function doMissionLogin(){
  if(missionPinVal===MISSION_PIN){
    missionUnlocked=true;
    document.getElementById('missionPinOverlay').classList.remove('open');
    missionPinVal='';
    updateMissionPinDisplay();
    renderMissionLockBanner();
    renderQuestGrid();
    renderWeeklyMissionBox();
    renderMonthlyMissionBox();
    showToast('🔓 Misi terbuka! Selamat mengerjakan! 💪');
  } else {
    const disp=document.getElementById('missionPinDisplay');
    disp.classList.add('err');
    document.getElementById('missionPinHint').textContent='❌ PIN salah, coba lagi!';
    missionPinVal='';
    updateMissionPinDisplay();
    setTimeout(()=>{
      disp.classList.remove('err');
      document.getElementById('missionPinHint').textContent='';
    },1800);
  }
}
function renderMissionLockBanner(){
  const banner=document.getElementById('missionLockBanner');
  const icon=document.getElementById('missionLockIcon');
  const title=document.getElementById('missionLockTitle');
  const desc=document.getElementById('missionLockDesc');
  const btn=document.getElementById('missionUnlockBtn');
  if(missionUnlocked){
    banner.className='mission-lock-banner unlocked';
    icon.textContent='✅';
    title.textContent='MISI TERBUKA!';
    desc.textContent='Semangat kerjakan semua misi hari ini, Aslan! 🌟';
    btn.textContent='✅ Siap!';
    btn.onclick=null;
    btn.style.cursor='default';
  } else {
    banner.className='mission-lock-banner locked';
    icon.textContent='🔒';
    title.textContent='MISI TERKUNCI';
    desc.textContent='Masukkan PIN untuk mulai mengerjakan misi hari ini!';
    btn.textContent='🔓 BUKA';
    btn.onclick=openMissionPin;
    btn.style.cursor='pointer';
  }
}

let adminUnlocked=false,savingsUnlocked=false,savingsLoginVal='';
let fbListenerAttached=false,tempPhotoData=null,editingTxnId=null;
let currentSavingsType='credit',selectedKarakter=null;

function formatRp(n){if(isNaN(n))return 'Rp 0';return 'Rp '+Math.abs(n).toLocaleString('id-ID');}

function setSyncStatus(st){
  const dot=document.getElementById('syncDot');
  dot.className='sync-dot'+(st==='syncing'?' syncing':st==='error'?' error':'');
}
function save(){
  try{localStorage.setItem('aslan_v8',JSON.stringify(state));}catch(e){}
  setSyncStatus('syncing');
  FB_REF.set(state).then(()=>setSyncStatus('ok')).catch(()=>setSyncStatus('error'));
}
function mergeState(p){
  // ✅ DEEP MERGE: Preserve history to prevent streak reset
  const oldHistory=state.history||{};
  state=Object.assign({},state,p);
  // Merge history day by day - keep whichever has more data for each day
  if(p.history){
    state.history=Object.assign({},oldHistory,p.history);
    for(let key in oldHistory){
      if(!state.history[key])state.history[key]={};
      state.history[key]=Object.assign({},oldHistory[key],p.history[key]||{});
    }
  }
  if(!p.quests||!Array.isArray(p.quests)||p.quests.length===0)state.quests=DEFAULT_QUESTS;
  if(!p.ayahMsg)state.ayahMsg=DEFAULT_MSG;
  if(!p.bundaMsg)state.bundaMsg=DEFAULT_BUNDA_MSG;
  if(!p.customBadges)state.customBadges=[];
  if(state.customBadges && Array.isArray(state.customBadges)){
    state.customBadges = state.customBadges.map(cb => {
      if(cb.name && cb.name.toLowerCase().includes('nonton bioskop') && cb.xpRequired===3500){
        return Object.assign({}, cb, {xpRequired:4000});
      }
      return cb;
    });
  }
  if(!p.profile)state.profile={name:'Aslan Adika Prada',birthdate:'',class:'Kelas 3 SD',photo:null};
  const oldSavings = state.savings||{transactions:[],goal:null};
  if(p.savings===undefined||p.savings===null){
    state.savings=oldSavings;
  } else {
    state.savings = Object.assign({}, oldSavings, p.savings);
    const localTxns = Array.isArray(oldSavings.transactions) ? oldSavings.transactions : [];
    const remoteTxns = Array.isArray(p.savings.transactions) ? p.savings.transactions : [];
    const mergedTxns = {};
    localTxns.concat(remoteTxns).forEach(tx => {
      if(tx && tx.id) mergedTxns[tx.id] = tx;
    });
    state.savings.transactions = Object.values(mergedTxns);
    if(!Array.isArray(state.savings.transactions)) state.savings.transactions=[];
  }
  if(!state.savings)state.savings={transactions:[],goal:null};
  if(!state.karakterAwarded)state.karakterAwarded=[];
  if(!p.jurnal)state.jurnal={};
  if(!p.karakterMotivation)state.karakterMotivation=DEFAULT_KARAKTER_MOTIVATION;
  // ideas removed
  if(!p.weeklyMissions)state.weeklyMissions=[];
  if(!p.monthlyMissions)state.monthlyMissions=[];
  if(!p.weeklyProgress)state.weeklyProgress={};
  if(!p.monthlyProgress)state.monthlyProgress={};
  // ✅ PATCH: baca manualStreak dari Firebase, tapi jangan turunkan nilai jika lokal lebih tinggi
  const localManual = state.manualStreak || 0;
  if(p.manualStreak===undefined||p.manualStreak===null){
    state.manualStreak = localManual;
  } else {
    state.manualStreak = Math.max(localManual, p.manualStreak || 0);
  }
}
function load(){
  try{
    const raw=localStorage.getItem('aslan_v8')||localStorage.getItem('aslan_v7')||localStorage.getItem('aslan_v6');
    if(raw){mergeState(JSON.parse(raw));}
  }catch(e){}
    renderAll();
    // Cleanup any leftover ideas data (remove from local state and remote DB)
    if(state.ideas){
      delete state.ideas;
      try{localStorage.setItem('aslan_v8',JSON.stringify(state));}catch(e){}
      if(typeof FB_REF!=='undefined' && FB_REF && FB_REF.set){
        FB_REF.set(state).then(()=>setSyncStatus('ok')).catch(()=>setSyncStatus('error'));
      }
    }
  if(!fbListenerAttached){
    fbListenerAttached=true;setSyncStatus('syncing');
    FB_REF.on('value',(snap)=>{
      const data=snap.val();
        if(data){
          // remove ideas from remote payload if present
          if(data.ideas){ delete data.ideas; FB_REF.set(data).catch(()=>{}); }
          mergeState(data);try{localStorage.setItem('aslan_v8',JSON.stringify(state));}catch(e){}setSyncStatus('ok');
        }
      else{FB_REF.set(state).then(()=>setSyncStatus('ok')).catch(()=>setSyncStatus('error'));}
      renderAll();
      if(savingsUnlocked&&document.getElementById('savingsParentOverlay').classList.contains('open'))renderParentLedger();
    },()=>setSyncStatus('error'));
  }
}

function dateKey(d){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function todayKey(){return dateKey(new Date());}
function todayData(){const k=todayKey();if(!state.history[k])state.history[k]={};return state.history[k];}
function getDataForKey(k){if(!state.history[k])state.history[k]={};return state.history[k];}
function getHistoricalStreakThreshold(){
  let minCount=Infinity;
  Object.values(state.history).forEach(h=>{
    if(h.submitted){
      const count = Object.keys(h).filter(k=>k!=='submitted' && h[k]).length;
      if(count>0 && count < minCount) minCount = count;
    }
  });
  return minCount===Infinity ? 1 : minCount;
}
function isDayComplete(key){
  const h=state.history[key]||{};
  if(h.submitted) return true;
  const completedCount = Object.keys(h).filter(k=>k!=='submitted' && h[k]).length;
  const threshold = getHistoricalStreakThreshold();
  return completedCount >= threshold && completedCount > 0;
}
function getWeekKey(d){
  const dt=new Date(d);dt.setHours(0,0,0,0);dt.setDate(dt.getDate()+4-(dt.getDay()||7));
  const yearStart=new Date(dt.getFullYear(),0,1);
  const wk=Math.ceil((((dt-yearStart)/86400000)+1)/7);
  return dt.getFullYear()+'-W'+String(wk).padStart(2,'0');
}
function getMonthKey(d){return d.getFullYear()+'-'+(d.getMonth()+1);}
function currentWeekKey(){return getWeekKey(new Date());}
function currentMonthKey(){return getMonthKey(new Date());}

function getLevel(xp){for(let i=LEVELS.length-1;i>=0;i--){if(xp>=LEVELS[i].min)return LEVELS[i];}return LEVELS[0];}
function renderLevel(){
  const lv=getLevel(state.totalXP);
  const next=LEVELS.find(l=>l.num===lv.num+1);
  document.getElementById('levelNum').textContent='Lv. '+lv.num;
  document.getElementById('levelName').textContent=lv.name;
  document.getElementById('headerLevel').textContent='⭐ Level '+lv.num+' · '+lv.name;
  if(next){
    const prog=((state.totalXP-lv.min)/(next.min-lv.min))*100;
    document.getElementById('levelBarFill').style.width=Math.min(100,prog)+'%';
    document.getElementById('levelNext').textContent='Butuh '+(next.min-state.totalXP)+' XP lagi → Lv.'+next.num;
  }else{
    document.getElementById('levelBarFill').style.width='100%';
    document.getElementById('levelNext').textContent='🎉 Level Maksimum! LEGENDA!';
  }
}
function getDailyMotivation(){
  const dayOfYear=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/(1000*60*60*24));
  return DAILY_MOTIVATIONS[dayOfYear%DAILY_MOTIVATIONS.length];
}

function updateSavingsLockDisplay(){const el=document.getElementById('savingsLockDisplay');el.textContent=savingsLoginVal.length?'●'.repeat(savingsLoginVal.length):'—';}
function savNpPress(c){if(savingsLoginVal.length>=6)return;savingsLoginVal+=c;updateSavingsLockDisplay();document.getElementById('savingsLockDisplay').classList.remove('err');document.getElementById('savingsLockHint').textContent='';}
function savNpDel(){savingsLoginVal=savingsLoginVal.slice(0,-1);updateSavingsLockDisplay();document.getElementById('savingsLockDisplay').classList.remove('err');document.getElementById('savingsLockHint').textContent='';}
function doSavingsLogin(){
  if(savingsLoginVal===SAVINGS_PW){savingsUnlocked=true;document.getElementById('savingsLockOverlay').classList.remove('open');savingsLoginVal='';updateSavingsLockDisplay();openSavingsParent();}
  else{document.getElementById('savingsLockDisplay').classList.add('err');document.getElementById('savingsLockHint').textContent='❌ Password salah!';savingsLoginVal='';updateSavingsLockDisplay();setTimeout(()=>{document.getElementById('savingsLockDisplay').classList.remove('err');document.getElementById('savingsLockHint').textContent='';},1800);}
}
function openSavingsLock(){savingsUnlocked=false;savingsLoginVal='';updateSavingsLockDisplay();document.getElementById('savingsLockHint').textContent='';document.getElementById('savingsLockDisplay').classList.remove('err');document.getElementById('savingsLockOverlay').classList.add('open');}
function closeSavingsLock(){savingsLoginVal='';updateSavingsLockDisplay();document.getElementById('savingsLockOverlay').classList.remove('open');}

function openSavingsParent(){renderParentLedger();document.getElementById('savingsParentOverlay').classList.add('open');showToast('💰 Panel Tabungan dibuka!');}
function closeSavingsParent(){document.getElementById('savingsParentOverlay').classList.remove('open');savingsUnlocked=false;}
function renderParentLedger(){
  const txns=(state.savings&&state.savings.transactions)||[];
  const balance=computeSavingsBalance();
  document.getElementById('spmBalanceDisplay').textContent=formatRp(balance);
  const ledger=document.getElementById('spmLedger');
  if(!txns.length){ledger.innerHTML='<div class="spm-ledger-empty">Belum ada transaksi.<br>Mulai menabung sekarang! 🐷</div>';return;}
  const sorted=[...txns].reverse();ledger.innerHTML='';
  sorted.forEach(t=>{
    const isCredit=t.type==='credit';
    const row=document.createElement('div');row.className='savings-txn';
    const d=new Date(t.timestamp);
    const dateStr=d.getDate()+' '+MONTHS_ID[d.getMonth()]+' '+d.getFullYear()+', '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    row.innerHTML=`<div class="txn-icon ${isCredit?'credit-icon':'debit-icon'}">${isCredit?'⬆️':'⬇️'}</div><div class="txn-info"><div class="txn-desc">${t.desc||'—'}</div><div class="txn-date">${dateStr}</div></div><div class="txn-amount ${isCredit?'credit-amt':'debit-amt'}">${isCredit?'+':'-'}${formatRp(t.amount)}</div><div class="txn-actions"><button class="txn-edit-btn" onclick="openEditTxn('${t.id}')">✏️</button><button class="txn-del-btn" onclick="deleteTxn('${t.id}')">🗑️</button></div>`;
    ledger.appendChild(row);
  });
}
function openGoalModal(){
  const g=(state.savings&&state.savings.goal)||{};
  document.getElementById('goalNameInput').value=g.name||'';
  document.getElementById('goalAmountInput').value=g.amount||'';
  document.getElementById('goalOverlay').classList.add('open');
}
function saveGoal(){
  const name=document.getElementById('goalNameInput').value.trim();
  const amount=parseInt(document.getElementById('goalAmountInput').value)||0;
  if(!name||amount<=0){showToast('Isi nama dan jumlah target!',true);return;}
  if(!state.savings)state.savings={transactions:[],goal:null};
  state.savings.goal={name,amount};
  document.getElementById('goalOverlay').classList.remove('open');
  save();renderSavings();showToast('🎯 Target tabungan disimpan!');
}

// ✅ PATCH: computeStreak berdasarkan riwayat nyata
function computeStreak(){
  const today=new Date();
  let streak=0;
  const todayK=dateKey(today);
  const todayComplete=isDayComplete(todayK);
  const startFrom=todayComplete?0:1;
  for(let i=startFrom;i<400;i++){
    const d=new Date(today);
    d.setDate(today.getDate()-i);
    const k=dateKey(d);
    if(isDayComplete(k)) {streak++;} else {break;}
  }
  return Math.max(streak, state.manualStreak||0);
}

// ✅ PATCH: fungsi untuk set manualStreak dari admin panel
function setManualStreak(val){
  const n=parseInt(val)||0;
  state.manualStreak=n;
  save();renderAll();
  showToast(n>0?'🔥 Streak diset ke '+n+' hari!':'✅ Streak kembali otomatis');
}

function getGridCols(n){if(n<=2)return 'repeat(2,1fr)';if(n<=3)return 'repeat(3,1fr)';if(n===4)return 'repeat(2,1fr)';return 'repeat(3,1fr)';}

function renderQuestGrid(){
  const grid=document.getElementById('questGrid');
  grid.style.gridTemplateColumns=getGridCols(state.quests.length);
  grid.innerHTML='';
  const d=todayData();
  state.quests.forEach(q=>{
    const done=!!d[q.id];
    const locked=!missionUnlocked&&!d.submitted;
    const card=document.createElement('div');
    card.className='quest-card'+(done?' done':'')+(locked?' locked-card':'');
    card.id='card-'+q.id;
    const safeEmoji=q.emoji.replace(/'/g,"\\'");
    const safeName=q.name.replace(/'/g,"\\'");
    card.innerHTML=`<div class="quest-icon-wrap" style="background:${q.bg};border-color:${q.bc};">${locked&&!done?'🔒':q.emoji}<div class="check-badge">✓</div></div><div class="quest-name">${q.name}</div><div class="quest-time">⏱ ${q.dur} menit</div><button class="timer-btn" onclick="openTimer('${q.id}','${safeName}','${safeEmoji}',${q.dur});event.stopPropagation();">▶ Mulai Timer</button>`;
    card.addEventListener('click',()=>{
      if(locked){openMissionPin();return;}
      toggleQuest(q.id);
    });
    grid.appendChild(card);
  });
}

function toggleQuest(id){
  const d=todayData();
  if(d.submitted){showToast('Hari ini sudah dikunci! 🎉');return;}
  if(!missionUnlocked){openMissionPin();return;}
  if(d[id]){delete d[id];showToast('↩ Dibatalkan');}
  else{d[id]=true;showToast('✅ Bagus Aslan! +20 XP!');}
  save();renderAll();
}

function confirmSubmit(){
  const d=todayData();const total=state.quests.length;const count=state.quests.filter(q=>d[q.id]).length;
  if(count<total)return;
  const xp=count*XP_PER+XP_BONUS;
  document.getElementById('confirmXpNum').textContent='+'+xp+' XP';
  document.getElementById('confirmOverlay').classList.add('open');
}
function submitDay(){
  document.getElementById('confirmOverlay').classList.remove('open');
  const d=todayData();const total=state.quests.length;const count=state.quests.filter(q=>d[q.id]).length;
  if(count<total)return;
  d.submitted=true;
  const xp=count*XP_PER+XP_BONUS;
  state.totalXP+=xp;
  checkBadges();
  save();renderAll();
  showConfetti();showToast('🎉 LUAR BIASA! +'+xp+' XP! Kamu HERO!');
}

function renderWeeklyMissionBox(){
  const box=document.getElementById('weeklyMissionBox');
  const missions=state.weeklyMissions||[];
  if(!missions.length){box.innerHTML='';return;}
  const wk=currentWeekKey();const prog=state.weeklyProgress[wk]||{};
  const locked=!missionUnlocked;
  let itemsHtml='';
  missions.forEach(m=>{
    const done=!!prog[m.id];
    itemsHtml+=`<div class="wm-item${done?' done':''}${locked&&!done?' mission-locked-item':''}" onclick="toggleWeeklyMission('${m.id}')"><div class="wm-item-check">${done?'✓':(locked?'🔒':'')}</div><div class="wm-item-text">${m.emoji||'📌'} ${m.name}</div><div class="wm-item-xp">+${m.xp||50} XP</div></div>`;
  });
  const now=new Date();const day=now.getDay()||7;const daysLeft=7-day+1;
  box.innerHTML=`<div class="weekly-mission-card"><div class="weekly-mission-header"><div class="weekly-mission-icon">📅</div><div><div class="weekly-mission-title">MISI MINGGUAN</div><div class="weekly-mission-deadline">⏳ ${daysLeft} hari lagi sampai reset</div></div></div>${itemsHtml}</div>`;
}

function renderMonthlyMissionBox(){
  const box=document.getElementById('monthlyMissionBox');
  const missions=state.monthlyMissions||[];
  if(!missions.length){box.innerHTML='';return;}
  const mk=currentMonthKey();const prog=state.monthlyProgress[mk]||{};
  const locked=!missionUnlocked;
  let itemsHtml='';
  missions.forEach(m=>{
    const done=!!prog[m.id];
    itemsHtml+=`<div class="mm-item${done?' done':''}${locked&&!done?' mission-locked-item':''}" onclick="toggleMonthlyMission('${m.id}')"><div class="mm-item-check">${done?'✓':(locked?'🔒':'')}</div><div class="mm-item-text">${m.emoji||'🎯'} ${m.name}</div><div class="mm-item-xp">+${m.xp||100} XP</div></div>`;
  });
  const now=new Date();const daysInMonth=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();const daysLeft=daysInMonth-now.getDate()+1;
  box.innerHTML=`<div class="monthly-mission-card"><div class="monthly-mission-header"><div class="monthly-mission-icon">🗓️</div><div><div class="monthly-mission-title">MISI BULANAN</div><div style="font-size:10px;color:#FF6F00;font-weight:700;margin-top:2px;">⏳ ${daysLeft} hari lagi sampai reset</div></div></div>${itemsHtml}</div>`;
}

function toggleWeeklyMission(id){
  if(!missionUnlocked){openMissionPin();return;}
  const wk=currentWeekKey();if(!state.weeklyProgress[wk])state.weeklyProgress[wk]={};
  const prog=state.weeklyProgress[wk];const mission=(state.weeklyMissions||[]).find(m=>m.id===id);if(!mission)return;
  if(prog[id]){delete prog[id];state.totalXP=Math.max(0,state.totalXP-(mission.xp||50));showToast('↩ Misi mingguan dibatalkan');}
  else{prog[id]=true;state.totalXP+=(mission.xp||50);showToast('✅ Misi Mingguan Selesai! +'+mission.xp+' XP! 🎉');showConfetti();}
  checkBadges();save();renderAll();
}

function toggleMonthlyMission(id){
  if(!missionUnlocked){openMissionPin();return;}
  const mk=currentMonthKey();if(!state.monthlyProgress[mk])state.monthlyProgress[mk]={};
  const prog=state.monthlyProgress[mk];const mission=(state.monthlyMissions||[]).find(m=>m.id===id);if(!mission)return;
  if(prog[id]){delete prog[id];state.totalXP=Math.max(0,state.totalXP-(mission.xp||100));showToast('↩ Misi bulanan dibatalkan');}
  else{prog[id]=true;state.totalXP+=(mission.xp||100);showToast('✅ Misi Bulanan Selesai! +'+mission.xp+' XP! 🎉');showConfetti();}
  checkBadges();save();renderAll();
}

function addWeeklyMission(){
  const emoji=document.getElementById('wmEmojiInput').value.trim()||'📌';
  const name=document.getElementById('wmNameInput').value.trim();
  const xp=parseInt(document.getElementById('wmXpInput').value)||50;
  if(!name){showToast('Isi nama misi!',true);return;}
  if(!state.weeklyMissions)state.weeklyMissions=[];
  state.weeklyMissions.push({id:'wm_'+Date.now(),emoji,name,xp});
  document.getElementById('wmEmojiInput').value='';document.getElementById('wmNameInput').value='';document.getElementById('wmXpInput').value='50';
  save();renderAll();renderWMAdminList();showToast('✅ Misi mingguan ditambahkan!');
}
function addMonthlyMission(){
  const emoji=document.getElementById('mmEmojiInput').value.trim()||'🎯';
  const name=document.getElementById('mmNameInput').value.trim();
  const xp=parseInt(document.getElementById('mmXpInput').value)||100;
  if(!name){showToast('Isi nama misi!',true);return;}
  if(!state.monthlyMissions)state.monthlyMissions=[];
  state.monthlyMissions.push({id:'mm_'+Date.now(),emoji,name,xp});
  document.getElementById('mmEmojiInput').value='';document.getElementById('mmNameInput').value='';document.getElementById('mmXpInput').value='100';
  save();renderAll();renderMMAdminList();showToast('✅ Misi bulanan ditambahkan!');
}
function deleteWeeklyMission(id){state.weeklyMissions=(state.weeklyMissions||[]).filter(m=>m.id!==id);save();renderAll();renderWMAdminList();showToast('🗑️ Misi mingguan dihapus',true);}
function deleteMonthlyMission(id){state.monthlyMissions=(state.monthlyMissions||[]).filter(m=>m.id!==id);save();renderAll();renderMMAdminList();showToast('🗑️ Misi bulanan dihapus',true);}
function renderWMAdminList(){
  const list=document.getElementById('wmListAdmin');if(!list)return;
  const missions=state.weeklyMissions||[];
  if(!missions.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;padding:8px;">Belum ada misi mingguan.</p>';return;}
  list.innerHTML='';
  missions.forEach(m=>{const row=document.createElement('div');row.className='wm-admin-row';row.innerHTML=`<span>${m.emoji||'📌'}</span><span class="wm-admin-name">${m.name}</span><span class="wm-admin-xp">+${m.xp} XP</span><button class="wm-del-btn" onclick="deleteWeeklyMission('${m.id}')">🗑️</button>`;list.appendChild(row);});
}
function renderMMAdminList(){
  const list=document.getElementById('mmListAdmin');if(!list)return;
  const missions=state.monthlyMissions||[];
  if(!missions.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;padding:8px;">Belum ada misi bulanan.</p>';return;}
  list.innerHTML='';
  missions.forEach(m=>{const row=document.createElement('div');row.className='mm-admin-row';row.innerHTML=`<span>${m.emoji||'🎯'}</span><span class="mm-admin-name">${m.name}</span><span class="mm-admin-xp">+${m.xp} XP</span><button class="mm-del-btn" onclick="deleteMonthlyMission('${m.id}')">🗑️</button>`;list.appendChild(row);});
}

function isTankUnlocked(){return state.totalXP>=TANK_UNLOCK_XP;}
function renderTankGame(){
  const unlocked=isTankUnlocked();
  const banner=document.getElementById('tankLockBanner');
  const card=document.getElementById('tankGameCard');
  if(unlocked){
    banner.innerHTML=`<div class="tank-lock-banner unlocked"><span style="font-size:24px;">🎯</span><div class="tank-lock-banner-text">TANK BATTLE sudah terbuka! Selamat bermain! 🎉</div></div>`;
    card.innerHTML=`<a class="game-card tank" href="tank.html"><span class="game-icon">🎯</span><div class="game-name">TANK BATTLE</div><div class="game-desc">Tembak musuh dengan tankmu!</div><span class="game-badge" style="background:#e67e22;color:#fff;">🔥 Mainkan</span></a>`;
  }else{
    const needed=TANK_UNLOCK_XP-state.totalXP;
    banner.innerHTML=`<div class="tank-lock-banner"><span style="font-size:24px;">🔒</span><div class="tank-lock-banner-text">Tank Battle terkunci! Kumpulkan <b>${needed} XP lagi</b> untuk buka!</div><div class="tank-lock-progress">${state.totalXP}/${TANK_UNLOCK_XP} XP</div></div>`;
    card.innerHTML=`<div class="game-card tank locked"><span class="game-icon" style="filter:grayscale(1);opacity:0.5;">🎯</span><div class="game-name" style="color:#90A4AE;">TANK BATTLE</div><div class="game-desc">Butuh ${needed} XP lagi...</div><span class="game-badge" style="background:#9e9e9e;color:#fff;">🔒 Terkunci</span></div>`;
  }
}

function showConfetti(){
  const container=document.getElementById('confettiContainer');container.innerHTML='';
  const colors=['#4CAF50','#FFD700','#FF6B6B','#4FC3F7','#CE93D8','#FFCC02','#81C784'];
  for(let i=0;i<60;i++){
    const piece=document.createElement('div');piece.className='confetti-piece';
    piece.style.left=Math.random()*100+'%';piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.width=(Math.random()*8+4)+'px';piece.style.height=(Math.random()*8+4)+'px';
    piece.style.borderRadius=Math.random()>0.5?'50%':'2px';
    piece.style.animationDuration=(Math.random()*2+2)+'s';piece.style.animationDelay=(Math.random()*1)+'s';
    container.appendChild(piece);
  }
  setTimeout(()=>container.innerHTML='',4000);
}

function renderProfile(){
  const prof=state.profile||{};const name=prof.name||'Aslan Adika Prada';
  document.getElementById('profileNameDisplay').textContent=name.toUpperCase();
  document.getElementById('profileClassBadge').textContent=prof.class||'Kelas 3 SD';
  document.getElementById('profileBirthdate').textContent=formatDate(prof.birthdate);
  const age=calcAge(prof.birthdate);
  document.getElementById('profileAge').textContent=age!==null?age+' tahun':'—';
  document.getElementById('profileWeight').textContent=prof.weight?prof.weight+' kg':'— kg';
  document.getElementById('profileHeight').textContent=prof.height?prof.height+' cm':'— cm';
  const bdCard=document.getElementById('birthdayCountdown');
  if(prof.birthdate){document.getElementById('birthdayCountdownVal').textContent=calcBirthdayCountdown(prof.birthdate);bdCard.style.display='block';}
  else{bdCard.style.display='none';}
  const pd=document.getElementById('profilePhotoDisplay');
  if(prof.photo){pd.innerHTML='<img src="'+prof.photo+'" alt="foto">';}else{pd.innerHTML='⚔️';}
  document.getElementById('pStatXP').textContent=state.totalXP;
  document.getElementById('pStatStreak').textContent=computeStreak();
  document.getElementById('pStatBadges').textContent=Object.keys(state.badges||{}).length;
  const balance=computeSavingsBalance();
  document.getElementById('profileSavingsBalance').textContent=formatRp(balance);
}

function renderAll(){
  renderDate();
  renderMissionLockBanner();
  renderQuestGrid();
  renderStatus();renderXPBar();
  renderStreak();renderBadges();renderMessages();render30DayTables();
  renderProfile();renderCustomBadges();renderSavings();
  renderKarakter();renderLevel();
  renderDailyMotivation();renderWeeklyStats();renderTankGame();
  renderWeeklyMissionBox();renderMonthlyMissionBox();
}
function renderDate(){const d=new Date();document.getElementById('dateDisplay').textContent=DAYS_LONG[d.getDay()]+', '+d.getDate()+' '+MONTHS_ID[d.getMonth()];}

function renderMessages(){
  const container=document.getElementById('msgContainer');
  const ayah=state.ayahMsg||DEFAULT_MSG;
  const bunda=state.bundaMsg||'';
  if(ayah&&bunda){
    container.innerHTML=`<div class="msg-grid"><div class="ayah-msg"><div class="msg-header"><div class="msg-avatar">👨‍💻</div><div class="msg-label">💬 Pesan Ayah</div></div><div class="msg-text">${ayah}</div></div><div class="bunda-msg"><div class="msg-header"><div class="msg-avatar">👩</div><div class="msg-label">💬 Pesan Bunda</div></div><div class="msg-text">${bunda}</div></div></div>`;
  }else if(bunda){
    container.innerHTML=`<div class="msg-single bunda-single"><div class="msg-single-header"><div class="msg-single-avatar">👩</div><div class="msg-single-label">💬 Pesan dari Bunda</div></div><div class="msg-single-text">${bunda}</div></div>`;
  }else{
    container.innerHTML=`<div class="msg-single"><div class="msg-single-header"><div class="msg-single-avatar">👨‍💻</div><div class="msg-single-label">💬 Pesan dari Ayah &amp; Bunda</div></div><div class="msg-single-text">${ayah}</div></div>`;
  }
}

function renderDailyMotivation(){document.getElementById('dailyMotivationText').textContent=getDailyMotivation();}

function renderStatus(){
  const d=todayData();const total=state.quests.length;const count=state.quests.filter(q=>d[q.id]).length;
  document.getElementById('statusText').textContent=count+' dari '+total+' misi selesai';
  const btn=document.getElementById('submitBtn');
  btn.disabled=count<total||!!d.submitted;
  btn.textContent=d.submitted?'🏆 SUDAH SELESAI!':'✅ SEMUA SELESAI!';
}
function renderXPBar(){
  const d=todayData();const total=state.quests.length;const count=state.quests.filter(q=>d[q.id]).length;
  const xp=count*XP_PER+(count===total&&total>0?XP_BONUS:0);
  const max=total*XP_PER+XP_BONUS;
  document.getElementById('xpText').textContent=xp+' / '+max+' XP';
  document.getElementById('xpFill').style.width=max>0?Math.min(100,(xp/max)*100)+'%':'0%';
}

function renderWeeklyStats(){
  const today=new Date();const xpByDay=[];
  for(let i=6;i>=0;i--){
    const d=new Date(today);d.setDate(today.getDate()-i);
    const k=dateKey(d);const h=state.history[k]||{};
    const dayDone=state.quests.filter(q=>h[q.id]).length;
    const dayXP=dayDone*XP_PER+(h.submitted?XP_BONUS:0);
    xpByDay.push({day:DAYS_ID[d.getDay()],xp:dayXP,isToday:i===0});
  }
  const chart=document.getElementById('xpChart');if(!chart)return;
  const maxXP=Math.max(...xpByDay.map(d=>d.xp),1);chart.innerHTML='';
  xpByDay.forEach(({day,xp,isToday})=>{
    const pct=Math.round((xp/maxXP)*100);
    const bar=document.createElement('div');bar.className='xp-bar-day';
    bar.innerHTML=`<div class="xp-bar-fill${isToday?' today-bar':''}" style="height:${pct}%;max-height:60px;min-height:${xp>0?8:4}px;"></div><div class="xp-bar-label">${day}</div>`;
    chart.appendChild(bar);
  });
}

function renderStreak(){
  const s=computeStreak();
  document.getElementById('streakNum').textContent=s;
  document.getElementById('totalXpDisplay').textContent=state.totalXP+' XP';
  const row=document.getElementById('weekRow');row.innerHTML='';
  const today=new Date();
  // Render full month calendar (31 days from start of month to today or end of month)
  const year=today.getFullYear();
  const month=today.getMonth();
  const firstDay=new Date(year,month,1);
  const lastDay=new Date(year,month+1,0);
  const daysInMonth=lastDay.getDate();
  const startDayOfWeek=firstDay.getDay();
  
  // Add day labels
  const dayLabels=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  dayLabels.forEach(label=>{
    const labelEl=document.createElement('div');labelEl.className='day-label';labelEl.textContent=label;
    row.appendChild(labelEl);
  });
  
  // Add empty cells for days before month starts
  for(let i=0;i<startDayOfWeek;i++){
    const emptyEl=document.createElement('div');emptyEl.className='day-dot empty';
    row.appendChild(emptyEl);
  }
  
  // Add days of month
  const todayK=dateKey(today);
  for(let day=1;day<=daysInMonth;day++){
    const d=new Date(year,month,day);
    const k=dateKey(d);const done=isDayComplete(k);const isToday=k===todayK;
    const el=document.createElement('div');el.className='day-dot'+(done?' done':'')+(isToday?' today':'');
    el.innerHTML='<span class="day-num">'+day+'</span><span class="day-check">'+(done?'✓':(isToday?'▸':''))+'</span>';
    row.appendChild(el);
  }
}

function totalDone(){
  const questIds=new Set((state.quests||[]).map(q=>q.id));
  return Object.values(state.history).reduce((a,h)=>{
    if(!h.submitted)return a;
    return a+Object.keys(h).filter(k=>questIds.has(k)).length;
  },0);
}

function checkBadges(){
  state.badges = state.badges || {};
  const st=computeStreak();const xp=state.totalXP;const td=totalDone();
  const d=todayData();const total=state.quests.length;const count=state.quests.filter(q=>d[q.id]).length;
  AUTO_BADGE_IDS.forEach(id=>delete state.badges[id]);
  const unlock=id=>{state.badges[id]=true;};
  if(td>=1)unlock('first');
  if(count===total&&total>0&&d.submitted)unlock('perfect');
  if(st>=3)unlock('streak3');if(st>=7)unlock('streak7');
  if(st>=14)unlock('streak14');if(st>=15)unlock('streak15');if(st>=30)unlock('streak30');
  if(st>=40)unlock('streak40');if(st>=50)unlock('streak50');
  if(xp>=100)unlock('xp100');if(xp>=300)unlock('xp300');
  if(xp>=1000)unlock('xp1000');if(xp>=1500)unlock('xp1500');if(xp>=2500)unlock('xp2500');
  if(xp>=4000)unlock('xp4000');if(xp>=5000)unlock('xp5000');if(xp>=6000)unlock('xp6000');
  if(td>=3)unlock('quest3');if(td>=20)unlock('quest20');if(td>=50)unlock('quest50');
  if(st>=60)unlock('hero');
  (state.customBadges||[]).forEach(cb=>{if(xp>=cb.xpRequired)state.badges[cb.id]=true;});
}

function renderBadges(){
  checkBadges();
  AUTO_BADGE_IDS.forEach(id=>{
    const ic=document.getElementById('bicon-'+id);
    if(ic){if(state.badges[id])ic.classList.add('unlocked');else ic.classList.remove('unlocked');}
  });
  const prof=state.profile||{};
  document.getElementById('headerName').textContent=(prof.name||'ASLAN ADIKA PRADA').toUpperCase();
  document.getElementById('headerSubtitle').textContent='Pejuang Ilmu · '+(prof.class||'Kelas 3 SD');
  const ha=document.getElementById('headerAvatar');
  if(prof.photo){ha.innerHTML='<img src="'+prof.photo+'" alt="foto">';}else{ha.innerHTML='⚔️';}
}
function renderCustomBadges(){
  const cbs=state.customBadges||[];
  const section=document.getElementById('customBadgesSection');
  const grid=document.getElementById('customBadgesGrid');
  if(!cbs.length){section.style.display='none';return;}
  section.style.display='block';grid.innerHTML='';
  cbs.forEach(cb=>{
    const unlocked=!!state.badges[cb.id];
    const item=document.createElement('div');item.className='badge-item'+(unlocked?' unlocked':'');
    item.innerHTML=`<div class="badge-icon ${unlocked?'unlocked':''}" title="${cb.xpRequired} XP">${cb.emoji}</div><div class="badge-name">${cb.name}<br><span style="font-size:7px;color:${unlocked?'#6A1B9A':'#BDBDBD'};">${unlocked?'✓ Terbuka!':cb.xpRequired+' XP'}</span></div>`;
    grid.appendChild(item);
  });
}

function renderKarakter(){
  const awarded=(state.karakterAwarded||[]);
  document.getElementById('karakterCount').textContent=awarded.length;
  document.getElementById('karakterSub').textContent='lencana diterima';
  const motivEl=document.getElementById('karakterMotivation');
  if(motivEl){const motiv=state.karakterMotivation||DEFAULT_KARAKTER_MOTIVATION;motivEl.innerHTML=motiv.replace(/\n/g,'<br>');}
  const display=document.getElementById('karakterBadgesDisplay');
  if(!awarded.length){
    display.innerHTML=`<div class="karakter-empty"><div style="font-size:48px;margin-bottom:12px;">🌱</div><div style="font-size:13px;font-weight:700;color:#90A4AE;line-height:1.6;">Belum ada lencana karakter.<br>Tunjukkan karakter terbaikmu,<br>Ayah &amp; Bunda akan memberimu lencana! 💪</div></div>`;
    return;
  }
  const grid=document.createElement('div');grid.className='karakter-badges-grid';
  awarded.slice().reverse().forEach(a=>{
    const card=document.createElement('div');card.className='karakter-badge-card awarded';
    const dd=new Date(a.timestamp);
    const dateStr=dd.getDate()+' '+MONTHS_ID[dd.getMonth()]+' '+dd.getFullYear();
    card.innerHTML=`<div class="karakter-badge-award-star">⭐</div><div class="karakter-badge-emoji">${a.emoji}</div><div class="karakter-badge-name">${a.name}</div><div class="karakter-badge-date">📅 ${dateStr}</div>${a.note?`<div class="karakter-badge-note">"${a.note}"</div>`:''}`;
    grid.appendChild(card);
  });
  display.innerHTML='';display.appendChild(grid);
  display.innerHTML+='<div style="margin-bottom:16px;"></div>';
}

// Ideas feature removed

function calcAge(birthdate){
  if(!birthdate)return null;
  const bd=new Date(birthdate);const now=new Date();
  let age=now.getFullYear()-bd.getFullYear();
  const m=now.getMonth()-bd.getMonth();
  if(m<0||(m===0&&now.getDate()<bd.getDate()))age--;
  return age;
}
function calcBirthdayCountdown(birthdate){
  if(!birthdate)return null;
  const bd=new Date(birthdate);const now=new Date();
  let next=new Date(now.getFullYear(),bd.getMonth(),bd.getDate());
  if(next<=now)next=new Date(now.getFullYear()+1,bd.getMonth(),bd.getDate());
  const diff=Math.ceil((next-now)/(1000*60*60*24));
  if(diff===0)return '🎂 HARI INI! Selamat Ulang Tahun! 🎉';
  if(diff===1)return '🎂 Besok Ulang Tahun! Siap-siap! 🎈';
  return '🎂 '+diff+' hari lagi';
}
function formatDate(birthdate){
  if(!birthdate)return '—';
  const d=new Date(birthdate);
  return d.getDate()+' '+MONTHS_ID[d.getMonth()]+' '+d.getFullYear();
}

function computeSavingsBalance(){
  const txns=(state.savings&&state.savings.transactions)||[];
  return txns.reduce((sum,t)=>sum+(t.type==='credit'?t.amount:-t.amount),0);
}
function renderSavings(){
  const txns=(state.savings&&state.savings.transactions)||[];
  const balance=computeSavingsBalance();
  document.getElementById('savingsBalanceDisplay').textContent=formatRp(balance);
  document.getElementById('savingsCountDisplay').textContent=txns.length+' transaksi';
  if(document.getElementById('profileSavingsBalance'))document.getElementById('profileSavingsBalance').textContent=formatRp(balance);
  const goal=(state.savings&&state.savings.goal)||null;
  const goalCard=document.getElementById('savingsGoalCard');
  if(goal&&goal.amount>0){
    goalCard.style.display='block';
    document.getElementById('savingsGoalName').textContent=goal.name||'—';
    const pct=Math.min(100,Math.round((balance/goal.amount)*100));
    document.getElementById('savingsGoalFill').style.width=pct+'%';
    document.getElementById('savingsGoalCurrent').textContent=formatRp(balance);
    document.getElementById('savingsGoalTarget').textContent=formatRp(goal.amount)+' ('+pct+'%)';
  }else{goalCard.style.display='none';}
  const ledger=document.getElementById('savingsLedger');
  if(!txns.length){ledger.innerHTML='<div class="savings-ledger-empty">Belum ada transaksi.<br>Tanya Ayah &amp; Bunda untuk mulai menabung! 🐷</div>';return;}
  const sorted=[...txns].reverse();ledger.innerHTML='';
  sorted.forEach(t=>{
    const isCredit=t.type==='credit';
    const row=document.createElement('div');row.className='savings-txn';
    const d=new Date(t.timestamp);
    const dateStr=d.getDate()+' '+MONTHS_ID[d.getMonth()]+' '+d.getFullYear()+', '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
    row.innerHTML=`<div class="txn-icon ${isCredit?'credit-icon':'debit-icon'}">${isCredit?'⬆️':'⬇️'}</div><div class="txn-info"><div class="txn-desc">${t.desc||'—'}</div><div class="txn-date">${dateStr}</div></div><div class="txn-amount ${isCredit?'credit-amt':'debit-amt'}">${isCredit?'+':'-'}${formatRp(t.amount)}</div>`;
    ledger.appendChild(row);
  });
}
function openSavingsModal(type){
  currentSavingsType=type;
  document.getElementById('savingsAmountInput').value='';document.getElementById('savingsDescInput').value='';
  setSavingsType(type);document.getElementById('savingsModalTitle').textContent=type==='credit'?'➕ TABUNG (KREDIT)':'➖ AMBIL (DEBIT)';
  document.getElementById('savingsTypeRow').style.display='flex';
  document.getElementById('savingsOverlay').classList.add('open');
  setTimeout(()=>document.getElementById('savingsAmountInput').focus(),100);
}
function closeSavingsModal(){document.getElementById('savingsOverlay').classList.remove('open');}
function setSavingsType(type){
  currentSavingsType=type;
  document.getElementById('typeCredit').className='savings-type-btn'+(type==='credit'?' credit-sel':'');
  document.getElementById('typeDebit').className='savings-type-btn'+(type==='debit'?' debit-sel':'');
}
function confirmSavingsTransaction(){
  const amount=parseInt(document.getElementById('savingsAmountInput').value);
  const desc=document.getElementById('savingsDescInput').value.trim();
  if(!amount||amount<=0){showToast('Masukkan jumlah yang valid!',true);return;}
  if(!desc){showToast('Keterangan harus diisi!',true);return;}
  if(currentSavingsType==='debit'){const balance=computeSavingsBalance();if(amount>balance){showToast('Saldo tidak cukup! Saldo: '+formatRp(balance),true);return;}}
  if(!state.savings)state.savings={transactions:[],goal:null};
  if(!state.savings.transactions)state.savings.transactions=[];
  const txn={id:'txn_'+Date.now(),type:currentSavingsType,amount,desc,timestamp:Date.now()};
  state.savings.transactions.push(txn);
  save();renderSavings();renderParentLedger();closeSavingsModal();
  showToast(currentSavingsType==='credit'?'💰 Ditabung '+formatRp(amount)+'!':'💸 Diambil '+formatRp(amount));
}
function openEditTxn(id){
  const txns=(state.savings&&state.savings.transactions)||[];
  const t=txns.find(x=>x.id===id);if(!t)return;
  editingTxnId=id;
  document.getElementById('editAmountInput').value=t.amount;
  document.getElementById('editDescInput').value=t.desc||'';
  document.getElementById('savingsEditOverlay').classList.add('open');
}
function confirmEditTransaction(){
  const amount=parseInt(document.getElementById('editAmountInput').value);
  const desc=document.getElementById('editDescInput').value.trim();
  if(!amount||amount<=0){showToast('Masukkan jumlah yang valid!',true);return;}
  if(!desc){showToast('Keterangan harus diisi!',true);return;}
  const txns=(state.savings&&state.savings.transactions)||[];
  const idx=txns.findIndex(x=>x.id===editingTxnId);if(idx===-1)return;
  txns[idx].amount=amount;txns[idx].desc=desc;
  document.getElementById('savingsEditOverlay').classList.remove('open');editingTxnId=null;
  save();renderSavings();renderParentLedger();showToast('✏️ Transaksi diperbarui!');
}
function deleteTxn(id){
  if(!confirm('Hapus transaksi ini?'))return;
  state.savings.transactions=state.savings.transactions.filter(t=>t.id!==id);
  save();renderSavings();renderParentLedger();showToast('🗑️ Transaksi dihapus',true);
}

function render30DayTables(){
  const wrap=document.getElementById('progressTables');wrap.innerHTML='';
  const today=new Date();const todayK=dateKey(today);
  state.quests.forEach(q=>{
    let doneCount=0;let gridHtml='';
    for(let i=0;i<30;i++){
      const d=new Date(today);d.setDate(today.getDate()-(29-i));
      const k=dateKey(d);const h=state.history[k]||{};const filled=!!h[q.id];const isToday=k===todayK;
      if(filled)doneCount++;
      gridHtml+=`<div class="day-box${filled?' filled':''}${isToday?' today-box':''}" style="${filled?'background:'+q.bg+';border-color:'+q.bc+';':''}" title="${d.getDate()+' '+MONTHS_ID[d.getMonth()]}"><div>${d.getDate()}</div><div>${filled?'✓':(isToday?'▸':'')}</div></div>`;
    }
    const card=document.createElement('div');card.className='table-card';card.style.borderColor=q.bc;
    card.innerHTML=`<div class="table-header"><div class="table-header-icon" style="background:${q.bg};border-color:${q.bc};">${q.emoji}</div><div><div class="table-header-title">${q.name}</div><div class="table-header-count">${doneCount} dari 30 hari selesai</div></div></div><div class="days-grid-30">${gridHtml}</div>`;
    wrap.appendChild(card);
  });
}

const TAB_ORDER=['today','streak','badges','progress','profile','savings','karakter','games'];
function switchTab(tab){
  const allTabs=document.querySelectorAll('.tab');
  const allContents=document.querySelectorAll('.tab-content');
  allTabs.forEach(el=>{
    const isActive=el.onclick&&el.onclick.toString().includes("'"+tab+"'");
    if(tab==='today')el.classList.toggle('active',el.classList.contains('tab-misi'));
    else if(tab==='streak')el.classList.toggle('active',el.classList.contains('tab-streak'));
    else if(tab==='badges')el.classList.toggle('active',el.classList.contains('tab-piala'));
    else if(tab==='progress')el.classList.toggle('active',el.classList.contains('tab-log'));
    else if(tab==='profile')el.classList.toggle('active',el.classList.contains('tab-profil'));
    else if(tab==='savings')el.classList.toggle('active',el.classList.contains('tab-nabung'));
    else if(tab==='karakter')el.classList.toggle('active',el.classList.contains('tab-karakter'));
    else if(tab==='games')el.classList.toggle('active',el.classList.contains('tab-game'));
    else el.classList.remove('active');
  });
  allContents.forEach(el=>el.classList.toggle('active',el.id==='tab-'+tab));
  if(tab==='progress')render30DayTables();
  if(tab==='profile')renderProfile();
  if(tab==='savings')renderSavings();
  if(tab==='karakter')renderKarakter();
  if(tab==='streak'){renderStreak();renderWeeklyStats();renderLevel();}
  if(tab==='games')renderTankGame();
}

let timerInterval=null,timerSecs=30*60,timerRunning=false,activeTimerQuest=null;
function openTimer(qId,label,emoji,dur){
  activeTimerQuest=qId;timerSecs=(dur||30)*60;timerRunning=false;clearInterval(timerInterval);
  document.getElementById('timerEmoji').textContent=emoji;
  document.getElementById('timerTitle').textContent=label.toUpperCase();
  document.getElementById('timerToggle').textContent='▶ Mulai';
  renderTimerDisplay();document.getElementById('timerOverlay').classList.add('open');
}
function closeTimer(){clearInterval(timerInterval);timerRunning=false;timerInterval=null;document.getElementById('timerOverlay').classList.remove('open');}
function toggleTimer(){
  if(timerRunning){clearInterval(timerInterval);timerRunning=false;document.getElementById('timerToggle').textContent='▶ Lanjut';}
  else{
    timerRunning=true;document.getElementById('timerToggle').textContent='⏸ Pause';
    timerInterval=setInterval(()=>{
      timerSecs--;renderTimerDisplay();
      if(timerSecs<=0){
        clearInterval(timerInterval);timerRunning=false;document.getElementById('timerOverlay').classList.remove('open');
        const d=todayData();
        if(!d.submitted&&!d[activeTimerQuest]){d[activeTimerQuest]=true;state.totalXP+=XP_PER;save();renderAll();}
        showToast('🎉 Selesai! +20 XP! Keren Aslan!');
      }
    },1000);
  }
}
function renderTimerDisplay(){
  const m=Math.floor(timerSecs/60),s=timerSecs%60;
  const el=document.getElementById('timerDisplay');
  el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  el.classList.toggle('urgent',timerSecs<=60);
}

function compressImage(file,cb){
  const reader=new FileReader();
  reader.onload=(e)=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const MAX=150;let w=img.width,h=img.height;
      if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}}else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}}
      canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);
      cb(canvas.toDataURL('image/jpeg',0.65));
    };img.src=e.target.result;
  };reader.readAsDataURL(file);
}
function handlePhotoUpload(input){
  if(!input.files||!input.files[0])return;
  compressImage(input.files[0],(data)=>{
    tempPhotoData=data;
    const prev=document.getElementById('adminPhotoPreview');
    prev.innerHTML='<img src="'+data+'" alt="preview" style="width:100%;height:100%;object-fit:cover;">';
    showToast('📸 Foto siap! Klik Simpan Profil.');
  });
}

let admPinVal = '';
function openAdmin(){
  document.getElementById('adminOverlay').classList.add('open');
  if(!adminUnlocked){
    document.getElementById('adminLogin').style.display='block';
    document.getElementById('adminPanel').classList.remove('visible');
    admPinVal = '';
    const pinDisplay = document.getElementById('adminPinDisplay');
    if(pinDisplay) pinDisplay.textContent = '—';
    document.getElementById('adminPwHint').textContent='';
  }
  const today=new Date();
  document.getElementById('adminDatePicker').value=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
}
function closeAdmin(){
  document.getElementById('adminOverlay').classList.remove('open');adminUnlocked=false;
  document.getElementById('adminLogin').style.display='block';document.getElementById('adminPanel').style.display='none';
  admPinVal = '';
  const d = document.getElementById('adminPinDisplay');
  if (d) d.textContent = '—';
}
function admNpPress(d) {
  if (admPinVal.length >= 10) return;
  admPinVal += d;
  const disp = document.getElementById('adminPinDisplay');
  if (disp) disp.textContent = '●'.repeat(admPinVal.length);
  const hint = document.getElementById('adminPwHint');
  if (hint) hint.textContent = '';
}
function admNpDel() {
  admPinVal = admPinVal.slice(0, -1);
  const disp = document.getElementById('adminPinDisplay');
  if (disp) disp.textContent = admPinVal.length ? '●'.repeat(admPinVal.length) : '—';
}
function doAdminLogin(){
  const pw = admPinVal;
  admPinVal = '';
  const disp = document.getElementById('adminPinDisplay');
  if (disp) disp.textContent = '—';
  if(pw===ADMIN_PW){
    adminUnlocked=true;document.getElementById('adminLogin').style.display='none';
    document.getElementById('adminPanel').style.display='block';renderAdminPanel();loadInvestPricesForAdmin();
    setTimeout(()=>{ if(typeof adm2Tab==='function') adm2Tab('profil'); },100);
  }else{
    const hint = document.getElementById('adminPwHint');
    if(hint) hint.textContent='❌ Password salah!';
    setTimeout(()=>{if(hint) hint.textContent='';},2000);
  }
}
function renderAdminPanel(){
  const prof=state.profile||{};
  const setVal=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v;};
  setVal('editName', prof.name||'Aslan Adika Prada');
  setVal('editBirthdate', prof.birthdate||'');
  setVal('editWeight', prof.weight!=null?prof.weight:'');
  setVal('editHeight', prof.height!=null?prof.height:'');
  setVal('editClass', prof.class||'Kelas 3 SD');
  const prev=document.getElementById('adminPhotoPreview');
  if(prev){
    if(prof.photo){prev.innerHTML='<img src="'+prof.photo+'" alt="foto" style="width:100%;height:100%;object-fit:cover;">';}
    else{prev.innerHTML='⚔️';}
  }
  tempPhotoData=null;
  setVal('ayahEditor', state.ayahMsg||DEFAULT_MSG);
  setVal('bundaEditor', state.bundaMsg||DEFAULT_BUNDA_MSG);
  setVal('karakterMotivationEditor', state.karakterMotivation||DEFAULT_KARAKTER_MOTIVATION);
  // ✅ PATCH: tampilkan nilai manualStreak di admin
  const msEl=document.getElementById('manualStreakInput');
  if(msEl)msEl.value=state.manualStreak||0;
  const qml=document.getElementById('questManagerList');if(qml)renderQuestManager();
  const aql=document.getElementById('adminQuestList');if(aql)renderAdminQuests();
  const cbl=document.getElementById('customBadgeList');if(cbl)renderCustomBadgeList();
  const xpd=document.getElementById('adminXpDisplay');if(xpd)xpd.textContent=state.totalXP+' XP';
  const xpd2=document.getElementById('adminXpDisplay2');if(xpd2)xpd2.textContent=state.totalXP+' XP';
  const ksg=document.getElementById('karakterSelectGrid');if(ksg)renderKarakterSelectGrid();
  const kal=document.getElementById('karakterAwardedList');if(kal)renderKarakterAwardedList();
  const wml=document.getElementById('wmListAdmin');if(wml)renderWMAdminList();
  const mml=document.getElementById('mmListAdmin');if(mml)renderMMAdminList();
}

// ===== INVEST PRICE MANAGER =====
function saveInvestPrices() {
  const goldPrice = parseFloat(document.getElementById('adminGoldPrice').value);
  const prices = {
    ultra:    parseFloat(document.getElementById('sp-ultra').value)    || null,
    indomie:  parseFloat(document.getElementById('sp-indomie').value)  || null,
    goto:     parseFloat(document.getElementById('sp-goto').value)     || null,
    mayora:   parseFloat(document.getElementById('sp-mayora').value)   || null,
    nintendo: parseFloat(document.getElementById('sp-nintendo').value) || null,
    bca:      parseFloat(document.getElementById('sp-bca').value)      || null,
  };
  Object.keys(prices).forEach(k => { if (!prices[k]) delete prices[k]; });
  const payload = {
    updatedAt: new Date().toISOString(),
    updatedBy: 'Ayah'
  };
  if (goldPrice > 0) payload.goldPrice = goldPrice;
  if (Object.keys(prices).length > 0) payload.stockPrices = prices;
  firebase.database().ref('aslan_investasi/manualPrices').update(payload, err => {
    if (!err) {
      showToast('✅ Harga berhasil diupdate!');
      loadInvestPricesForAdmin();
    } else {
      showToast('❌ Gagal simpan, cek koneksi');
    }
  });
}

function loadInvestPricesForAdmin() {
  firebase.database().ref('aslan_investasi/manualPrices').once('value', snap => {
    const d = snap.val();
    if (!d) return;
    if (d.goldPrice) {
      const el = document.getElementById('adminGoldPrice');
      if (el) el.value = d.goldPrice;
    }
    if (d.stockPrices) {
      Object.entries(d.stockPrices).forEach(([id, price]) => {
        const el = document.getElementById('sp-' + id);
        if (el) el.value = price;
      });
    }
    if (d.updatedAt) {
      const dt = new Date(d.updatedAt);
      const str = '🕐 Terakhir update: ' + dt.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      }) + ' ' + dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const el1 = document.getElementById('adminPriceLastUpdate');
      const el2 = document.getElementById('adminPriceLastUpdate2');
      if (el1) el1.textContent = str;
      if (el2) el2.textContent = str;
    }
  });
}

function saveProfile(){
  if(!state.profile)state.profile={};
  state.profile.name=document.getElementById('editName').value.trim()||'Aslan Adika Prada';
  state.profile.birthdate=document.getElementById('editBirthdate').value;
  state.profile.weight=document.getElementById('editWeight').value?parseFloat(document.getElementById('editWeight').value):null;
  state.profile.height=document.getElementById('editHeight').value?parseFloat(document.getElementById('editHeight').value):null;
  state.profile.class=document.getElementById('editClass').value.trim()||'Kelas 3 SD';
  if(tempPhotoData){state.profile.photo=tempPhotoData;}
  save();renderAll();showToast('💾 Profil berhasil disimpan!');
}
function saveAyahMsg(){
  const txt=document.getElementById('ayahEditor').value.trim();
  if(!txt){showToast('Pesan tidak boleh kosong',true);return;}
  state.ayahMsg=txt;save();renderMessages();showToast('💾 Pesan Ayah berhasil disimpan!');
}
function saveBundaMsg(){
  const txt=document.getElementById('bundaEditor').value.trim();
  if(!txt){showToast('Pesan tidak boleh kosong',true);return;}
  state.bundaMsg=txt;save();renderMessages();showToast('💾 Pesan Bunda berhasil disimpan!');
}
function saveKarakterMotivation(){
  const txt=document.getElementById('karakterMotivationEditor').value.trim();
  if(!txt){showToast('Motivasi tidak boleh kosong',true);return;}
  state.karakterMotivation=txt;save();renderKarakter();showToast('💾 Motivasi berhasil disimpan!');
}

function renderKarakterSelectGrid(){
  const grid=document.getElementById('karakterSelectGrid');grid.innerHTML='';
  KARAKTER_LIST.forEach(k=>{
    const btn=document.createElement('button');
    btn.className='karakter-select-btn'+(selectedKarakter===k.id?' selected':'');
    btn.title=k.name;
    btn.innerHTML=k.emoji+'<div style="font-size:8px;font-weight:800;color:#6A1B9A;margin-top:3px;">'+k.name+'</div>';
    btn.onclick=()=>{selectedKarakter=k.id;renderKarakterSelectGrid();};
    grid.appendChild(btn);
  });
}
function awardKarakter(){
  if(!selectedKarakter){showToast('Pilih lencana dulu ya!',true);return;}
  const k=KARAKTER_LIST.find(x=>x.id===selectedKarakter);if(!k)return;
  const note=document.getElementById('karakterNoteInput').value.trim();
  if(!state.karakterAwarded)state.karakterAwarded=[];
  state.karakterAwarded.push({id:'kar_'+Date.now(),karakterId:k.id,emoji:k.emoji,name:k.name,note,timestamp:Date.now()});
  document.getElementById('karakterNoteInput').value='';selectedKarakter=null;
  save();renderAll();renderKarakterSelectGrid();renderKarakterAwardedList();
  showToast('🌟 Lencana '+k.name+' diberikan ke Aslan!');
}
function renderKarakterAwardedList(){
  const list=document.getElementById('karakterAwardedList');
  const awarded=(state.karakterAwarded||[]).slice().reverse().slice(0,8);
  if(!awarded.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;text-align:center;padding:8px;">Belum ada lencana yang diberikan.</p>';return;}
  list.innerHTML='';
  awarded.forEach(a=>{
    const dd=new Date(a.timestamp);
    const dateStr=dd.getDate()+' '+MONTHS_ID[dd.getMonth()]+' '+dd.getFullYear();
    const row=document.createElement('div');row.className='ka-row';
    row.innerHTML=`<div class="ka-icon">${a.emoji}</div><div class="ka-info"><div class="ka-name">${a.name}</div><div class="ka-note">"${a.note||'—'}"</div><div class="ka-date">📅 ${dateStr}</div></div><button class="ka-del-btn" onclick="deleteKarakter('${a.id}')">🗑️</button>`;
    list.appendChild(row);
  });
}
function deleteKarakter(id){
  if(!confirm('Hapus lencana ini?'))return;
  state.karakterAwarded=(state.karakterAwarded||[]).filter(a=>a.id!==id);
  save();renderAll();renderKarakterAwardedList();showToast('🗑️ Lencana dihapus',true);
}

function renderQuestManager(){
  const list=document.getElementById('questManagerList');list.innerHTML='';
  if(!state.quests.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;text-align:center;padding:12px;">Belum ada latihan.</p>';return;}
  state.quests.forEach(q=>{
    const row=document.createElement('div');row.className='qm-row';
    row.innerHTML=`<span class="qm-icon">${q.emoji}</span><span class="qm-name">${q.name}</span><span class="qm-dur">⏱${q.dur}mnt</span><button class="qm-del-btn" onclick="deleteQuest('${q.id}')">🗑️</button>`;
    list.appendChild(row);
  });
}
function deleteQuest(questId){
  if(!confirm('Hapus latihan ini?'))return;
  state.quests=state.quests.filter(q=>q.id!==questId);
  save();renderAll();renderQuestManager();renderAdminQuests();showToast('🗑️ Latihan dihapus',true);
}
function addQuest(){
  const emoji=(document.getElementById('aqEmoji').value.trim()||'🎯');
  const name=document.getElementById('aqName').value.trim();
  const dur=parseInt(document.getElementById('aqDur').value)||30;
  if(!name){showToast('Nama latihan harus diisi!');return;}
  if(state.quests.find(q=>q.name.toLowerCase()===name.toLowerCase())){showToast('Nama latihan sudah ada!');return;}
  const id='q_'+Date.now();const {bg,bc}=COLOR_POOL[state.quests.length%COLOR_POOL.length];
  state.quests.push({id,emoji,name,dur,bg,bc});
  document.getElementById('aqEmoji').value='';document.getElementById('aqName').value='';document.getElementById('aqDur').value='30';
  save();renderAll();renderQuestManager();renderAdminQuests();showToast('✅ Latihan "'+name+'" ditambahkan!');
}
function renderAdminQuests(){
  const dateVal=document.getElementById('adminDatePicker').value;
  let k;
  if(dateVal){const p=dateVal.split('-');const d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));k=dateKey(d);}
  else k=todayKey();
  const d=getDataForKey(k);
  const list=document.getElementById('adminQuestList');list.innerHTML='';
  if(!state.quests.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;text-align:center;padding:12px;">Belum ada latihan.</p>';return;}
  state.quests.forEach(q=>{
    const row=document.createElement('div');row.className='admin-quest-row';
    const isDone=!!d[q.id];
    row.innerHTML=`<span class="q-icon">${q.emoji}</span><span class="q-name">${q.name}</span><span class="q-status ${isDone?'done-status':'pending-status'}">${isDone?'✓ Selesai':'– Belum'}</span><button class="cancel-btn" ${!isDone?'disabled':''} onclick="adminCancelQuest('${k}','${q.id}')">${isDone?'↩ Batal':'–'}</button>`;
    list.appendChild(row);
  });
  document.getElementById('adminXpDisplay').textContent=state.totalXP+' XP';
}
function adminCancelQuest(k,questId){
  const d=getDataForKey(k);if(!d[questId])return;
  const wasSubmitted=!!d.submitted;delete d[questId];
  if(wasSubmitted){d.submitted=false;state.totalXP=Math.max(0,state.totalXP-XP_PER-XP_BONUS);showToast('↩ Dibatalkan & XP dikurangi',true);}
  else showToast('↩ Misi dibatalkan');
  save();renderAll();renderAdminQuests();
}
function cancelWholeDay(){
  const dateVal=document.getElementById('adminDatePicker').value;
  let k;
  if(dateVal){const p=dateVal.split('-');const d=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));k=dateKey(d);}
  else k=todayKey();
  const d=getDataForKey(k);
  const wasSubmitted=!!d.submitted;const doneCount=state.quests.filter(q=>d[q.id]).length;
  if(doneCount===0&&!wasSubmitted){showToast('Tidak ada misi selesai di tanggal ini');return;}
  let xpDeduct=doneCount*XP_PER;if(wasSubmitted)xpDeduct+=XP_BONUS;
  state.history[k]={};state.totalXP=Math.max(0,state.totalXP-xpDeduct);
  save();renderAll();renderAdminQuests();showToast('🗑️ Seluruh hari dibatalkan! -'+xpDeduct+' XP',true);
}
function adjustXP(sign){
  const val=parseInt(document.getElementById('xpAdjustInput').value)||0;
  if(val<=0){showToast('Masukkan angka yang benar');return;}
  state.totalXP=Math.max(0,state.totalXP+sign*val);
  save();renderAll();renderAdminPanel();showToast((sign>0?'⚡ +':'🔻 -')+val+' XP berhasil diubah');
}

function renderCustomBadgeList(){
  const list=document.getElementById('customBadgeList');list.innerHTML='';
  const cbs=state.customBadges||[];
  if(!cbs.length){list.innerHTML='<p style="font-size:12px;color:#90A4AE;font-weight:700;text-align:center;padding:8px;">Belum ada piala spesial.</p>';return;}
  cbs.forEach(cb=>{
    const row=document.createElement('div');row.className='cb-row';
    const unlocked=!!state.badges[cb.id];
    row.innerHTML=`<span class="cb-icon">${cb.emoji}</span><div class="cb-info"><div class="cb-name">${cb.name}</div><div class="cb-xp">🔓 Unlock di ${cb.xpRequired} XP ${unlocked?'· ✅ Sudah dibuka!':''}</div></div><button class="cb-del-btn" onclick="deleteCustomBadge('${cb.id}')">🗑️</button>`;
    list.appendChild(row);
  });
}
function addCustomBadge(){
  const emoji=(document.getElementById('abEmoji').value.trim()||'🌟');
  const name=document.getElementById('abName').value.trim();
  const xpReq=parseInt(document.getElementById('abXP').value)||500;
  if(!name){showToast('Nama piala harus diisi!');return;}
  if((state.customBadges||[]).find(cb=>cb.name.toLowerCase()===name.toLowerCase())){showToast('Nama piala sudah ada!');return;}
  if(!state.customBadges)state.customBadges=[];
  const id='cb_'+Date.now();
  state.customBadges.push({id,emoji,name,xpRequired:xpReq});
  document.getElementById('abEmoji').value='';document.getElementById('abName').value='';document.getElementById('abXP').value='500';
  checkBadges();save();renderAll();renderCustomBadgeList();showToast('✨ Piala "'+name+'" ditambahkan!');
}
function deleteCustomBadge(id){
  if(!confirm('Hapus piala ini?'))return;
  state.customBadges=(state.customBadges||[]).filter(cb=>cb.id!==id);
  delete state.badges[id];save();renderAll();renderCustomBadgeList();showToast('🗑️ Piala dihapus',true);
}

let toastTimeout;
function showToast(msg,red=false){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.remove('red-toast','blue-toast');
  if(red)t.classList.add('red-toast');
  t.classList.add('show');clearTimeout(toastTimeout);
  toastTimeout=setTimeout(()=>t.classList.remove('show'),2800);
}
// INIT
setSyncStatus('syncing');
load();