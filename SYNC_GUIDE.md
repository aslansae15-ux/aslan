# 🔄 PANDUAN SINKRONISASI DATA DARI FIREBASE

Data Firebase terbaru sudah tersedia untuk disinkronisasi. Ada 3 cara untuk sync:

## CARA 1: AUTO-SYNC via Hard Refresh (⭐ PALING MUDAH)

1. Buka aplikasi: http://localhost:1500
2. Tekan **Ctrl + Shift + R** (Windows) atau **Cmd + Shift + R** (Mac)
3. Tunggu halaman reload dengan cache terbersih
4. Firebase listener akan otomatis pull data terbaru
5. Data akan tersinkronisasi otomatis

✅ **Waktu: 5 detik**

---

## CARA 2: Sync via UI Halaman (JIKA TERSEDIA)

1. Buka: http://localhost:1500/sync_instructions.html
2. Scroll ke bagian "Sinkronisasi Otomatis"
3. Klik tombol "Sinkronisasi Sekarang"
4. Tunggu status "✅ Sinkronisasi berhasil"
5. Klik "Reload Aplikasi"

✅ **Waktu: 10 detik**

---

## CARA 3: Manual via Browser Console

Jika hard refresh tidak berhasil:

1. Buka aplikasi: http://localhost:1500
2. Tekan **F12** untuk buka Developer Tools
3. Klik tab **"Console"**
4. Copy-paste kode di bawah ini:

```javascript
(function(){
  const fbRef = window.FB_REF;
  if(!fbRef) {
    alert('❌ Firebase belum siap. Coba refresh halaman dulu.');
    return;
  }
  
  fbRef.once('value', (snap) => {
    const fbData = snap.val();
    let local = JSON.parse(localStorage.getItem('aslan_v8') || '{}');
    
    // Merge history
    if(fbData.history) {
      local.history = local.history || {};
      for(let day in fbData.history) {
        local.history[day] = fbData.history[day];
      }
    }
    
    // Copy main fields
    ['totalXP','badges','quests','ayahMsg','bundaMsg','customBadges',
     'profile','savings','karakterAwarded','jurnal','karakterMotivation',
     'weeklyMissions','monthlyMissions','weeklyProgress','monthlyProgress','manualStreak']
      .forEach(k => { if(fbData[k]) local[k] = fbData[k]; });
    
    localStorage.setItem('aslan_v8', JSON.stringify(local));
    console.log('✅ Sinkronisasi selesai! XP: ' + local.totalXP);
    location.reload();
  });
})();
```

5. Tekan **Enter**
6. Tunggu status "✅ Sinkronisasi selesai"
7. Halaman akan reload otomatis

✅ **Waktu: 20 detik**

---

## DATA YANG AKAN DISINKRONISASI

Berdasarkan Firebase export terbaru:

| Data | Nilai | Status |
|------|-------|--------|
| Total XP | 4720 | ✅ Ready |
| Hari Riwayat | 32 hari | ✅ Ready |
| Badges | 19 badge | ✅ Ready |
| Total Tabungan | Rp 4,670,500 | ✅ Ready |
| Quests | 6 quest | ✅ Ready |
| Streak Terakhir | 7 hari | ✅ Ready |

---

## ⚠️ TROUBLESHOOTING

**Jika data masih lama setelah sync:**
- Pastikan Internet connection aktif
- Buka DevTools (F12) → Application → Clear All Site Data
- Tekan Ctrl+Shift+R
- Buka aplikasi kembali

**Jika masih belum sinkron:**
- Buka console dan cek error message
- Pastikan Firebase URL sudah benar di file config
- Hubungi admin untuk restart Firebase listener

---

## 📁 FILE YANG BERKAITAN

- `sync_instructions.html` - UI untuk sinkronisasi visual
- `firebase_backup.json` - Backup data Firebase terbaru
- `quick_sync.js` - Script untuk sync via console
- `app.js` - Sudah dikonfigurasi deep merge untuk history

---

## 🎯 NEXT STEPS

Setelah sinkronisasi berhasil:
1. Periksa halaman Streak → pastikan hari berturut-turut tampil dengan benar
2. Periksa XP → harus menunjukkan 4720
3. Periksa Badges → harus 19 badge terunlock
4. Cek Riwayat → harus punya 32 hari data

Jika semua OK, data sudah singkron dengan sempurna! ✅
