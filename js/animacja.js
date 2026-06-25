export function initHologramAnimation() {
  const container = document.getElementById("hologram-container");
  const statusText = document.getElementById("status-text");
  const video = document.getElementById("hologram-video");

  if (!container || !video) return;

  if (video) {
    video.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      return false;
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
