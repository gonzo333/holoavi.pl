import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createLogger } from "./logger.js";

const logger = createLogger("hologram");

const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
const ICON_UNMUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
const ICON_REFRESH = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;

const assetsAvatarPath = "/assets/avatars";
const assetsHologramPath = "/assets/holograms";

// Mode configuration
const MODES = {
  avatar: {
    isThreeJSLegacy: false, // Full GLB model + audio Q&A (legacy hologram experience)
    idleUsesThreeJS: false, // Video mode only: render the three.js wireframe loop instead of an idle video
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
        video: assetsAvatarPath + "/questions/magda-electronic-document.webm",
      },
      {
        text: "Jak długo trwa wdrożenie awatara?",
        video: assetsAvatarPath + "/questions/magda-time-required.webm",
      },
      {
        text: "A skąd awatar wie, jak odpowiadać klientom?",
        video: assetsAvatarPath + "/questions/magda-avatar-knowledge.webm",
      },
    ],
  },
  hologram: {
    // Off by default: flip to true (and idleUsesThreeJS to false) to restore
    // the full GLB model + audio Q&A experience below (uses `questions`).
    isThreeJSLegacy: false,
    // On by default: idle state renders the three.js wireframe loop, and
    // `presentations` videos are played on demand like `questions` used to be.
    idleUsesThreeJS: true,
    modelPath: assetsHologramPath + "/alex-avatar.glb",
    greetingAudio: assetsHologramPath + "/alex-greeting.mp3",
    staticImg: assetsHologramPath + "/alex-photo.png",
    statusReady: "Hologram 3D aktywny",
    statusIdle: "Zadaj pytanie modelowi 3D.", // isThreeJSLegacy: true
    statusIdlePresentation: "Gotowy do prezentacji.", // idleUsesThreeJS: true
    statusAnalyzing: "Inicjalizacja silnika holograficznego...",
    stages: [
      "Uruchamianie silnika renderowania...",
      "Inicjalizacja kamery i światła...",
      "Wczytywanie trójwymiarowej geometrii...",
      "Weryfikacja danych...",
    ],
    // Used when isThreeJSLegacy: true (full GLB model + audio branch).
    questions: [
      {
        text: "Z jakim wyprzedzeniem muszę rezerwować termin?",
        audio: assetsHologramPath + "/questions/alex-book-in-advance.mp3",
        animation: "present",
      },
      {
        text: "Czy hologram działa w jasnym pomieszczeniu?",
        audio: assetsHologramPath + "/questions/alex-brightness.mp3",
        animation: "explain",
      },
      {
        text: "Czy dowozicie i montujecie sprzęt na miejscu?",
        audio:
          assetsHologramPath + "/questions/alex-transport-and-logistics.mp3",
        animation: "explain",
      },
    ],
    // Used when idleUsesThreeJS: true (video + wireframe-idle branch).
    presentations: [
      {
        text: "Prezentacja procesu produkcyjnego",
        video: assetsHologramPath + "/presentations/production-processing.mp4",
      },
      {
        text: "Dynamiczna prezentacja firmy",
        video:
          assetsHologramPath +
          "/presentations/dynamic-company-presentation.mp4",
      },
      {
        text: "Wirtualny pracownik",
        video: assetsHologramPath + "/presentations/virtual-employee.mp4",
      },
    ],
  },
};

// Shared hologram "wireframe" mesh (points-based torus knot) reused both by
// the full three.js hologram scene and by the standalone idle-loop renderer
// used when a video-based mode opts into a three.js idle loop.
function createHologramFallbackMesh(customUniforms) {
  const geometry = new THREE.TorusKnotGeometry(1.0, 0.22, 120, 16);

  const positions = geometry.attributes.position;
  const originals = new Float32Array(positions.array);
  geometry.userData = { originals: originals };

  const material = new THREE.ShaderMaterial({
    uniforms: customUniforms,
    vertexShader: `
      uniform float uTime;
      uniform float uVolume;
      varying float vVolume;
      varying vec3 vPos;
      void main() {
        vVolume = uVolume;
        vec3 pos = position;
        vPos = position;

        float waveIntensity = uVolume / 140.0;
        float frequency = 2.5;

        float offsetX = (sin(uTime * 4.5 + pos.y * frequency + pos.z) * 0.6 + cos(uTime * 2.3 - pos.x * 1.9) * 0.4) * waveIntensity * 0.26;
        float offsetY = (cos(uTime * 3.8 + pos.x * frequency + pos.y) * 0.6 + sin(uTime * 1.8 - pos.z * 2.5) * 0.4) * waveIntensity * 0.26;
        float offsetZ = (sin(uTime * 4.8 + pos.z * frequency + pos.x) * 0.6 + cos(uTime * 2.6 - pos.y * 2.9) * 0.4) * waveIntensity * 0.26;

        pos.x += offsetX;
        pos.y += offsetY;
        pos.z += offsetZ;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = 1.6 * (45.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform float uIsLightMode;
      uniform float uTime;
      varying float vVolume;
      varying vec3 vPos;

      vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
      }

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if(dist > 0.5) discard;

        float intensity = smoothstep(0.5, 0.2, dist);
        float targetAlpha = 0.35 / (1.0 + vVolume * 0.07);
        if (uIsLightMode > 0.5) targetAlpha = 0.85;

        vec3 color;

        float spatialPulse = sin(uTime * 6.5 + vPos.y * 7.0) * cos(uTime * 4.5 + vPos.x * 5.0) * (0.08 + vVolume * 0.008);

        if (uIsLightMode > 0.5) {
          if (vVolume < 2.0) {
            color = hsl2rgb(vec3(0.58, 0.95, 0.32));
          } else {
            float hueShift = 0.84 + spatialPulse;
            color = hsl2rgb(vec3(mod(hueShift, 1.0), 0.95, 0.38));
          }
        } else {
          if (vVolume < 2.0) {
            color = hsl2rgb(vec3(0.50, 1.0, 0.50));
          } else {
            float hueShift = 0.80 + spatialPulse;
            color = hsl2rgb(vec3(mod(hueShift, 1.0), 1.0, 0.52));
          }
        }

        gl_FragColor = vec4(color * intensity, targetAlpha * intensity);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Points(geometry, material);
  mesh.scale.setScalar(1.5);
  return mesh;
}

// Standalone three.js idle-loop renderer for video-based modes that set
// `idleUsesThreeJS: true` — lets a mode play talking/question videos while
// showing the hologram wireframe instead of an idle video loop.
function createHologramWireframeLoop(canvas, container) {
  const uniforms = {
    uTime: { value: 0 },
    uVolume: { value: 0 },
    uIsLightMode: { value: 0 },
  };

  let scene, camera, renderer, mesh, clock, animationFrameId;
  let running = false;

  function ensureScene() {
    if (renderer) return;
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 6);

    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    mesh = createHologramFallbackMesh(uniforms);
    scene.add(mesh);
  }

  function handleResize() {
    if (!renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const isLightMode =
      document.documentElement.getAttribute("data-theme") === "light";
    const time = clock.getElapsedTime();

    uniforms.uTime.value = time;
    uniforms.uIsLightMode.value = isLightMode ? 1.0 : 0.0;

    mesh.rotation.y = time * 0.12;
    mesh.rotation.x = time * 0.05;
    mesh.material.blending = isLightMode
      ? THREE.NormalBlending
      : THREE.AdditiveBlending;

    renderer.render(scene, camera);
  }

  return {
    start() {
      if (running) return;
      ensureScene();
      running = true;
      window.addEventListener("resize", handleResize);
      handleResize();
      animate();
    },
    stop() {
      if (!running) return;
      running = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    },
    isActive() {
      return running;
    },
    dispose() {
      this.stop();
      if (mesh) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      if (renderer) renderer.dispose();
      renderer = null;
    },
  };
}

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
    const questionsLabel = document.getElementById("questions-label");

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

    let audioObject = null;
    let replayThreeAnimation = null;

    if (questionsGroup) {
      questionsGroup.classList.add("is-locked");
    }
    if (questionTrigger) {
      questionTrigger.classList.remove("is-ready", "is-open");
    }
    setControlsReady(false);

    // Neither three.js branch needs the static fallback photo: the legacy
    // GLB branch goes straight to its own canvas, and the wireframe-idle
    // branch has no video loop to bridge to. Skip loading it entirely so
    // there's no broken-image icon/alt text flash for modes without one.
    const needsStaticImg = !config.isThreeJSLegacy && !config.idleUsesThreeJS;
    if (config.staticImg && needsStaticImg) {
      staticImg.src = config.staticImg;
      staticImg.style.display = "block";
    } else {
      staticImg.style.display = "none";
    }

    // Video mode with a three.js idle loop shows `presentations` instead of
    // `questions`, played on demand the same way `questions` used to be.
    const presentationMode =
      !config.isThreeJSLegacy && !!config.idleUsesThreeJS;
    const questionItems = presentationMode
      ? config.presentations || []
      : config.questions;

    if (questionsLabel) {
      questionsLabel.textContent = presentationMode
        ? "Przykładowe prezentacje:"
        : "Przykładowe pytania:";
    }

    if (questionsSelector) {
      questionsSelector.innerHTML = questionItems
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

    const handleMuteClick = () => {
      isMuted = !isMuted;
      if (muteBtn) {
        muteBtn.innerHTML = isMuted ? ICON_MUTED : ICON_UNMUTED;
      }
      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
        if (v) v.muted = isMuted;
      });
      if (audioObject) {
        audioObject.muted = isMuted;
      }
    };

    const handleRefreshClick = () => {
      if (
        config.isThreeJSLegacy &&
        typeof replayThreeAnimation === "function"
      ) {
        replayThreeAnimation();
      } else if (!config.isThreeJSLegacy) {
        replayAnimation();
      }
    };

    if (muteBtn) {
      muteBtn.innerHTML = isMuted ? ICON_MUTED : ICON_UNMUTED;
      muteBtn.addEventListener("click", handleMuteClick);
    }
    if (refreshBtn) {
      refreshBtn.innerHTML = ICON_REFRESH;
      refreshBtn.addEventListener("click", handleRefreshClick);
    }

    // Three.js enabled (legacy full GLB model + audio Q&A)
    if (config.isThreeJSLegacy) {
      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
        if (v) {
          v.style.display = "none";
          v.pause();
        }
      });
      if (canvas3d) canvas3d.style.display = "block";

      let scene, camera, renderer, animationFrameId;
      let clock, mixer, activeAction, currentModel;
      let isDestroyed = false;
      let audioCtx = null,
        analyser = null,
        sourceNode = null,
        dataArray = null;

      let fallbackMesh;
      let purpleLight, orangeLight, rimLight;
      let holoDust;
      let hologramNodes = [];

      const colDarkIdle = new THREE.Color(0x00ffff);
      const colDarkTalk = new THREE.Color(0xff00ff);
      const colLightIdle = new THREE.Color(0x0284c7);
      const colLightTalk = new THREE.Color(0xb91c1c);

      let customUniforms = {
        uTime: { value: 0 },
        uVolume: { value: 0 },
        uIsLightMode: { value: 0 },
        uModelY: { value: -2.2 },
      };

      function initThreeScene() {
        clock = new THREE.Clock();
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100,
        );
        camera.position.set(0, 0, 7);

        renderer = new THREE.WebGLRenderer({
          canvas: canvas3d,
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);

        const ambientLight = new THREE.AmbientLight(0x0a0518, 0.4);
        scene.add(ambientLight);

        purpleLight = new THREE.PointLight(0x811abe, 2.5, 20);
        purpleLight.position.set(-5, 4, 2);
        scene.add(purpleLight);

        orangeLight = new THREE.PointLight(0xfa9721, 2.5, 20);
        orangeLight.position.set(5, -4, 2);
        scene.add(orangeLight);

        rimLight = new THREE.PointLight(0x00ffff, 2, 10);
        rimLight.position.set(0, 4, -3);
        scene.add(rimLight);

        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 130;
        const posArray = new Float32Array(particleCount * 3);
        const velArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
          posArray[i] = (Math.random() - 0.5) * 5.5;
          posArray[i + 1] = (Math.random() - 0.5) * 3.0;
          posArray[i + 2] = (Math.random() - 0.5) * 5.5;

          velArray[i] = (Math.random() - 0.5) * 0.015;
          velArray[i + 1] = (Math.random() - 0.5) * 0.01;
          velArray[i + 2] = (Math.random() - 0.5) * 0.015;
        }

        particleGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(posArray, 3),
        );
        particleGeo.userData = { velocities: velArray };

        const particleMat = new THREE.ShaderMaterial({
          uniforms: customUniforms,
          vertexShader: `
            uniform float uVolume;
            varying float vVolume;
            varying vec3 vModelPos;
            void main() {
              vVolume = uVolume;
              vModelPos = position;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPosition;
              
              gl_PointSize = (1.6 + (uVolume * 0.04)) * (26.0 / -mvPosition.z);
            }
          `,
          fragmentShader: `
            uniform float uIsLightMode;
            uniform float uTime;
            uniform float uModelY;
            varying float vVolume;
            varying vec3 vModelPos;
            
            vec3 hsl2rgb(vec3 c) {
              vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
              return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
            }
            
            void main() {
              vec2 coord = gl_PointCoord - vec2(0.5);
              float dist = length(coord);
              if(dist > 0.5) discard;
              
              float alphaFactor = smoothstep(0.5, 0.1, dist);
              vec3 color;
              
              if (uIsLightMode > 0.5) {
                if (vVolume < 1.8) {
                  color = hsl2rgb(vec3(0.58, 0.85, 0.35));
                } else {
                  float hue = 0.94 + sin(uTime * 5.0) * 0.03 + (vModelPos.y * 0.02);
                  color = hsl2rgb(vec3(mod(hue, 1.0), 0.95, 0.36));
                }
              } else {
                if (vVolume < 1.8) {
                  color = hsl2rgb(vec3(0.52, 1.0, 0.45));
                } else {
                  float hue = 0.82 + (vVolume * 0.005) + (vModelPos.y * 0.04);
                  color = hsl2rgb(vec3(mod(hue, 1.0), 1.0, 0.55));
                }
              }
              
              float targetAlpha = 0.70;
              
              if (vModelPos.z > 0.0) {
                float centerY = uModelY + 2.2; 
                
                float maskX = vModelPos.x * 0.75; 
                float maskY = vModelPos.y - centerY;
                float distToFace = length(vec2(maskX, maskY));
                
                float faceMask = smoothstep(0.6, 1.6, distToFace);
                
                targetAlpha = mix(0.02, 0.70, faceMask);
              }
              
              float glow = 1.0 + (vVolume * 0.09);
              gl_FragColor = vec4(color * glow * alphaFactor, targetAlpha * alphaFactor);
            }
          `,
          transparent: true,
          depthWrite: false,
        });

        holoDust = new THREE.Points(particleGeo, particleMat);
        holoDust.renderOrder = 1;
        scene.add(holoDust);

        hologramNodes = [];
        for (let i = 0; i < 3; i++) {
          const pLight = new THREE.PointLight(0xffffff, 0, 3.0);
          scene.add(pLight);
          hologramNodes.push(pLight);
        }
      }

      function setupFallbackGeometry() {
        fallbackMesh = createHologramFallbackMesh(customUniforms);
        scene.add(fallbackMesh);
      }

      function loadGLTFModel() {
        const loader = new GLTFLoader();
        loader.load(
          config.modelPath,
          (gltf) => {
            if (isDestroyed) return;
            currentModel = gltf.scene;
            currentModel.position.set(0, 0, 0);
            currentModel.scale.setScalar(4.5);
            scene.add(currentModel);
            currentModel.renderOrder = 0;

            const hologramShaderMaterial = new THREE.ShaderMaterial({
              uniforms: customUniforms,
              vertexShader: `
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vModelPos;
                void main() {
                  vNormal = normalize(normalMatrix * normal);
                  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                  vViewPosition = -mvPosition.xyz;
                  vModelPos = position;
                  gl_Position = projectionMatrix * mvPosition;
                }
              `,
              fragmentShader: `
                uniform float uIsLightMode;
                uniform float uTime;
                uniform float uVolume;
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vModelPos;

                vec3 hsl2rgb(vec3 c) {
                  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
                  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
                }

                void main() {
                  vec3 normal = normalize(vNormal);
                  vec3 viewDir = normalize(vViewPosition);
                  
                  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
                  
                  float scanline = sin(vModelPos.y * 70.0 - uTime * 5.0) * 0.18 + 0.82;
                  
                  vec3 color;
                  float baseAlpha = (uIsLightMode > 0.5) ? 0.35 : 0.15;
                  
                  if (uIsLightMode > 0.5) {
                    if (uVolume < 2.0) {
                      color = hsl2rgb(vec3(0.58, 0.95, 0.32));
                    } else {
                      float hueShift = 0.84 + sin(uTime * 6.0) * 0.03;
                      color = hsl2rgb(vec3(mod(hueShift, 1.0), 0.95, 0.38));
                    }
                  } else {
                    if (uVolume < 2.0) {
                      color = hsl2rgb(vec3(0.50, 1.0, 0.50));
                    } else {
                      float hueShift = 0.80 + sin(uTime * 5.0) * 0.06;
                      color = hsl2rgb(vec3(mod(hueShift, 1.0), 1.0, 0.52));
                    }
                  }
                  
                  float glow = fresnel * 1.8 + 0.15 + (uVolume / 90.0);
                  
                  gl_FragColor = vec4(color * glow * scanline, (baseAlpha + fresnel * 0.5) * scanline);
                }
              `,
              transparent: true,
              depthWrite: true,
            });

            currentModel.traverse((child) => {
              if (child.isMesh) {
                child.material = hologramShaderMaterial;
              }
            });

            mixer = new THREE.AnimationMixer(currentModel);
            if (gltf.animations.length > 0) {
              activeAction = mixer.clipAction(gltf.animations[0]);
              activeAction.play();
            }
          },
          undefined,
          (err) => {
            if (isDestroyed) return;
            console.warn(
              "No 3D model available... starting fallback chain.",
              err,
            );
            setupFallbackGeometry();
          },
        );
      }

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

        const time = clock ? clock.getElapsedTime() : 0;
        const volume = getAverageVolume();

        const isLightMode =
          document.documentElement.getAttribute("data-theme") === "light";

        customUniforms.uTime.value = time;
        customUniforms.uVolume.value = volume;
        customUniforms.uIsLightMode.value = isLightMode ? 1.0 : 0.0;

        const lightPulse = volume / 12;
        if (isLightMode) {
          if (purpleLight) {
            purpleLight.color.setHex(0x6b21a8);
            purpleLight.intensity = 2.0 + lightPulse;
          }
          if (orangeLight) {
            orangeLight.color.setHex(0xea580c);
            orangeLight.intensity = 2.0 + volume / 20;
          }
          if (rimLight) {
            rimLight.color.setHex(0x0284c7);
            rimLight.intensity = 1.0 + volume / 15;
          }
        } else {
          if (purpleLight) {
            purpleLight.color.setHex(0x811abe);
            purpleLight.intensity = 4.0 + lightPulse * 4.0;
          }
          if (orangeLight) {
            orangeLight.color.setHex(0xfa9721);
            orangeLight.intensity = 4.0 + volume / 15;
          }
          if (rimLight) {
            rimLight.color.setHex(0x00ffff);
            rimLight.intensity = 2.0 + volume / 8;
          }
        }

        if (hologramNodes && hologramNodes.length === 3) {
          const isLight = isLightMode;
          const powerFactor =
            (35.0 + Math.sin(time * 5.0) * 10.0) * (1.0 + volume / 3.5);

          hologramNodes[0].position.set(
            Math.sin(time * 3.5) * 0.4,
            1.3,
            Math.cos(time * 3.5) * 0.4,
          );
          hologramNodes[0].intensity = powerFactor * 0.8;
          hologramNodes[0].distance = 1.8;
          hologramNodes[0].color.setHex(isLight ? 0x0284c7 : 0x00ffff);

          hologramNodes[1].position.set(
            Math.cos(time * 2.5) * 0.45,
            0.2,
            Math.sin(time * 2.5) * 0.45,
          );
          hologramNodes[1].intensity = powerFactor * 1.2;
          hologramNodes[1].distance = 1.8;
          hologramNodes[1].color.setHex(isLight ? 0xb91c1c : 0xff00ff);

          hologramNodes[2].position.set(
            Math.sin(time * 1.8) * 0.5,
            -0.7,
            Math.cos(time * 1.8) * 0.5,
          );
          hologramNodes[2].intensity = powerFactor * 0.9;
          hologramNodes[2].distance = 1.8;
          hologramNodes[2].color.setHex(isLight ? 0x4f46e5 : 0x00ffaa);
        }

        if (currentModel) {
          currentModel.position.y = -2.2 + Math.sin(time * 1.8) * 0.05;
          currentModel.rotation.z =
            Math.sin(time * 8.0) * 0.015 * (volume / 90.0);
          currentModel.rotation.y = time * 0.12;

          customUniforms.uModelY.value = currentModel.position.y;

          currentModel.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.blending = isLightMode
                ? THREE.NormalBlending
                : THREE.AdditiveBlending;
            }
          });
        }

        if (holoDust) {
          const geo = holoDust.geometry;
          const positions = geo.attributes.position.array;
          const vels = geo.userData.velocities;

          const avatarWidth = 1.15;

          const boundX = 2.8,
            boundY = 1.5,
            boundZ = 2.8;

          for (let i = 0; i < positions.length; i += 3) {
            let px = positions[i];
            let py = positions[i + 1];
            let pz = positions[i + 2];

            const swirlStrength = 0.0003 + volume * 0.00002;
            vels[i] += -pz * swirlStrength;
            vels[i + 2] += px * swirlStrength;

            positions[i] += vels[i];
            positions[i + 1] += vels[i + 1];
            positions[i + 2] += vels[i + 2];

            vels[i] += (Math.random() - 0.5) * 0.0005;
            vels[i + 1] += (Math.random() - 0.5) * 0.0004;
            vels[i + 2] += (Math.random() - 0.5) * 0.0005;

            let speed = Math.sqrt(
              vels[i] * vels[i] +
                vels[i + 1] * vels[i + 1] +
                vels[i + 2] * vels[i + 2],
            );
            const maxSpeed = 0.01 + volume * 0.0003;
            if (speed > maxSpeed) {
              vels[i] = (vels[i] / speed) * maxSpeed;
              vels[i + 1] = (vels[i + 1] / speed) * maxSpeed;
              vels[i + 2] = (vels[i + 2] / speed) * maxSpeed;
            }

            if (Math.abs(positions[i]) > boundX) {
              vels[i] *= -1;
              positions[i] = Math.sign(positions[i]) * boundX;
            }
            if (Math.abs(positions[i + 1]) > boundY) {
              vels[i + 1] *= -1;
              positions[i + 1] = Math.sign(positions[i + 1]) * boundY;
            }
            if (Math.abs(positions[i + 2]) > boundZ) {
              vels[i + 2] *= -1;
              positions[i + 2] = Math.sign(positions[i + 2]) * boundZ;
            }

            let distToAvatar = Math.sqrt(
              positions[i] * positions[i] + positions[i + 2] * positions[i + 2],
            );

            if (
              distToAvatar < avatarWidth &&
              positions[i + 1] > -1.5 &&
              positions[i + 1] < 1.4
            ) {
              let nx = positions[i] / distToAvatar;
              let nz = positions[i + 2] / distToAvatar;
              let dotProduct = vels[i] * nx + vels[i + 2] * nz;

              if (dotProduct < 0.0) {
                vels[i] = vels[i] - 2.0 * dotProduct * nx;
                vels[i + 2] = vels[i + 2] - 2.0 * dotProduct * nz;

                vels[i] += (Math.random() - 0.5) * 0.006;
                vels[i + 1] += (Math.random() - 0.5) * 0.004;
                vels[i + 2] += (Math.random() - 0.5) * 0.006;
              }

              positions[i] = nx * (avatarWidth + 0.02);
              positions[i + 2] = nz * (avatarWidth + 0.02);
            }
          }

          geo.attributes.position.needsUpdate = true;

          if (holoDust.material) {
            holoDust.material.blending = isLightMode
              ? THREE.NormalBlending
              : THREE.AdditiveBlending;
          }
        }

        if (fallbackMesh) {
          fallbackMesh.rotation.y = time * 0.12;
          fallbackMesh.rotation.x = time * 0.05;
          if (fallbackMesh.material) {
            if (isLightMode) {
              fallbackMesh.material.blending = THREE.NormalBlending;
              fallbackMesh.material.opacity = 0.9;
            } else {
              fallbackMesh.material.blending = THREE.AdditiveBlending;
              fallbackMesh.material.opacity = 0.95;
            }
          }
        }

        renderer.render(scene, camera);
      }

      function playAudioAnswer(qConfig, isGreeting = false) {
        if (audioObject) {
          audioObject.pause();
        }

        setControlsReady(false);
        statusText.innerText = isGreeting
          ? "Hologram Alexa gotowy..."
          : "Odpowiadam na pytanie...";

        const audioUrl = typeof qConfig === "string" ? qConfig : qConfig.audio;
        audioObject = new Audio(audioUrl);
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

          if (questionsSelector) {
            questionsSelector
              .querySelectorAll(".hologram-btn")
              .forEach((b) => b.classList.remove("is-active"));
          }
        };
      }

      replayThreeAnimation = () => {
        if (audioObject) {
          audioObject.pause();
          audioObject = null;
        }
        if (questionsSelector) {
          questionsSelector
            .querySelectorAll(".hologram-btn")
            .forEach((b) => b.classList.remove("is-active"));
        }
        setControlsReady(false);

        if (laserLine) {
          laserLine.style.display = "block";
          laserLine.style.animation = "laserScanAnimation 1.5s ease-in-out";
          setTimeout(() => {
            if (laserLine) laserLine.style.display = "none";
          }, 1500);
        }

        if (config.greetingAudio) {
          playAudioAnswer(config.greetingAudio, true);
        } else {
          statusText.innerText = config.statusReady;
          setControlsReady(true);
        }
      };

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

        if (config.greetingAudio) {
          setTimeout(() => {
            if (!isDestroyed) playAudioAnswer(config.greetingAudio, true);
          }, 400);
        }
      }

      const handleThreeQuestionsClick = (e) => {
        const btn = e.target.closest("button");
        if (!btn || btn.disabled) return;

        questionsSelector
          .querySelectorAll(".hologram-btn")
          .forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const qIdx = parseInt(btn.getAttribute("data-index"), 10);
        const qConfig = questionItems[qIdx];
        if (qConfig && qConfig.audio) {
          playAudioAnswer(qConfig, false);
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

      startThreeSequence();

      return function cleanupThree() {
        isDestroyed = true;
        window.removeEventListener("resize", handleResize);
        if (questionsSelector) {
          questionsSelector.removeEventListener(
            "click",
            handleThreeQuestionsClick,
          );
        }
        if (muteBtn) muteBtn.removeEventListener("click", handleMuteClick);
        if (refreshBtn)
          refreshBtn.removeEventListener("click", handleRefreshClick);

        cancelAnimationFrame(animationFrameId);

        if (audioObject) {
          audioObject.pause();
          audioObject = null;
        }
        if (audioCtx) {
          audioCtx.close();
        }

        if (renderer) renderer.dispose();
        if (scene) {
          scene.traverse((object) => {
            if (!object.isMesh && !object.isPoints) return;
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

    // Video handler
    if (canvas3d) canvas3d.style.display = "none";
    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
      if (v) v.style.display = "block";
    });

    const PATH_TALKING_VIDEO = config.talking;
    const PATH_IDLE_VIDEO = config.idle;
    const PATH_DEFAULT_QUESTION_VIDEO = config.question;
    const ANALYSIS_DURATION_MS = 2000;

    // Video-based mode, but the idle state renders the three.js hologram
    // wireframe instead of looping an idle video.
    const wireframeLoop = config.idleUsesThreeJS
      ? createHologramWireframeLoop(canvas3d, container)
      : null;

    function showIdleWireframe() {
      if (!wireframeLoop) return;
      logger.log("showIdleWireframe()", new Error().stack);
      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
        logger.log("showIdleWireframe: pausing", v.id, {
          paused: v.paused,
          ended: v.ended,
          readyState: v.readyState,
          currentSrc: v.currentSrc,
        });
        v.classList.remove("active");
        v.pause();
      });
      // #avatar-static-img is opacity:1 regardless of the .active class
      // (CSS id specificity), so it has to be hidden explicitly or it shows
      // through the transparent parts of the wireframe canvas.
      staticImg.style.display = "none";
      if (canvas3d) canvas3d.style.display = "block";
      wireframeLoop.start();
      logger.log("showIdleWireframe: done", {
        staticImgDisplay: staticImg.style.display,
        canvas3dDisplay: canvas3d ? canvas3d.style.display : null,
      });
    }

    function hideIdleWireframe() {
      if (!wireframeLoop) return;
      logger.log("hideIdleWireframe()");
      wireframeLoop.stop();
      if (canvas3d) canvas3d.style.display = "none";
    }

    const preventContext = (e) => e.preventDefault();
    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((video) =>
      video.addEventListener("contextmenu", preventContext),
    );

    [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach(
      (v) => (v.muted = isMuted),
    );

    const handleVideoQuestionsClick = (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;

      questionsSelector
        .querySelectorAll(".hologram-btn")
        .forEach((b) => b.classList.remove("is-active"));

      btn.classList.add("is-active");
      statusText.innerText = presentationMode
        ? "Wczytywanie prezentacji..."
        : "Przetwarzam zapytanie...";

      const qIdx = parseInt(btn.getAttribute("data-index"), 10);
      const qConfig = questionItems[qIdx];
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
      if (PATH_TALKING_VIDEO) videoBlobCache.set(PATH_TALKING_VIDEO, null);
      if (PATH_IDLE_VIDEO) videoBlobCache.set(PATH_IDLE_VIDEO, null);
      if (PATH_DEFAULT_QUESTION_VIDEO)
        videoBlobCache.set(PATH_DEFAULT_QUESTION_VIDEO, null);

      const paths = [...videoBlobCache.keys()];
      const progressByPath = new Map(paths.map((p) => [p, 0]));
      const reportProgress = () => {
        if (paths.length === 0) return;
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

      if (PATH_TALKING_VIDEO)
        talkingSource.src = videoBlobCache.get(PATH_TALKING_VIDEO);
      if (PATH_IDLE_VIDEO) {
        idleSource.src = videoBlobCache.get(PATH_IDLE_VIDEO);
        idleSourceB.src = videoBlobCache.get(PATH_IDLE_VIDEO);
      }
      if (PATH_DEFAULT_QUESTION_VIDEO)
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
      if (wireframeLoop) {
        logger.log("playIdleLoop() [wireframe branch]", {
          pendingQuestionPath,
        });
        statusText.innerText =
          config.statusIdlePresentation || config.statusIdle;
        if (questionsGroup) questionsGroup.classList.remove("is-locked");
        setControlsReady(true);

        if (pendingQuestionPath) {
          const pathToPlay = pendingQuestionPath;
          pendingQuestionPath = null;
          playQuestionVideo(pathToPlay);
          return;
        }

        showIdleWireframe();
        return;
      }

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
          if (questionsGroup) questionsGroup.classList.remove("is-locked");
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
      logger.log("playQuestionVideo()", videoPath, {
        paused: questionVideo.paused,
        ended: questionVideo.ended,
        readyState: questionVideo.readyState,
        currentSrc: questionVideo.currentSrc,
      });
      hideIdleWireframe();
      setControlsReady(false);
      if (questionTrigger) questionTrigger.classList.remove("is-open");

      statusText.innerText = presentationMode
        ? "Prezentuję treść holograficzną..."
        : "Odpowiadam na pytanie...";
      questionVideo.onended = () => {
        logger.log("questionVideo onended fired", {
          currentTime: questionVideo.currentTime,
          duration: questionVideo.duration,
          currentSrc: questionVideo.currentSrc,
        });
        playIdleLoop();
      };

      const startPlayback = () => {
        logger.log("playQuestionVideo: startPlayback()", {
          readyState: questionVideo.readyState,
          currentTime: questionVideo.currentTime,
          currentSrc: questionVideo.currentSrc,
        });

        const beginReveal = () => {
          revealVideo(questionVideo, [
            talkingVideo,
            idleVideo,
            idleVideoB,
          ]).then(() => {
            if (questionsSelector) {
              questionsSelector
                .querySelectorAll(".hologram-btn")
                .forEach((b) => b.classList.remove("is-active"));
            }
          });
        };

        // A fresh .load() already resets currentTime to 0, so only seek (and
        // wait for it to settle) when actually replaying a video that isn't
        // at the start - calling play() right after setting currentTime can
        // make the browser abort the play() with the seek it just triggered.
        if (questionVideo.currentTime !== 0) {
          logger.log("playQuestionVideo: seeking to 0 before replay");
          questionVideo.onseeked = () => {
            questionVideo.onseeked = null;
            logger.log("playQuestionVideo: seeked, revealing now");
            beginReveal();
          };
          questionVideo.currentTime = 0;
        } else {
          beginReveal();
        }
      };

      const cachedSrc = videoBlobCache.get(videoPath);
      const resolvedSrc =
        cachedSrc || new URL(videoPath, window.location.href).href;
      logger.log("playQuestionVideo: resolved src", {
        videoPath,
        cachedSrc,
        resolvedSrc,
      });
      if (questionSource.src === resolvedSrc && questionVideo.readyState >= 3) {
        logger.log("playQuestionVideo: already loaded, playing immediately");
        startPlayback();
        return;
      }

      questionVideo.oncanplay = () => {
        logger.log("playQuestionVideo: oncanplay fired");
        questionVideo.oncanplay = null;
        startPlayback();
      };

      questionSource.src = resolvedSrc;
      questionVideo.load();
    }

    function requestQuestion(videoPath) {
      if (questionVideo.classList.contains("active") || pendingQuestionPath) {
        logger.log("requestQuestion: ignored (already active/pending)", {
          videoPath,
          questionVideoActive: questionVideo.classList.contains("active"),
          pendingQuestionPath,
        });
        return;
      }
      if (wireframeLoop && wireframeLoop.isActive()) {
        logger.log("requestQuestion: wireframe active, playing immediately", {
          videoPath,
        });
        playQuestionVideo(videoPath);
        return;
      }
      logger.log("requestQuestion: queued as pending", { videoPath });
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

    // Presentation mode has no dedicated intro clip: skip straight to the
    // idle wireframe instead of revealing a (nonexistent) talking video.
    function enterIdleOrTalking() {
      if (wireframeLoop) {
        if (laserLine) laserLine.style.display = "none";
        playIdleLoop();
      } else {
        activateAvatar();
      }
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
        if (PATH_TALKING_VIDEO) talkingSource.src = PATH_TALKING_VIDEO;
        if (PATH_IDLE_VIDEO) {
          idleSource.src = PATH_IDLE_VIDEO;
          idleSourceB.src = PATH_IDLE_VIDEO;
        }
        if (PATH_DEFAULT_QUESTION_VIDEO)
          questionSource.src = PATH_DEFAULT_QUESTION_VIDEO;
        [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) =>
          v.load(),
        );

        if (PATH_TALKING_VIDEO) {
          await new Promise((resolve) => {
            talkingVideo.oncanplaythrough = () => {
              talkingVideo.oncanplaythrough = null;
              resolve();
            };
          });
        }
      }

      if (isDestroyed) return;
      statusText.innerText = "Inicjalizacja strumienia...";
      const t2 = setTimeout(enterIdleOrTalking, 600);
      pendingTimeouts.push(t2);
    }

    function replayAnimation() {
      hideIdleWireframe();
      if (questionsSelector) {
        questionsSelector
          .querySelectorAll(".hologram-btn")
          .forEach((b) => b.classList.remove("is-active"));
      }
      if (questionsGroup) questionsGroup.classList.add("is-locked");

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
      questionVideo.onseeked = null;

      [talkingVideo, idleVideo, idleVideoB, questionVideo].forEach((v) => {
        v.pause();
        v.currentTime = 0;
        v.classList.remove("active");
        v.style.zIndex = "";
      });
      staticImg.style.zIndex = "";
      if (needsStaticImg) staticImg.style.display = "block";
      staticImg.classList.add("active", "scanning");

      if (laserLine) {
        laserLine.style.display = "none";
        laserLine.getBoundingClientRect();
        laserLine.style.display = "block";
        laserLine.style.animation =
          "laserScanAnimation 4s infinite ease-in-out";
      }

      statusText.innerText = config.statusAnalyzing;
      const t = setTimeout(enterIdleOrTalking, ANALYSIS_DURATION_MS);
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
      if (wireframeLoop) wireframeLoop.dispose();
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
      questionVideo.onseeked = null;
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

  switchMode("avatar");

  return function cleanupAll() {
    if (currentCleanup) currentCleanup();
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
  logger.log("revealVideo() called for", video.id, {
    currentSrc: video.currentSrc,
    readyState: video.readyState,
    paused: video.paused,
  });
  return new Promise((resolve) => {
    video.onplaying = () => {
      logger.log("revealVideo: onplaying fired for", video.id);
      video.onplaying = null;
      hideElements.forEach((el) => {
        el.classList.remove("active", "scanning");
        if (typeof el.pause === "function") el.pause();
      });
      resolve();
    };

    video.classList.add("active");
    logger.log("revealVideo: calling play() on", video.id);
    video.play().catch((err) => {
      console.log("Error while playing:", err);
      logger.error("revealVideo: play() rejected for", video.id, {
        name: err && err.name,
        message: err && err.message,
        paused: video.paused,
        ended: video.ended,
        readyState: video.readyState,
      });
      hideElements.forEach((el) => {
        el.classList.remove("active", "scanning");
        if (typeof el.pause === "function") el.pause();
      });
      resolve();
    });
  });
}
