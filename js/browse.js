/**
 * NETFLIX - Browse Home Dashboard Controller
 * Implements interactive rows: MoodSync, Why This For You, Time-based filter,
 * Dynamic Genre Explorer, Indian Cinema Hub, Hidden Gems, Coming Soon & Calendar,
 * Language Filter, and Top 10 with live activity indicators.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await Auth.requireAuth();
  if (!currentUser) return;

  setupNavbar();
  renderHeroBanner();
  setupHeroParallaxScroll();
  setupMoodSync();
  renderWhyThisForYouRow();
  setupTimeBasedFilter();
  setupGenreExplorer();
  setupIndianCinemaHub();
  renderHiddenGemsSection();
  renderComingSoonSection();
  renderLanguagePillsSection();
  renderKidsSection();
  renderAllCategoryRows();

  window.addEventListener("mylist-updated", () => {
    renderAllCategoryRows();
  });

  window.addEventListener("lang-changed", () => {
    renderHeroBanner();
    renderKidsSection();
    renderAllCategoryRows();
  });
});

// ==========================================
// NAVBAR & PROFILE DROPDOWN
// ==========================================
function setupNavbar() {
  const nav = document.getElementById("main-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("bg-zinc-950/95", "border-b", "border-zinc-800/80");
        nav.classList.remove("glass-nav");
      } else {
        nav.classList.remove("bg-zinc-950/95", "border-b", "border-zinc-800/80");
        nav.classList.add("glass-nav");
      }
    });
  }

  const profile = AppState.getActiveProfile();
  const avatarImg = document.getElementById("nav-profile-avatar");
  if (avatarImg) avatarImg.src = profile.avatar;

  const profileBtn = document.getElementById("profile-menu-btn");
  const profileMenu = document.getElementById("profile-dropdown");
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("hidden");
    });
    document.addEventListener("click", () => profileMenu.classList.add("hidden"));
  }

  const profilesContainer = document.getElementById("dropdown-profiles-list");
  if (profilesContainer) {
    const profiles = AppState.getProfiles();
    profilesContainer.innerHTML = profiles.map(p => `
      <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition cursor-pointer ${p.id === profile.id ? 'bg-zinc-800/60 font-bold' : ''}" onclick="AppState.setActiveProfile('${p.id}')">
        <img src="${p.avatar}" alt="${p.name}" class="w-7 h-7 rounded-md object-cover" />
        <span class="text-xs text-zinc-200">${p.name} ${p.isKids ? '<span class="text-[10px] px-1 bg-yellow-500/20 text-yellow-400 rounded">KIDS</span>' : ''}</span>
      </div>
    `).join('');
  }

  const notifBtn = document.getElementById("notif-bell-btn");
  const notifDropdown = document.getElementById("notif-dropdown");
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", () => notifDropdown.classList.add("hidden"));
  }

  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav-drawer");
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener("click", () => {
      mobileNav.classList.toggle("hidden");
    });
  }

  const logoutBtn = document.getElementById("nav-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      AppState.logout();
    });
  }
}

// ==========================================
// FEATURED HERO BANNER & CAROUSEL ENGINE
// ==========================================
let isHeroMuted = true;

function renderHeroBanner() {
  const container = document.getElementById("hero-banner");
  if (!container) return;

  const heroMovie = MOVIES_DATA.find(m => m.id === "m1");
  const isInList = AppState.isInMyList(heroMovie.id);
  const liveCount = getLiveViewerCount(heroMovie.id);

  container.innerHTML = `
    <!-- Multi-Layer Vignette Background Video / Poster Container with Parallax Layer -->
    <div id="hero-bg-parallax" class="absolute inset-0 w-full h-full overflow-hidden hero-parallax-bg">
      <iframe
    id="hero-bg-video"
    src="https://www.youtube.com/embed/${heroMovie.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${heroMovie.youtubeId}&controls=0&rel=0&playsinline=1"
    title="${heroMovie.title}"
    frameborder="0"
    allow="autoplay; encrypted-media; picture-in-picture"
    allowfullscreen
></iframe>
      
      <!-- Netflix Multi-Layer Vignette Shadows -->
      <div class="absolute inset-0 hero-vignette-bottom pointer-events-none"></div>
      <div class="absolute inset-0 hero-vignette-left pointer-events-none"></div>
      <div class="absolute inset-0 hero-vignette-top pointer-events-none"></div>
      <div class="absolute inset-0 hero-gradient-overlay pointer-events-none"></div>
    </div>

    <!-- Main Content Grid with Staggered Entrance Animations -->
    <div id="hero-content-parallax" class="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-end min-h-[75vh] md:min-h-[85vh] pt-24 pb-12 hero-parallax-content">
      <div class="max-w-3xl space-y-4 md:space-y-6">
        
        <!-- Netflix Style "NETFLIX ORIGINAL" Brand Eyebrow -->
        <div class="flex items-center gap-3 hero-enter-eyebrow">
          <div class="flex items-center gap-1.5 bg-zinc-950/80 px-3 py-1 rounded-md border border-red-600/40 backdrop-blur-md">
            <span class="w-2.5 h-6 bg-red-600 rounded-xs inline-block font-mono font-black text-xs"></span>
            <span class="text-red-600 font-mono font-black text-sm md:text-base tracking-wider">NETFLIX</span>
            <span class="text-[10px] md:text-xs font-extrabold tracking-[0.25em] text-zinc-300 uppercase ml-1">ORIGINAL</span>
          </div>

          <span class="px-2.5 py-0.5 rounded bg-red-950/90 text-red-400 border border-red-600/50 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> 🔴 ${liveCount} Watching
          </span>
        </div>

        <!-- Title Header -->
        <h1 class="hero-title-text hero-enter-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
          ${I18N.getMovieTitle(heroMovie)}
        </h1>

        <!-- Metadata Badges Bar -->
        <div class="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-zinc-200 hero-enter-meta">
          <span class="px-2.5 py-1 rounded bg-red-600 text-white font-extrabold text-[11px] uppercase tracking-widest shadow-md" data-i18n="top10_today">#IN TOP 10 TODAY</span>
          <span class="text-emerald-400 font-bold">★ ${heroMovie.rating} Rating</span>
          <span class="text-zinc-400">•</span>
          <span>${heroMovie.year}</span>
          <span class="text-zinc-400">•</span>
          <span class="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px]">${heroMovie.ageRating}</span>
          <span class="text-zinc-400">•</span>
          <span>${heroMovie.duration}</span>
          <span class="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] text-zinc-300">4K ULTRA HD</span>
        </div>

        <!-- Synopsis Description -->
        <p class="text-zinc-300 text-sm md:text-base lg:text-lg line-clamp-3 max-w-2xl leading-relaxed drop-shadow-md hero-enter-desc">
          ${I18N.getMovieDesc(heroMovie)}
        </p>

        <!-- Interactive Action Buttons Row -->
        <div class="hero-action-buttons flex flex-wrap items-center gap-3 pt-3 hero-enter-buttons">
          <button id="hero-play-btn" class="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm md:text-base shadow-2xl transition transform hover:scale-105 cursor-pointer">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play Stream
          </button>

          <button id="hero-mylist-btn" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold text-sm md:text-base border border-zinc-700/80 backdrop-blur-md transition cursor-pointer">
            <span>${isInList ? "✓" : "＋"}</span> ${isInList ? "In My List" : "Add to My List"}
          </button>

          <button id="hero-details-btn" class="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/80 text-zinc-300 hover:text-white font-semibold text-sm border border-zinc-700/50 backdrop-blur-md transition cursor-pointer">
            ⓘ More Info
          </button>

          <button onclick="openSurpriseMeModal()" class="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl transition transform hover:scale-105 cursor-pointer">
            🎲 Surprise Me
          </button>
        </div>
      </div>

      <!-- Right Edge Controls: Audio Toggle, Age Rating Tag & Featured Carousel Switcher -->
      <div class="mt-8 flex flex-wrap items-center justify-between gap-1 pt-4 border-t border-zinc-800/50 hero-enter-controls">

        <!-- Audio Mute/Unmute & Netflix Maturity Tag -->
        <div class="flex items-center gap-3">
          <div class="netflix-age-tag rounded-r-md">
            <span>${heroMovie.ageRating}</span>
          </div>
        </div>

      </div>
    </div>
  `;

  document.getElementById("hero-play-btn").onclick = () => openVideoPlayer(heroMovie);
  document.getElementById("hero-details-btn").onclick = () => openMovieDetails(heroMovie.id);

  const heroListBtn = document.getElementById("hero-mylist-btn");
  heroListBtn.onclick = () => {
    const added = AppState.toggleMyList(heroMovie.id);
    heroListBtn.innerHTML = `<span>${added ? "✓" : "＋"}</span> ${added ? "In My List" : "Add to My List"}`;
  };
}

// ==========================================
// SMOOTH PARALLAX SCROLL CONTROLLER
// ==========================================
let parallaxTicking = false;
function setupHeroParallaxScroll() {
  const onScroll = () => {
    if (!parallaxTicking) {
      window.requestAnimationFrame(() => {
        const bgParallax = document.getElementById("hero-bg-parallax");
        const contentParallax = document.getElementById("hero-content-parallax");
        const heroBanner = document.getElementById("hero-banner");

        if (heroBanner && (bgParallax || contentParallax)) {
          const scrolled = window.scrollY;
          const heroHeight = heroBanner.offsetHeight || 700;

          if (scrolled <= heroHeight + 100) {
            const bgOffset = scrolled * 0.38;
            const bgScale = 1.05 + (scrolled * 0.0002);
            const bgBlur = Math.min(12, scrolled / 40);
            const bgOpacity = Math.max(0.15, 1 - (scrolled / (heroHeight * 0.85)));

            const contentOffset = scrolled * 0.22;
            const contentOpacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.65)));

            if (bgParallax) {
              bgParallax.style.transform = `translate3d(0, ${bgOffset}px, 0) scale(${bgScale})`;
              bgParallax.style.opacity = bgOpacity;
              bgParallax.style.filter = `blur(${bgBlur}px)`;
            }

            if (contentParallax) {
              contentParallax.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
              contentParallax.style.opacity = contentOpacity;
            }
          }
        }
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}


// ==========================================
// MOODSYNC RECOMMENDATION ENGINE
// ==========================================
function setupMoodSync() {
  const container = document.getElementById("moodsync-container");
  if (!container) return;

  const moods = [
    { name: "Happy", emoji: "😊", filterMood: "Happy" },
    { name: "Energetic", emoji: "🔥", filterMood: "Energetic" },
    { name: "Romantic", emoji: "❤️", filterMood: "Romantic" },
    { name: "Relaxed", emoji: "😌", filterMood: "Relaxed" },
    { name: "Stressed", emoji: "😰", filterMood: "Stressed" },
    { name: "Sad", emoji: "😢", filterMood: "Sad" },
    { name: "Tired", emoji: "😴", filterMood: "Tired" }
  ];

  container.innerHTML = `
    <div class="mb-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🎭</span>
        <div>
          <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">MoodSync</h2>
          <p class="text-xs text-zinc-400">Select your current vibe for instant personalized curation.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
      ${moods.map((m, idx) => `
        <button class="mood-pill ${idx === 0 ? 'active' : ''}" data-mood="${m.filterMood}">
          <span>${m.emoji}</span> ${m.name}
        </button>
      `).join('')}
    </div>

    <div id="moodsync-results-container" class="mt-4"></div>
  `;

  const pills = container.querySelectorAll(".mood-pill");
  pills.forEach(pill => {
    pill.onclick = () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderMoodResults(pill.getAttribute("data-mood"));
    };
  });

  renderMoodResults("Happy");
}

function renderMoodResults(mood) {
  const box = document.getElementById("moodsync-results-container");
  if (!box) return;

  const matches = MOVIES_DATA.filter(m => m.moods && m.moods.includes(mood));

  box.innerHTML = `
    <div class="animate-slide-up">
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        ${matches.map(m => renderMovieCardHTML(m)).join('')}
      </div>
    </div>
  `;

  attachCardListeners(box);
}

// ==========================================
// 🧠 "WHY THIS FOR YOU?" EXPLANATION ROW
// ==========================================
function renderWhyThisForYouRow() {
  const container = document.getElementById("why-this-row-container");
  if (!container) return;

  const topPicks = MOVIES_DATA.slice(0, 4);

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🧠</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">Why This For You?</h2>
        <p class="text-xs text-zinc-400">Algorithmic score explanations based on your activity and ratings.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
      ${topPicks.map(m => {
        const match = calculateMatchScore(m);
        return `
          <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-red-600/50 transition cursor-pointer group" onclick="openMovieDetails('${m.id}')">
            <div class="aspect-video relative rounded-xl overflow-hidden mb-3">
              <img src="${m.backdrop}" alt="${m.title}" class="w-full h-full object-cover group-hover:scale-105 transition" />
              <div class="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-extrabold shadow-lg">
                ${match.score}% Match
              </div>
            </div>

            <div>
              <h3 class="text-sm font-bold text-white group-hover:text-red-400 transition">${m.title}</h3>
              <ul class="text-[11px] text-zinc-400 space-y-1 mt-2">
                ${match.reasons.slice(0, 2).map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>

            <button class="mt-4 w-full py-2 bg-zinc-800 hover:bg-red-600 text-zinc-200 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer">
              ▶ Stream Content
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ==========================================
// 🕐 "WHAT CAN I WATCH?" TIME-BASED FILTER
// ==========================================
function setupTimeBasedFilter() {
  const container = document.getElementById("time-filter-container");
  if (!container) return;

  const options = [
    { label: "⚡ 15 Mins", maxMin: 20 },
    { label: "⏱ 30 Mins", maxMin: 45 },
    { label: "🎬 1 Hour", maxMin: 70 },
    { label: "🎥 2 Hours", maxMin: 130 },
    { label: "🍿 All Night 😎", maxMin: 999 }
  ];

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🕐</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">What Can I Watch?</h2>
        <p class="text-xs text-zinc-400">Filter content precisely to your available free time.</p>
      </div>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
      ${options.map((opt, idx) => `
        <button class="time-pill px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition cursor-pointer ${idx === 3 ? 'bg-red-600 border-red-500 text-white' : ''}" data-max="${opt.maxMin}">
          ${opt.label}
        </button>
      `).join('')}
    </div>

    <div id="time-filter-results" class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2"></div>
  `;

  const pills = container.querySelectorAll(".time-pill");
  pills.forEach(p => {
    p.onclick = () => {
      pills.forEach(other => {
        other.classList.remove("bg-red-600", "border-red-500", "text-white");
        other.classList.add("bg-zinc-900", "border-zinc-800", "text-zinc-300");
      });
      p.classList.remove("bg-zinc-900", "border-zinc-800", "text-zinc-300");
      p.classList.add("bg-red-600", "border-red-500", "text-white");
      
      const maxMin = parseInt(p.getAttribute("data-max"), 10);
      renderTimeFilterResults(maxMin);
    };
  });

  renderTimeFilterResults(130);
}

function renderTimeFilterResults(maxMinutes) {
  const box = document.getElementById("time-filter-results");
  if (!box) return;

  const matches = MOVIES_DATA.filter(m => (m.durationMinutes || 120) <= maxMinutes);

  box.innerHTML = matches.map(m => renderMovieCardHTML(m)).join('');
  attachCardListeners(box);
}

// ==========================================
// INTERACTIVE GENRE EXPLORER WITH DYNAMIC BACKDROP
// ==========================================
function setupGenreExplorer() {
  const container = document.getElementById("genre-explorer-container");
  if (!container) return;

  const genres = [
    { name: "Sci-Fi", emoji: "🚀", backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop" },
    { name: "Action", emoji: "🔥", backdrop: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1600&auto=format&fit=crop" },
    { name: "Drama", emoji: "🎭", backdrop: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1600&auto=format&fit=crop" },
    { name: "Romance", emoji: "❤️", backdrop: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop" },
    { name: "Comedy", emoji: "😂", backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop" },
    { name: "Indian Cinema", emoji: "🇮🇳", backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop" },
    { name: "Animated", emoji: "🎨", backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop" }
  ];

  container.innerHTML = `
    <div class="relative rounded-3xl overflow-hidden p-6 md:p-10 border border-zinc-800 transition-all duration-500" id="genre-dynamic-backdrop" style="background: linear-gradient(to right, rgba(10,10,10,0.95), rgba(10,10,10,0.7)), url('${genres[0].backdrop}') center/cover no-repeat;">
      
      <div class="relative z-10 space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🎨</span>
          <div>
            <h2 class="text-2xl font-black text-white">Interactive Genre Explorer</h2>
            <p class="text-xs text-zinc-300">Hover over genres to transform ambient backdrops in real-time.</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 pt-2">
          ${genres.map((g, idx) => `
            <button class="genre-tag-btn px-4 py-2.5 rounded-xl bg-zinc-900/80 hover:bg-red-600 text-xs font-bold text-white border border-zinc-700/80 backdrop-blur-md transition cursor-pointer ${idx === 0 ? 'bg-red-600 border-red-500' : ''}" data-genre="${g.name}" data-backdrop="${g.backdrop}">
              ${g.emoji} ${g.name}
            </button>
          `).join('')}
        </div>

        <div id="genre-explorer-results" class="flex items-center gap-1 overflow-x-auto no-scrollbar pt-4"></div>
      </div>
    </div>
  `;

  const bgBox = document.getElementById("genre-dynamic-backdrop");
  const tagBtns = container.querySelectorAll(".genre-tag-btn");

  tagBtns.forEach(btn => {
    btn.onmouseenter = () => {
      const backdrop = btn.getAttribute("data-backdrop");
      bgBox.style.background = `linear-gradient(to right, rgba(10,10,10,0.92), rgba(10,10,10,0.75)), url('${backdrop}') center/cover no-repeat`;
    };

    btn.onclick = () => {
      tagBtns.forEach(b => b.classList.remove("bg-red-600", "border-red-500"));
      btn.classList.add("bg-red-600", "border-red-500");
      const genre = btn.getAttribute("data-genre");
      renderGenreResults(genre);
    };
  });

  renderGenreResults("Sci-Fi");
}

function renderGenreResults(genreName) {
  const box = document.getElementById("genre-explorer-results");
  if (!box) return;

  const matches = MOVIES_DATA.filter(m => m.genres.includes(genreName));

  box.innerHTML = matches.map(m => renderMovieCardHTML(m)).join('');
  attachCardListeners(box);
}

// ==========================================
// 🇮🇳 INDIAN CINEMA HUB SECTION
// ==========================================
function setupIndianCinemaHub() {
  const container = document.getElementById("indian-cinema-hub-container");
  if (!container) return;

  const languages = [
    { name: "All Regional", code: "ALL" },
    { name: "Bollywood (Hindi)", code: "Hindi" },
    { name: "Kannada (Sandalwood)", code: "Kannada" },
    { name: "Telugu (Tollywood)", code: "Telugu" },
    { name: "Tamil (Kollywood)", code: "Tamil" },
    { name: "Malayalam (Mollywood)", code: "Malayalam" }
  ];

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🇮🇳</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">Indian Cinema Hub</h2>
        <p class="text-xs text-zinc-400">Discover regional Indian blockbusters across languages.</p>
      </div>
    </div>

    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
      ${languages.map((l, idx) => `
        <button class="indian-hub-pill px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition cursor-pointer ${idx === 0 ? 'bg-red-600 border-red-500 text-white' : ''}" data-code="${l.code}">
          ${l.name}
        </button>
      `).join('')}
    </div>

    <div id="indian-hub-results" class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2"></div>
  `;

  const pills = container.querySelectorAll(".indian-hub-pill");
  pills.forEach(p => {
    p.onclick = () => {
      pills.forEach(other => {
        other.classList.remove("bg-red-600", "border-red-500", "text-white");
        other.classList.add("bg-zinc-900", "border-zinc-800", "text-zinc-300");
      });
      p.classList.remove("bg-zinc-900", "border-zinc-800", "text-zinc-300");
      p.classList.add("bg-red-600", "border-red-500", "text-white");
      
      renderIndianHubResults(p.getAttribute("data-code"));
    };
  });

  renderIndianHubResults("ALL");
}

function renderIndianHubResults(langCode) {
  const box = document.getElementById("indian-hub-results");
  if (!box) return;

  let matches = MOVIES_DATA.filter(m => m.country === "Indian Cinema" || m.genres.includes("Indian Cinema"));

  if (langCode !== "ALL") {
    matches = matches.filter(m => m.language.includes(langCode));
  }

  box.innerHTML = matches.map(m => renderMovieCardHTML(m)).join('');
  attachCardListeners(box);
}

// ==========================================
// 🍿 KIDS & FAMILY SECTION
// ==========================================
function renderKidsSection() {
  const container = document.getElementById("kids-section-container");
  if (!container) return;

  const kidsMovies = MOVIES_DATA.filter(m => m.isKids);

  container.innerHTML = `
    <div class="relative rounded-3xl p-6 md:p-8 bg-gradient-to-r from-amber-600/30 via-pink-600/20 to-purple-700/30 border border-yellow-500/30 backdrop-blur-xl overflow-hidden my-8 shadow-2xl">
      <div class="absolute top-0 right-0 p-8 opacity-10 text-8xl pointer-events-none select-none">🎈</div>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-6">
        <div class="flex items-center gap-3">
          <span class="text-4xl animate-bounce">🎈</span>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight" data-i18n="row_kids_title">🍿 Kids & Family Special</h2>
              <span class="px-2.5 py-0.5 rounded-full bg-yellow-400 text-black font-extrabold text-[10px] uppercase">RATED U</span>
            </div>
            <p class="text-xs md:text-sm text-yellow-100/80 mt-1" data-i18n="row_kids_desc">Fun, magical, and colorful stories curated for young adventurers.</p>
          </div>
        </div>

        <button onclick="window.location.href='/browse/search.html?filter=kids'" class="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xs transition shadow-lg flex items-center gap-2 w-fit cursor-pointer">
          <span>Explore All Kids Movies</span> ➔
        </button>
      </div>

      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        ${kidsMovies.map(m => renderMovieCardHTML(m)).join('')}
      </div>
    </div>
  `;

  attachCardListeners(container);
}
// ==========================================
// 🕵️ HIDDEN GEMS SECTION
// ==========================================
function renderHiddenGemsSection() {
  const container = document.getElementById("hidden-gems-container");
  if (!container) return;

  const gems = MOVIES_DATA.filter(m => m.isHiddenGem);

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🕵️</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">Hidden Gems</h2>
        <p class="text-xs text-zinc-400">Critically acclaimed masterpieces you might have overlooked.</p>
      </div>
    </div>

    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
      ${gems.map(m => renderMovieCardHTML(m)).join('')}
    </div>
  `;

  attachCardListeners(container);
}

// ==========================================
// 🔔 COMING SOON & 🗓️ RELEASE CALENDAR
// ==========================================
function renderComingSoonSection() {
  const container = document.getElementById("coming-soon-container");
  if (!container) return;

  const reminders = AppState.getReminders();

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left 2 Cols: Coming Soon List -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🔔</span>
          <div>
            <h2 class="text-xl font-black text-white">Coming Soon</h2>
            <p class="text-xs text-zinc-400">Set reminders for upcoming blockbuster releases.</p>
          </div>
        </div>

        <div class="space-y-4">
          ${COMING_SOON_DATA.map(cs => {
            const isReminded = reminders.includes(cs.id);
            return `
              <div class="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-center gap-1 hover:border-zinc-700 transition">
                <img src="${cs.poster}" alt="${cs.title}" class="w-24 h-32 object-cover rounded-xl flex-shrink-0" />
                <div class="space-y-2 flex-1 text-center sm:text-left">
                  <span class="px-2.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-extrabold uppercase tracking-wider">${cs.releaseDate}</span>
                  <h3 class="text-base font-bold text-white">${cs.title}</h3>
                  <p class="text-xs text-zinc-400 line-clamp-2">${cs.description}</p>
                </div>
                <button class="cs-reminder-btn px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${isReminded ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}" data-id="${cs.id}">
                  ${isReminded ? '✓ Reminded' : '🔔 Remind Me'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right 1 Col: Release Calendar Widget -->
      <div class="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">🗓️ Release Calendar</h3>
          <span class="text-xs text-red-500 font-bold">August 2026</span>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-zinc-500">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs">
          ${Array.from({length: 31}, (_, i) => i + 1).map(day => {
            const hasRelease = day === 25 || day === 10 || day === 28;
            return `
              <div class="py-2 rounded-lg ${hasRelease ? 'bg-red-600 text-white font-extrabold shadow-lg shadow-red-600/30 cursor-pointer' : 'bg-zinc-800/40 text-zinc-400'}" ${hasRelease ? 'onclick="showToast(\'🎬 Movie release scheduled on August ' + day + '!\', \'info\')"' : ''}>
                ${day}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  const btnList = container.querySelectorAll(".cs-reminder-btn");
  btnList.forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute("data-id");
      const added = AppState.toggleReminder(id);
      btn.textContent = added ? "✓ Reminded" : "🔔 Remind Me";
      btn.className = `cs-reminder-btn px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${added ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`;
    };
  });
}

// ==========================================
// 🌎 BROWSE BY LANGUAGE SECTION
// ==========================================
function renderLanguagePillsSection() {
  const container = document.getElementById("language-pills-container");
  if (!container) return;

  const languages = [
    { flag: "🇮🇳", name: "Hindi" },
    { flag: "🇮🇳", name: "Kannada" },
    { flag: "🇮🇳", name: "Telugu" },
    { flag: "🇮🇳", name: "Tamil" },
    { flag: "🇮🇳", name: "Malayalam" },
    { flag: "🇬🇧", name: "English" },
    { flag: "🇯🇵", name: "Japanese" },
    { flag: "🇰🇷", name: "Korean" }
  ];

  container.innerHTML = `
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🌎</span>
      <div>
        <h2 class="text-xl md:text-2xl font-black text-white tracking-tight">Browse by Language</h2>
        <p class="text-xs text-zinc-400">Stream global entertainment in your native audio.</p>
      </div>
    </div>

    <div class="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
      ${languages.map(l => `
        <button onclick="window.location.href='/browse/search.html?lang=${l.name}'" class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-600 hover:bg-zinc-800 text-xs font-bold text-white transition cursor-pointer flex-shrink-0">
          <span>${l.flag}</span> ${l.name}
        </button>
      `).join('')}
    </div>
  `;
}

// ==========================================
// ALL CATEGORY ROWS & TOP 10 TODAY
// ==========================================
function renderAllCategoryRows() {
  const rowsContainer = document.getElementById("movie-rows-container");
  if (!rowsContainer) return;

  let html = "";

  // Continue Watching
  const watchData = AppState.getAllWatchProgress();
  const continueList = Object.keys(watchData).map(id => {
    const movie = MOVIES_DATA.find(m => m.id === id);
    return movie ? { movie, progress: watchData[id] } : null;
  }).filter(Boolean);

  if (continueList.length > 0) {
    html += `
      <section class="mb-10">
        <h2 class="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-2">
          <span>▶</span> Continue Watching
        </h2>
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          ${continueList.map(item => `
            <div class="relative flex-shrink-0 w-60 md:w-72 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-red-600 transition cursor-pointer group" onclick="openVideoPlayer('${item.movie.id}')">
              <div class="aspect-video relative">
                <img src="${item.movie.backdrop}" alt="${item.movie.title}" class="w-full h-full object-cover group-hover:scale-105 transition" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span class="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-lg shadow-xl">▶</span>
                </div>
              </div>
              <div class="w-full h-1.5 bg-zinc-800">
                <div class="h-full bg-red-600" style="width: ${item.progress.percent}%"></div>
              </div>
              <div class="p-3 flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-bold text-white line-clamp-1">${item.movie.title}</h4>
                  <p class="text-xs text-zinc-400 mt-0.5">${item.progress.percent}% completed</p>
                </div>
                <span class="text-xs text-red-500 font-semibold">Resume</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Top 10 Today Row
  const top10 = MOVIES_DATA.filter(m => m.top10Rank).sort((a,b) => a.top10Rank - b.top10Rank);
  html += `
    <section class="mb-10">
      <h2 class="text-xl md:text-2xl font-black text-white mb-4 tracking-tight">Top 10 Movies & Series Today</h2>
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
        ${top10.map(m => `
          <div class="top10-card group" onclick="openMovieDetails('${m.id}')">
            <span class="top10-number">0${m.top10Rank}</span>
            <div class="movie-card">
              <img src="${m.poster}" alt="${m.title}" class="w-full h-64 md:h-80 object-cover" />
              <div class="movie-card-overlay absolute inset-0 p-3 flex flex-col justify-end">
                <h3 class="text-xs font-bold text-white">${m.title}</h3>
                <span class="text-[10px] text-emerald-400">★ ${m.rating}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Standard Categories
  const categories = [
    { title: "Trending Right Now 🔥", filter: m => m.isTrending },
    { title: "Popular Blockbusters", filter: m => m.isPopular },
    { title: "Sci-Fi & Cyberpunk", filter: m => m.genres.includes("Sci-Fi") },
    { title: "High-Octane Action", filter: m => m.genres.includes("Action") },
    { title: "Award Winners & Masterpieces", filter: m => m.isAwardWinner }
  ];

  categories.forEach(cat => {
    const list = MOVIES_DATA.filter(cat.filter);
    if (list.length > 0) {
      html += `
        <section class="mb-10">
          <h2 class="text-lg md:text-2xl font-black text-white mb-4 tracking-tight">${cat.title}</h2>
          <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
            ${list.map(m => renderMovieCardHTML(m)).join('')}
          </div>
        </section>
      `;
    }
  });

  rowsContainer.innerHTML = html;
  attachCardListeners(rowsContainer);
}

// Generate movie card HTML with preview video
function renderMovieCardHTML(movie) {
  const isInList = AppState.isInMyList(movie.id);
  const displayTitle = I18N.getMovieTitle(movie);

  return `
    <div class="movie-card group" data-movie-id="${movie.id}">
      <img src="${movie.poster}" alt="${displayTitle}" class="w-full h-64 md:h-80 object-cover" loading="lazy" />
      
      ${movie.preview ? `<video class="card-preview-video" muted loop playsinline src="${movie.preview}"></video>` : ''}

      <div class="movie-card-overlay absolute inset-0 p-3 flex flex-col justify-end">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">${movie.genres[0]}</span>
          ${movie.isKids ? '<span class="text-[9px] px-1 bg-yellow-400 text-black font-extrabold rounded">KIDS</span>' : ''}
        </div>
        <h3 class="text-xs md:text-sm font-bold text-white line-clamp-1">${displayTitle}</h3>
        
        <div class="flex items-center gap-2 text-[10px] text-zinc-300 mt-1">
          <span class="text-emerald-400 font-bold">★ ${movie.rating}</span>
          <span>${movie.year}</span>
          <span>${movie.duration}</span>
        </div>

        <div class="flex items-center gap-2 mt-3">
          <button class="card-play-btn p-2 rounded-full bg-white text-black hover:bg-zinc-200 transition cursor-pointer" title="Play">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
          
          <button class="card-list-btn p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition border border-zinc-600 cursor-pointer" title="My List">
            ${isInList ? '✓' : '＋'}
          </button>

          <button class="card-info-btn p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition border border-zinc-600 cursor-pointer ml-auto" title="Details">
            ⓘ
          </button>
        </div>
      </div>
    </div>
  `;
}

function attachCardListeners(container) {
  const cards = container.querySelectorAll(".movie-card");
  cards.forEach(card => {
    const movieId = card.getAttribute("data-movie-id");
    const video = card.querySelector(".card-preview-video");

    if (video && window.innerWidth > 768) {
      let timeout;
      card.onmouseenter = () => {
        timeout = setTimeout(() => {
          video.currentTime = 0;
          video.play().catch(() => {});
        }, 300);
      };
      card.onmouseleave = () => {
        clearTimeout(timeout);
        video.pause();
      };
    }

    card.onclick = (e) => {
      if (e.target.closest(".card-play-btn")) {
        e.stopPropagation();
        openVideoPlayer(movieId);
      } else if (e.target.closest(".card-list-btn")) {
        e.stopPropagation();
        AppState.toggleMyList(movieId);
      } else if (e.target.closest(".card-info-btn")) {
        e.stopPropagation();
        openMovieDetails(movieId);
      } else {
        openMovieDetails(movieId);
      }
    };
  });
}
