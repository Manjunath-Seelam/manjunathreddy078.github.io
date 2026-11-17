/**
 * High-Performance 3D Scene Controller
 * Immersive WebGL backdrop using Three.js with scroll-driven camera & mouse parallax.
 */
(function() {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    console.info('WebGL not supported or Three.js missing; falling back to CSS backdrop.');
    return;
  }

  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b16, 0.0018);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 45;
  camera.position.y = 0;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x38bdf8, 2, 80);
  pointLight1.position.set(20, 25, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 80);
  pointLight2.position.set(-20, -20, 15);
  scene.add(pointLight2);

  // Group to rotate together
  const sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  // 1. Particle Galaxy / Constellation
  const particleCount = prefersReducedMotion ? 400 : 1100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x38bdf8); // sky blue
  const color2 = new THREE.Color(0x4b86ff); // sapphire
  const color3 = new THREE.Color(0x8b5cf6); // electric purple

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    // Spread in wide cylindrical volume
    const radius = 25 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 110;

    positions[i3] = Math.cos(theta) * radius;
    positions[i3 + 1] = y;
    positions[i3 + 2] = Math.sin(theta) * radius;

    // Mix particle colors
    const randColor = Math.random();
    const mixed = randColor < 0.4 ? color1 : (randColor < 0.75 ? color2 : color3);
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // High-performance circular particle texture generated procedurally
  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(100,180,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 1.6,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  sceneGroup.add(particles);

  // 2. Floating Geometric Crystal Elements (Low-poly aesthetics)
  const floatingObjects = [];
  const crystalMaterials = [
    new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    }),
    new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    }),
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    })
  ];

  const shapes = [
    new THREE.IcosahedronGeometry(4.2, 0),
    new THREE.OctahedronGeometry(3.5, 0),
    new THREE.TorusGeometry(3.8, 0.8, 8, 24),
    new THREE.TetrahedronGeometry(3.2, 0),
    new THREE.IcosahedronGeometry(2.8, 0)
  ];

  const objectPositions = [
    { x: -28, y: 15, z: -10 },
    { x: 30, y: 5, z: -15 },
    { x: -24, y: -25, z: -8 },
    { x: 26, y: -45, z: -12 },
    { x: -18, y: -65, z: -15 }
  ];

  objectPositions.forEach((pos, idx) => {
    const geom = shapes[idx % shapes.length];
    const mat = crystalMaterials[idx % crystalMaterials.length];
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.012,
      floatSpeed: 0.0015 + Math.random() * 0.001,
      baseY: pos.y,
      offset: Math.random() * Math.PI * 2
    };
    sceneGroup.add(mesh);
    floatingObjects.push(mesh);
  });

  // Mouse tracking with lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Scroll tracking
  let scrollProgress = 0;
  let targetScrollY = 0;

  function updateScroll() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetScrollY = window.scrollY / maxScroll;
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    updateScroll();
  }, { passive: true });

  // Pause rendering when not visible to save GPU & battery
  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isPageVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Lerp mouse
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Lerp scroll
    scrollProgress += (targetScrollY - scrollProgress) * 0.07;

    // Rotate particle system slowly
    if (!prefersReducedMotion) {
      sceneGroup.rotation.y = elapsedTime * 0.04 + mouseX * 0.3;
      sceneGroup.rotation.x = mouseY * 0.2;

      // Scroll camera path: moves gracefully along Y axis through sections
      camera.position.y = -scrollProgress * 55;
      camera.position.z = 45 + Math.sin(scrollProgress * Math.PI * 2) * 5;

      // Point lights orbit
      pointLight1.position.x = 22 * Math.cos(elapsedTime * 0.5);
      pointLight1.position.y = camera.position.y + 15 * Math.sin(elapsedTime * 0.4);

      pointLight2.position.x = -22 * Math.cos(elapsedTime * 0.4);
      pointLight2.position.y = camera.position.y - 15 * Math.sin(elapsedTime * 0.5);

      // Animate floating crystal shards
      floatingObjects.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rotX;
        mesh.rotation.y += mesh.userData.rotY;
        mesh.position.y = mesh.userData.baseY + Math.sin(elapsedTime * 1.5 + mesh.userData.offset) * 1.8;
      });
    }

    renderer.render(scene, camera);
  }

  animate();
})();
