const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;

const LOADING_STAGES = [
  "Zbieranie informacji o awatarze...",
  "Układanie wiedzy awatara...",
  "Nadanie charakteru awatarowi...",
  "Sprawdzanie poprawności danych...",
];

function loadingStageText(progress) {
  const index = Math.min(
    LOADING_STAGES.length - 1,
    Math.floor(progress * LOADING_STAGES.length),
  );
  return LOADING_STAGES[index];
}

export function initHologramAnimation() {
  const PATH_TALKING_VIDEO = "/assets/animation-start.webm";
  const PATH_IDLE_VIDEO = "/assets/animation-loop.webm";
  const PATH_DEFAULT_QUESTION_VIDEO = "/assets/animation-question.mp4";
  const ANALYSIS_DURATION_MS = 2000;

  const container = document.getElementById("hologram-container");
  const statusText = document.getElementById("status-text");
  const laserLine = document.getElementById("laser-line");
  const muteBtn = document.getElementById("muteToggle");
  const refreshBtn = document.getElementById("refreshBtn");
  const questionTrigger = document.getElementById("questionTrigger");
  const questionsSelector = document.getElementById("questions-selector");

  const staticImg = document.getElementById("avatar-static-img");
  const talkingVideo = document.getElementById("avatar-talking-video");
  const idleVideo = document.getElementById("avatar-idle-video");
  const idleVideoB = document.getElementById("avatar-idle-video-b");
  const questionVideo = document.getElementById("avatar-question-video");
  const questionsGroup = document.querySelector(".hologram-questions-group");
  const talkingSource = document.getElementById("talking-source");
  const idleSource = document.getElementById("idle-source");
  const idleSourceB = document.getElementById("idle-source-b");
  const questionSource = document.getElementById("question-source");

  if (
    !container ||
    !talkingVideo ||
    !idleVideo ||
    !idleVideoB ||
    !questionVideo ||
    !staticImg ||
    !talkingSource ||
    !idleSource ||
    !idleSourceB ||
    !questionSource
  )
    return;

  const preventContext = (e) => e.preventDefault();
  [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((video) =>
    video.addEventListener("contextmenu", preventContext),
  );

  talkingVideo.muted = true;
  idleVideo.muted = true;
  idleVideoB.muted = true;
  questionVideo.muted = true;

  if (muteBtn) {
    muteBtn.innerHTML = ICON_MUTED;
    muteBtn.addEventListener("click", () => {
      const newState = !talkingVideo.muted;
      talkingVideo.muted = newState;
      idleVideo.muted = newState;
      idleVideoB.muted = newState;
      questionVideo.muted = newState;
      muteBtn.innerHTML = newState ? ICON_MUTED : ICON_UNMUTED;
    });
  }

  if (refreshBtn) {
    refreshBtn.innerHTML = ICON_REFRESH;
    refreshBtn.addEventListener("click", replayAnimation);
  }

  if (questionsSelector) {
    questionsSelector.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;

      questionsSelector
        .querySelectorAll(".hologram-btn")
        .forEach((b) => b.classList.remove("is-active"));

      btn.classList.add("is-active");

      statusText.innerText = "Przetwarzam pytanie...";

      const videoPath = btn.getAttribute("data-video");
      if (videoPath) {
        requestQuestion(videoPath);
      }
    });
  }

  let pendingQuestionPath = null;
  let pendingTimeouts = [];
  let isDestroyed = false;
  const videoBlobCache = new Map();

  function clearPendingTimeouts() {
    pendingTimeouts.forEach((id) => clearTimeout(id));
    pendingTimeouts = [];
  }

  // Fetches every video up front and only swaps <source src> to a fully
  // downloaded blob: URL, so a slow connection can never let the browser
  // start playing off a half-downloaded stream (which is what caused the
  // "start" video to stutter — canplaythrough is just a heuristic guess,
  // not a guarantee the rest of the file is there).
  async function preloadAllAssets(onProgress) {
    if (questionsSelector) {
      questionsSelector.querySelectorAll("[data-video]").forEach((btn) => {
        const path = btn.getAttribute("data-video");
        if (path) videoBlobCache.set(path, null);
      });
    }
    videoBlobCache.set(PATH_TALKING_VIDEO, null);
    videoBlobCache.set(PATH_IDLE_VIDEO, null);
    videoBlobCache.set(PATH_DEFAULT_QUESTION_VIDEO, null);

    const paths = [...videoBlobCache.keys()];
    const progressByPath = new Map(paths.map((p) => [p, 0]));
    const reportProgress = () => {
      let sum = 0;
      progressByPath.forEach((v) => (sum += v));
      onProgress(sum / paths.length);
    };

    await Promise.all(
      paths.map(async (path) => {
        const blob = await fetchWithProgress(path, (p) => {
          progressByPath.set(path, p);
          reportProgress();
        });
        videoBlobCache.set(path, URL.createObjectURL(blob));
      }),
    );

    talkingSource.src = videoBlobCache.get(PATH_TALKING_VIDEO);
    idleSource.src = videoBlobCache.get(PATH_IDLE_VIDEO);
    idleSourceB.src = videoBlobCache.get(PATH_IDLE_VIDEO);
    questionSource.src = videoBlobCache.get(PATH_DEFAULT_QUESTION_VIDEO);

    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => v.load());
  }

  function setAvatarReady(ready) {
    if (questionTrigger) questionTrigger.classList.toggle("is-ready", ready);
    if (questionsSelector) {
      const buttons = questionsSelector.querySelectorAll("button");
      buttons.forEach((btn) => (btn.disabled = !ready));
    }
  }

  // Native `loop` restarts the *same* decoded stream at time 0, and on this
  // codec that causes a visible black frame while the decoder re-keys. We
  // avoid it by ping-ponging between two idle video elements and
  // cross-fading between them just like every other transition here.
  function armIdleLoopTransition(video) {
    video.ontimeupdate = () => {
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft > 0 && timeLeft < 0.3) {
        video.ontimeupdate = null;

        if (pendingQuestionPath) {
          const pathToPlay = pendingQuestionPath;
          pendingQuestionPath = null;
          playQuestionVideo(pathToPlay);
        } else {
          crossfadeIdleLoop(video);
        }
      }
    };
  }

  function crossfadeIdleLoop(current) {
    const next = current === idleVideo ? idleVideoB : idleVideo;

    next.currentTime = 0;
    next.classList.add("active");

    next.onplaying = () => {
      next.onplaying = null;
      current.classList.remove("active");
      current.pause();
      armIdleLoopTransition(next);
    };

    next.play().catch((err) => {
      console.log("Błąd odtwarzania:", err);
      next.onplaying = null;
      // Fall back to native looping on the current element rather than freezing.
      current.loop = true;
    });
  }

  function playIdleLoop() {
    idleVideo.loop = false;
    idleVideo.currentTime = 0;
    idleVideo.ontimeupdate = null;
    idleVideo.onseeked = null;
    idleVideo.onended = null;
    idleVideoB.ontimeupdate = null;
    idleVideoB.onplaying = null;

    revealVideo(idleVideo, [talkingVideo, questionVideo, idleVideoB]).then(() => {
      statusText.innerText = "Oczekiwanie na Twój głos.";

      if (questionsGroup) {
        questionsGroup.classList.remove("is-locked");
      }

      setAvatarReady(true);

      if (pendingQuestionPath) {
        const pathToPlay = pendingQuestionPath;
        pendingQuestionPath = null;
        playQuestionVideo(pathToPlay);
        return;
      }

      armIdleLoopTransition(idleVideo);
    });
  }

  function playQuestionVideo(videoPath) {
    setAvatarReady(false);
    if (questionTrigger) questionTrigger.classList.remove("is-open");

    statusText.innerText = "Odpowiadam na pytanie...";

    questionVideo.onended = () => {
      playIdleLoop();
    };

    const startPlayback = () => {
      questionVideo.currentTime = 0;
      revealVideo(questionVideo, [talkingVideo, idleVideo, idleVideoB]).then(() => {
        if (questionsSelector) {
          questionsSelector
            .querySelectorAll(".hologram-btn")
            .forEach((b) => b.classList.remove("is-active"));
        }
      });
    };

    // Reloading an already-buffered source throws away its decoded frames,
    // which is what made every question (even the preloaded default one)
    // flash black: play() was called before any frame existed to show.
    const cachedSrc = videoBlobCache.get(videoPath);
    const resolvedSrc = cachedSrc || new URL(videoPath, window.location.href).href;
    if (questionSource.src === resolvedSrc && questionVideo.readyState >= 3) {
      startPlayback();
      return;
    }

    questionVideo.oncanplay = () => {
      questionVideo.oncanplay = null;
      startPlayback();
    };

    questionSource.src = resolvedSrc;
    questionVideo.load();
  }

  function requestQuestion(videoPath) {
    if (questionVideo.classList.contains("active") || pendingQuestionPath)
      return;
    pendingQuestionPath = videoPath;
  }

  if (questionTrigger) {
    questionTrigger.addEventListener("click", () => {
      if (!questionTrigger.classList.contains("is-ready")) return;
      questionTrigger.classList.add("is-open");
      requestQuestion(PATH_DEFAULT_QUESTION_VIDEO);
    });
  }

  if (questionsSelector) {
    questionsSelector.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;

      const videoPath = btn.getAttribute("data-video");
      if (videoPath) {
        requestQuestion(videoPath);
      }
    });
  }

  function armTalkingVideoTransition() {
    talkingVideo.ontimeupdate = () => {
      const timeLeft = talkingVideo.duration - talkingVideo.currentTime;

      if (timeLeft > 0 && timeLeft < 0.3) {
        talkingVideo.ontimeupdate = null;

        if (pendingQuestionPath) {
          const pathToPlay = pendingQuestionPath;
          pendingQuestionPath = null;
          playQuestionVideo(pathToPlay);
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

  async function startSequence() {
    statusText.innerText = "Budowanie awatara z obrazka...";

    if (laserLine) {
      laserLine.style.display = "block";
      laserLine.style.animation = "laserScanAnimation 4s infinite ease-in-out";
    }

    // Keep this stage visible for at least a beat even on a fast connection,
    // so the UI doesn't flash past it when preloading finishes instantly.
    const minStageDelay = new Promise((resolve) => {
      const t = setTimeout(resolve, 1500);
      pendingTimeouts.push(t);
    });

    try {
      await Promise.all([
        preloadAllAssets((p) => {
          if (isDestroyed) return;
          statusText.innerText = `${loadingStageText(p)} ${Math.round(p * 100)}%`;
        }),
        minStageDelay,
      ]);
    } catch (err) {
      console.log("Błąd pobierania zasobów, ładowanie awaryjne:", err);

      talkingSource.src = PATH_TALKING_VIDEO;
      idleSource.src = PATH_IDLE_VIDEO;
      idleSourceB.src = PATH_IDLE_VIDEO;
      questionSource.src = PATH_DEFAULT_QUESTION_VIDEO;
      talkingVideo.load();
      idleVideo.load();
      idleVideoB.load();
      questionVideo.load();

      await new Promise((resolve) => {
        talkingVideo.oncanplaythrough = () => {
          talkingVideo.oncanplaythrough = null;
          resolve();
        };
      });
    }

    if (isDestroyed) return;

    statusText.innerText = "Inicjalizacja strumienia...";

    const t2 = setTimeout(activateAvatar, 600);
    pendingTimeouts.push(t2);
  }

  function replayAnimation() {
    if (questionsSelector) {
      questionsSelector
        .querySelectorAll(".hologram-btn")
        .forEach((b) => b.classList.remove("is-active"));
    }

    if (questionsGroup) {
      questionsGroup.classList.add("is-locked");
    }

    clearPendingTimeouts();
    pendingQuestionPath = null;
    setAvatarReady(false);
    if (questionTrigger) questionTrigger.classList.remove("is-open");

    talkingVideo.oncanplaythrough = null;
    talkingVideo.ontimeupdate = null;
    idleVideo.ontimeupdate = null;
    idleVideo.onseeked = null;
    idleVideo.onended = null;
    idleVideoB.ontimeupdate = null;
    idleVideoB.onplaying = null;
    questionVideo.onended = null;
    questionVideo.oncanplay = null;

    talkingVideo.pause();
    idleVideo.pause();
    idleVideoB.pause();
    questionVideo.pause();
    talkingVideo.currentTime = 0;
    idleVideo.currentTime = 0;
    idleVideoB.currentTime = 0;
    questionVideo.currentTime = 0;

    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((video) => {
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
      !idleVideoB.classList.contains("active") &&
      !questionVideo.classList.contains("active")
    ) {
      if (pendingQuestionPath) {
        const pathToPlay = pendingQuestionPath;
        pendingQuestionPath = null;
        playQuestionVideo(pathToPlay);
      } else {
        playIdleLoop();
      }
    }
  };

  return function cleanup() {
    isDestroyed = true;
    clearPendingTimeouts();
    talkingVideo.removeEventListener("contextmenu", preventContext);
    idleVideo.removeEventListener("contextmenu", preventContext);
    idleVideoB.removeEventListener("contextmenu", preventContext);
    questionVideo.removeEventListener("contextmenu", preventContext);
    talkingVideo.ontimeupdate = null;
    idleVideo.ontimeupdate = null;
    idleVideoB.ontimeupdate = null;
    idleVideoB.onplaying = null;
    questionVideo.onended = null;
    questionVideo.oncanplay = null;
    talkingVideo.pause();
    idleVideo.pause();
    idleVideoB.pause();
    questionVideo.pause();
    videoBlobCache.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    videoBlobCache.clear();
  };
}

async function fetchWithProgress(url, onProgress) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać ${url}: ${response.status}`);
  }

  const contentLength = response.headers.get("content-length");
  const total = contentLength ? Number.parseInt(contentLength, 10) : 0;

  if (!response.body || !total) {
    const blob = await response.blob();
    onProgress(1);
    return blob;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(received / total);
  }

  return new Blob(chunks);
}

function revealVideo(video, hideElements) {
  return new Promise((resolve) => {
    video.onplaying = () => {
      video.onplaying = null;

      hideElements.forEach((el) => {
        el.classList.remove("active", "scanning");
        if (typeof el.pause === "function") el.pause();
      });

      resolve();
    };

    video.classList.add("active");

    video.play().catch((err) => {
      console.log("Błąd odtwarzania:", err);
      hideElements.forEach((el) => {
        el.classList.remove("active", "scanning");
        if (typeof el.pause === "function") el.pause();
      });
      resolve();
    });
  });
}
