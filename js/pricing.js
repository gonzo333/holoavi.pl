import { createLogger } from "./logger.js";

const logger = createLogger("pricing");

export function initPricingPage() {
  const triggers = document.querySelectorAll("[data-pricing-trigger]");
  const targets = document.querySelectorAll("[data-pricing-target]");

  if (triggers.length === 0 || targets.length === 0) return;

  logger.log("Pricing page interactive components initialized.");

  function syncPricingCardElements() {
    // Synchronize heights only on desktop (cards side-by-side)
    if (window.innerWidth < 992) {
      document.querySelectorAll(".pricing-card-desc, .pricing-features-core").forEach((el) => {
        el.style.minHeight = "auto";
      });
      return;
    }

    document.querySelectorAll(".pricing-view").forEach((view) => {
      // 1. Sync Descriptions (.pricing-card-desc)
      const descs = view.querySelectorAll(".pricing-card-desc");
      let maxDescHeight = 0;

      descs.forEach((el) => {
        el.style.minHeight = "auto";
      });

      descs.forEach((el) => {
        if (el.offsetHeight > maxDescHeight) {
          maxDescHeight = el.offsetHeight;
        }
      });

      if (maxDescHeight > 0) {
        descs.forEach((el) => {
          el.style.minHeight = `${maxDescHeight}px`;
        });
      }

      // 2. Sync Core Features Lists (.pricing-features-core)
      // This ensures pricing-features-extra divider lines sit on exact same horizontal line across all cards
      const cores = view.querySelectorAll(".pricing-features-core");
      let maxCoreHeight = 0;

      cores.forEach((el) => {
        el.style.minHeight = "auto";
      });

      cores.forEach((el) => {
        if (el.offsetHeight > maxCoreHeight) {
          maxCoreHeight = el.offsetHeight;
        }
      });

      if (maxCoreHeight > 0) {
        cores.forEach((el) => {
          el.style.minHeight = `${maxCoreHeight}px`;
        });
      }
    });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const selectedTab = trigger.getAttribute("data-pricing-trigger");
      logger.log("Pricing plan tab switched to:", selectedTab);

      targets.forEach((target) => {
        const targetView = target.getAttribute("data-pricing-target");
        if (targetView === selectedTab) {
          target.classList.add("view-active");
        } else {
          target.classList.remove("view-active");
        }
      });

      triggers.forEach((btn) => {
        if (btn === trigger) {
          btn.classList.remove("btn-tertiary", "btn-secondary");
          btn.classList.add("btn-primary", "toggle-active");
        } else {
          btn.classList.remove("btn-primary", "toggle-active");
          btn.classList.add("btn-secondary");
        }
      });

      // Recalculate heights after switching view
      setTimeout(syncPricingCardElements, 50);
    });
  });

  // Initial height sync
  syncPricingCardElements();

  // Debounced window resize listener (runs only once after user finishes resizing)
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncPricingCardElements, 150);
  });
}
