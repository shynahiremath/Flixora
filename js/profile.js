/**
 * NETFLIX - User Profile, Subscription, Watch Stats & Achievements Controller
 */

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await Auth.requireAuth();
  if (!currentUser) return;

  renderProfilesGrid();
  renderSubscriptionCard();
  renderWatchStatsAndAchievements();
  renderAccentThemeSelector();
  setupSettingsTabs();
  setupSignOut();
});

function renderProfilesGrid() {
  const grid = document.getElementById("profiles-grid");
  if (!grid) return;

  const profiles = AppState.getProfiles();
  const active = AppState.getActiveProfile();

  grid.innerHTML = profiles.map(p => `
    <div class="profile-card ${p.id === active.id ? 'active' : ''}" onclick="AppState.setActiveProfile('${p.id}')">
      <div class="profile-avatar-container">
        <img src="${p.avatar}" alt="${p.name}" class="w-full h-full object-cover" />
      </div>
      <span class="text-sm font-bold text-zinc-200 group-hover:text-white">${p.name}</span>
      ${p.id === active.id ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 border border-red-500/40 font-semibold">Active</span>' : ''}
    </div>
  `).join('') + `
    <div class="profile-card" onclick="openAddProfileModal()">
      <div class="profile-avatar-container flex items-center justify-center bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-zinc-500">
        <span class="text-3xl text-zinc-400">＋</span>
      </div>
      <span class="text-sm font-semibold text-zinc-400">Add Profile</span>
    </div>
  `;
}

function renderSubscriptionCard() {
  const subContainer = document.getElementById("subscription-plan-container");
  if (!subContainer) return;

  const sub = AppState.getSubscription();

  const plans = [
    { id: "BASIC", name: "BASIC", price: "₹149/mo", resolution: "720p HD", devices: "1 Device", popular: false },
    { id: "STANDARD", name: "STANDARD", price: "₹299/mo", resolution: "1080p Full HD", devices: "2 Devices", popular: false },
    { id: "PREMIUM", name: "PREMIUM", price: "₹499/mo", resolution: "4K + HDR", devices: "4 Devices", popular: true }
  ];

  subContainer.innerHTML = plans.map(p => {
    const isCurrent = sub.plan === p.id;
    return `
      <div class="plan-card ${p.popular ? 'popular' : ''} flex flex-col justify-between">
        <div>
          ${p.popular ? '<span class="px-3 py-1 rounded-full bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider mb-3 inline-block">MOST POPULAR</span>' : ''}
          <h3 class="text-xl font-black text-white tracking-wide">${p.name}</h3>
          <div class="text-2xl font-black text-white mt-2">${p.price}</div>
          
          <ul class="mt-6 space-y-3 text-xs text-zinc-300">
            <li class="flex items-center gap-2">✓ <span>Video Quality: <strong>${p.resolution}</strong></span></li>
            <li class="flex items-center gap-2">✓ <span>Supported Devices: <strong>${p.devices}</strong></span></li>
            <li class="flex items-center gap-2">✓ <span>Ad-free Unlimited Streams</span></li>
            <li class="flex items-center gap-2">✓ <span>Cancel Anytime</span></li>
          </ul>
        </div>

        <button onclick="confirmPlanSelection('${p.id}', '${p.name}', '${p.price}')" class="mt-8 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer ${isCurrent ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 cursor-default' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30'}">
          ${isCurrent ? '✓ Active Plan' : 'Choose Plan'}
        </button>
      </div>
    `;
  }).join('');
}

// 📊 Watch Stats & Gamified Badges
function renderWatchStatsAndAchievements() {
  const container = document.getElementById("stats-achievements-container");
  if (!container) return;

  const stats = AppState.getWatchStats();
  const unlocked = checkAchievements();

  const allBadges = [
    { id: "night_owl", icon: "🦉", title: "Night Owl", desc: "Watch streams past 1 AM." },
    { id: "movie_buff", icon: "🎬", title: "Movie Buff", desc: "Watch 10+ titles." },
    { id: "indian_cinephile", icon: "🇮🇳", title: "Indian Cinephile", desc: "Stream Indian Cinema." },
    { id: "binge_master", icon: "🍿", title: "Binge Master", desc: "Stream 10+ hours total." },
    { id: "social_viewer", icon: "🎉", title: "Social Streamer", desc: "Host a Watch Party." }
  ];

  container.innerHTML = `
    <!-- Stats Banner Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <span class="text-xs text-zinc-400 uppercase font-bold tracking-wider">Total Time</span>
        <div class="text-2xl font-black text-white mt-1">${stats.hoursWatched} hrs</div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <span class="text-xs text-zinc-400 uppercase font-bold tracking-wider">Titles Watched</span>
        <div class="text-2xl font-black text-white mt-1">${stats.titlesCompleted}</div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <span class="text-xs text-zinc-400 uppercase font-bold tracking-wider">Top Genre</span>
        <div class="text-2xl font-black text-red-500 mt-1">${stats.topGenre}</div>
      </div>

      <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
        <span class="text-xs text-zinc-400 uppercase font-bold tracking-wider">Stream Streak</span>
        <div class="text-2xl font-black text-emerald-400 mt-1">${stats.currentStreak} Days 🔥</div>
      </div>
    </div>

    <!-- Achievements Badges Grid -->
    <div>
      <h3 class="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
        🏆 Unlocked Achievements (${unlocked.length}/${allBadges.length})
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${allBadges.map(b => {
          const isUnlocked = unlocked.includes(b.id);
          return `
            <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4 ${isUnlocked ? 'border-red-600/50 shadow-lg shadow-red-600/10' : 'opacity-50'}">
              <span class="text-3xl">${b.icon}</span>
              <div>
                <h4 class="text-sm font-bold text-white">${b.title}</h4>
                <p class="text-xs text-zinc-400 mt-0.5">${b.desc}</p>
                <span class="text-[10px] font-extrabold uppercase tracking-wider block mt-1 ${isUnlocked ? 'text-emerald-400' : 'text-zinc-600'}">
                  ${isUnlocked ? '✓ Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// 🎨 Accent Color Theme Selector
function renderAccentThemeSelector() {
  const container = document.getElementById("accent-theme-container");
  if (!container) return;

  const currentTheme = AppState.getTheme();

  const themes = [
    { id: "red", name: "Signature Red", color: "#E50914" },
    { id: "purple", name: "Cyber Purple", color: "#9333EA" },
    { id: "cyan", name: "Neon Cyan", color: "#06B6D4" },
    { id: "emerald", name: "Emerald Gold", color: "#10B981" }
  ];

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🎨</span>
      <div>
        <h3 class="text-lg font-bold text-white">Accent Color Theme</h3>
        <p class="text-xs text-zinc-400">Personalize your Flixora interface highlight color.</p>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      ${themes.map(t => `
        <button onclick="setTheme('${t.id}')" class="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900 border ${currentTheme === t.id ? 'border-white' : 'border-zinc-800'} hover:border-zinc-500 transition cursor-pointer">
          <span class="w-4 h-4 rounded-full" style="background-color: ${t.color}"></span>
          <span class="text-xs font-bold text-white">${t.name}</span>
        </button>
      `).join('')}
    </div>
  `;
}

function setTheme(themeId) {
  AppState.saveTheme(themeId);
  showToast(`Accent theme updated to ${themeId.toUpperCase()}`, "success");
  renderAccentThemeSelector();
}

function confirmPlanSelection(planId, planName, price) {
  let modal = document.getElementById("flixora-sub-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "flixora-sub-modal";
    modal.className = "fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-center">
      <div class="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center text-2xl mx-auto mb-4">💳</div>
      
      <h3 class="text-2xl font-bold text-white mb-2">Confirm Plan Change</h3>
      <p class="text-sm text-zinc-300 mb-6">You're selecting the <strong class="text-red-400 font-bold">${planName}</strong> plan (${price}).</p>

      <div class="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-xs text-zinc-400 mb-6 text-left">
        <p class="mb-1"><strong>Note:</strong> Educational frontend demonstration. No payment gateway charges occur.</p>
      </div>

      <div class="flex gap-3">
        <button id="sub-cancel-btn" class="w-1/2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer">Cancel</button>
        <button id="sub-confirm-btn" class="w-1/2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 cursor-pointer">Continue</button>
      </div>
    </div>
  `;

  document.getElementById("sub-cancel-btn").onclick = () => modal.remove();

  document.getElementById("sub-confirm-btn").onclick = () => {
    AppState.setSubscription(planId);
    modal.remove();
    renderSubscriptionCard();
    showToast(`Subscription upgraded to ${planName}!`, "success");
  };
}

function setupSettingsTabs() {
  const settingsForm = document.getElementById("settings-preferences-form");
  if (!settingsForm) return;

  const currentSettings = AppState.getSettings();

  const autoplayPreviews = document.getElementById("pref-autoplay-previews");
  const autoplayNext = document.getElementById("pref-autoplay-next");
  const qualitySelect = document.getElementById("pref-quality");
  const languageSelect = document.getElementById("pref-language");

  if (autoplayPreviews) autoplayPreviews.checked = currentSettings.autoplayPreviews;
  if (autoplayNext) autoplayNext.checked = currentSettings.autoplayNextEpisode;
  if (qualitySelect) qualitySelect.value = currentSettings.quality;
  if (languageSelect) languageSelect.value = currentSettings.language;

  settingsForm.onsubmit = (e) => {
    e.preventDefault();
    const updated = {
      autoplayPreviews: autoplayPreviews ? autoplayPreviews.checked : true,
      autoplayNextEpisode: autoplayNext ? autoplayNext.checked : true,
      quality: qualitySelect ? qualitySelect.value : "Auto (4K)",
      language: languageSelect ? languageSelect.value : "English"
    };
    AppState.saveSettings(updated);
  };
}

function openAddProfileModal() {
  let modal = document.getElementById("flixora-add-profile-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "flixora-add-profile-modal";
    modal.className = "fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
      <button id="add-prof-close" class="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer text-xl">✕</button>
      <h3 class="text-2xl font-bold text-white mb-2">Create Profile</h3>
      <p class="text-sm text-zinc-400 mb-6">Add a profile for another person watching Flixora.</p>

      <form id="add-prof-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Profile Name</label>
          <input type="text" id="add-prof-name" required placeholder="e.g. Alex" class="auth-input" />
        </div>

        <div class="flex items-center gap-3">
          <input type="checkbox" id="add-prof-kids" class="w-4 h-4 accent-red-600 rounded cursor-pointer" />
          <label for="add-prof-kids" class="text-sm font-semibold text-zinc-200 cursor-pointer">Kid's Profile (Age 12 & under)</label>
        </div>

        <button type="submit" class="auth-btn mt-4">Save Profile</button>
      </form>
    </div>
  `;

  document.getElementById("add-prof-close").onclick = () => modal.remove();

  document.getElementById("add-prof-form").onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("add-prof-name").value.trim();
    const isKids = document.getElementById("add-prof-kids").checked;

    if (!name) return;

    const profiles = AppState.getProfiles();
    const newProfile = {
      id: `p_${Date.now()}`,
      name,
      avatar: isKids 
        ? "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      isKids
    };

    profiles.push(newProfile);
    AppState.saveProfiles(profiles);
    showToast(`Profile "${name}" added!`, "success");
    modal.remove();
    renderProfilesGrid();
  };
}

function setupSignOut() {
  const btn = document.getElementById("profile-signout-btn");
  if (btn) {
    btn.onclick = () => AppState.logout();
  }
}

window.openAddProfileModal = openAddProfileModal;
window.confirmPlanSelection = confirmPlanSelection;
window.setTheme = setTheme;
