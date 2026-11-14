// SPDX-License-Identifier: Apache-2.0
// The home page's 3D Pixel 3a XL: an extruded rounded body with the real neoui home frame on its screen.
// Needs THREE (r152 UMD) loaded first. Without WebGL the static frame stays visible instead.
(function () {
  const canvas = document.getElementById('hero');
  if (!canvas || !window.THREE) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return; // the <img> fallback inside the figure stays shown
  }
  canvas.parentNode.classList.add('webgl');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  cam.position.set(0, 0.2, 7.2);

  const w = 1.9, h = 3.72, r = 0.28, d = 0.16;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 4, curveSegments: 16 }),
    new THREE.MeshStandardMaterial({ color: 0x1f2735, metalness: 0.6, roughness: 0.35 })
  );
  body.position.z = -d / 2;

  // The screen is 1:2, like the phone's 1080x2160.
  const tex = new THREE.TextureLoader().load(canvas.dataset.screen);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.22, (w - 0.22) * 2), new THREE.MeshBasicMaterial({ map: tex }));
  screen.position.z = d + 0.035;

  const phone = new THREE.Group();
  phone.add(body, screen);
  scene.add(phone);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.1); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xf2b36e, 0.9); rim.position.set(-4, -2, -3); scene.add(rim);

  function resize() {
    const p = canvas.parentNode.getBoundingClientRect();
    renderer.setSize(p.width, p.height, false);
    cam.aspect = p.width / p.height;
    cam.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  const still = matchMedia('(prefers-reduced-motion: reduce)');
  function frame(t) {
    if (!still.matches) phone.rotation.y = Math.sin(t / 2600) * 0.45;
    renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
