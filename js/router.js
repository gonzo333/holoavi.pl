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

      if (pageUrl === "hologramy.html" || pageUrl === "awatary.html") {
        if (typeof GLightbox !== "undefined") {
          const lightbox = GLightbox({
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
      }
    } catch (err) {
      console.log(err);
      loadPage("error.html");
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
