import { initContactForm } from "./kontakt.js";
import { createLogger } from "./logger.js";

const logger = createLogger("router");

import { initHologramAnimation } from "./animacja.js?v=3";
import { initPricingPage } from "./pricing.js";
import { initCookieConsent } from "./cookie-consent.js";

const PAGE_TITLES = {
  "home.html": "HOLOAVI - Hologramy i awatary AI",
  "cennik.html": "Cennik | HOLOAVI",
  "o-nas.html": "O nas | HOLOAVI",
  "kontakt.html": "Kontakt | HOLOAVI",
  "hologramy.html": "Hologramy | HOLOAVI",
  "awatary.html": "Awatary AI | HOLOAVI",
  "regulamin.html": "Regulamin | HOLOAVI",
  "polityka.html": "Polityka Prywatności | HOLOAVI",
};

const HASH_TO_PAGE = {
  home: "home.html",
  cennik: "cennik.html",
  "o-nas": "o-nas.html",
  kontakt: "kontakt.html",
  hologramy: "hologramy.html",
  awatary: "awatary.html",
  regulamin: "regulamin.html",
  polityka: "polityka.html",
};

function pageToHash(pageUrl) {
  return pageUrl.replace(".html", "");
}

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  const allNavLinks = document.querySelectorAll("a[data-page]");
  const loader = document.getElementById("page-loader");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");
  const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  const initialTheme = savedTheme || (systemPrefersLight ? "light" : "dark");
  applyTheme(initialTheme);
  logger.log(
    "Read saved theme preference:",
    savedTheme ||
      (systemPrefersLight
        ? "light (system preference)"
        : "dark (system preference)"),
  );

  let currentCleanup = null;

  // --- Hamburger menu ---
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("nav-open");
    });

    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("nav-open");
      }
    });
  }

  function closeNav() {
    if (navToggle && navLinks) {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("nav-open");
    }
  }

  // --- Loading bar ---
  function showLoader() {
    if (loader) {
      loader.classList.remove("loaded");
      loader.classList.add("loading");
    }
  }

  function hideLoader() {
    if (loader) {
      loader.classList.remove("loading");
      loader.classList.add("loaded");
      setTimeout(() => loader.classList.remove("loaded"), 400);
    }
  }

  // --- Active nav link ---
  function setActiveNav(pageUrl) {
    allNavLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("data-page") === pageUrl,
      );
    });
  }

  function applyTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
    logger.log("Applied theme:", theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", (e) => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      logger.log(
        "Theme toggle clicked, switching from",
        currentTheme,
        "to",
        newTheme,
      );

      const rect = themeToggle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      document.documentElement.style.setProperty("--clip-x", `${x}px`);
      document.documentElement.style.setProperty("--clip-y", `${y}px`);

      if (!document.startViewTransition) {
        applyTheme(newTheme);
        return;
      }

      document.startViewTransition(() => {
        applyTheme(newTheme);
      });
    });
  }

  function initSubpageScripts(pageUrl) {
    logger.log("Initializing subpage scripts for:", pageUrl);
    switch (pageUrl) {
      case "home.html":
        currentCleanup = initHologramAnimation();
        break;
      case "kontakt.html":
        initContactForm();
        break;
      case "cennik.html":
        initPricingPage();
        break;
      case "hologramy.html":
      case "awatary.html":
        if (typeof GLightbox !== "undefined") {
          GLightbox({
            selector: ".glightbox",
            touchNavigation: true,
            keyboardNavigation: true,
            loop: true,
            autoplayVideos: true,
            zoomable: true,
            moreText: "Pokaż więcej",
            moreLength: "60",
          });
          initYouTubeThumbnails();
        }
        break;
    }
  }

  // historyMode: 'push' | 'replace' | 'none'
  async function loadPage(pageUrl, historyMode = "push") {
    logger.log("Loading page:", pageUrl, "| History mode:", historyMode);
    try {
      showLoader();
      contentDiv.classList.add("page-fade");

      const response = await fetch(`pages/${pageUrl}`);
      if (!response.ok) throw new Error("Nie znaleziono strony.");
      const html = await response.text();

      setTimeout(() => {
        if (currentCleanup) {
          currentCleanup();
          currentCleanup = null;
        }

        contentDiv.innerHTML = html;
        window.scrollTo({ top: 0 });

        document.title = PAGE_TITLES[pageUrl] || "HOLOAVI";
        setActiveNav(pageUrl);

        if (historyMode === "push") {
          history.pushState({ page: pageUrl }, "", "#" + pageToHash(pageUrl));
        } else if (historyMode === "replace") {
          history.replaceState(
            { page: pageUrl },
            "",
            "#" + pageToHash(pageUrl),
          );
        }

        initSubpageScripts(pageUrl);
        initScrollReveal();

        const currentLang = localStorage.getItem("naapp-lang") || "pl";
        if (typeof window.setLanguage === "function") {
          window.setLanguage(currentLang);
        }

        contentDiv.classList.remove("page-fade");
        hideLoader();
        logger.log("Successfully loaded page:", pageUrl);
      }, 200);
    } catch (err) {
      logger.error("Failed to load page:", pageUrl, err);
      loadPage("error.html", "none");
    }
  }

  async function openPageInPopup(pageUrl) {
    logger.log("Opening popup for page:", pageUrl);
    try {
      const response = await fetch(`pages/${pageUrl}`);
      if (!response.ok) throw new Error("Nie znaleziono zawartości popupu.");
      const html = await response.text();

      const overlay = document.createElement("div");
      overlay.className = "popup-overlay";

      overlay.innerHTML = `
        <div class="popup-card">
          <button class="popup-close-btn" aria-label="Zamknij">&times;</button>
          <div class="popup-scroll-container">
            ${html}
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      initSubpageScripts(pageUrl);

      const currentLang = localStorage.getItem("naapp-lang") || "pl";
      if (typeof window.setLanguage === "function") {
        window.setLanguage(currentLang);
      }

      const closePopup = () => {
        logger.log("Closing popup for page:", pageUrl);
        overlay.classList.add("popup-closing");
        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = "";
        }, 250);
      };

      overlay
        .querySelector(".popup-close-btn")
        .addEventListener("click", closePopup);

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closePopup();
      });
    } catch (err) {
      logger.error("Failed to open page in popup:", pageUrl, err);
    }
  }

  function initYouTubeThumbnails() {
    const mediaLinks = document.querySelectorAll(".media-grid a.glightbox");
    mediaLinks.forEach((link) => {
      const url = link.getAttribute("href");
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);

      if (match && match[2].length === 11) {
        const videoId = match[2];
        const previewDiv = link.querySelector(".media-preview");
        if (previewDiv) {
          previewDiv.innerHTML = "";
          const img = document.createElement("img");
          img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          img.alt =
            link.querySelector(".media-caption h4")?.textContent ||
            "Miniaturka wideo";
          img.className = "auto-thumb";
          previewDiv.appendChild(img);
        }
      }
    });
  }

  // --- Navigation clicks (global delegation for header, content, footer, cookie banner, and popups) ---
  document.addEventListener("click", (e) => {
    const pageLink = e.target.closest("a[data-page]");
    const popupLink = e.target.closest("a[data-popup]");

    if (pageLink) {
      e.preventDefault();
      const page = pageLink.getAttribute("data-page");
      if (page) {
        closeNav();
        loadPage(page);
      }
    } else if (popupLink) {
      e.preventDefault();
      const popupPage = popupLink.getAttribute("data-popup");
      if (popupPage) openPageInPopup(popupPage);
    }
  });

  // --- Browser back/forward ---
  window.addEventListener("popstate", () => {
    const hash = location.hash.slice(1);
    const pageUrl = HASH_TO_PAGE[hash] || "home.html";
    logger.log("Popstate triggered, navigating to:", pageUrl);
    loadPage(pageUrl, "none");
  });

  // --- Scroll reveal ---
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".card, .tech-style, .section-footer-cta, .media-card",
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            // Clear inline transitionDelay so hover animations trigger instantly with 0ms delay!
            setTimeout(() => {
              entry.target.style.transitionDelay = "";
            }, 600);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    targets.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.4)}s`;
      observer.observe(el);
    });
  }

  // --- Initial load ---
  const initialHash = location.hash.slice(1);
  const initialPage = HASH_TO_PAGE[initialHash] || "home.html";
  loadPage(initialPage, "replace");

  applyTheme(initialTheme);

  initCookieConsent(loadPage);
});
