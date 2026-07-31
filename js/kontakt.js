import { createLogger } from "./logger.js";

const logger = createLogger("contact");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwFNyZXpQEaqzWJtIEr5wjpwt1B_K4OhOny9xZU58ufVHtGv9l8aCkHh5MrIJ-RWNb0/exec";

function sanitizeFormData(formElement) {
  const formData = new FormData(formElement);
  const sanitized = {};

  for (let [key, value] of formData.entries()) {
    let cleanValue = value.trim();

    if (key === "email") {
      cleanValue = cleanValue.toLowerCase();
    }
    if (key === "nrtel") {
      cleanValue = cleanValue.replace(/(?!^\+)[^\d]/g, "");
    }

    sanitized[key] = cleanValue;
  }

  return sanitized;
}

function validateFormData(data) {
  const lang = localStorage.getItem("naapp-lang") || "pl";
  const dict = window.naappTranslations?.[lang] || window.naappTranslations?.pl || {};

  const validationRules = [
    {
      field: "imie",
      test: (value) => value.length > 0,
      message: dict.contact_err_name || "Poznajmy się! Jak możemy się do Ciebie zwracać?",
    },
    {
      field: "email",
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: dict.contact_err_email || "Wprowadź poprawny adres e-mail (np. jan@kowalski.pl).",
    },
    {
      field: "nrtel",
      test: (value) => !value || /^\+?[0-9]{9,15}$/.test(value),
      message:
        dict.contact_err_phone ||
        "Wprowadź poprawny numer telefonu (dokładnie 9 cyfr lub format międzynarodowy).",
    },
    {
      field: "wiadomosc",
      test: (value) => value.length > 0,
      message: dict.contact_err_msg || "Co chciałbyś nam przekazać?",
    },
  ];

  const errors = [];

  for (const rule of validationRules) {
    const valueToTest = data[rule.field];

    if (!rule.test(valueToTest)) {
      errors.push({
        field: rule.field,
        message: rule.message,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

async function sendToGoogleScripts(data) {
  return await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function showResponse(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => {
      toast.remove();
      if (container.childNodes.length === 0) {
        container.remove();
      }
    }, 300);
  }, 4000);
}

function setLoadingState(isLoading) {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;
  const lang = localStorage.getItem("naapp-lang") || "pl";
  const dict = window.naappTranslations?.[lang] || window.naappTranslations?.pl || {};
  submitBtn.disabled = isLoading;
  submitBtn.innerText = isLoading
    ? (dict.contact_msg_sending || "Wysyłanie...")
    : (dict.contact_btn_send || "Wyślij wiadomość");
}

export function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.nodeName === "INPUT") {
      e.preventDefault();
    }
  });

  const clearInputErrors = () => {
    form.querySelectorAll(".input-error").forEach((el) => {
      el.classList.remove("input-error");
    });
    form.querySelectorAll(".field-error-message").forEach((el) => {
      el.remove();
    });
  };

  form.addEventListener("input", clearInputErrors);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInputErrors();

    logger.log("Contact form submission initiated.");

    const formData = sanitizeFormData(e.target);
    const validation = validateFormData(formData);

    if (!validation.isValid) {
      logger.warn("Contact form validation failed:", validation.errors);
      const lang = localStorage.getItem("naapp-lang") || "pl";
      const dict = window.naappTranslations?.[lang] || window.naappTranslations?.pl || {};
      showResponse(dict.contact_err_form || "Formularz zawiera błędy. Popraw zaznaczone pola.", "error");

      form.classList.remove("shake-error");
      void form.offsetWidth;
      form.classList.add("shake-error");
      setTimeout(() => form.classList.remove("shake-error"), 400);

      validation.errors.forEach((err, index) => {
        const invalidInput = form.querySelector(`[name="${err.field}"]`);
        if (invalidInput) {
          invalidInput.classList.add("input-error");

          const errorSpan = document.createElement("span");
          errorSpan.className = "field-error-message";
          errorSpan.innerText = err.message;

          invalidInput.parentNode.appendChild(errorSpan);

          if (index === 0) {
            invalidInput.focus();
          }
        }
      });

      return;
    }

    logger.log("Contact form validation passed. Sending request to server...");
    setLoadingState(true);

    try {
      await sendToGoogleScripts(formData);
      logger.log("Contact form submitted successfully.");
      const lang = localStorage.getItem("naapp-lang") || "pl";
      const dict = window.naappTranslations?.[lang] || window.naappTranslations?.pl || {};
      showResponse(dict.contact_msg_success || "Dziękujemy! Twoja wiadomość została wysłana.", "success");
      form.reset();
    } catch (err) {
      logger.error("Failed to submit contact form:", err);
      const lang = localStorage.getItem("naapp-lang") || "pl";
      const dict = window.naappTranslations?.[lang] || window.naappTranslations?.pl || {};
      showResponse(dict.contact_msg_error || "Wystąpił błąd podczas wysyłania wiadomości.", "error");
    } finally {
      setLoadingState(false);
    }
  });
}
