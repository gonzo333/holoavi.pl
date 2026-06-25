import { initContactForm } from "./kontakt.js";
import { initHologramAnimation } from "./animacja.js?v=1";
import { initPricingPage } from "./pricing.js";

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  const allNavLinks = document.querySelectorAll("a[data-page]");

  let currentCleanup = null;

  function initSubpageScripts(pageUrl) {
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

  async function loadPage(pageUrl) {
    try {
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

        initSubpageScripts(pageUrl);

        contentDiv.classList.remove("page-fade");
      }, 200);
    } catch (err) {
      console.error(err);
      loadPage("error.html");
    }
  }

  async function openPageInPopup(pageUrl) {
    try {
      const response = await fetch(`pages/${pageUrl}`);
      if (!response.ok) throw new Error("Nie znaleziono zawartości popupu.");
      const html = await response.text();

      const overlay = document.createElement("div");
      overlay.className = "popup-overlay";

      overlay.innerHTML = `
        <div class="popup-card">
          <button class="popup-close-btn">&times;</button>
          <div class="popup-scroll-container">
            ${html}
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      initSubpageScripts(pageUrl);

      const closePopup = () => {
        overlay.classList.add("popup-closing");

        setTimeout(() => {
          overlay.remove();
          document.body.style.overflow = "";
        }, 250);
      };

      overlay
        .querySelector(".popup-close-btn")
        .addEventListener("click", closePopup);
    } catch (err) {
      console.error(err);
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
      if (page) loadPage(page);
    });
  });

  contentDiv.addEventListener("click", (e) => {
    const pageLink = e.target.closest("a[data-page]");
    const popupLink = e.target.closest("a[data-popup]");

    if (pageLink) {
      e.preventDefault();
      const page = pageLink.getAttribute("data-page");
      if (page) loadPage(page);
    } else if (popupLink) {
      e.preventDefault();
      const popupPage = popupLink.getAttribute("data-popup");
      if (popupPage) openPageInPopup(popupPage);
    }
  });

  loadPage("home.html");
});
