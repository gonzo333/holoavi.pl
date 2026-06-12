export function initContactForm() {
  const form = document.getElementById("contactForm");
  const responseDiv = document.getElementById("formResponse");
  const submitBtn = document.getElementById("submitBtn");

  const googleScriptUrl = "FUTURE_LINK_TO_GOOGLE_SCRIPTS";

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Wysyłanie...";

    const formData = {
      imie: document.getElementById("imie").value,
      email: document.getElementById("email").value,
      wiadomosc: document.getElementById("wiadomosc").value,
    };

    try {
      await fetch(googleScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      responseDiv.style.display = "block";
      responseDiv.style.backgroundColor = "var(--accent-primary)";
      responseDiv.style.color = "white";
      responseDiv.style.margin = "1rem auto";
      responseDiv.innerHTML = "Dziękujemy! Wiadomość została zapisana.";
      form.reset();
    } catch (err) {
      console.log(err);
      responseDiv.style.display = "block";
      responseDiv.style.backgroundColor = "var(--error-primary)";
      responseDiv.style.color = "white";
      responseDiv.innerHTML = "Wystąpił błąd. Spróbuj ponownie.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Wyślij wiadomość";
    }
  });
}
