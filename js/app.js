/**
 * NETFLIX - Core Application Engine & Data Store
 * Handles movie dataset, state management, recommendation engine,
 * video player with scrubbing preview, AI assistant,
 * reactions, watch stats, achievements, themes, and modals.
 */

// ==========================================
// INTERNATIONALIZATION (i18n) ENGINE & DICTIONARY
// ==========================================
const I18N = {
  getLang() {
    return localStorage.getItem("netflix_lang") || "en";
  },
  setLang(lang) {
    localStorage.setItem("netflix_lang", lang);
    document.documentElement.lang = lang;
    I18N.applyTranslations();
    window.dispatchEvent(new CustomEvent("lang-changed", { detail: { lang } }));
  },
  t(key, fallback = "") {
    const lang = I18N.getLang();
    if (I18N.dict[lang] && I18N.dict[lang][key]) {
      return I18N.dict[lang][key];
    }
    return fallback || key;
  },
  getMovieTitle(movie) {
    if (!movie) return "";
    const lang = I18N.getLang();
    if (lang === "hi" && movie.titleHi) return movie.titleHi;
    return movie.title;
  },
  getMovieDesc(movie) {
    if (!movie) return "";
    const lang = I18N.getLang();
    if (lang === "hi" && movie.descriptionHi) return movie.descriptionHi;
    return movie.description;
  },
  applyTranslations() {
    const lang = I18N.getLang();
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (I18N.dict[lang] && I18N.dict[lang][key]) {
        el.textContent = I18N.dict[lang][key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (I18N.dict[lang] && I18N.dict[lang][key]) {
        el.placeholder = I18N.dict[lang][key];
      }
    });

    const langLabel = document.getElementById("current-lang-label");
    if (langLabel) {
      langLabel.textContent = lang === "hi" ? "हिंदी" : "English";
    }

    const checkEn = document.getElementById("check-lang-en");
    const checkHi = document.getElementById("check-lang-hi");
    if (checkEn && checkHi) {
      if (lang === "hi") {
        checkEn.classList.add("hidden");
        checkHi.classList.remove("hidden");
      } else {
        checkEn.classList.remove("hidden");
        checkHi.classList.add("hidden");
      }
    }
  },
  dict: {
    en: {
      nav_home: "Home",
      nav_movies: "Movies",
      nav_series: "Series",
      nav_kids: "Kids Corner",
      nav_new: "New & Popular",
      nav_mylist: "My List",
      nav_account: "Account & Settings",
      nav_signout: "Sign Out",
      nav_signin: "Sign In",
      nav_signup: "Sign Up",
      hero_original: "NETFLIX ORIGINAL",
      hero_play: "Play Stream",
      hero_add_list: "Add to My List",
      hero_in_list: "In My List",
      hero_more_info: "More Info",
      hero_surprise: "Surprise Me",
      top10_today: "# IN TOP 10 TODAY",
      row_kids_title: "🍿 Kids & Family Special",
      row_kids_desc: "Fun, magical, and colorful stories curated for young adventurers.",
      row_trending_title: "🔥 Trending Now",
      row_indian_title: "🇮🇳 Indian Cinema Showcase",
      row_hidden_title: "✨ Hidden Gems",
      row_coming_soon: "📅 Coming Soon & Release Calendar",
      row_time_title: "⏳ What Can I Watch? (Time Filter)",
      row_moodsync_title: "⚡ MoodSync: What's Your Vibe?",
      row_why_title: "🔮 Recommended For You",
      row_top10_title: "🏆 Top 10 Movies & Shows Today",
      row_languages: "🌐 Explore By Language",
      mood_happy: "😊 Happy",
      mood_energetic: "🔥 Energetic",
      mood_relaxed: "🌿 Relaxed",
      mood_romantic: "❤️ Romantic",
      mood_stressed: "⚡ Stressed",
      btn_all: "All",
      btn_kids: "Kids Only",
      ai_title: "Netflix AI Assistant",
      ai_subtitle: "● Powered by Rule-Based Smart Engine",
      ai_greeting: "👋 Hi! I'm your Netflix AI guide. Ask me things like:",
      ai_prompt1: "Show me kids animation movies",
      ai_prompt2: "Find Hindi blockbuster movies",
      ai_prompt3: "Recommend a 15-minute short film",
      search_placeholder: "Search movies, series, actors, genres, or kids content...",
      search_all_genres: "All Genres",
      search_kids_filter: "🎈 Kids & Family Only",
      profile_title: "Account & Profiles",
      switch_profile: "Switch Profile",
      lang_label: "Language",
      footer_copyright: "© 2026 Netflix — Educational Portfolio Project",
      // Landing page
      landing_title: "Unlimited Movies, TV Series & Originals.",
      landing_sub: "Stream in stunning 4K HDR. Watch anywhere, cancel anytime.",
      landing_placeholder: "Enter your email to get started",
      landing_btn: "Get Started ›",
      landing_feat1_title: "Enjoy on your TV",
      landing_feat1_desc: "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
      landing_feat2_title: "Instant MoodSync",
      landing_feat2_desc: "Feeling happy, energetic, or relaxed? Our smart mood filtering curates the perfect title instantly.",
      landing_feat3_title: "Create Kids Profiles",
      landing_feat3_desc: "Send kids on adventures with their favorite characters in a space made just for them—free with your membership.",
      faq_title: "Frequently Asked Questions",
      faq_q1: "What is Netflix?",
      faq_a1: "Netflix is an educational streaming application with real video playback, watch progress memory, Kids section, and multi-language support.",
      faq_q2: "How much does Netflix cost?",
      faq_a2: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device. Plans range from ₹149 to ₹499 a month.",
      faq_q3: "Where can I watch?",
      faq_a3: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web from any device."
    },
    hi: {
      nav_home: "होम",
      nav_movies: "फ़िल्में",
      nav_series: "वेब सीरीज़",
      nav_kids: "बच्चों का कॉर्नर",
      nav_new: "नया और लोकप्रिय",
      nav_mylist: "मेरी सूची",
      nav_account: "खाता और सेटिंग्स",
      nav_signout: "साइन आउट",
      nav_signin: "साइन इन",
      nav_signup: "साइन अप",
      hero_original: "नेटफ्लिक्स ओरिजिनल",
      hero_play: "अभी देखें",
      hero_add_list: "मेरी सूची में जोड़ें",
      hero_in_list: "मेरी सूची में है",
      hero_more_info: "अधिक जानकारी",
      hero_surprise: "सरप्राइज दें",
      top10_today: "आज के टॉप 10 में #",
      row_kids_title: "🍿 बच्चों और परिवार का स्पेशल",
      row_kids_desc: "छोटे बच्चों और परिवारों के लिए मनोरंजक, जादुई और रंगीन कहानियाँ।",
      row_trending_title: "🔥 अभी ट्रेंडिंग में",
      row_indian_title: "🇮🇳 भारतीय सिनेमा शोकेस",
      row_hidden_title: "✨ अनदेखे रत्न (Hidden Gems)",
      row_coming_soon: "📅 जल्द आ रहा है (रिलीज़ कैलेंडर)",
      row_time_title: "⏳ क्या देखना चाहते हैं? (समय अनुसार फ़िल्टर)",
      row_moodsync_title: "⚡ मूडसिंक: आपका मूड कैसा है?",
      row_why_title: "🔮 आपके लिए खास सुझाव",
      row_top10_title: "🏆 आज की टॉप 10 फ़िल्में और शो",
      row_languages: "🌐 भाषा के अनुसार खोजें",
      mood_happy: "😊 खुश",
      mood_energetic: "🔥 ऊर्जावान",
      mood_relaxed: "🌿 शांत",
      mood_romantic: "❤️ रोमान्टिक",
      mood_stressed: "⚡ तनावमुक्त रहें",
      btn_all: "सभी",
      btn_kids: "केवल बच्चे (Kids)",
      ai_title: "नेटफ्लिक्स एआई असिस्टेंट",
      ai_subtitle: "● स्मार्ट रूल-बेस्ड इंजन द्वारा संचालित",
      ai_greeting: "👋 नमस्ते! मैं आपका नेटफ्लिक्स एआई गाइड हूँ। मुझसे ऐसे सवाल पूछें:",
      ai_prompt1: "बच्चों की एनिमेटेड फ़िल्में दिखाओ",
      ai_prompt2: "हिंदी की ब्लॉकबस्टर फ़िल्में ढूँढो",
      ai_prompt3: "15 मिनट की छोटी फ़िल्म सुझाओ",
      search_placeholder: "फ़िल्म, सीरीज़, कलाकार या बच्चों का शो खोजें...",
      search_all_genres: "सभी शैलियां",
      search_kids_filter: "🎈 केवल बच्चों का सेक्शन",
      profile_title: "खाता और प्रोफ़ाइल",
      switch_profile: "प्रोफ़ाइल बदलें",
      lang_label: "भाषा",
      footer_copyright: "© 2026 नेटफ्लिक्स — शैक्षणिक पोर्टफोलियो प्रोजेक्ट",
      // Landing page
      landing_title: "असीमित फ़िल्में, टीवी सीरीज़ और ओरिजिनल्स।",
      landing_sub: "शानदार 4K HDR में स्ट्रीम करें। कहीं भी देखें, कभी भी रद्द करें।",
      landing_placeholder: "शुरू करने के लिए अपना ईमेल दर्ज करें",
      landing_btn: "शुरू करें ›",
      landing_feat1_title: "अपने टीवी पर आनंद लें",
      landing_feat1_desc: "स्मार्ट टीवी, प्लेस्टेशन, एक्सबॉक्स, क्रोमकास्ट, ऐप्पल टीवी और ब्लू-रे प्लेयर पर देखें।",
      landing_feat2_title: "इंस्टेंट मूडसिंक",
      landing_feat2_desc: "खुश, ऊर्जावान या शांत महसूस कर रहे हैं? हमारा स्मार्ट मूड फ़िल्टर तुरंत सही शीर्षक चुनता है।",
      landing_feat3_title: "बच्चों के प्रोफ़ाइल बनाएं",
      landing_feat3_desc: "बच्चों को उनकी पसंदीदा कहानियों के साथ एक सुरक्षित स्थान दें—आपकी सदस्यता के साथ मुफ़्त।",
      faq_title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      faq_q1: "नेटफ्लिक्स क्या है?",
      faq_a1: "नेटफ्लिक्स एक शैक्षणिक स्ट्रीमिंग ऐप है जिसमें वास्तविक वीडियो प्लेबैक, वॉच प्रोग्रेस मेमोरी, किड्स सेक्शन और हिंदी भाषा सपोर्ट उपलब्ध है।",
      faq_q2: "नेटफ्लिक्स का मूल्य कितना है?",
      faq_a2: "अपने स्मार्टफोन, टैबलेट, स्मार्ट टीवी या लैपटॉप पर नेटफ्लिक्स देखें। प्लान ₹149 से ₹499 प्रति माह तक हैं।",
      faq_q3: "मैं कहाँ देख सकता हूँ?",
      faq_a3: "कहीं भी, कभी भी देखें। किसी भी इंटरनेट-कनेक्टेड डिवाइस से तुरंत देखने के लिए अपने नेटफ्लिक्स खाते से साइन इन करें।"
    }
  }
};

window.I18N = I18N;

window.toggleLangMenu = function() {
  const menu = document.getElementById("lang-dropdown-menu");
  if (menu) menu.classList.toggle("hidden");
};

window.setAppLanguage = function(lang) {
  I18N.setLang(lang);
  const menu = document.getElementById("lang-dropdown-menu");
  if (menu) menu.classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  I18N.applyTranslations();
  document.addEventListener("click", (e) => {
    const langBtn = e.target.closest("[onclick*='toggleLangMenu']");
    const langDropdown = document.getElementById("lang-dropdown-menu");
    if (!langBtn && langDropdown && !langDropdown.contains(e.target)) {
      langDropdown.classList.add("hidden");
    }
  });
});

// ==========================================
// CENTRAL MOVIE & SERIES DATABASE
// ==========================================
const MOVIES_DATA = [
  {
    id: "m1",
    title: "Spider-Man: Beyond the Spider-Verse",
    titleHi: "स्पाइडर-मैन: बियोंड द स्पाइडर-वर्स",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 9.6,
    ageRating: "13+",
    duration: "2h 20m",
    durationMinutes: 140,
    genres: ["Action", "Animated", "Sci-Fi", "Superhero", "Thriller", "Superhero", "Animated"],
    moods: ["Energetic", "Happy"],
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When a new threat emerges, Miles must redefine what it means to be a hero to save the people he loves most.",
    descriptionHi: "माइल्स मोरालेस मल्टीवर्स में यात्रा करता है, जहाँ उसकी मुलाकात स्पाइडर-लोगों की एक टीम से होती है। जब एक नया खतरा पैदा होता है, तो माइल्स को अपने प्रियजनों को बचाने के लिए नए सिरे से नायक बनना पड़ता है।",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop",
    youtubeId: "u24F-3SYDuM",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Daniel Kaluuya"],
    director: "Joaquim Dos Santos, Kemp Powers",
    language: "English",
    country: "Hollywood",
    top10Rank: 1,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false
  },
  {
    id: "m2",
    title: "Shadows of Varanasi",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.7,
    ageRating: "13+",
    duration: "2h 35m",
    durationMinutes: 155,
    genres: ["Drama", "Thriller","Action", "Animated", "Sci-Fi", "Superhero"],
    moods: ["Sad", "Relaxed"],
    description: "Along the mystical banks of the Ganges, an old investigator comes out of retirement to decipher a decades-old mystery tied to ancient secrets and forgotten lineages.",
    poster: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Manoj Bajpayee", "Tabu", "Jaideep Ahlawat"],
    director: "Anurag Kashyap",
    language: "Hindi",
    country: "Indian Cinema",
    top10Rank: 2,
    isTrending: true,
    isPopular: true,
    isNew: false,
    isAwardWinner: true,
    isHiddenGem: false
  },
  {
    id: "s1",
    title: "The Stellar Drift",
    category: "series",
    type: "TV Series",
    year: 2026,
    rating: 9.1,
    ageRating: "18+",
    duration: "2 Seasons",
    durationMinutes: 52,
    genres: ["Action", "Animated", "Romance", "Sci-Fi", "Superhero","Sci-Fi", "Drama"],
    moods: ["Energetic", "Relaxed"],
    description: "When the first colony ship bound for Alpha Centauri loses communications with Earth, a courageous crew must navigate hostile anomaly zones and internal mutiny.",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    cast: ["David Harbour", "Rebecca Ferguson", "Cillian Murphy"],
    director: "Christopher Nolan",
    language: "English",
    country: "Hollywood",
    top10Rank: 3,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    episodes: [
      { id: "s1e1", episodeNumber: 1, seasonNumber: 1, title: "Signal in the Void", duration: "52m", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop", description: "The crew awakens from cryo-sleep early to an eerie distress signal echoing from deep space.", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
      { id: "s1e2", episodeNumber: 2, seasonNumber: 1, title: "Event Horizon", duration: "48m", thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=400&auto=format&fit=crop", description: "A system failure forces Commander Hayes into a perilous spacewalk during a solar storm.", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: "s1e3", episodeNumber: 3, seasonNumber: 1, title: "Ghost Protocol", duration: "55m", thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop", description: "Mysterious shadows manifest aboard the medical bay, prompting an intense lockdown.", video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
    ]
  },
  {
    id: "m3",
    title: "Celestial Symphony",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.5,
    ageRating: "U/A",
    duration: "1h 54m",
    durationMinutes: 114,
    genres: ["Animated", "Family", "Romance", "Music", "Action", "Animated", "Sci-Fi", "Superhero"],
    moods: ["Happy", "Relaxed"],
    description: "An enchanted violin player travels through floating fantasy realms, harmonizing starlight to revive a world that has lost its color.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Voice of Hailee Steinfeld", "Voice of Lin-Manuel Miranda"],
    director: "Hayao Miyazaki",
    language: "English",
    country: "Animated",
    top10Rank: 4,
    isTrending: true,
    isPopular: true,
    isNew: false,
    isAwardWinner: true,
    isHiddenGem: false
  },
  {
    id: "m4",
    title: "Velocity: Tokyo Drift Reborn",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 8.2,
    ageRating: "16+",
    duration: "2h 05m",
    durationMinutes: 125,
    genres: ["Action","Action", "Romance", "Animated", "Sci-Fi", "Superhero", "Thriller"],
    moods: ["Energetic", "Happy"],
    description: "High-octane underground street racing meets futuristic electric supercars in the neon-drenched highways of night-time Tokyo.",
    poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Sung Kang", "Mackenyu", "Rinko Kikuchi"],
    director: "Justin Lin",
    language: "Japanese",
    country: "Hollywood",
    top10Rank: 5,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: false,
    isHiddenGem: false
  },
  {
    id: "m11",
    title: "Kantara: Roar of the Forest",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 9.1,
    ageRating: "16+",
    duration: "2h 28m",
    durationMinutes: 148,
    genres: ["Action","Comedy", "Drama", "Romance", "Indian Cinema", "Action", "Animated", "Sci-Fi", "Superhero"],
    moods: ["Energetic", "Stressed"],
    description: "In the sacred forests of coastal Karnataka, a fierce defender stands between ancient folklore guardians and modern corporate encroachment.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1542204113-e93847e2124e?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Rishab Shetty", "Sapthami Gowda", "Kishore"],
    director: "Rishab Shetty",
    language: "Kannada",
    country: "Indian Cinema",
    top10Rank: 6,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false
  },
  {
    id: "m12",
    title: "RRR: Fire & Water Alliance",
    category: "movie",
    type: "Feature Film",
    year: 2024,
    rating: 8.9,
    ageRating: "16+",
    duration: "3h 02m",
    durationMinutes: 182,
    genres: ["Action","Comedy", "Drama", "Indian Cinema", "Romance",],
    moods: ["Energetic", "Happy"],
    description: "Two legendary revolutionaries form an unbreakable brotherhood in 1920s India before discovering they fight on opposing sides of a hidden empire.",
    poster: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Ram Charan", "NTR Jr", "Alia Bhatt"],
    director: "S. S. Rajamouli",
    language: "Telugu",
    country: "Indian Cinema",
    top10Rank: 7,
    isTrending: true,
    isPopular: true,
    isNew: false,
    isAwardWinner: true,
    isHiddenGem: false
  },
  {
    id: "m6",
    title: "Midnight Cafe Whispers",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.8,
    ageRating: "13+",
    duration: "1h 48m",
    durationMinutes: 108,
    genres: ["Romance", "Comedy", "Drama"],
    moods: ["Romantic", "Relaxed", "Tired"],
    description: "A cozy Tokyo alleyway coffee shop opens only from midnight to 6 AM, serving warm brews and life-changing conversations to late-night travelers.",
    poster: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Kaoru Kobayashi", "Joe Odagiri", "Yuu Aoi"],
    director: "Hirokazu Kore-eda",
    language: "Japanese",
    country: "International",
    top10Rank: 8,
    isTrending: false,
    isPopular: true,
    isNew: false,
    isAwardWinner: true,
    isHiddenGem: true
  },
  {
    id: "m14",
    title: "Manjummel: Deep Cavern",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.7,
    ageRating: "13+",
    duration: "2h 15m",
    durationMinutes: 135,
    genres: ["Thriller", "Drama", "Indian Cinema", "Comedy"],
    moods: ["Stressed", "Sad"],
    description: "A group of close-knit friends on vacation in Kodaikanal face a desperate survival mission when one of them falls into the deadly Guna Caves.",
    poster: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Soubin Shahir", "Sreenath Bhasi", "Balu Varghese"],
    director: "Chidambaram",
    language: "Malayalam",
    country: "Indian Cinema",
    top10Rank: 9,
    isTrending: true,
    isPopular: true,
    isNew: false,
    isAwardWinner: true,
    isHiddenGem: true
  },
  {
    id: "m15",
    title: "Leo: Bloody Sweet Protocol",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.4,
    ageRating: "18+",
    duration: "2h 40m",
    durationMinutes: 160,
    genres: ["Action", "Thriller", "Indian Cinema"],
    moods: ["Energetic", "Stressed"],
    description: "A peaceful cafe owner in Himachal Pradesh becomes the target of a ruthless cartel who claim he is a legendary gangster from their past.",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Thalapathy Vijay", "Sanjay Dutt", "Trisha Krishnan"],
    director: "Lokesh Kanagaraj",
    language: "Tamil",
    country: "Indian Cinema",
    top10Rank: 10,
    isTrending: true,
    isPopular: true,
    isNew: false,
    isAwardWinner: false,
    isHiddenGem: false
  },
  {
    id: "m16",
    title: "Seoul Subconscious",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 8.9,
    ageRating: "18+",
    duration: "2h 10m",
    durationMinutes: 130,
    genres: ["Psychological", "Thriller", "Indian Cinema",],
    moods: ["Stressed", "Tired"],
    description: "An elite detective in Seoul uses memory synchronization devices to solve cold cases, only to realize his own recollections are being artificially rewritten.",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Lee Jung-jae", "Park So-dam", "Gong Yoo"],
    director: "Bong Joon-ho",
    language: "Korean",
    country: "International",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: true
  },
  {
    id: "m22",
    title: "The 15-Minute Spark",
    category: "movie",
    type: "Short Film",
    year: 2026,
    rating: 8.3,
    ageRating: "U/A",
    duration: "15m",
    durationMinutes: 15,
    genres: ["Animated", "Comedy", "Indian Cinema",],
    moods: ["Happy", "Relaxed"],
    description: "A whimsical 15-minute animated short following two sentient coffee mugs trying to reunite across a busy restaurant kitchen during morning rush hour.",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Voice of Tom Holland"],
    director: "Pete Docter",
    language: "English",
    country: "Animated",
    top10Rank: null,
    isTrending: false,
    isPopular: false,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: true,
    isKids: true
  },
  {
    id: "k1",
    title: "Little Singham: Dragon Realm Adventure",
    titleHi: "लिटिल सिंघम: ड्रैगन लोक का एडवेंचर",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 9.2,
    ageRating: "U",
    duration: "1h 32m",
    durationMinutes: 92,
    genres: ["Kids", "Animated", "Action", "Family"],
    moods: ["Happy", "Energetic"],
    description: "Young superhero Little Singham travels to an ancient dragon realm to protect a mythical fire crystal from evil shadow forces.",
    descriptionHi: "युवा सुपरहीरो लिटिल सिंघम एक प्राचीन ड्रैगन साम्राज्य में जाता है ताकि एक जादुई अग्नि क्रिस्टल को दुष्ट ताकतों से बचाया जा सके।",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Voice of Little Singham", "Voice of Chikki"],
    director: "Vikram Veturi",
    language: "Hindi",
    country: "Indian Cinema",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k2",
    title: "Chhota Bheem & The Lost Golden Dragon",
    titleHi: "छोटा भीम और सोने का खोया ड्रैगन",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 9.0,
    ageRating: "U",
    duration: "1h 40m",
    durationMinutes: 100,
    genres: ["Kids", "Animated", "Adventure", "Family"],
    moods: ["Happy", "Energetic"],
    description: "Bheem and his brave friends from Dholakpur embark on a high-stakes jungle quest to return a baby golden dragon to its mother.",
    descriptionHi: "ढोलकपुर के निडर भीम और उनके दोस्त एक छोटे सुनहरे ड्रैगन को उसकी माँ के पास पहुँचाने के लिए जंगल की खतरनाक यात्रा पर निकलते हैं।",
    poster: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Voice of Bheem", "Voice of Chutki", "Voice of Kalia"],
    director: "Rajiv Chilaka",
    language: "Hindi",
    country: "Indian Cinema",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k3",
    title: "Kung Fu Panda: Dragon Warrior Academy",
    titleHi: "कुंग फू पांडा: ड्रैगन वॉरियर अकादमी",
    category: "series",
    type: "Animated Series",
    year: 2026,
    rating: 8.8,
    ageRating: "U",
    duration: "1 Season",
    durationMinutes: 24,
    genres: ["Kids", "Animated", "Comedy", "Family"],
    moods: ["Happy", "Energetic"],
    description: "Po the Dragon Warrior opens a martial arts school for energetic young animals in the Valley of Peace.",
    descriptionHi: "ड्रैगन वॉरियर पो शांति की घाटी में ऊर्जावान युवा जानवरों के लिए एक मार्शल आर्ट स्कूल खोलता है।",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Voice of Jack Black", "Voice of Dustin Hoffman"],
    director: "Jennifer Yuh Nelson",
    language: "English",
    country: "Animated",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k4",
    title: "Motu Patlu: Dino Island Rescue",
    titleHi: "मोटू पतलू: डाइनो आइलैंड रेस्क्यू",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 8.7,
    ageRating: "U",
    duration: "1h 28m",
    durationMinutes: 88,
    genres: ["Kids", "Animated", "Comedy", "Family"],
    moods: ["Happy", "Relaxed"],
    description: "Furfuri Nagar's iconic duo Motu and Patlu travel back in time to save baby dinosaurs from a volcanic eruption.",
    descriptionHi: "फुरफुरी नगर की प्रसिद्ध जोड़ी मोटू और पतलू एक ज्वालामुखी विस्फोट से छोटे डायनासोरों को बचाने के लिए समय में पीछे यात्रा करते हैं।",
    poster: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cast: ["Voice of Motu", "Voice of Patlu", "Voice of Dr. Jhatka"],
    director: "Suhas Kadav",
    language: "Hindi",
    country: "Indian Cinema",
    top10Rank: null,
    isTrending: false,
    isPopular: true,
    isNew: false,
    isAwardWinner: false,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k5",
    title: "Super Kids: Galaxy Guardians",
    titleHi: "सुपर किड्स: गैलेक्सी गार्डियंस",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 8.9,
    ageRating: "U",
    duration: "1h 45m",
    durationMinutes: 105,
    genres: ["Kids", "Sci-Fi", "Animated", "Family"],
    moods: ["Happy", "Energetic"],
    description: "Four talented school friends discover high-tech cosmic suits and band together to protect Earth from mischievous space invaders.",
    descriptionHi: "चार स्कूली दोस्त हाई-टेक अंतरिक्ष सूट खोजते हैं और शरारती एलियंस से पृथ्वी की रक्षा करने के लिए एक टीम बनाते हैं।",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Voice of Tom Holland", "Voice of Zendaya"],
    director: "Brad Bird",
    language: "English",
    country: "Animated",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k6",
    title: "Moana 2: Ocean Song Legend",
    titleHi: "मोआना 2: समुद्र के गीत की कथा",
    category: "movie",
    type: "Feature Film",
    year: 2025,
    rating: 9.1,
    ageRating: "U",
    duration: "1h 50m",
    durationMinutes: 110,
    genres: ["Kids", "Animated", "Music", "Family"],
    moods: ["Happy", "Relaxed"],
    description: "Moana receives an unexpected call from her wayfinding ancestors and sets sail to distant, uncharted waters with Maui.",
    descriptionHi: "मोआना को अपने पूर्वजों से एक गुप्त बुलावा मिलता है और वह माउई के साथ अनजान महासागरों की यात्रा पर निकलती है।",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    cast: ["Voice of Auliʻi Cravalho", "Voice of Dwayne Johnson"],
    director: "David G. Derrick Jr.",
    language: "English",
    country: "Animated",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k7",
    title: "Baalveer & The Magic Kingdom",
    titleHi: "बालवीर और जादुई साम्राज्य",
    category: "series",
    type: "TV Series",
    year: 2026,
    rating: 8.6,
    ageRating: "U",
    duration: "2 Seasons",
    durationMinutes: 22,
    genres: ["Kids", "Fantasy", "Action", "Family"],
    moods: ["Happy", "Energetic"],
    description: "Young Baalveer uses his magical wands and fairy blessings to defeat darkness and bring joy to children across Earth.",
    descriptionHi: "युवा बालवीर अपनी जादुई छड़ी और परियों के आशीर्वाद से अंधेरे को हराकर पृथ्वी के बच्चों में खुशियां फैलाता है।",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    cast: ["Dev Joshi", "Anushka Sen"],
    director: "Abhimanyu Singh",
    language: "Hindi",
    country: "Indian Cinema",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: false,
    isHiddenGem: false,
    isKids: true
  },
  {
    id: "k8",
    title: "Spider-Kid: Spider-Verse Academy",
    titleHi: "स्पाइडर-किड: स्पाइडर-वर्स अकादमी",
    category: "movie",
    type: "Feature Film",
    year: 2026,
    rating: 9.3,
    ageRating: "U",
    duration: "1h 48m",
    durationMinutes: 108,
    genres: ["Kids", "Animated", "Action", "Family"],
    moods: ["Happy", "Energetic"],
    description: "A young web-slinger attends an interdimensional academy where junior heroes team up to solve multiverse mischief.",
    descriptionHi: "एक युवा स्पाइडर-हीरो एक इंटर-डायमेंशनल अकादमी में जाता है जहाँ छोटे सुपरहीरो मिलकर मल्टीवर्स की समस्याओं को हल करते हैं।",
    poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    preview: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    cast: ["Voice of Shameik Moore", "Voice of Hailee Steinfeld"],
    director: "Joaquim Dos Santos",
    language: "English",
    country: "Animated",
    top10Rank: null,
    isTrending: true,
    isPopular: true,
    isNew: true,
    isAwardWinner: true,
    isHiddenGem: false,
    isKids: true
  }
];

// Coming Soon Database
const COMING_SOON_DATA = [
  {
    id: "cs1",
    title: "The Final Signal: Earthfall",
    releaseDate: "AUG 25, 2026",
    genres: ["Sci-Fi", "Action"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    description: "The long-awaited sequel to the galactic sci-fi phenomenon. Humanity's final broadcast reaches an unexpected ally."
  },
  {
    id: "cs2",
    title: "Neon Shadows: Tokyo Awakening",
    releaseDate: "SEP 10, 2026",
    genres: ["Cyberpunk", "Thriller"],
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    description: "Cyber-enhanced detectives face off against an autonomous AI cartel threatening Tokyo's power grid."
  },
  {
    id: "cs3",
    title: "Empire of Sand & Gold",
    releaseDate: "SEP 28, 2026",
    genres: ["Historical", "Drama", "Indian Cinema"],
    poster: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop",
    description: "A colossal historical epic bringing ancient royal dynasties and grand desert sieges to life."
  }
];

// Default Profiles
const DEFAULT_PROFILES = [
  { id: "p1", name: "Shyna", avatar: "https://png.pngtree.com/png-vector/20250725/ourlarge/pngtree-cute-little-girl-avatar-icon-png-material-png-image_16837393.webp", isKids: false },
  { id: "p2", name: "Kids Zone", avatar: "https://png.pngtree.com/png-vector/20250815/ourlarge/pngtree-cute-cartoon-girl-avatar-png-image_17185033.webp", isKids: true },
  { id: "p3", name: "Guest User", avatar:"https://avatarfiles.alphacoders.com/378/378615.jpg", isKids: false }
];

// ==========================================
// LOCAL STORAGE STATE & CORE SERVICES
// ==========================================
const AppState = {
  // Auth
  getCurrentUser() {
    return localStorage.getItem("flixora_currentUser") || null;
  },
  setCurrentUser(email) {
    if (email) {
      localStorage.setItem("flixora_currentUser", email);
    } else {
      localStorage.removeItem("flixora_currentUser");
    }
  },
  logout() {
    localStorage.removeItem("flixora_currentUser");
    showToast("Signed out successfully", "info");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 500);
  },
  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = "/login.html";
      return false;
    }
    return true;
  },

  // Profiles
  getProfiles() {
    const stored = localStorage.getItem("flixora_profiles");
    return stored ? JSON.parse(stored) : DEFAULT_PROFILES;
  },
  saveProfiles(profiles) {
    localStorage.setItem("flixora_profiles", JSON.stringify(profiles));
  },
  getActiveProfile() {
    const activeId = localStorage.getItem("flixora_activeProfileId");
    const profiles = this.getProfiles();
    return profiles.find(p => p.id === activeId) || profiles[0];
  },
  setActiveProfile(profileId) {
    localStorage.setItem("flixora_activeProfileId", profileId);
    showToast(`Switched profile`, "success");
    window.location.reload();
  },

  // My List
  getMyList() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_mylist_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : ["m1", "s1", "m11"];
  },
  isInMyList(movieId) {
    const list = this.getMyList();
    return list.includes(movieId);
  },
  toggleMyList(movieId) {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_mylist_${activeProfile.id}`;
    let list = this.getMyList();
    let added = false;

    if (list.includes(movieId)) {
      list = list.filter(id => id !== movieId);
      added = false;
      showToast("Removed from My List", "info");
    } else {
      list.push(movieId);
      added = true;
      showToast("Added to My List", "success");
      this.checkAchievements();
    }
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("mylist-updated", { detail: { movieId, added } }));
    return added;
  },

  // Reactions Engine (Love, Amazing, Funny, Emotional, Shocking, Like)
  getReactions() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_reactions_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { "m1": "fire", "m2": "love", "m11": "fire" };
  },
  setReaction(movieId, reactionType) {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_reactions_${activeProfile.id}`;
    const reactions = this.getReactions();
    
    if (reactions[movieId] === reactionType) {
      delete reactions[movieId];
      showToast("Reaction removed", "info");
    } else {
      reactions[movieId] = reactionType;
      const names = { love: "❤️ Loved", fire: "🔥 Amazing", funny: "😂 Funny", emotional: "😢 Emotional", shocking: "😱 Shocking", like: "👍 Liked" };
      showToast(`Reacted ${names[reactionType] || reactionType}`, "success");
    }
    localStorage.setItem(key, JSON.stringify(reactions));
    this.checkAchievements();
    window.dispatchEvent(new CustomEvent("reactions-updated"));
    return reactions[movieId];
  },

  // Coming Soon Reminders
  getReminders() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_reminders_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : ["cs1"];
  },
  toggleReminder(comingSoonId) {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_reminders_${activeProfile.id}`;
    let reminders = this.getReminders();
    let added = false;
    if (reminders.includes(comingSoonId)) {
      reminders = reminders.filter(id => id !== comingSoonId);
      showToast("Reminder removed", "info");
    } else {
      reminders.push(comingSoonId);
      added = true;
      showToast("🔔 Reminder added! We'll notify you on release day.", "success");
    }
    localStorage.setItem(key, JSON.stringify(reminders));
    return added;
  },

  // Watch Progress & Stats
  getWatchProgress(movieId) {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_progress_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : {};
    return data[movieId] || null;
  },
  saveWatchProgress(movieId, currentTime, duration) {
    if (!duration || duration <= 0) return;
    const activeProfile = this.getActiveProfile();
    const key = `flixora_progress_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : {};
    
    data[movieId] = {
      currentTime,
      duration,
      percent: Math.min(100, Math.round((currentTime / duration) * 100)),
      updatedAt: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(data));

    // Update global watch stats
    this.updateStats(movieId, currentTime);
  },
  getAllWatchProgress() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_progress_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  },

  updateStats(movieId, seconds) {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_stats_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    const stats = stored ? JSON.parse(stored) : { totalMinutes: 1260, moviesWatched: 24, genres: { "Sci-Fi": 12, "Action": 10, "Drama": 8, "Indian Cinema": 6 }, languages: ["English", "Hindi", "Kannada", "Japanese"] };
    
    stats.totalMinutes += Math.round(seconds / 60);
    localStorage.setItem(key, JSON.stringify(stats));
    this.checkAchievements();
  },
  getStats() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_stats_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { totalMinutes: 1260, moviesWatched: 24, genres: { "Sci-Fi": 12, "Action": 10, "Drama": 8, "Indian Cinema": 6, "Romance": 4 }, languages: ["English", "Hindi", "Kannada", "Japanese", "Telugu"] };
  },

  // Achievements Engine
  getAchievements() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_achievements_${activeProfile.id}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : ["night_owl", "movie_buff"];
  },
  checkAchievements() {
    const activeProfile = this.getActiveProfile();
    const key = `flixora_achievements_${activeProfile.id}`;
    let unlocked = this.getAchievements();

    const stats = this.getStats();
    const hour = new Date().getHours();

    const awards = [
      { id: "night_owl", title: "🏆 Night Owl", desc: "Watched movies past midnight", check: () => hour >= 0 && hour <= 4 },
      { id: "movie_buff", title: "🎬 Movie Buff", desc: "Watched 20+ movies", check: () => stats.moviesWatched >= 20 },
      { id: "binge_master", title: "🔥 Binge Master", desc: "Finished 3 episodes in one session", check: () => true },
      { id: "explorer", title: "🌎 Explorer", desc: "Watched content in 4+ languages", check: () => stats.languages.length >= 4 },
      { id: "romantic", title: "❤️ Romantic", desc: "Reacted Love to romance cinema", check: () => true }
    ];

    awards.forEach(a => {
      if (!unlocked.includes(a.id) && a.check()) {
        unlocked.push(a.id);
        showToast(`UNLOCKED ACHIEVEMENT: ${a.title}!`, "success");
      }
    });

    localStorage.setItem(key, JSON.stringify(unlocked));
  },

  // Theme Accent Switcher
  getTheme() {
    return localStorage.getItem("flixora_theme") || "crimson";
  },
  setTheme(themeName) {
    localStorage.setItem("flixora_theme", themeName);
    document.body.classList.remove("theme-purple", "theme-blue", "theme-emerald", "theme-sunset");
    if (themeName !== "crimson") {
      document.body.classList.add(`theme-${themeName}`);
    }
    showToast(`Accent theme updated to ${themeName.toUpperCase()}`, "success");
  },
  applySavedTheme() {
    const t = this.getTheme();
    if (t && t !== "crimson") {
      document.body.classList.add(`theme-${t}`);
    }
  },

  // Subscription
  getSubscription() {
    const user = this.getCurrentUser();
    const key = `flixora_sub_${user || "default"}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { plan: "PREMIUM", name: "Premium 4K + HDR", active: true, devices: 4 };
  },
  setSubscription(planName) {
    const user = this.getCurrentUser();
    const key = `flixora_sub_${user || "default"}`;
    const plans = {
      BASIC: { plan: "BASIC", name: "Basic HD", price: "₹149/mo", active: true, devices: 1 },
      STANDARD: { plan: "STANDARD", name: "Standard Full HD", price: "₹299/mo", active: true, devices: 2 },
      PREMIUM: { plan: "PREMIUM", name: "Premium 4K + HDR", price: "₹499/mo", active: true, devices: 4 }
    };
    const sub = plans[planName] || plans.PREMIUM;
    localStorage.setItem(key, JSON.stringify(sub));
    showToast(`Subscription updated to ${sub.name}!`, "success");
    return sub;
  },

  // Settings
  getSettings() {
    const stored = localStorage.getItem("flixora_settings");
    return stored ? JSON.parse(stored) : {
      autoplayPreviews: true,
      autoplayNextEpisode: true,
      quality: "Auto (4K)",
      language: "English",
      subtitles: "On (English)",
      notifications: true
    };
  },
  saveSettings(settings) {
    localStorage.setItem("flixora_settings", JSON.stringify(settings));
    showToast("Settings saved successfully", "success");
  }
};

// Apply theme on initial load
document.addEventListener("DOMContentLoaded", () => {
  AppState.applySavedTheme();
});

// ==========================================
// RECOMMENDATION SCORE & MATCH LOGIC ENGINE
// ==========================================
function calculateMatchScore(movie) {
  let score = 50; // Base baseline
  const reasons = [];

  const reactions = AppState.getReactions();
  const myList = AppState.getMyList();

  // Genre match
  if (movie.genres.some(g => ["Sci-Fi", "Action", "Thriller", "Indian Cinema"].includes(g))) {
    score += 25;
    reasons.push(`❤️ Matches your preferred ${movie.genres[0]} genre`);
  }

  // Rating boost
  if (movie.rating >= 8.8) {
    score += 15;
    reasons.push(`⭐ Top Rated (${movie.rating}/10)`);
  } else if (movie.rating >= 8.0) {
    score += 10;
  }

  // Reactions match
  if (reactions[movie.id]) {
    score += 10;
    reasons.push(`🔥 You previously reacted ${reactions[movie.id].toUpperCase()}`);
  }

  // In My List boost
  if (myList.includes(movie.id)) {
    score += 10;
    reasons.push(`📌 In your saved collection`);
  }

  // Cap score max 99%
  score = Math.min(99, score);

  return {
    score,
    reasons: reasons.length ? reasons : ["🎬 Recommended based on popular trends", "⏱ Fits your 2-hour watch timeframe"]
  };
}

// Live Dynamic Viewer Counter Generator
function getLiveViewerCount(movieId) {
  const hash = movieId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseCount = (hash * 317) % 15000 + 3200;
  const variance = Math.floor(Math.sin(Date.now() / 3000 + hash) * 120);
  const count = baseCount + variance;
  return `${(count / 1000).toFixed(1)}K watching now`;
}

// ==========================================
// ELEGANT TOAST NOTIFICATION SYSTEM
// ==========================================
function createToastContainer() {
  let container = document.getElementById("flixora-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "flixora-toast-container";
    container.className = "fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "info") {
  const container = createToastContainer();
  const toast = document.createElement("div");
  
  let bgClass = "bg-zinc-900/90 border-zinc-700 text-white";
  let iconHtml = `<span>ℹ️</span>`;
  
  if (type === "success") {
    bgClass = "bg-red-950/90 border-red-600/60 text-white shadow-xl shadow-red-900/20";
    iconHtml = `<svg class="w-5 h-5 text-red-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
  } else if (type === "warning") {
    bgClass = "bg-amber-950/90 border-amber-600/60 text-amber-100";
    iconHtml = `<span>⚠️</span>`;
  }

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 opacity-0 transform translate-y-4 text-sm font-medium ${bgClass}`;
  toast.innerHTML = `${iconHtml} <span>${message}</span>`;
  
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-4");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// ==========================================
// CINEMATIC HTML5 PLAYER WITH SCRUBBING PREVIEW
// ==========================================
let currentVideoState = {
  movieId: null,
  videoEl: null,
  episodesSessionCount: 0
};

function openVideoPlayer(movieOrId, episode = null) {
  const movie = typeof movieOrId === "string" ? MOVIES_DATA.find(m => m.id === movieOrId) : movieOrId;
  if (!movie) {
    showToast("Movie content unavailable", "warning");
    return;
  }

  currentVideoState.episodesSessionCount++;
  if (currentVideoState.episodesSessionCount > 3) {
    // Trigger "Are you still watching?" prompt
    showStillWatchingPrompt(() => continuePlayback(movie, episode));
    return;
  }

  continuePlayback(movie, episode);
}

function showStillWatchingPrompt(onConfirm) {
  let modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center animate-fade-in";
  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md space-y-4 shadow-2xl">
      <div class="text-4xl">💤</div>
      <h2 class="text-2xl font-bold text-white">Are You Still Watching?</h2>
      <p class="text-sm text-zinc-400">You've been watching for 4 episodes in a row 👀</p>
      <div class="flex gap-4 pt-4">
        <button id="still-watch-yes" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer">Yes, Keep Watching</button>
        <button id="still-watch-no" class="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition cursor-pointer">Exit Player</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("still-watch-yes").onclick = () => {
    currentVideoState.episodesSessionCount = 0;
    modal.remove();
    onConfirm();
  };
  document.getElementById("still-watch-no").onclick = () => {
    modal.remove();
  };
}

function continuePlayback(movie, episode) {
  const videoUrl = episode ? episode.video : movie.video;
  const youtubeUrl = !episode && movie.youtubeId
    ? `https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&rel=0&playsinline=1`
    : null;
  const titleText = episode ? `${movie.title} - S${episode.seasonNumber}:E${episode.episodeNumber} (${episode.title})` : movie.title;

  const progress = AppState.getWatchProgress(movie.id);
  const startTime = progress ? progress.currentTime : 0;

  let playerOverlay = document.getElementById("flixora-video-modal");
  if (!playerOverlay) {
    playerOverlay = document.createElement("div");
    playerOverlay.id = "flixora-video-modal";
    playerOverlay.className = "fixed inset-0 z-[10000] bg-black flex flex-col justify-between select-none overflow-hidden animate-fade-in";
    document.body.appendChild(playerOverlay);
  }

  playerOverlay.innerHTML = `
    <!-- Top Bar -->
    <div class="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-300" id="player-topbar">
      <div class="flex items-center gap-4">
        <button id="player-close-btn" class="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer" aria-label="Close Player">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <div>
          <h2 class="text-lg md:text-xl font-bold text-white tracking-wide">${titleText}</h2>
          <p class="text-xs text-zinc-400">${movie.genres.join(" • ")} | ${movie.year}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="openWatchPartyModal('${movie.id}')" class="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/60 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
          🍿 Watch Party
        </button>
        <span class="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold">4K ULTRA HD</span>
      </div>
    </div>

    <!-- Main Video Frame -->
    <div class="relative w-full h-full flex items-center justify-center bg-black">
      <div class="relative w-full h-full flex items-center justify-center bg-black">
      ${youtubeUrl ? `
      <iframe
        id="flixora-youtube-element"
        class="w-full h-full"
        src="${youtubeUrl}"
        frameborder="0"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen>
      </iframe>
      ` : `
      <video id="flixora-video-element" class="w-full h-full object-contain cursor-pointer" playsinline>
        <source src="${videoUrl}" type="video/mp4" />
      </video>
      `}

      <!-- Video Loading Spinner -->
      <div id="player-spinner" class="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none transition-opacity">
        <div class="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-sm font-medium text-zinc-300 tracking-wider">Loading Stream...</p>
      </div>

      <!-- Smart Next Episode Auto Overlay -->
      <div id="next-episode-overlay" class="hidden absolute bottom-24 right-12 z-30 p-6 rounded-2xl bg-zinc-900/90 border border-red-600/50 backdrop-blur-xl max-w-xs space-y-3 shadow-2xl animate-slide-up">
        <p class="text-xs font-bold text-red-500 uppercase tracking-wider">Episode Finished</p>
        <h4 class="text-sm font-bold text-white">Playing Next Episode in <span id="next-ep-countdown" class="text-red-500 font-extrabold text-base">5</span>s</h4>
        <div class="flex gap-2">
          <button id="next-ep-now-btn" class="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition cursor-pointer">Play Now</button>
          <button id="next-ep-cancel-btn" class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-lg transition cursor-pointer">Cancel</button>
        </div>
      </div>

      <!-- Error Overlay -->
      <div id="player-error" class="hidden absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center z-30">
        <svg class="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <h3 class="text-xl font-bold text-white mb-2">Sorry, this video couldn't be loaded.</h3>
        <p class="text-sm text-zinc-400 max-w-md mb-6">The demo video stream might be temporarily unavailable.</p>
        <div class="flex gap-4">
          <button id="player-retry-btn" class="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer">Try Again</button>
          <button id="player-error-close-btn" class="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition cursor-pointer">Close</button>
        </div>
      </div>
    </div>

    <!-- Bottom Control Bar -->
    <div class="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300" id="player-bottombar">
      <!-- Progress Bar Container with Timeline Hover Preview -->
      <div class="relative w-full mb-4 group cursor-pointer" id="progress-container">
        <!-- Floating Thumbnail Hover Bubble -->
        <div id="scrub-preview" class="hidden absolute bottom-6 -translate-x-1/2 p-2 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-2xl z-30 text-center pointer-events-none transition-all">
          <img src="${movie.backdrop}" alt="Preview" class="w-32 h-20 object-cover rounded-lg mb-1" />
          <span id="scrub-time" class="text-[10px] font-mono text-zinc-300 font-bold">00:00:00</span>
        </div>

        <div class="w-full h-1.5 bg-zinc-700/60 rounded-full overflow-hidden group-hover:h-2.5 transition-all">
          <div id="player-progress-fill" class="h-full bg-red-600 relative rounded-full" style="width: 0%;"></div>
        </div>
        <input type="range" id="player-seek" min="0" max="100" value="0" step="0.1" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
      </div>

      <!-- Controls Row -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <button id="player-play-btn" class="text-white hover:text-red-500 transition cursor-pointer" aria-label="Play/Pause">
            <svg id="play-icon" class="w-8 h-8 hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg id="pause-icon" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          </button>

          <button id="player-rewind" class="text-zinc-300 hover:text-white transition cursor-pointer" title="Rewind 10s">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/></svg>
          </button>

          <button id="player-forward" class="text-zinc-300 hover:text-white transition cursor-pointer" title="Forward 10s">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.934 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z"/></svg>
          </button>

          <div class="flex items-center gap-2 group/vol">
            <button id="player-mute-btn" class="text-zinc-300 hover:text-white transition cursor-pointer">
              <svg id="vol-high" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"/></svg>
              <svg id="vol-mute" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
            </button>
            <input type="range" id="player-volume" min="0" max="1" step="0.05" value="1" class="w-20 accent-red-600 h-1 cursor-pointer" />
          </div>

          <span class="text-xs text-zinc-400 font-mono" id="player-time-display">00:00 / 00:00</span>
        </div>

        <div class="flex items-center gap-4">
          <select id="player-speed" class="bg-zinc-800/80 text-xs text-zinc-300 px-2 py-1 rounded border border-zinc-700/60 focus:outline-none cursor-pointer">
            <option value="0.5">0.5x</option>
            <option value="1" selected>1.0x Speed</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>

          <button id="player-subtitles" class="text-zinc-300 hover:text-white px-2 py-1 rounded border border-zinc-700 text-xs font-semibold cursor-pointer" title="Subtitles">
            CC
          </button>

          <button id="player-fullscreen" class="text-zinc-300 hover:text-white transition cursor-pointer" title="Toggle Fullscreen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.style.overflow = "hidden";
  if (!video) {
    // YouTube trailer mode — just wire up the close button and skip custom controls
    document.getElementById("player-close-btn").onclick = () => {
      document.body.style.overflow = "";
      playerOverlay.remove();
    };
    document.getElementById("player-topbar").querySelector("h2").textContent = titleText;
    return;
  }

  const video = document.getElementById("flixora-video-element");
  const spinner = document.getElementById("player-spinner");
  const errorBox = document.getElementById("player-error");
  const playBtn = document.getElementById("player-play-btn");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const seek = document.getElementById("player-seek");
  const progressFill = document.getElementById("player-progress-fill");
  const timeDisplay = document.getElementById("player-time-display");
  const volumeRange = document.getElementById("player-volume");
  const muteBtn = document.getElementById("player-mute-btn");
  const speedSelect = document.getElementById("player-speed");
  const subtitlesBtn = document.getElementById("player-subtitles");
  const fullscreenBtn = document.getElementById("player-fullscreen");
  const closeBtn = document.getElementById("player-close-btn");

  const progressContainer = document.getElementById("progress-container");
  const scrubPreview = document.getElementById("scrub-preview");
  const scrubTime = document.getElementById("scrub-time");

  const nextEpOverlay = document.getElementById("next-episode-overlay");
  const nextEpCountdown = document.getElementById("next-ep-countdown");
  let nextEpTimer = null;

  currentVideoState.movieId = movie.id;
  currentVideoState.videoEl = video;

  // Timeline Scrubbing Preview Hover
  progressContainer.onmousemove = (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const posPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (video.duration) {
      const timeVal = posPercent * video.duration;
      scrubPreview.style.left = `${e.clientX - rect.left}px`;
      scrubTime.textContent = formatTime(timeVal);
      scrubPreview.classList.remove("hidden");
    }
  };
  progressContainer.onmouseleave = () => {
    scrubPreview.classList.add("hidden");
  };

  // Video Events
  video.onloadedmetadata = () => {
    if (startTime > 0 && startTime < video.duration - 5) {
      video.currentTime = startTime;
      showToast(`Resumed from ${formatTime(startTime)}`, "info");
    }
    spinner.classList.add("opacity-0", "pointer-events-none");
    video.play().catch(() => {
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    });
  };

  video.onerror = () => {
    spinner.classList.add("opacity-0");
    errorBox.classList.remove("hidden");
  };

  video.ontimeupdate = () => {
    if (video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      seek.value = pct;
      progressFill.style.width = `${pct}%`;
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      
      AppState.saveWatchProgress(movie.id, video.currentTime, video.duration);

      // Trigger Smart Next Episode Overlay when near completion (last 10s)
      if (video.duration - video.currentTime <= 10 && movie.episodes && !nextEpTimer) {
        nextEpOverlay.classList.remove("hidden");
        let count = 5;
        nextEpCountdown.textContent = count;
        nextEpTimer = setInterval(() => {
          count--;
          if (count > 0) {
            nextEpCountdown.textContent = count;
          } else {
            clearInterval(nextEpTimer);
            nextEpOverlay.classList.add("hidden");
            // Play next episode
            openVideoPlayer(movie, movie.episodes[1] || movie.episodes[0]);
          }
        }, 1000);
      }
    }
  };

  document.getElementById("next-ep-cancel-btn").onclick = () => {
    if (nextEpTimer) clearInterval(nextEpTimer);
    nextEpOverlay.classList.add("hidden");
  };
  document.getElementById("next-ep-now-btn").onclick = () => {
    if (nextEpTimer) clearInterval(nextEpTimer);
    nextEpOverlay.classList.add("hidden");
    openVideoPlayer(movie, movie.episodes ? movie.episodes[1] : null);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (video.paused) {
      video.play();
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      video.pause();
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
    }
  };

  video.onclick = togglePlay;
  playBtn.onclick = togglePlay;

  seek.oninput = () => {
    if (video.duration) {
      video.currentTime = (seek.value / 100) * video.duration;
    }
  };

  document.getElementById("player-rewind").onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  };
  document.getElementById("player-forward").onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  volumeRange.oninput = () => {
    video.volume = volumeRange.value;
    video.muted = volumeRange.value === "0";
    updateVolumeIcons(video.muted);
  };

  muteBtn.onclick = () => {
    video.muted = !video.muted;
    updateVolumeIcons(video.muted);
  };

  function updateVolumeIcons(isMuted) {
    const high = document.getElementById("vol-high");
    const mute = document.getElementById("vol-mute");
    if (isMuted) {
      high.classList.add("hidden");
      mute.classList.remove("hidden");
    } else {
      high.classList.remove("hidden");
      mute.classList.add("hidden");
    }
  }

  speedSelect.onchange = () => {
    video.playbackRate = parseFloat(speedSelect.value);
  };

  let subtitlesOn = false;
  subtitlesBtn.onclick = () => {
    subtitlesOn = !subtitlesOn;
    if (subtitlesOn) {
      subtitlesBtn.classList.add("bg-red-600", "border-red-500", "text-white");
      showToast("English Subtitles Enabled", "info");
    } else {
      subtitlesBtn.classList.remove("bg-red-600", "border-red-500", "text-white");
      showToast("Subtitles Disabled", "info");
    }
  };

  fullscreenBtn.onclick = () => {
    if (!document.fullscreenElement) {
      playerOverlay.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const closePlayer = () => {
    if (nextEpTimer) clearInterval(nextEpTimer);
    if (video) {
      AppState.saveWatchProgress(movie.id, video.currentTime, video.duration);
      video.pause();
      video.src = "";
    }
    document.body.style.overflow = "";
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    playerOverlay.classList.add("opacity-0");
    setTimeout(() => {
      playerOverlay.remove();
    }, 300);
    showToast("Playback ended", "info");
  };

  closeBtn.onclick = closePlayer;
  document.getElementById("player-error-close-btn").onclick = closePlayer;
  document.getElementById("player-retry-btn").onclick = () => {
    errorBox.classList.add("hidden");
    spinner.classList.remove("opacity-0");
    video.load();
    video.play();
  };

  // Keyboard shortcut listener
  const handleKey = (e) => {
    if (e.key === "Escape") {
      closePlayer();
      document.removeEventListener("keydown", handleKey);
    } else if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "f" || e.key === "F") {
      fullscreenBtn.click();
    } else if (e.key === "m" || e.key === "M") {
      muteBtn.click();
    } else if (e.key === "ArrowLeft") {
      video.currentTime = Math.max(0, video.currentTime - 10);
    } else if (e.key === "ArrowRight") {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
    }
  };
  document.addEventListener("keydown", handleKey);
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}

// ==========================================
// ENHANCED MOVIE DETAILS MODAL & REACTIONS
// ==========================================
function openMovieDetails(movieId) {
  const movie = MOVIES_DATA.find(m => m.id === movieId);
  if (!movie) return;

  const isInList = AppState.isInMyList(movie.id);
  const matchInfo = calculateMatchScore(movie);
  const liveViewers = getLiveViewerCount(movie.id);
  const reactions = AppState.getReactions();
  const currentReaction = reactions[movie.id] || null;

  let modal = document.getElementById("flixora-details-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "flixora-details-modal";
    modal.className = "fixed inset-0 z-[9000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-fade-in";
    document.body.appendChild(modal);
  }

  const related = MOVIES_DATA.filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.includes(g))).slice(0, 3);

  modal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
      <button id="modal-close-btn" class="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer border border-white/10" aria-label="Close modal">
        ✕
      </button>

      <div class="overflow-y-auto custom-scrollbar">
        <!-- Hero Dynamic Backdrop Header -->
        <div class="relative w-full h-72 md:h-96 bg-zinc-950 flex items-end p-6 md:p-10" style="background: linear-gradient(to top, #18181b 10%, transparent 90%), url('${movie.backdrop}') center/cover no-repeat;">
          <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
          
          <div class="relative z-10 max-w-2xl space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded bg-red-600 text-white font-bold text-xs uppercase tracking-wider">${movie.category}</span>
              <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">${matchInfo.score}% Match</span>
              <span class="text-xs text-zinc-300 font-semibold">• ${movie.ageRating}</span>
              <span class="text-xs text-zinc-300 font-semibold">• ${movie.duration}</span>
              <span class="px-2 py-0.5 rounded bg-red-950/80 border border-red-600/50 text-red-400 text-[10px] font-bold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ${liveViewers}
              </span>
            </div>

            <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight">${I18N.getMovieTitle(movie)}</h1>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button id="modal-play-btn" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition transform hover:scale-105 cursor-pointer">
                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Play Stream
              </button>

              <button id="modal-list-btn" class="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-white font-semibold text-sm border border-zinc-700/80 transition cursor-pointer">
                <span id="modal-list-icon">${isInList ? "✓" : "＋"}</span>
                <span id="modal-list-text">${isInList ? "In My List" : "Add to My List"}</span>
              </button>

              <button id="modal-download-btn" class="px-4 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-sm transition cursor-pointer" title="Download for Offline">
                ⬇ Offline
              </button>

              <button onclick="openMobileHandoffModal('${movie.id}')" class="p-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold text-sm transition cursor-pointer" title="Continue on Mobile">
                📱 QR Handoff
              </button>
            </div>
          </div>
        </div>

        <!-- Details Content -->
        <div class="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Left Main Column -->
          <div class="md:col-span-2 space-y-6">
            
            <!-- Match Reason Breakdown Box -->
            <div class="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
              <h4 class="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                <span>🧠 Why We Picked This For You</span>
                <span class="text-emerald-400 font-extrabold ml-auto">${matchInfo.score}% Match</span>
              </h4>
              <ul class="text-xs text-zinc-300 space-y-1">
                ${matchInfo.reasons.map(r => `<li>• ${r}</li>`).join('')}
              </ul>
            </div>

            <!-- Reaction Picker Row -->
            <div>
              <label class="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Your Reaction</label>
              <div class="flex flex-wrap items-center gap-2" id="reaction-picker-container">
                <button class="reaction-btn ${currentReaction === 'love' ? 'active' : ''}" data-type="love">❤️ Love</button>
                <button class="reaction-btn ${currentReaction === 'fire' ? 'active' : ''}" data-type="fire">🔥 Amazing</button>
                <button class="reaction-btn ${currentReaction === 'funny' ? 'active' : ''}" data-type="funny">😂 Funny</button>
                <button class="reaction-btn ${currentReaction === 'emotional' ? 'active' : ''}" data-type="emotional">😢 Emotional</button>
                <button class="reaction-btn ${currentReaction === 'shocking' ? 'active' : ''}" data-type="shocking">😱 Shocking</button>
              </div>
            </div>

            <p class="text-zinc-300 text-base leading-relaxed">${I18N.getMovieDesc(movie)}</p>

            <!-- Episodes if Series -->
            ${movie.episodes ? `
              <div class="pt-4 border-t border-zinc-800">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-white">Episodes</h3>
                  <span class="text-xs text-zinc-400 font-semibold">Season 1 (${movie.episodes.length} Episodes)</span>
                </div>

                <div class="space-y-3">
                  ${movie.episodes.map(ep => `
                    <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-800/80 hover:bg-zinc-800 hover:border-zinc-700 transition cursor-pointer group" onclick="openVideoPlayer('${movie.id}', ${JSON.stringify(ep).replace(/"/g, '&quot;')})">
                      <div class="flex items-center gap-4">
                        <div class="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900">
                          <img src="${ep.thumbnail}" alt="${ep.title}" class="w-full h-full object-cover group-hover:scale-105 transition" />
                          <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs">▶</span>
                          </div>
                        </div>
                        <div>
                          <h4 class="text-sm font-bold text-white group-hover:text-red-400 transition">${ep.episodeNumber}. ${ep.title}</h4>
                          <p class="text-xs text-zinc-400 line-clamp-1">${ep.description}</p>
                        </div>
                      </div>
                      <span class="text-xs text-zinc-500 font-medium ml-2">${ep.duration}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Related Movies -->
            <div class="pt-6 border-t border-zinc-800">
              <h3 class="text-lg font-bold text-white mb-4">More Like This</h3>
              <div class="grid grid-cols-3 gap-4">
                ${related.map(r => `
                  <div class="group cursor-pointer rounded-xl overflow-hidden bg-zinc-800 border border-zinc-800 hover:border-red-600/50 transition" onclick="openMovieDetails('${r.id}')">
                    <div class="aspect-video relative overflow-hidden">
                      <img src="${r.backdrop}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div class="p-3">
                      <h4 class="text-xs font-bold text-white line-clamp-1">${r.title}</h4>
                      <p class="text-[10px] text-zinc-400 mt-1">★ ${r.rating} • ${r.year}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column Info -->
          <div class="space-y-4 text-xs text-zinc-400 border-l border-zinc-800/80 pl-0 md:pl-6">
            <div>
              <span class="block text-zinc-500 font-semibold mb-1">Cast:</span>
              <p class="text-zinc-200 font-medium">${movie.cast.join(", ")}</p>
            </div>
            <div>
              <span class="block text-zinc-500 font-semibold mb-1">Director:</span>
              <p class="text-zinc-200 font-medium">${movie.director}</p>
            </div>
            <div>
              <span class="block text-zinc-500 font-semibold mb-1">Genres:</span>
              <div class="flex flex-wrap gap-1.5 mt-1">
                ${movie.genres.map(g => `<span class="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-zinc-700/60">${g}</span>`).join('')}
              </div>
            </div>
            <div>
              <span class="block text-zinc-500 font-semibold mb-1">Language:</span>
              <p class="text-zinc-200 font-medium">${movie.language} (${movie.country})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.style.overflow = "hidden";

  document.getElementById("modal-close-btn").onclick = () => {
    document.body.style.overflow = "";
    modal.remove();
  };

  document.getElementById("modal-play-btn").onclick = () => {
    document.body.style.overflow = "";
    modal.remove();
    openVideoPlayer(movie);
  };

  const listBtn = document.getElementById("modal-list-btn");
  listBtn.onclick = () => {
    const added = AppState.toggleMyList(movie.id);
    document.getElementById("modal-list-icon").textContent = added ? "✓" : "＋";
    document.getElementById("modal-list-text").textContent = added ? "In My List" : "Add to My List";
  };

  // Download simulation
  document.getElementById("modal-download-btn").onclick = () => {
    const btn = document.getElementById("modal-download-btn");
    btn.disabled = true;
    btn.innerHTML = `Downloading 12%...`;
    let pct = 12;
    const interval = setInterval(() => {
      pct += 24;
      if (pct >= 100) {
        clearInterval(interval);
        btn.innerHTML = `✓ Downloaded`;
        btn.className = "px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-default";
        showToast("Offline download complete!", "success");
      } else {
        btn.innerHTML = `Downloading ${pct}%...`;
      }
    }, 400);
  };

  // Reactions setup
  const reactBtns = modal.querySelectorAll(".reaction-btn");
  reactBtns.forEach(b => {
    b.onclick = () => {
      const type = b.getAttribute("data-type");
      const activeType = AppState.setReaction(movie.id, type);
      reactBtns.forEach(btn => btn.classList.remove("active"));
      if (activeType === type) {
        b.classList.add("active");
      }
    };
  });

  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.style.overflow = "";
      modal.remove();
    }
  };
}

// Reaction styling helper CSS inject
const reactionStyle = document.createElement("style");
reactionStyle.textContent = `
  .reaction-btn {
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    background: rgba(39, 39, 42, 0.8);
    border: 1px solid rgba(255,255,255,0.1);
    color: #d4d4d8;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .reaction-btn:hover {
    background: rgba(63, 63, 70, 0.9);
    color: #fff;
  }
  .reaction-btn.active {
    background: #E50914;
    border-color: #E50914;
    color: #fff;
    box-shadow: 0 4px 12px rgba(229, 9, 20, 0.4);
  }
`;
document.head.appendChild(reactionStyle);

// ==========================================
// SURPRISE ME & SHUFFLE WATCH MODAL
// ==========================================
function openSurpriseMeModal() {
  let modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-fade-in";
  
  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full space-y-6 shadow-2xl relative">
      <button id="surprise-close" class="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
      <div id="surprise-loading" class="space-y-4">
        <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h3 class="text-xl font-bold text-white">Finding something for you...</h3>
        <p class="text-xs text-zinc-400">Analyzing your mood, previous likes & ratings...</p>
      </div>

      <div id="surprise-result" class="hidden space-y-4 animate-fade-in">
        <span class="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">🎲 SURPRISE PICK</span>
        <div id="surprise-card-content"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("surprise-close").onclick = () => modal.remove();

  setTimeout(() => {
    const randomMovie = MOVIES_DATA[Math.floor(Math.random() * MOVIES_DATA.length)];
    const loading = document.getElementById("surprise-loading");
    const result = document.getElementById("surprise-result");
    const content = document.getElementById("surprise-card-content");

    if (loading && result && content) {
      loading.classList.add("hidden");
      result.classList.remove("hidden");

      content.innerHTML = `
        <img src="${randomMovie.backdrop}" alt="${randomMovie.title}" class="w-full h-44 object-cover rounded-xl border border-zinc-800 mb-4" />
        <h2 class="text-2xl font-black text-white">${randomMovie.title}</h2>
        <p class="text-xs text-emerald-400 font-bold">★ ${randomMovie.rating} • ${randomMovie.year} • ${randomMovie.duration}</p>
        <p class="text-xs text-zinc-300 line-clamp-2 mt-2">${randomMovie.description}</p>
        <div class="pt-4 flex gap-3">
          <button id="surprise-play-now" class="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition cursor-pointer">▶ Watch Now</button>
          <button id="surprise-reroll" class="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl transition cursor-pointer">🔀 Shuffle Again</button>
        </div>
      `;

      document.getElementById("surprise-play-now").onclick = () => {
        modal.remove();
        openVideoPlayer(randomMovie);
      };
      document.getElementById("surprise-reroll").onclick = () => {
        modal.remove();
        openSurpriseMeModal();
      };
    }
  }, 1200);
}

// ==========================================
// WATCH PARTY (REMOVED)
// ==========================================
function openWatchPartyModal() {
  showToast("Watch party feature is not available.", "info");
}

// ==========================================
// MOBILE HANDOFF QR CODE MODAL
// ==========================================
function openMobileHandoffModal(movieId) {
  const movie = MOVIES_DATA.find(m => m.id === movieId) || MOVIES_DATA[0];

  let modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-fade-in";

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl relative">
      <button id="handoff-close" class="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
      <div class="text-3xl">📱</div>
      <h3 class="text-xl font-bold text-white">Continue on Mobile</h3>
      <p class="text-xs text-zinc-400">Scan this QR code with your smartphone camera to handoff playback instantly.</p>
      
      <!-- Simulated QR Code SVG -->
      <div class="w-48 h-48 bg-white p-3 rounded-xl mx-auto shadow-xl flex items-center justify-center">
        <svg class="w-full h-full text-black" viewBox="0 0 100 100">
          <path fill="currentColor" d="M10,10 h30 v30 h-30 z M15,15 h20 v20 h-20 z M20,20 h10 v10 h-10 z M60,10 h30 v30 h-30 z M65,15 h20 v20 h-20 z M70,20 h10 v10 h-10 z M10,60 h30 v30 h-30 z M15,65 h20 v20 h-20 z M20,70 h10 v10 h-10 z M50,50 h10 v10 h-10 z M70,50 h20 v10 h-20 z M50,70 h20 v20 h-20 z M80,80 h10 v10 h-10 z"/>
        </svg>
      </div>

      <div class="p-2.5 rounded-lg bg-zinc-800 text-[11px] font-mono text-zinc-300">
        Playing: <strong>${movie.title}</strong>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("handoff-close").onclick = () => modal.remove();
}

// ==========================================
// AI MOVIE ASSISTANT CHATBOT DRAWER
// ==========================================
function toggleAIAssistant() {
  let drawer = document.getElementById("netflix-ai-drawer");
  if (drawer) {
    drawer.remove();
    return;
  }

  drawer = document.createElement("div");
  drawer.id = "netflix-ai-drawer";
  drawer.className = "fixed bottom-20 right-6 z-[9500] w-80 md:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col h-[480px] overflow-hidden animate-slide-up";

  drawer.innerHTML = `
    <!-- Header -->
    <div class="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl">✨</span>
        <div>
          <h3 class="text-sm font-bold text-white">Netflix AI Assistant</h3>
          <span class="text-[10px] text-emerald-400 font-semibold">● Powered by Rule-Based Smart Engine</span>
        </div>
      </div>
      <button id="ai-close" class="text-zinc-400 hover:text-white">✕</button>
    </div>

    <!-- Chat Messages Container -->
    <div id="ai-chat-messages" class="flex-1 p-4 space-y-3 overflow-y-auto text-xs custom-scrollbar">
      <div class="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-zinc-200">
        👋 Hi! I'm your Netflix AI guide. Ask me things like:
        <ul class="mt-2 space-y-1 text-red-400 font-medium">
          <li class="cursor-pointer hover:underline" onclick="sendAIMessage('Show me funny movies')">• "Show me funny movies"</li>
          <li class="cursor-pointer hover:underline" onclick="sendAIMessage('Find Kannada movies')">• "Find Kannada movies"</li>
          <li class="cursor-pointer hover:underline" onclick="sendAIMessage('Movies under 2 hours')">• "Movies under 2 hours"</li>
        </ul>
      </div>
    </div>

    <!-- Input Form -->
    <form id="ai-chat-form" class="p-3 border-t border-zinc-800 bg-zinc-950 flex gap-2">
      <input type="text" id="ai-chat-input" placeholder="Ask AI Assistant..." class="flex-1 bg-zinc-800 text-xs text-white px-3 py-2.5 rounded-xl border border-zinc-700 focus:outline-none" />
      <button type="submit" class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer">Ask</button>
    </form>
  `;

  document.body.appendChild(drawer);
  document.getElementById("ai-close").onclick = () => drawer.remove();

  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");

  form.onsubmit = (e) => {
    e.preventDefault();
    sendAIMessage(input.value);
    input.value = "";
  };
}

function sendAIMessage(query) {
  if (!query || !query.trim()) return;
  const box = document.getElementById("ai-chat-messages");
  if (!box) return;

  box.innerHTML += `
    <div class="p-2.5 rounded-xl bg-red-600/20 text-red-200 border border-red-500/30 font-medium text-right ml-8">
      ${query}
    </div>
  `;

  const q = query.toLowerCase();
  let matches = [];

  if (q.includes("funny") || q.includes("comedy")) {
    matches = MOVIES_DATA.filter(m => m.genres.includes("Comedy"));
  } else if (q.includes("kannada")) {
    matches = MOVIES_DATA.filter(m => m.language === "Kannada");
  } else if (q.includes("hindi") || q.includes("bollywood")) {
    matches = MOVIES_DATA.filter(m => m.language === "Hindi");
  } else if (q.includes("telugu")) {
    matches = MOVIES_DATA.filter(m => m.language === "Telugu");
  } else if (q.includes("2 hours") || q.includes("short")) {
    matches = MOVIES_DATA.filter(m => m.durationMinutes && m.durationMinutes <= 120);
  } else if (q.includes("action")) {
    matches = MOVIES_DATA.filter(m => m.genres.includes("Action"));
  } else if (q.includes("scifi") || q.includes("sci-fi")) {
    matches = MOVIES_DATA.filter(m => m.genres.includes("Sci-Fi"));
  } else {
    matches = MOVIES_DATA.slice(0, 3);
  }

  setTimeout(() => {
    if (matches.length === 0) {
      box.innerHTML += `
        <div class="p-3 rounded-xl bg-zinc-800 text-zinc-300">
          I couldn't find exact matches, but here are some top picks for you:
        </div>
      `;
      matches = MOVIES_DATA.slice(0, 2);
    } else {
      box.innerHTML += `
        <div class="p-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold">
          ✨ Found ${matches.length} title(s) matching your request:
        </div>
      `;
    }

    matches.forEach(m => {
      box.innerHTML += `
        <div class="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3 cursor-pointer hover:border-red-600 transition" onclick="openMovieDetails('${m.id}')">
          <img src="${m.poster}" class="w-10 h-14 object-cover rounded" />
          <div>
            <h4 class="text-xs font-bold text-white">${m.title}</h4>
            <p class="text-[10px] text-emerald-400">★ ${m.rating} • ${m.duration}</p>
          </div>
        </div>
      `;
    });

    box.scrollTop = box.scrollHeight;
  }, 600);
}

// ==========================================
// KEYBOARD SHORTCUTS MODAL
// ==========================================
function openShortcutsModal() {
  let modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-fade-in";

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full space-y-4 shadow-2xl relative text-left">
      <button id="shortcuts-close" class="absolute top-4 right-4 text-zinc-400 hover:text-white">✕</button>
      <div class="flex items-center gap-2">
        <span class="text-2xl">⌨️</span>
        <h3 class="text-xl font-bold text-white">Keyboard Shortcuts</h3>
      </div>
      <p class="text-xs text-zinc-400">Master Netflix playback with these fast desktop controls:</p>

      <div class="grid grid-cols-2 gap-3 text-xs pt-2">
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Play / Pause</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">Space</kbd>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Toggle Mute</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">M</kbd>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Fullscreen</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">F</kbd>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Seek -10s / +10s</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">← / →</kbd>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Close Player/Modal</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">Esc</kbd>
        </div>
        <div class="p-2.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-between">
          <span class="text-zinc-300">Show Shortcuts</span>
          <kbd class="px-2 py-0.5 rounded bg-zinc-900 text-red-400 font-mono text-[11px] font-bold">?</kbd>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("shortcuts-close").onclick = () => modal.remove();
}

// Listen for "?" key
document.addEventListener("keydown", (e) => {
  if (e.key === "?" || (e.shiftKey && e.key === "/")) {
    openShortcutsModal();
  }
});

// Setup Parallax Scroll & Card Tilt for Index Landing Page
function setupLandingPageParallaxScroll() {
  const bgParallax = document.getElementById("index-bg-parallax");
  const contentParallax = document.getElementById("index-hero-content");
  const heroSection = document.getElementById("index-hero-section");

  if (heroSection && (bgParallax || contentParallax)) {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const heroHeight = heroSection.offsetHeight || 600;

          if (scrolled <= heroHeight + 100) {
            const bgOffset = scrolled * 0.36;
            const bgScale = 1.05 + (scrolled * 0.0002);
            const bgBlur = Math.min(10, scrolled / 35);
            const bgOpacity = Math.max(0.1, 1 - (scrolled / (heroHeight * 0.8)));

            const contentOffset = scrolled * 0.2;
            const contentOpacity = Math.max(0, 1 - (scrolled / (heroHeight * 0.6)));

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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Feature Cards 3D Interactive Tilt on Hover
  const featureCards = document.querySelectorAll(".landing-card");
  featureCards.forEach((card) => {
    let cardTicking = false;

    card.addEventListener("mousemove", (e) => {
      if (!cardTicking) {
        window.requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const cardX = rect.left + rect.width / 2;
          const cardY = rect.top + rect.height / 2;

          const deltaX = (e.clientX - cardX) / (rect.width / 2);
          const deltaY = (e.clientY - cardY) / (rect.height / 2);

          const rotX = deltaY * -8;
          const rotY = deltaX * 8;

          card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) scale(1.02)`;
          card.style.boxShadow = `0 20px 40px -10px rgba(229, 9, 20, 0.35), 0 0 25px rgba(229, 9, 20, 0.25)`;
          cardTicking = false;
        });
        cardTicking = true;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      card.style.boxShadow = ``;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupLandingPageParallaxScroll();
});

// Export all globally
window.MOVIES_DATA = MOVIES_DATA;
window.COMING_SOON_DATA = COMING_SOON_DATA;
window.AppState = AppState;
window.calculateMatchScore = calculateMatchScore;
window.getLiveViewerCount = getLiveViewerCount;
window.showToast = showToast;
window.openVideoPlayer = openVideoPlayer;
window.openMovieDetails = openMovieDetails;
window.openSurpriseMeModal = openSurpriseMeModal;
window.openWatchPartyModal = openWatchPartyModal;
window.openMobileHandoffModal = openMobileHandoffModal;
window.toggleAIAssistant = toggleAIAssistant;
window.sendAIMessage = sendAIMessage;
window.openShortcutsModal = openShortcutsModal;
