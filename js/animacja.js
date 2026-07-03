const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
const ICON_ARROW_UP = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>`;

export function initHologramAnimation() {
  const PATH_TALKING_VIDEO = "/assets/animation-start.webm";
  const PATH_IDLE_VIDEO = "/assets/animation-loop.webm";
  const PATH_QUESTION_VIDEO = "/assets/animation-question.mp4";
  const ANALYSIS_DURATION_MS = 2000;

  const container = document.getElementById("hologram-container");
  const statusText = document.getElementById("status-text");
  const laserLine = document.getElementById("laser-line");
  const muteBtn = document.getElementById("muteToggle");
  const refreshBtn = document.getElementById("refreshBtn");
  const questionTrigger = document.getElementById("questionTrigger");
  const questionArrowBtn = document.getElementById("questionArrowBtn");

  const staticImg = document.getElementById("avatar-static-img");
  const talkingVideo = document.getElementById("avatar-talking-video");
  const idleVideo = document.getElementById("avatar-idle-video");
  const questionVideo = document.getElementById("avatar-question-video");
  const talkingSource = document.getElementById("talking-source");
  const idleSource = document.getElementById("idle-source");
  const questionSource = document.getElementById("question-source");

  if (
    !container ||
    !talkingVideo ||
    !idleVideo ||
    !questionVideo ||
    !staticImg ||
    !talkingSource ||
    !idleSource ||
    !questionSource
  )
    return;

  const preventContext = (e) => e.preventDefault();
  [talkingVideo, idleVideo, questionVideo].forEach((video) =>
    video.addEventListener("contextmenu", preventContext),
  );

  talkingVideo.muted = true;
  idleVideo.muted = true;
  questionVideo.muted = true;

  if (muteBtn) {
    muteBtn.innerHTML = ICON_MUTED;
    muteBtn.addEventListener("click", () => {
      const newState = !talkingVideo.muted;
      talkingVideo.muted = newState;
      idleVideo.muted = newState;
      questionVideo.muted = newState;
      muteBtn.innerHTML = newState ? ICON_MUTED : ICON_UNMUTED;
    });
  }

  if (refreshBtn) {
    refreshBtn.innerHTML = ICON_REFRESH;
    refreshBtn.addEventListener("click", replayAnimation);
  }

  if (questionArrowBtn) {
    questionArrowBtn.innerHTML = ICON_ARROW_UP;
  }

  let pendingQuestion = false;
  let pendingTimeouts = [];

  function clearPendingTimeouts() {
    pendingTimeouts.forEach((id) => clearTimeout(id));
    pendingTimeouts = [];
  }

  function setAvatarReady(ready) {
    if (questionTrigger) questionTrigger.classList.toggle("is-ready", ready);
  }

  function playIdleLoop() {
    idleVideo.currentTime = 0;
    idleVideo.loop = false;

    revealVideo(idleVideo, [talkingVideo, questionVideo]).then(() => {
      statusText.innerText = "Oczekiwanie na Twój głos.";
      setAvatarReady(true);

      idleVideo.ontimeupdate = () => {
        if (
          idleVideo.duration &&
          idleVideo.duration - idleVideo.currentTime < 0.2
        ) {
          if (pendingQuestion) {
            pendingQuestion = false;
            idleVideo.ontimeupdate = null;
            playQuestionVideo();
          } else {
            idleVideo.currentTime = 0;
          }
        }
      };
    });
  }

  function playQuestionVideo() {
    setAvatarReady(false);
    if (questionTrigger) questionTrigger.classList.remove("is-open");
    statusText.innerText = "Odpowiadam na pytanie...";

    questionVideo.currentTime = 0;
    questionVideo.onended = () => {
      playIdleLoop();
    };

    revealVideo(questionVideo, [talkingVideo, idleVideo]);
  }

  function requestQuestion() {
    if (questionVideo.classList.contains("active") || pendingQuestion) return;
    pendingQuestion = true;
  }

  if (questionTrigger) {
    questionTrigger.addEventListener("click", () => {
      if (!questionTrigger.classList.contains("is-ready")) return;
      questionTrigger.classList.add("is-open");
      requestQuestion();
    });
  }

  function armTalkingVideoTransition() {
    talkingVideo.ontimeupdate = () => {
      const timeLeft = talkingVideo.duration - talkingVideo.currentTime;

      if (timeLeft > 0 && timeLeft < 0.3) {
        talkingVideo.ontimeupdate = null;

        if (pendingQuestion) {
          pendingQuestion = false;
          playQuestionVideo();
        } else {
          playIdleLoop();
        }
      }
    };
  }

  function activateAvatar() {
    if (laserLine) laserLine.style.display = "none";

    statusText.innerText = "Awatar aktywny (Online)";
    talkingVideo.currentTime = 0;
    armTalkingVideoTransition();

    revealVideo(talkingVideo, [staticImg]).then(() => {
      setAvatarReady(true);
    });
  }

  statusText.innerText = "Ładowanie awatara...";

  function startSequence() {
    statusText.innerText = "Budowanie awatara z obrazka...";

    if (laserLine) {
      laserLine.style.display = "block";
      laserLine.style.animation = "laserScanAnimation 4s infinite ease-in-out";
    }

    talkingSource.src = PATH_TALKING_VIDEO;
    idleSource.src = PATH_IDLE_VIDEO;
    questionSource.src = PATH_QUESTION_VIDEO;

    talkingVideo.load();
    idleVideo.load();
    questionVideo.load();

    talkingVideo.oncanplaythrough = () => {
      talkingVideo.oncanplaythrough = null;

      const t1 = setTimeout(() => {
        statusText.innerText = "Inicjalizacja strumienia...";

        const t2 = setTimeout(activateAvatar, 600);
        pendingTimeouts.push(t2);
      }, 2500);
      pendingTimeouts.push(t1);
    };
  }

  function replayAnimation() {
    clearPendingTimeouts();
    pendingQuestion = false;
    setAvatarReady(false);
    if (questionTrigger) questionTrigger.classList.remove("is-open");

    talkingVideo.oncanplaythrough = null;
    talkingVideo.ontimeupdate = null;
    idleVideo.ontimeupdate = null;
    questionVideo.onended = null;

    talkingVideo.pause();
    idleVideo.pause();
    questionVideo.pause();
    talkingVideo.currentTime = 0;
    idleVideo.currentTime = 0;
    questionVideo.currentTime = 0;

    [talkingVideo, idleVideo, questionVideo].forEach((video) => {
      video.classList.remove("active");
      video.style.zIndex = "";
    });
    staticImg.style.zIndex = "";
    staticImg.classList.add("active", "scanning");

    if (laserLine) {
      laserLine.style.display = "none";
      laserLine.getBoundingClientRect();
      laserLine.style.display = "block";
      laserLine.style.animation = "laserScanAnimation 4s infinite ease-in-out";
    }

    statusText.innerText = "Budowanie awatara z obrazka...";

    const t = setTimeout(activateAvatar, ANALYSIS_DURATION_MS);
    pendingTimeouts.push(t);
  }

  if (staticImg.complete && staticImg.naturalHeight !== 0) {
    startSequence();
  } else {
    staticImg.onload = startSequence;
    staticImg.onerror = startSequence;
  }

  talkingVideo.onended = () => {
    if (
      !idleVideo.classList.contains("active") &&
      !questionVideo.classList.contains("active")
    ) {
      if (pendingQuestion) {
        pendingQuestion = false;
        playQuestionVideo();
      } else {
        playIdleLoop();
      }
    }
  };

  return function cleanup() {
    clearPendingTimeouts();
    talkingVideo.removeEventListener("contextmenu", preventContext);
    idleVideo.removeEventListener("contextmenu", preventContext);
    questionVideo.removeEventListener("contextmenu", preventContext);
    talkingVideo.ontimeupdate = null;
    idleVideo.ontimeupdate = null;
    questionVideo.onended = null;
    talkingVideo.pause();
    idleVideo.pause();
    questionVideo.pause();
  };
}

function revealVideo(video, hideElements) {
  const reveal = () => {
    hideElements.forEach((el) => {
      el.classList.remove("active", "scanning");
      if (typeof el.pause === "function") el.pause();
    });
    video.classList.add("active");
  };

  return video.play().then(reveal, (err) => {
    console.log(err);
    reveal();
  });
}
