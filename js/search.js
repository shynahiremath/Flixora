/**
 * NETFLIX - Live Search & Category Filtering Controller
 * Supports text search, genre/year/rating/language/kids filters,
 * URL params parsing, and Web Speech API Voice Search.
 */

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await Auth.requireAuth();
  if (!currentUser) return;

  const searchInput = document.getElementById("search-input");
  const micBtn = document.getElementById("voice-search-btn");
  const genreFilter = document.getElementById("search-genre-filter");
  const yearFilter = document.getElementById("search-year-filter");
  const ratingFilter = document.getElementById("search-rating-filter");
  const languageFilter = document.getElementById("search-language-filter");
  const kidsFilterBtn = document.getElementById("search-kids-btn");
  const resultsContainer = document.getElementById("search-results-grid");
  const emptyState = document.getElementById("search-empty-state");
  const resultCount = document.getElementById("search-count");

  // Parse URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get("q") || "";
  const initialLang = urlParams.get("lang") || "";
  const initialFilter = urlParams.get("filter") || "";
  let isKidsFilterActive = initialFilter === "kids";

  if (searchInput && initialQuery) searchInput.value = initialQuery;
  if (languageFilter && initialLang) languageFilter.value = initialLang;

  if (kidsFilterBtn) {
    if (isKidsFilterActive) {
      kidsFilterBtn.classList.add("bg-yellow-400", "text-black", "font-extrabold");
      kidsFilterBtn.classList.remove("bg-zinc-800", "text-zinc-200");
    }
    kidsFilterBtn.addEventListener("click", () => {
      isKidsFilterActive = !isKidsFilterActive;
      if (isKidsFilterActive) {
        kidsFilterBtn.classList.add("bg-yellow-400", "text-black", "font-extrabold");
        kidsFilterBtn.classList.remove("bg-zinc-800", "text-zinc-200");
      } else {
        kidsFilterBtn.classList.remove("bg-yellow-400", "text-black", "font-extrabold");
        kidsFilterBtn.classList.add("bg-zinc-800", "text-zinc-200");
      }
      filterMovies();
    });
  }

  // Web Speech API Voice Search Setup
  if (micBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = I18N.getLang() === "hi" ? "hi-IN" : "en-US";

      micBtn.addEventListener("click", () => {
        micBtn.classList.add("text-red-500", "animate-pulse");
        showToast("🎙️ Listening... Speak movie title or genre", "info");
        recognition.start();
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (searchInput) {
          searchInput.value = transcript;
          filterMovies();
          showToast(`Voice Search: "${transcript}"`, "success");
        }
      };

      recognition.onerror = () => {
        micBtn.classList.remove("text-red-500", "animate-pulse");
        showToast("Voice search error or permission denied", "warning");
      };

      recognition.onend = () => {
        micBtn.classList.remove("text-red-500", "animate-pulse");
      };
    } else {
      micBtn.onclick = () => {
        showToast("Voice search is not supported in this browser", "warning");
      };
    }
  }

  function filterMovies() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedGenre = genreFilter ? genreFilter.value : "";
    const selectedYear = yearFilter ? yearFilter.value : "";
    const selectedRating = ratingFilter ? parseFloat(ratingFilter.value) || 0 : 0;
    const selectedLang = languageFilter ? languageFilter.value : "";

    const filtered = MOVIES_DATA.filter(m => {
      const displayTitle = I18N.getMovieTitle(m).toLowerCase();
      const displayDesc = I18N.getMovieDesc(m).toLowerCase();

      const matchesQuery = !query || 
        displayTitle.includes(query) ||
        displayDesc.includes(query) ||
        m.title.toLowerCase().includes(query) ||
        (m.titleHi && m.titleHi.toLowerCase().includes(query)) ||
        m.cast.some(c => c.toLowerCase().includes(query)) ||
        m.director.toLowerCase().includes(query) ||
        m.genres.some(g => g.toLowerCase().includes(query)) ||
        m.description.toLowerCase().includes(query);

      const matchesGenre = !selectedGenre || m.genres.includes(selectedGenre);
      const matchesYear = !selectedYear || m.year.toString() === selectedYear;
      const matchesRating = m.rating >= selectedRating;
      const matchesLang = !selectedLang || m.language.toLowerCase().includes(selectedLang.toLowerCase());
      const matchesKids = !isKidsFilterActive || m.isKids;

      return matchesQuery && matchesGenre && matchesYear && matchesRating && matchesLang && matchesKids;
    });

    renderSearchResults(filtered);
  }

  function renderSearchResults(movies) {
    if (!resultsContainer) return;

    if (resultCount) {
      resultCount.textContent = `${movies.length} ${I18N.getLang() === 'hi' ? 'फ़िल्में मिलीं' : 'titles found'}`;
    }

    if (movies.length === 0) {
      resultsContainer.classList.add("hidden");
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    resultsContainer.classList.remove("hidden");

    resultsContainer.innerHTML = movies.map(m => {
      const displayTitle = I18N.getMovieTitle(m);
      return `
        <div class="movie-card group w-full" data-movie-id="${m.id}">
          <img src="${m.poster}" alt="${displayTitle}" class="w-full h-72 object-cover" />
          ${m.preview ? `<video class="card-preview-video" muted loop playsinline src="${m.preview}"></video>` : ''}
          
          <div class="movie-card-overlay absolute inset-0 p-3 flex flex-col justify-end">
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">${m.genres[0]}</span>
              ${m.isKids ? '<span class="text-[9px] px-1 bg-yellow-400 text-black font-extrabold rounded">KIDS</span>' : ''}
            </div>
            <h3 class="text-xs md:text-sm font-bold text-white line-clamp-1">${displayTitle}</h3>
            
            <div class="flex items-center gap-2 text-[10px] text-zinc-300 mt-1">
              <span class="text-emerald-400 font-bold">★ ${m.rating}</span>
              <span>${m.year}</span>
              <span>${m.duration}</span>
            </div>

            <div class="flex items-center gap-2 mt-3">
              <button class="card-play-btn p-2 rounded-full bg-white text-black hover:bg-zinc-200 transition cursor-pointer" title="Play">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="card-info-btn p-2 rounded-full bg-zinc-800/80 text-white hover:bg-zinc-700 transition border border-zinc-600 cursor-pointer ml-auto" title="Details">
                ⓘ
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const cards = resultsContainer.querySelectorAll(".movie-card");
    cards.forEach(card => {
      const id = card.getAttribute("data-movie-id");
      card.onclick = (e) => {
        if (e.target.closest(".card-play-btn")) {
          e.stopPropagation();
          openVideoPlayer(id);
        } else {
          openMovieDetails(id);
        }
      };
    });
  }

  if (searchInput) searchInput.addEventListener("input", filterMovies);
  if (genreFilter) genreFilter.addEventListener("change", filterMovies);
  if (yearFilter) yearFilter.addEventListener("change", filterMovies);
  if (ratingFilter) ratingFilter.addEventListener("change", filterMovies);
  if (languageFilter) languageFilter.addEventListener("change", filterMovies);

  window.addEventListener("lang-changed", () => {
    filterMovies();
  });

  filterMovies();
});
