/**
 * HUNAR — live WebGL backdrop (Three.js r128, global build)
 *
 * - A particle "farmland" terrain that ripples with the microphone level.
 * - A voice orb (displaced point sphere + fresnel core + orbit rings + trade satellites)
 *   that sits beside the hero, then docks in the corner as an assistant while you scroll.
 * - window.HUNAR_FX = { level, burst() } is the bridge used by app.js.
 */
(function () {
  const FX = (window.HUNAR_FX = { level: 0, burst() { burst = 1; }, ready: false });
  let burst = 0;

  const canvas = document.getElementById('bg3d');
  if (!canvas || !window.THREE) { document.body.classList.add('no-webgl'); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.body.classList.add('no-webgl');
    return;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  // ---------------------------------------------------------------- terrain
  const terrainGeo = new THREE.PlaneGeometry(46, 26, 180, 100);
  const terrainMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uAudio: { value: 0 }, uPix: { value: DPR }, uFade: { value: 1 } },
    vertexShader: `
      uniform float uTime; uniform float uAudio; uniform float uPix;
      varying float vH; varying float vFog;
      void main() {
        vec3 p = position;
        float w = sin(p.x * 0.45 + uTime * 0.6) * 0.45
                + sin(p.y * 0.8 - uTime * 0.4) * 0.35
                + sin((p.x + p.y) * 0.25 + uTime * 0.25) * 0.6;
        float d = length(p.xy);
        w += sin(d * 1.4 - uTime * 3.0) * uAudio * 1.6 * exp(-d * 0.1);
        p.z += w;
        vH = w;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vFog = smoothstep(30.0, 5.0, -mv.z);
        gl_PointSize = uPix * (20.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uFade; varying float vH; varying float vFog;
      void main() {
        float a = smoothstep(0.5, 0.08, length(gl_PointCoord - 0.5));
        vec3 col = mix(vec3(0.16, 0.18, 0.56), vec3(0.91, 0.25, 0.17), smoothstep(-0.4, 1.3, vH));
        gl_FragColor = vec4(col, a * vFog * uFade * 0.85);
      }`
  });
  const terrain = new THREE.Points(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2.25;
  terrain.position.set(0, -3.1, -4);
  scene.add(terrain);

  // ---------------------------------------------------------------- orb
  const orb = new THREE.Group();
  scene.add(orb);

  const shellUniforms = { uTime: { value: 0 }, uAudio: { value: 0 }, uBurst: { value: 0 }, uPix: { value: DPR } };
  const shell = new THREE.Points(
    new THREE.IcosahedronGeometry(1.55, 18),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: shellUniforms,
      vertexShader: `
        uniform float uTime; uniform float uAudio; uniform float uBurst; uniform float uPix;
        varying float vD;
        void main() {
          vec3 n = normalize(position);
          float t = uTime * 0.7;
          float d = sin(n.x * 4.0 + t) * sin(n.y * 4.0 + t * 1.3) * sin(n.z * 4.0 + t * 0.8);
          d += 0.5 * sin(n.x * 9.0 - t * 1.7) * sin(n.y * 8.0 + t) * sin(n.z * 10.0 + t * 1.2);
          float amp = 0.16 + uAudio * 0.7 + uBurst * 0.55;
          vec3 p = position + n * d * amp + n * uBurst * 0.25;
          vD = d;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uPix * (1.5 + uAudio * 2.5 + uBurst * 2.0) * (7.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying float vD;
        void main() {
          float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
          vec3 col = mix(vec3(0.10, 0.07, 0.06), vec3(0.91, 0.25, 0.17), smoothstep(-0.2, 0.8, vD));
          gl_FragColor = vec4(col, a * 0.95);
        }`
    })
  );
  orb.add(shell);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.12, 48, 48),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: shellUniforms,
      vertexShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uAudio; uniform float uBurst;
        varying vec3 vN; varying vec3 vV;
        void main() {
          float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
          vec3 col = mix(vec3(1.0, 0.72, 0.18), vec3(0.95, 0.42, 0.08), f);
          col = mix(col, vec3(0.16, 0.18, 0.56), (uAudio * 0.6 + uBurst * 0.9) * f);
          gl_FragColor = vec4(col, 0.96);
        }`
    })
  );
  orb.add(core);

  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.05 + i * 0.38, 0.016, 8, 200),
      new THREE.MeshBasicMaterial({ color: i === 1 ? 0xe8412c : 0x1a1210, transparent: true, opacity: 0.9 - i * 0.15 })
    );
    ring.rotation.set(Math.PI / 2 + (i - 1) * 0.5, i * 0.7, 0);
    rings.push(ring);
    orb.add(ring);
  }

  // Satellites: one per trade sector
  const satColors = [0x2a2f8f, 0x1d7a4b, 0xe8412c, 0xff7eb6, 0xffa30f, 0x1a1210];
  const sats = satColors.map((c, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), new THREE.MeshBasicMaterial({ color: c }));
    m.userData = { r: 2.05 + (i % 3) * 0.38, speed: 0.35 + i * 0.09, phase: i * 1.05, ring: rings[i % 3] };
    orb.add(m);
    return m;
  });

  // Shockwave on successful match
  const wave = new THREE.Mesh(
    new THREE.RingGeometry(0.96, 1.0, 96),
    new THREE.MeshBasicMaterial({ color: 0xe8412c, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
  );
  orb.add(wave);

  // ---------------------------------------------------------------- dust
  const dustCount = 700;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 34;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0x1a1210, size: 0.05, transparent: true, opacity: 0.28, depthWrite: false
  }));
  scene.add(dust);

  // ---------------------------------------------------------------- layout
  let halfW = 5, halfH = 3.7, desktop = true;
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    halfW = halfH * camera.aspect;
    desktop = w >= 1024;
  }
  window.addEventListener('resize', resize);
  resize();

  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const ease = (t) => t * t * (3 - 2 * t);

  let audio = 0, time = 0, last = performance.now();
  const camTarget = { x: 0, y: 0 };

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += reduced ? 0 : dt;

    // Smoothed audio level + burst decay
    audio = lerp(audio, FX.level || 0, 0.18);
    burst = Math.max(0, burst - dt * 0.9);

    const p = ease(clamp01(window.scrollY / (window.innerHeight * 0.9)));

    // Orb: hero position -> docked assistant in the bottom-right corner
    const heroX = desktop ? halfW * 0.5 : 0;
    const heroY = desktop ? 0.15 : halfH * 0.42;
    const heroS = desktop ? Math.min(1.25, halfW / 4.6) : 0.62;
    const dockX = halfW - (desktop ? 1.15 : 0.75);
    const dockY = -halfH + (desktop ? 1.15 : 0.8);
    const dockS = desktop ? 0.3 : 0.2;
    orb.position.x = lerp(heroX, dockX, p);
    orb.position.y = lerp(heroY, dockY, p) + Math.sin(time * 0.9) * 0.08;
    const s = lerp(heroS, dockS, p) * (1 + audio * 0.25 + burst * 0.35);
    orb.scale.setScalar(s);

    shell.rotation.y += dt * (0.18 + audio * 1.4);
    shell.rotation.x += dt * 0.07;
    rings.forEach((r, i) => { r.rotation.z += dt * (0.25 + i * 0.12) * (i % 2 ? -1 : 1); r.rotation.x += dt * 0.05; });
    sats.forEach((m) => {
      const u = m.userData, a = time * u.speed + u.phase;
      m.position.set(Math.cos(a) * u.r, Math.sin(a) * u.r, 0).applyEuler(u.ring.rotation);
    });

    // Shockwave
    wave.quaternion.copy(camera.quaternion);
    const wv = 1 - burst;
    wave.scale.setScalar(1.2 + wv * 4.5);
    wave.material.opacity = burst > 0 ? burst * 0.9 : 0;

    shellUniforms.uTime.value = time;
    shellUniforms.uAudio.value = audio;
    shellUniforms.uBurst.value = burst;
    terrainMat.uniforms.uTime.value = time;
    terrainMat.uniforms.uAudio.value = audio + burst * 0.6;
    terrainMat.uniforms.uFade.value = lerp(1, 0.5, p);

    dust.rotation.y = time * 0.012;
    dust.position.y = (time * 0.12) % 2;

    // Camera parallax + scroll dolly
    camTarget.x = lerp(camTarget.x, mouse.x * 0.55, 0.05);
    camTarget.y = lerp(camTarget.y, -mouse.y * 0.35, 0.05);
    camera.position.x = camTarget.x;
    camera.position.y = camTarget.y + p * 0.6;
    camera.lookAt(0, -p * 0.5, 0);

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  FX.ready = true;
})();
