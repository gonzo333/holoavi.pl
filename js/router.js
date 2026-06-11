import { initContactForm } from "./kontakt.js";
import { initHologramAnimation } from "./animacja.js?v=1";

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  const allNavLinks = document.querySelectorAll("a[data-page]");

  let currentCleanup = null;

  async function loadPage(pageUrl) {
    try {
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }

      const response = await fetch(`pages/${pageUrl}`);
      if (!response.ok) throw new Error("Nie znaleziono strony.");

      const html = await response.text();
      contentDiv.innerHTML = html;

      window.scrollTo({ top: 0, behavior: "smooth" });

      if (pageUrl === "kontakt.html") {
        initContactForm();
      }

      if (pageUrl === "home.html") {
        currentCleanup = initHologramAnimation();
      }
    } catch (err) {
      console.log(err);
      loadPage("error.html");
    }
  }

  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    });
  });

  contentDiv.addEventListener("click", (e) => {
    const targetLink = e.target.closest("a[data-page]");

    if (targetLink) {
      e.preventDefault();
      const page = targetLink.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    }
  });

  // Pierwsze wykonanie dla strony głównej
  loadPage("home.html");
});
