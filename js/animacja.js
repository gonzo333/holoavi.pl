const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;

export function initHologramAnimation() {
  const container = document.getElementById("hologram-container");
  const statusText = document.getElementById("status-text");
  const video = document.getElementById("hologram-video");
  const muteBtn = document.getElementById("muteToggle");

  if (!container || !video) return;

  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  if (muteBtn) {
    muteBtn.innerHTML = ICON_MUTED;
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? ICON_MUTED : ICON_UNMUTED;
      muteBtn.setAttribute(
        "aria-label",
        video.muted ? "Włącz dźwięk" : "Wycisz",
      );
    });
  }

  video.onloadeddata = () => {
    statusText.style.display = "none";
    video.play();
  };

  video.onerror = () => {
    statusText.innerText = "BŁĄD: Nie można załadować wideo.";
  };

  statusText.innerText = "Inicjalizacja hologramu...";

  return function cleanup() {
    video.pause();
    video.src = "";
    video.load();
  };
}
