import { createLogger } from "./logger.js";

const CONSENT_KEY = "holoavi_cookie_consent";
const logger = createLogger("cookie-consent");

export function initCookieConsent(navigateFn) {
  const savedConsent = localStorage.getItem(CONSENT_KEY);
  logger.log("Read stored cookie consent preference:", savedConsent);

  if (savedConsent) {
    logger.log("Cookie consent decision already exists in storage, skipping banner.");
    return;
  }

  const banner = document.getElementById("cookieBanner");
  if (!banner) {
    logger.warn("Cookie banner container '#cookieBanner' not found in DOM.");
    return;
  }

  logger.log("Cookie banner displayed to user.");
  setTimeout(() => banner.classList.add("visible"), 600);

  function dismiss(value) {
    localStorage.setItem(CONSENT_KEY, value);
    logger.log("Cookie consent decision made and saved:", value);
    banner.classList.remove("visible");
    setTimeout(() => (banner.style.display = "none"), 400);
  }

  document
    .getElementById("cookieAccept")
    ?.addEventListener("click", () => dismiss("accepted"));
  document
    .getElementById("cookieDecline")
    ?.addEventListener("click", () => dismiss("declined"));

  banner
    .querySelector(".cookie-policy-link")
    ?.addEventListener("click", (e) => {
      e.preventDefault();
      logger.log("Cookie policy link clicked, navigating to privacy policy page.");
      navigateFn("polityka.html");
    });
}
