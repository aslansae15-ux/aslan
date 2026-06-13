// Quick Sync dari Firebase - simpan di console
// Copy paste ini di console (F12) untuk sync instan

(function syncFromFB() {
  if (typeof state === 'undefined') {
    alert('❌ State tidak ditemukan. Pastikan Anda berada di halaman app yang sudah loaded');
    return;
  }

  console.log('🔄 Memulai sinkronisasi dari Firebase...');

  // Fetch data terbaru dari Firebase melalui app
  if (typeof FB_REF !== 'undefined' && FB_REF) {
    FB_REF.once('value', (snap) => {
      const fbData = snap.val();
      if (!fbData) {
        console.log('⚠️ Firebase empty');
        return;
      }

      console.log('📥 Data Firebase diterima');
      console.log('- Total XP:', fbData.totalXP || state.totalXP);
      console.log('- History days:', Object.keys(fbData.history || {}).length);
      console.log('- Badges:', Object.keys(fbData.badges || {}).length);

      // Deep merge history - jangan timpa
      if (fbData.history) {
        const oldHistorySize = Object.keys(state.history || {}).length;
        state.history = state.history || {};
        for (let day in fbData.history) {
          if (!state.history[day]) {
            state.history[day] = fbData.history[day];
          } else {
            // Merge day by day
            state.history[day] = Object.assign({}, state.history[day], fbData.history[day]);
          }
        }
        console.log(`- History merged: ${oldHistorySize} → ${Object.keys(state.history).length} days`);
      }

      // Copy main fields (overwrite)
      const fields = ['totalXP', 'badges', 'quests', 'ayahMsg', 'bundaMsg', 'customBadges',
                      'profile', 'savings', 'karakterAwarded', 'jurnal', 'karakterMotivation',
                      'weeklyMissions', 'monthlyMissions', 'weeklyProgress', 'monthlyProgress', 'manualStreak'];
      fields.forEach(f => {
        if (fbData[f] !== undefined) {
          state[f] = fbData[f];
          console.log(`✓ ${f} updated from Firebase`);
        }
      });

      // Save to localStorage
      try {
        localStorage.setItem('aslan_v8', JSON.stringify(state));
        console.log('💾 Data saved to localStorage');
      } catch (e) {
        console.error('❌ LocalStorage error:', e);
      }

      // Re-render UI
      if (typeof renderAll === 'function') {
        renderAll();
        console.log('🎨 UI re-rendered');
      }

      console.log('✅ SINKRONISASI SELESAI!');
      console.log('Streak saat ini:', computeStreak ? computeStreak() : state.manualStreak);
      alert(`✅ Sinkronisasi berhasil!\n\nXP: ${state.totalXP}\nBadges: ${Object.keys(state.badges || {}).length}\nHistory: ${Object.keys(state.history || {}).length} hari`);
    }, (err) => {
      console.error('❌ Firebase error:', err);
      alert('❌ Error mengakses Firebase: ' + err.message);
    });
  } else {
    alert('❌ Firebase tidak tersedia. Pastikan Internet connected dan app sudah load.');
  }
})();
