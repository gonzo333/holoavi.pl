import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;

const assetsAvatarPath = "/assets/avatars";
const assetsHologramPath = "/assets/holograms";

// Mode configuration
const MODES = {
  avatar: {
    isThreeJS: false, // Traditional video or three.js setup (only hologram is supported atm)
    talking: assetsAvatarPath + "/magda-start.webm",
    idle: assetsAvatarPath + "/magda-loop.webm",
    question: assetsAvatarPath + "/magda-question.mp4",
    staticImg: assetsAvatarPath + "/magda-photo.png",
    statusReady: "Awatar aktywny (Online)",
    statusIdle: "Oczekiwanie na Twój głos.",
    statusAnalyzing: "Budowanie awatara z obrazka...",
    stages: [
      "Zbieranie informacji o awatarze...",
      "Układanie wiedzy awatara...",
      "Nadanie charakteru awatarowi...",
      "Sprawdzanie poprawności danych...",
    ],
    questions: [
      {
        text: "Czy mogę otrzymać umowę elektronicznie?",
        video: assetsAvatarPath + "/questions/magda-electronic-document.mp4",
      },
    ],
  },
  hologram: {
    isThreeJS: true, // Traditional video or three.js setup (only hologram is supported atm)
    modelPath: assetsHologramPath + "/hologram-avatar.glb",
    staticImg: assetsHologramPath + "/animation-photo.png",
    statusReady: "Hologram 3D aktywny",
    statusIdle: "Zadaj pytanie modelowi 3D.",
    statusAnalyzing: "Inicjalizacja silnika holograficznego...",
    stages: [
      "Uruchamianie silnika renderowania...",
      "Inicjalizacja kamery i światła...",
      "Wczytywanie trójwymiarowej geometrii...",
      "Dostrajanie kości i animacji...",
    ],
    questions: [
      {
        text: "Jakie urządzenia holograficzne oferujecie?",
        audio: assetsHologramPath + "/questions/hologram-devices.mp3",
        animation: "present",
      },
      {
        text: "Czy hologram działa w jasnym pomieszczeniu?",
        audio: assetsHologramPath + "/questions/hologram-light.mp3",
        animation: "explain",
      },
    ],
  },
};

export function initHologramAnimation() {
  const avatarBtn = document.querySelector('[data-mode="avatar"]');
  const hologramBtn = document.querySelector('[data-mode="hologram"]');

  let currentCleanup = null;
  let activeMode = "avatar";
  let isMuted = false; // Global mute state

  function switchMode(mode) {
    const wrapper = document.querySelector(".hologram-wrapper");

    if (wrapper) {
      wrapper.classList.add("hologram-transition-active");

      if (mode === "avatar") {
        wrapper.classList.add("theme-avatar");
        wrapper.classList.remove("theme-hologram");
      } else {
        wrapper.classList.add("theme-hologram");
        wrapper.classList.remove("theme-avatar");
      }

      setTimeout(() => {
        wrapper.classList.remove("hologram-transition-active");
      }, 500);
    }

    if (currentCleanup) {
      currentCleanup();
    }

    activeMode = mode;

    if (avatarBtn && hologramBtn) {
      if (mode === "avatar") {
        avatarBtn.classList.add("btn-primary");
        avatarBtn.classList.remove("btn-secondary");
        hologramBtn.classList.add("btn-secondary");
        hologramBtn.classList.remove("btn-primary");
      } else {
        hologramBtn.classList.add("btn-primary");
        hologramBtn.classList.remove("btn-secondary");
        avatarBtn.classList.add("btn-secondary");
        avatarBtn.classList.remove("btn-primary");
      }
    }

    currentCleanup = startHologramAnimationForMode(mode);
  }

  function startHologramAnimationForMode(mode) {
    const config = MODES[mode] || MODES.avatar;

    const container = document.getElementById("hologram-container");
    const canvas3d = document.getElementById("hologram-3d-canvas");
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
      !staticImg ||
      !talkingVideo ||
      !idleVideo ||
      !idleVideoB ||
      !questionVideo ||
      !talkingSource ||
      !idleSource ||
      !idleSourceB ||
      !questionSource
    )
      return () => {};

    // Reset sidebar question tile
    if (questionsGroup) {
      questionsGroup.classList.add("is-locked");
    }
    if (questionTrigger) {
      questionTrigger.classList.remove("is-ready", "is-open");
    }
    setControlsReady(false);

    staticImg.src = config.staticImg;
    if (questionsSelector) {
      questionsSelector.innerHTML = config.questions
        .map(
          (q, idx) => `
        <button
          class="hologram-btn btn-secondary"
          data-index="${idx}"
          disabled
        >
          ${q.text}
        </button>
      `,
        )
        .join("");
    }

    function setControlsReady(ready) {
      if (questionTrigger) questionTrigger.classList.toggle("is-ready", ready);
      if (questionsSelector) {
        questionsSelector
          .querySelectorAll("button")
          .forEach((btn) => (btn.disabled = !ready));
      }
    }

    function loadingStageText(progress) {
      const index = Math.min(
        config.stages.length - 1,
        Math.floor(progress * config.stages.length),
      );
      return config.stages[index];
    }

    if (config.isThreeJS) {
      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
        if (v) {
          v.style.display = "none";
          v.pause();
        }
      });
      if (canvas3d) canvas3d.style.display = "block";

      let scene, camera, renderer, animationFrameId;
      let clock, mixer, activeAction, currentModel;
      let audioObject = null;
      let audioCtx = null,
        analyser = null,
        sourceNode = null,
        dataArray = null;

      let fallbackMesh;

      function initThreeScene() {
        clock = new THREE.Clock();
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100,
        );
        camera.position.set(0, 0, 8);

        renderer = new THREE.WebGLRenderer({
          canvas: canvas3d,
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);

        const ambientLight = new THREE.AmbientLight(0x0f0b26, 1.5);
        scene.add(ambientLight);

        const purpleLight = new THREE.DirectionalLight(0x811abe, 3);
        purpleLight.position.set(-5, 3, 5);
        scene.add(purpleLight);

        const orangeLight = new THREE.DirectionalLight(0xfa9721, 3);
        orangeLight.position.set(5, -3, 5);
        scene.add(orangeLight);
      }

      // Fallback chain core setup
      function setupFallbackGeometry() {
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 120, 16);
        const material = new THREE.MeshBasicMaterial({
          color: 0x811abe,
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });
        fallbackMesh = new THREE.Mesh(geometry, material);
        scene.add(fallbackMesh);
      }

      function loadGLTFModel() {
        const loader = new GLTFLoader();
        loader.load(
          config.modelPath,
          (gltf) => {
            currentModel = gltf.scene;

            currentModel.position.set(0, -1.8, 0);
            currentModel.scale.setScalar(1.5);
            scene.add(currentModel);

            mixer = new THREE.AnimationMixer(currentModel);
            if (gltf.animations.length > 0) {
              activeAction = mixer.clipAction(gltf.animations[0]);
              activeAction.play();
            }
          },
          undefined,
          (err) => {
            console.warn(
              "Brak pliku modelu 3D na serwerze. Uruchamiam efekt awaryjny (Holographic Core Fallback).",
              err,
            );
            setupFallbackGeometry();
          },
        );
      }

      // Maps the audio frequency to animate the core chain
      function setupAudioAnalyser(audioElement) {
        try {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;

          sourceNode = audioCtx.createMediaElementSource(audioElement);
          sourceNode.connect(analyser);
          analyser.connect(audioCtx.destination);

          const bufferLength = analyser.frequencyBinCount;
          dataArray = new Uint8Array(bufferLength);
        } catch (e) {
          console.warn(
            "Something unexpected happened while running Web Audio API:",
            e,
          );
        }
      }

      function getAverageVolume() {
        if (!analyser || !dataArray) return 0;
        analyser.getByteFrequencyData(dataArray);
        let values = 0;
        for (let i = 0; i < dataArray.length; i++) {
          values += dataArray[i];
        }
        return values / dataArray.length;
      }

      function animate() {
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock ? clock.getDelta() : 0.016;
        if (mixer) mixer.update(delta);

        // Track audio volume for effects
        const volume = getAverageVolume();

        // Fallback chain core
        if (fallbackMesh) {
          fallbackMesh.rotation.x += 0.005;
          fallbackMesh.rotation.y += 0.01;

          fallbackMesh.position.y =
            Math.sin(clock.getElapsedTime() * 1.5) * 0.15;

          const scale = 1 + volume / 120;
          fallbackMesh.scale.set(scale, scale, scale);

          fallbackMesh.material.color.setHex(volume > 30 ? 0xfa9721 : 0x811abe);
        }

        // Simplified lip sync
        if (currentModel && volume > 10) {
          currentModel.traverse((child) => {
            if (child.isMesh && child.morphTargetInfluences) {
              const mouthOpenIdx = child.morphTargetDictionary
                ? child.morphTargetDictionary["mouthOpen"]
                : 0;
              if (mouthOpenIdx !== undefined) {
                child.morphTargetInfluences[mouthOpenIdx] = Math.min(
                  volume / 80,
                  1.0,
                );
              }
            }
          });
        }

        renderer.render(scene, camera);
      }

      function playAudioAnswer(qConfig) {
        if (audioObject) {
          audioObject.pause();
        }

        setControlsReady(false);
        statusText.innerText = "Hologram odpowiada...";

        audioObject = new Audio(qConfig.audio);
        audioObject.muted = isMuted;

        audioObject.addEventListener("canplaythrough", () => {
          setupAudioAnalyser(audioObject);
          audioObject
            .play()
            .catch((err) =>
              console.log("The browser refused to autoplay a video:", err),
            );
        });

        audioObject.onended = () => {
          statusText.innerText = config.statusIdle;
          setControlsReady(true);

          // Clear all other question buttons
          if (questionsSelector) {
            questionsSelector
              .querySelectorAll(".hologram-btn")
              .forEach((b) => b.classList.remove("is-active"));
          }
        };
      }

      // Three.js animation start sequence
      async function startThreeSequence() {
        statusText.innerText = config.statusAnalyzing;
        if (laserLine) {
          laserLine.style.display = "block";
          laserLine.style.animation =
            "laserScanAnimation 3s infinite ease-in-out";
        }

        for (let i = 0; i <= 100; i += 25) {
          statusText.innerText = `${loadingStageText(i / 100)} ${i}%`;
          await new Promise((r) => setTimeout(r, 450));
        }

        if (isDestroyed) return;

        initThreeScene();
        loadGLTFModel();
        animate();

        if (laserLine) laserLine.style.display = "none";
        statusText.innerText = config.statusReady;
        setControlsReady(true);
        if (questionsGroup) questionsGroup.classList.remove("is-locked");
      }

      const handleThreeQuestionsClick = (e) => {
        const btn = e.target.closest("button");
        if (!btn || btn.disabled) return;

        questionsSelector
          .querySelectorAll(".hologram-btn")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const qIdx = parseInt(btn.getAttribute("data-index"), 10);
        const qConfig = config.questions[qIdx];
        if (qConfig && qConfig.audio) {
          playAudioAnswer(qConfig);
        }
      };

      if (questionsSelector) {
        questionsSelector.addEventListener("click", handleThreeQuestionsClick);
      }

      const handleResize = () => {
        if (!renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // Start three.js module
      let isDestroyed = false;
      startThreeSequence();

      // Clear Three.js module to avoid RAM leaks and audio doubling
      return function cleanupThree() {
        isDestroyed = true;
        window.removeEventListener("resize", handleResize);
        if (questionsSelector) {
          questionsSelector.removeEventListener(
            "click",
            handleThreeQuestionsClick,
          );
        }
        cancelAnimationFrame(animationFrameId);

        if (audioObject) {
          audioObject.pause();
          audioObject = null;
        }
        if (audioCtx) {
          audioCtx.close();
        }

        // Drop GPU renderer task
        if (renderer) {
          renderer.dispose();
        }
        if (scene) {
          scene.traverse((object) => {
            if (!object.isMesh) return;
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          });
        }
        if (canvas3d) canvas3d.style.display = "none";
      };
    }

    if (canvas3d) canvas3d.style.display = "none";
    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
      if (v) v.style.display = "block";
    });

    const PATH_TALKING_VIDEO = config.talking;
    const PATH_IDLE_VIDEO = config.idle;
    const PATH_DEFAULT_QUESTION_VIDEO = config.question;
    const ANALYSIS_DURATION_MS = 2000;

    const preventContext = (e) => e.preventDefault();
    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((video) =>
      video.addEventListener("contextmenu", preventContext),
    );

    // Sync mute status
    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach(
      (v) => (v.muted = isMuted),
    );

    const handleMuteClick = () => {
      isMuted = !isMuted;
      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach(
        (v) => (v.muted = isMuted),
      );
      if (muteBtn) {
        muteBtn.innerHTML = isMuted ? ICON_MUTED : ICON_UNMUTED;
      }
    };

    if (muteBtn) {
      muteBtn.innerHTML = isMuted ? ICON_MUTED : ICON_UNMUTED;
      muteBtn.addEventListener("click", handleMuteClick);
    }

    const handleRefreshClick = () => {
      replayAnimation();
    };

    if (refreshBtn) {
      refreshBtn.innerHTML = ICON_REFRESH;
      refreshBtn.addEventListener("click", handleRefreshClick);
    }

    const handleVideoQuestionsClick = (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;

      questionsSelector
        .querySelectorAll(".hologram-btn")
        .forEach((b) => b.classList.remove("is-active"));

      btn.classList.add("is-active");
      statusText.innerText = "Przetwarzam zapytanie...";

      const qIdx = parseInt(btn.getAttribute("data-index"), 10);
      const qConfig = config.questions[qIdx];
      if (qConfig && qConfig.video) {
        requestQuestion(qConfig.video);
      }
    };

    if (questionsSelector) {
      questionsSelector.addEventListener("click", handleVideoQuestionsClick);
    }

    let pendingQuestionPath = null;
    let pendingTimeouts = [];
    let isDestroyed = false;
    const videoBlobCache = new Map();

    function clearPendingTimeouts() {
      pendingTimeouts.forEach((id) => clearTimeout(id));
      pendingTimeouts = [];
    }

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

      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) =>
        v.load(),
      );
    }

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
        console.log("Error while playing:", err);
        next.onplaying = null;
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

      revealVideo(idleVideo, [talkingVideo, questionVideo, idleVideoB]).then(
        () => {
          statusText.innerText = config.statusIdle;

          if (questionsGroup) {
            questionsGroup.classList.remove("is-locked");
          }

          setControlsReady(true);

          if (pendingQuestionPath) {
            const pathToPlay = pendingQuestionPath;
            pendingQuestionPath = null;
            playQuestionVideo(pathToPlay);
            return;
          }

          armIdleLoopTransition(idleVideo);
        },
      );
    }

    function playQuestionVideo(videoPath) {
      setControlsReady(false);
      if (questionTrigger) questionTrigger.classList.remove("is-open");

      statusText.innerText = "Odpowiadam na pytanie...";

      questionVideo.onended = () => {
        playIdleLoop();
      };

      const startPlayback = () => {
        questionVideo.currentTime = 0;
        revealVideo(questionVideo, [talkingVideo, idleVideo, idleVideoB]).then(
          () => {
            if (questionsSelector) {
              questionsSelector
                .querySelectorAll(".hologram-btn")
                .forEach((b) => b.classList.remove("is-active"));
            }
          },
        );
      };

      const cachedSrc = videoBlobCache.get(videoPath);
      const resolvedSrc =
        cachedSrc || new URL(videoPath, window.location.href).href;
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

    const handleTriggerClick = () => {
      if (!questionTrigger.classList.contains("is-ready")) return;
      questionTrigger.classList.add("is-open");
      requestQuestion(PATH_DEFAULT_QUESTION_VIDEO);
    };

    if (questionTrigger) {
      questionTrigger.addEventListener("click", handleTriggerClick);
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

      statusText.innerText = config.statusReady;
      talkingVideo.currentTime = 0;
      armTalkingVideoTransition();

      revealVideo(talkingVideo, [staticImg]).then(() => {
        setControlsReady(true);
      });
    }

    statusText.innerText = "Ładowanie prezentacji...";

    async function startSequence() {
      statusText.innerText = config.statusAnalyzing;

      if (laserLine) {
        laserLine.style.display = "block";
        laserLine.style.animation =
          "laserScanAnimation 4s infinite ease-in-out";
      }

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
        console.log("Error while loading resources, run fallback:", err);

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
      setControlsReady(false);
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
        laserLine.style.animation =
          "laserScanAnimation 4s infinite ease-in-out";
      }

      statusText.innerText = config.statusAnalyzing;

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

    return function cleanupVideo() {
      isDestroyed = true;
      clearPendingTimeouts();
      talkingVideo.removeEventListener("contextmenu", preventContext);
      idleVideo.removeEventListener("contextmenu", preventContext);
      idleVideoB.removeEventListener("contextmenu", preventContext);
      questionVideo.removeEventListener("contextmenu", preventContext);

      if (muteBtn) muteBtn.removeEventListener("click", handleMuteClick);
      if (refreshBtn)
        refreshBtn.removeEventListener("click", handleRefreshClick);
      if (questionsSelector)
        questionsSelector.removeEventListener(
          "click",
          handleVideoQuestionsClick,
        );
      if (questionTrigger)
        questionTrigger.removeEventListener("click", handleTriggerClick);

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

  // Mode buttons handlera
  if (avatarBtn) {
    avatarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (activeMode !== "avatar") switchMode("avatar");
    });
  }

  if (hologramBtn) {
    hologramBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (activeMode !== "hologram") switchMode("hologram");
    });
  }

  // Default run avatar mode
  switchMode("avatar");

  return function cleanupAll() {
    if (currentCleanup) {
      currentCleanup();
    }
  };
}

async function fetchWithProgress(url, onProgress) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
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
      console.log("Error while playing:", err);
      hideElements.forEach((el) => {
        el.classList.remove("active", "scanning");
        if (typeof el.pause === "function") el.pause();
      });
      resolve();
    });
  });
}
