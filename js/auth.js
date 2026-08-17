/**
 * FLIXORA - Auth Helper
 * Handles JWT token storage, protected API calls, session checking, and logout.
 *
 * IMPORTANT: Load this BEFORE app.js and browse.js on any page that
 * requires login (home.html, mylist.html, profile.html, search.html),
 * and BEFORE login.js on login.html / signup.html.
 */

const API_BASE = `${window.API_BASE_URL}/api`;

const Auth = {
  getToken() {
    return localStorage.getItem("flixora_token");
  },
  setToken(token) {
    localStorage.setItem("flixora_token", token);
  },
  getUser() {
    const stored = localStorage.getItem("flixora_user");
    return stored ? JSON.parse(stored) : null;
  },
  setUser(user) {
    localStorage.setItem("flixora_user", JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem("flixora_token");
    localStorage.removeItem("flixora_user");
  },

  // Call this right after a successful login/signup response
  saveSession(token, user) {
    this.setToken(token);
    this.setUser(user);
  },

  // Use this for ANY request to a protected backend route.
  // It automatically attaches the "Authorization: Bearer <token>" header.
  async authFetch(path, options = {}) {
    const token = this.getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    return fetch(`${API_BASE}${path}`, { ...options, headers, cache: "no-store" });
  },

  // Asks the backend "is this token still valid?" via GET /api/auth/me
  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await this.authFetch("/auth/me");
      const data = await res.json();
      if (res.ok && data.success) {
        this.setUser(data.user); // keep local copy fresh
        return data.user;
      }
      return null;
    } catch (err) {
      console.error("Session check failed:", err);
      return null;
    }
  },

  // Call this at the top of any protected page.
  // Redirects to login.html if there's no valid session.
  async requireAuth() {
    const user = await this.verifySession();
    if (!user) {
      this.clear();
      window.location.href = "/login.html";
      return null;
    }
    updateAuthUI(user);
    return user;
  },

  logout() {
    this.clear();
    if (typeof showToast === "function") {
      showToast("Signed out successfully", "info");
    }
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 400);
  }
};

// Fills in any element with data-auth-name="" with the logged-in user's name.
// Optional — only runs if such elements exist on the page.
function updateAuthUI(user) {
  document.querySelectorAll("[data-auth-name]").forEach((el) => {
    el.textContent = user.fullName;
  });
}

// Auto-wire the existing "Sign Out" button (id="nav-logout-btn") if present
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("nav-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => Auth.logout());
  }
});

window.Auth = Auth;
