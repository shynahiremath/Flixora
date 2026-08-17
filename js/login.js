/**
 * NETFLIX - Authentication Page Controller (Login & Signup)
 */

document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const passwordInputs = document.querySelectorAll("input[type='password']");
  const togglePassBtns = document.querySelectorAll(".toggle-password-btn");

  togglePassBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const input = passwordInputs[index] || passwordInputs[0];
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          btn.textContent = "HIDE";
        } else {
          input.type = "password";
          btn.textContent = "SHOW";
        }
      }
    });
  });

  // Handle Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errorText = document.getElementById("login-error");
      const submitBtn = document.getElementById("login-submit-btn");
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Sign In";

      if (errorText) errorText.classList.add("hidden");

      function showError(msg) {
        if (errorText) {
          errorText.textContent = msg;
          errorText.classList.remove("hidden");
        } else if (typeof showToast === "function") {
          showToast(msg, "warning");
        }
      }

      // Frontend validation
      if (!email) {
        showError("Please enter your email address.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError("Please enter a valid email format.");
        return;
      }
      if (!password || password.length < 6) {
        showError("Password must contain at least 6 characters.");
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Signing In...
      `;

      try {
        // Send login request to backend
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password.");
        }

        // Save the real JWT + user using the shared Auth helper (js/auth.js)
        Auth.saveSession(data.token, data.user);

        if (typeof showToast === "function") {
          showToast(`Welcome back, ${data.user.fullName}!`, "success");
        }

        setTimeout(() => {
          window.location.href = "/browse/home.html";
        }, 600);

      } catch (error) {
        console.error("Login error:", error);
        showError(error.message || "Something went wrong. Please try again.");

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  // Handle Signup Form
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;
      const dateOfBirth = document.getElementById("signup-dob").value;
      const termsChecked = document.getElementById("signup-terms").checked;
      const submitBtn = document.getElementById("signup-submit-btn");

      // -----------------------------
      // Frontend validation
      // -----------------------------

      if (!fullName) {
        showToast("Please enter your full name", "warning");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address", "warning");
        return;
      }

      if (password.length < 6) {
        showToast("Password must be at least 6 characters long", "warning");
        return;
      }

      if (password !== confirmPassword) {
        showToast("Passwords do not match", "warning");
        return;
      }

      if (!dateOfBirth) {
        showToast("Please enter your date of birth", "warning");
        return;
      }

      if (!termsChecked) {
        showToast("You must accept the Terms of Service", "warning");
        return;
      }

      // -----------------------------
      // Loading state
      // -----------------------------

      submitBtn.disabled = true;

      submitBtn.innerHTML = `
        <div class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        Creating Account...
      `;

      try {
        // -----------------------------
        // Send signup request to backend
        // -----------------------------

        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            fullName,
            email,
            password,
            dateOfBirth
          })
        });

        const data = await response.json();

        // -----------------------------
        // Backend error
        // -----------------------------

        if (!response.ok) {
          throw new Error(data.message || "Unable to create account");
        }

        // -----------------------------
        // Signup successful — log them straight in using the token
        // the backend already returned, no need to re-enter credentials
        // -----------------------------

        Auth.saveSession(data.token, data.user);

        showToast("Account created successfully!", "success");

        setTimeout(() => {
          window.location.href = "/browse/home.html";
        }, 1000);

      } catch (error) {

        console.error("Signup error:", error);

        showToast(
          error.message || "Something went wrong. Please try again.",
          "warning"
        );

        // Restore button
        submitBtn.disabled = false;

        submitBtn.innerHTML = `
          Create Account
        `;
      }
    });
  }

  // Handle Forgot Password Modal
  const forgotBtn = document.getElementById("forgot-password-link");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openForgotPasswordModal();
    });
  }

  // Initialize Interactive 3D Parallax Tilt for Auth Card & Background
  setupAuthParallaxController();
});

function setupAuthParallaxController() {
  const card = document.getElementById("auth-interactive-card");
  const bgMesh = document.getElementById("auth-bg-mesh");

  if (!card) return;

  let ticking = false;

  const handleMouseMove = (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - cardCenterX) / (window.innerWidth / 2);
        const deltaY = (e.clientY - cardCenterY) / (window.innerHeight / 2);

        const rotateX = deltaY * -7; // Max tilt deg
        const rotateY = deltaX * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;

        if (bgMesh) {
          bgMesh.style.transform = `translate3d(${deltaX * -25}px, ${deltaY * -25}px, 0) scale(1.05)`;
        }

        ticking = false;
      });
      ticking = true;
    }
  };

  const handleMouseLeave = () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    if (bgMesh) {
      bgMesh.style.transform = `translate3d(0, 0, 0) scale(1)`;
    }
  };

  document.addEventListener("mousemove", handleMouseMove, { passive: true });
  document.addEventListener("mouseleave", handleMouseLeave);
}

function openForgotPasswordModal() {
  let modal = document.getElementById("flixora-forgot-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "flixora-forgot-modal";
    modal.className = "fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
      <button id="forgot-close-btn" class="absolute top-4 right-4 text-zinc-400 hover:text-white transition cursor-pointer text-xl">✕</button>
      
      <h3 class="text-2xl font-bold text-white mb-2">Forgot Password</h3>
      <p class="text-sm text-zinc-400 mb-6">Enter your registered email address and we'll send you simulated password reset instructions.</p>

      <form id="forgot-form" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Email Address</label>
          <input type="email" id="forgot-email" required placeholder="name@example.com" class="auth-input" />
        </div>

        <button type="submit" id="forgot-send-btn" class="auth-btn">Send Reset Link</button>
      </form>

      <div id="forgot-success-msg" class="hidden mt-4 p-4 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-200 text-sm">
        Password reset instructions have been sent to your email. (Simulated demo process)
      </div>
    </div>
  `;

  document.getElementById("forgot-close-btn").onclick = () => modal.remove();

  document.getElementById("forgot-form").onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("forgot-email").value.trim();
    if (!email) return;

    const btn = document.getElementById("forgot-send-btn");
    btn.disabled = true;
    btn.innerHTML = `<div class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Sending...`;

    setTimeout(() => {
      btn.classList.add("hidden");
      document.getElementById("forgot-success-msg").classList.remove("hidden");
      showToast("Reset link sent!", "success");
    }, 1200);
  };
}
