import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

export function initHologramAnimation() {
  const container = document.getElementById("hologram-container");
  const statusText = document.getElementById("status-text");

  if (!container || !statusText) return;

  const FOTO_URL = "assets/photo.png";
  const MODEL_URL = "assets/sylwetka.glb";

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0.5, 2.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  let hologramPoints;
  let solidMesh;
  let particleCount = 45000;

  const photoPositions = new Float32Array(particleCount * 3);
  const hologramPositions = new Float32Array(particleCount * 3);
  const photoColors = new Float32Array(particleCount * 3);
  const holoNeonColors = new Float32Array(particleCount * 3);
  const holoRealColors = new Float32Array(particleCount * 3);

  const animationState = {
    morph: 0,
    colorMode: 0,
    meshOpacity: 0,
  };

  const loadingManager = new THREE.LoadingManager();
  const textureLoader = new THREE.TextureLoader(loadingManager);
  const gltfLoader = new GLTFLoader(loadingManager);

  let loadedTexture, loadedGeometry;

  textureLoader.load(
    FOTO_URL,
    (texture) => {
      loadedTexture = texture;
    },
    undefined,
    (err) => {
      statusText.innerText = "BŁĄD: Brak " + FOTO_URL;
    },
  );

  gltfLoader.load(
    MODEL_URL,
    (gltf) => {
      gltf.scene.traverse((child) => {
        if (child.isMesh && !loadedGeometry) {
          solidMesh = child.clone();
          loadedGeometry = child.geometry.clone();
        }
      });
    },
    undefined,
    (err) => {
      statusText.innerText = "BŁĄD: Brak " + MODEL_URL;
    },
  );

  loadingManager.onLoad = () => {
    statusText.innerText = "Przetwarzanie danych...";
    initHologram();
  };

  function initHologram() {
    loadedGeometry.center();
    loadedGeometry.scale(1.3, 1.3, 1.3);

    if (solidMesh) {
      solidMesh.geometry = loadedGeometry;
      solidMesh.position.set(0, 0.5, 0);

      const applyMaterialSettings = (mat) => {
        mat.transparent = true;
        mat.opacity = 0;
        mat.depthWrite = false;
        mat.depthTest = true;
      };

      if (Array.isArray(solidMesh.material)) {
        solidMesh.material.forEach(applyMaterialSettings);
      } else {
        applyMaterialSettings(solidMesh.material);
      }

      solidMesh.visible = false;
      scene.add(solidMesh);
    }

    const modelVertices = loadedGeometry.attributes.position.array;
    const vertexCount = modelVertices.length / 3;

    const img = loadedTexture.image;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const gridX = 150;
    const gridY = 150;
    canvas.width = gridX;
    canvas.height = gridY;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < particleCount; i++) {
      const col = i % gridX;
      const row = Math.floor(i / gridX) % gridY;

      const pX = col / gridX - 0.5;
      const pY = 1.0 - row / gridY - 0.5;

      photoPositions[i * 3] = pX * 1.6;
      photoPositions[i * 3 + 1] = pY * 1.6 + 0.6;
      photoPositions[i * 3 + 2] = 0;

      const pIdx = (row * canvas.width + col) * 4;
      const r = imgData[pIdx] / 255;
      const g = imgData[pIdx + 1] / 255;
      const b = imgData[pIdx + 2] / 255;

      photoColors[i * 3] = r;
      photoColors[i * 3 + 1] = g;
      photoColors[i * 3 + 2] = b;

      const randomVertexIdx = Math.floor(Math.random() * vertexCount) * 3;
      let xPos = modelVertices[randomVertexIdx];
      let yPos = modelVertices[randomVertexIdx + 1];
      let zPos = modelVertices[randomVertexIdx + 2];

      if (yPos < -0.3) {
        yPos = -0.3;
      }

      hologramPositions[i * 3] = xPos;
      hologramPositions[i * 3 + 1] = yPos + 0.5;
      hologramPositions[i * 3 + 2] = zPos;

      holoNeonColors[i * 3] = 0.0;
      holoNeonColors[i * 3 + 1] = 1.0;
      holoNeonColors[i * 3 + 2] = 0.8;

      const brightnessBoost = 1.3;
      holoRealColors[i * 3] = Math.min(r * brightnessBoost, 1.0);
      holoRealColors[i * 3 + 1] = Math.min(g * brightnessBoost, 1.0);
      holoRealColors[i * 3 + 2] = Math.min(b * brightnessBoost, 1.0);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(photoPositions), 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(photoColors), 3),
    );

    const material = new THREE.PointsMaterial({
      size: 0.008,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    hologramPoints = new THREE.Points(geometry, material);
    scene.add(hologramPoints);

    startTransformationLoopFixed();
    animate();
  }

  let tl;

  function startTransformationLoopFixed() {
    tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    tl.to(
      {},
      {
        duration: 2,
        onStart: () => {
          statusText.innerText = "Transmisja 2D stabilna.";
        },
      },
    );

    tl.to(animationState, {
      morph: 1,
      duration: 3,
      ease: "power2.inOut",
      onStart: () => {
        statusText.innerText = "Inicjalizacja skanowania 3D...";
      },
    });
    tl.to(animationState, { colorMode: 1, duration: 1.5, ease: "linear" }, "<");

    tl.to(
      hologramPoints.rotation,
      {
        y: Math.PI * 2,
        duration: 6,
        ease: "power1.inOut",
        onStart: () => {
          statusText.innerText = "Hologram zsynchronizowany.";
        },
      },
      "-=1",
    );

    tl.to(
      animationState,
      {
        colorMode: 2,
        meshOpacity: 1,
        duration: 2.0,
        ease: "power2.out",
        onStart: () => {
          statusText.innerText = "Przywracanie struktury [SUKCES].";
        },
      },
      "-=3.0",
    );

    tl.to({}, { duration: 2 });

    tl.to(animationState, {
      morph: 0,
      colorMode: 0,
      meshOpacity: 0,
      duration: 2,
      ease: "power2.inOut",
      onStart: () => {
        statusText.innerText = "Resetowanie matrycy...";
      },
    });
    tl.to(
      hologramPoints.rotation,
      { y: 0, duration: 2, ease: "power2.inOut" },
      "<",
    );
  }

  let animationFrameId;

  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    if (hologramPoints) {
      const posAttr = hologramPoints.geometry.attributes.position;
      const colAttr = hologramPoints.geometry.attributes.color;

      const m = animationState.morph;
      const c = animationState.colorMode;

      if (solidMesh) {
        solidMesh.visible = animationState.meshOpacity > 0;
        const currentOpacity = animationState.meshOpacity;

        if (Array.isArray(solidMesh.material)) {
          solidMesh.material.forEach((mat) => {
            mat.opacity = currentOpacity;
            mat.depthWrite = currentOpacity > 0.9;
          });
        } else {
          solidMesh.material.opacity = currentOpacity;
          solidMesh.material.depthWrite = currentOpacity > 0.9;
        }
        solidMesh.rotation.y = hologramPoints.rotation.y;
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        posAttr.array[i3] =
          photoPositions[i3] + (hologramPositions[i3] - photoPositions[i3]) * m;
        posAttr.array[i3 + 1] =
          photoPositions[i3 + 1] +
          (hologramPositions[i3 + 1] - photoPositions[i3 + 1]) * m;
        posAttr.array[i3 + 2] =
          photoPositions[i3 + 2] +
          (hologramPositions[i3 + 2] - photoPositions[i3 + 2]) * m;

        if (c <= 1) {
          colAttr.array[i3] =
            photoColors[i3] + (holoNeonColors[i3] - photoColors[i3]) * c;
          colAttr.array[i3 + 1] =
            photoColors[i3 + 1] +
            (holoNeonColors[i3 + 1] - photoColors[i3 + 1]) * c;
          colAttr.array[i3 + 2] =
            photoColors[i3 + 2] +
            (holoNeonColors[i3 + 2] - photoColors[i3 + 2]) * c;
        } else {
          const t2 = c - 1;
          colAttr.array[i3] =
            holoNeonColors[i3] + (holoRealColors[i3] - holoNeonColors[i3]) * t2;
          colAttr.array[i3 + 1] =
            holoNeonColors[i3 + 1] +
            (holoRealColors[i3 + 1] - holoNeonColors[i3 + 1]) * t2;
          colAttr.array[i3 + 2] =
            holoNeonColors[i3 + 2] +
            (holoRealColors[i3 + 2] - holoNeonColors[i3 + 2]) * t2;
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  const handleResize = () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener("resize", handleResize);

  return function cleanup() {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(animationFrameId);
    if (tl) tl.kill();
    renderer.dispose();
  };
}
