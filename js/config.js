/**
 * FLIXORA - Global API Configuration
 * Automatically uses the correct base URL whether running locally or deployed.
 */
const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "";

window.API_BASE_URL = API_BASE_URL;