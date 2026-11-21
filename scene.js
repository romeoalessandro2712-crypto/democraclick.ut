// scene.js — the single persistent WebGL canvas ("L'Agorà").
// Loaded dynamically by main.js. If this module or WebGL fails, main.js stays in 2D mode.
// Three.js is imported lazily (loadThree) so that a CDN or WebGL failure can never take
// the rest of the page down, even when everything is bundled into one file.
let THREE, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass, RoomEnvironment, V3;

export async function loadThree() {
  const m = await Promise.all([
    import('three'),
    import('three/addons/postprocessing/EffectComposer.js'),
    import('three/addons/postprocessing/RenderPass.js'),
    import('three/addons/postprocessing/UnrealBloomPass.js'),
    import('three/addons/postprocessing/ShaderPass.js'),
    import('three/addons/postprocessing/OutputPass.js'),
    import('three/addons/environments/RoomEnvironment.js'),
  ]);
  THREE = m[0];
  ({ EffectComposer } = m[1]); ({ RenderPass } = m[2]); ({ UnrealBloomPass } = m[3]);
  ({ ShaderPass } = m[4]); ({ OutputPass } = m[5]); ({ RoomEnvironment } = m[6]);
  V3 = THREE.Vector3;
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (dt, rate) => 1 - Math.exp(-dt * rate);

// Scene palette per theme. Kept in sync with the CSS tokens in styles.css (--paper / --ink).
const PALETTE = {
  // paper #F7F5F0 / ink #121A22 / petrol teal #0E4A5A hairlines (light); ink ground, cyan hairlines (dark)
  light: { bg: '#efede6', floor: '#efede6', line: '#0E4A5A', orb: '#8a989c', column: '#e2e5e1', shadow: '#0E2A33', key: 1.9, hemi: 1.65, lineOp: 0.26 },
  dark:  { bg: '#0B1218', floor: '#0c141a', line: '#8FD3E0', orb: '#c6d1d4', column: '#14212a', shadow: '#000000', key: 1.3, hemi: 0.55, lineOp: 0.15 },
};

function radialTexture(size = 128, inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Screen-space shockwave + film grain. One pass, cheap.
const rippleShader = () => ({
  uniforms: {
    tDiffuse: { value: null },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uProgress: { value: 1 },
    uStrength: { value: 0 },
    uAspect: { value: 1 },
    uTime: { value: 0 },
    uGrain: { value: 0.035 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse; uniform vec2 uCenter; uniform float uProgress;
    uniform float uStrength; uniform float uAspect; uniform float uTime; uniform float uGrain;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec2 d = uv - uCenter; d.x *= uAspect;
      float dist = length(d);
      float radius = uProgress * 1.5;
      float w = smoothstep(0.14, 0.0, abs(dist - radius)) * (1.0 - uProgress) * uStrength;
      vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
      dir.x /= uAspect;
      uv -= dir * w * 0.03;
      vec4 c = texture2D(tDiffuse, uv);
      c.rgb += w * 0.05;
      float n = fract(sin(dot(vUv * vec2(12.9898, 78.233) + fract(uTime) * 7.0, vec2(1.0, 1.0))) * 43758.5453);
      c.rgb += (n - 0.5) * uGrain;
      gl_FragColor = c;
    }`,
});

/**
 * @param {object} o
 * @param {HTMLCanvasElement} o.canvas
 * @param {object} o.tune         tunables (see main.js TUNE)
 * @param {string} o.theme        'light' | 'dark'
 * @param {boolean} o.reducedMotion
 * @param {number} o.orbCount
 * @param {object} o.views        { home, partiti, dati, fonti, metodo, community } view factories from worlds/*.js
 * @param {HTMLElement} o.labelsRoot  overlay for aria-hidden 3D labels
 * @param {function} o.getLang
 * @param {object} o.gsap
 */
export function createScene(o) {
  const { canvas, tune, gsap, labelsRoot } = o;
  let reducedMotion = o.reducedMotion;

  // ---------- renderer ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.NoToneMapping; // keeps the paper/ink colours exact
  let dprCap = tune.quality.dprCap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));

  const scene = new THREE.Scene();
  const bg = new THREE.Color(PALETTE.light.bg);
  scene.background = bg;
  scene.fog = new THREE.FogExp2(bg.clone(), 0.05);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(renderer), 0.04);
  scene.environment = envRT.texture;
  pmrem.dispose();

  // ---------- light ----------
  const hemi = new THREE.HemisphereLight(0xffffff, 0x7d8a88, 1);
  const key = new THREE.DirectionalLight(0xfff6e8, 2);
  key.position.set(-4, 9, 6);
  scene.add(hemi, key);

  // "levels" let HOME light the scene word by word. 1 = fully lit.
  const levels = { key: 1, env: 1, arch: 1 };

  // ---------- architecture: floor, tiers, columns ----------
  // Architecture ignores the environment map so the floor reads as the same paper as the sky.
  const floorMat = new THREE.MeshStandardMaterial({ color: PALETTE.light.floor, roughness: 1, metalness: 0, envMapIntensity: 0 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const lineMat = new THREE.LineBasicMaterial({ color: PALETTE.light.line, transparent: true, opacity: PALETTE.light.lineOp, fog: true });
  const tierMat = new THREE.MeshStandardMaterial({ color: PALETTE.light.floor, roughness: 0.95, envMapIntensity: 0 });
  const arch = new THREE.Group();
  const tierGeos = [];
  for (let k = 0; k < 4; k++) {
    const r0 = 6.2 + k * 0.9, r1 = r0 + 0.9, y = 0.12 + k * 0.16;
    const g = new THREE.RingGeometry(r0, r1, 96, 1, Math.PI, Math.PI); // back half only
    tierGeos.push(g);
    const m = new THREE.Mesh(g, tierMat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    arch.add(m);
    const pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = Math.PI + (i / 96) * Math.PI;
      pts.push(new V3(Math.cos(a) * r0, y + 0.002, Math.sin(a) * r0));
    }
    const lg = new THREE.BufferGeometry().setFromPoints(pts);
    tierGeos.push(lg);
    arch.add(new THREE.Line(lg, lineMat));
  }
  // concentric floor circles (full) — the "agorà" plan
  for (const r of [2.0, 4.6]) {
    const pts = [];
    for (let i = 0; i <= 128; i++) { const a = (i / 128) * Math.PI * 2; pts.push(new V3(Math.cos(a) * r, 0.004, Math.sin(a) * r)); }
    const lg = new THREE.BufferGeometry().setFromPoints(pts);
    tierGeos.push(lg);
    arch.add(new THREE.Line(lg, lineMat));
  }
  scene.add(arch);

  const colCount = 15;
  const colMat = new THREE.MeshStandardMaterial({ color: PALETTE.light.column, roughness: 0.9, envMapIntensity: 0 });
  const columns = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.1, 0.1, 8, 12), colMat, colCount);
  {
    const d = new THREE.Object3D();
    for (let i = 0; i < colCount; i++) {
      const a = Math.PI + 0.15 + (i / (colCount - 1)) * (Math.PI - 0.3);
      d.position.set(Math.cos(a) * 10.5, 4 + 0.64, Math.sin(a) * 10.5);
      d.updateMatrix();
      columns.setMatrixAt(i, d.matrix);
    }
    columns.instanceMatrix.needsUpdate = true;
  }
  scene.add(columns);

  // ---------- orb field (shared by HOME and PARTITI) ----------
  // NEUTRALITY: one geometry, one material, identical scale and motion for every orb.
  const N = o.orbCount;
  const orbGeo = new THREE.SphereGeometry(0.42, 48, 32);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: PALETTE.light.orb, roughness: 0.06, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05,
    transparent: true, opacity: 0.92, ior: 1.45, iridescence: 0.3, iridescenceIOR: 1.3, envMapIntensity: 1, sheen: 0.4, sheenColor: 0xffffff,
  });
  const orbMesh = new THREE.InstancedMesh(orbGeo, orbMat, N);
  orbMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  orbMesh.frustumCulled = false;
  const orbState = Array.from({ length: N }, (_, i) => ({
    p: new V3(0, 1, 0), tp: new V3(0, 1, 0), s: 0, ts: 1, dim: 1, tdim: 1, phase: (i / N) * Math.PI * 2, hover: 0,
    tint: new THREE.Color(1, 1, 1), ttint: new THREE.Color(1, 1, 1), // party tint (PARTITI only)
  }));
  const white = new THREE.Color(1, 1, 1);
  for (let i = 0; i < N; i++) orbMesh.setColorAt(i, white);
  scene.add(orbMesh);

  const shadowTex = radialTexture(128, 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)');
  const shadowMat = new THREE.MeshBasicMaterial({ color: PALETTE.light.shadow, alphaMap: shadowTex, transparent: true, depthWrite: false, opacity: 0.32 });
  const shadowGeo = new THREE.PlaneGeometry(1, 1);
  const shadows = new THREE.InstancedMesh(shadowGeo, shadowMat, N + 1);
  shadows.frustumCulled = false;
  scene.add(shadows);

  let breathSync = false; // PARTITI sets this true: identical phase for every orb
  const orbs = {
    count: N,
    state: orbState,
    mesh: orbMesh,
    material: orbMat,
    setSync(v) { breathSync = v; },
    ring(radius = 3.4, y = 1.0, rot = 0) {
      return orbState.map((_, i) => {
        const a = rot + (i / N) * Math.PI * 2;
        return new V3(Math.cos(a) * radius, y, Math.sin(a) * radius);
      });
    },
    hemicycle(radius = 4.6, y = 1.0) {
      return orbState.map((_, i) => {
        const a = Math.PI + 0.3 + (N === 1 ? 0.5 : i / (N - 1)) * (Math.PI - 0.6);
        return new V3(Math.cos(a) * radius, y, Math.sin(a) * radius * 0.82 - 0.4);
      });
    },
  };

  // ---------- shared transient: floor shockwave ----------
  const shockMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const shock = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 128), shockMat);
  shock.rotation.x = -Math.PI / 2;
  shock.position.y = 0.02;
  scene.add(shock);

  // ---------- accent + fog (per world) ----------
  const accent = new THREE.Color('#0E4A5A');
  const glow = new THREE.Color(tune.glow || '#E9A944');
  const accentTarget = accent.clone();
  let fogTarget = 0.05;

  // ---------- post ----------
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // threshold > 1: only HDR emissive (the Click orb) blooms, never the paper
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.7, 1.0);
  composer.addPass(bloom);
  const ripplePass = new ShaderPass(rippleShader());
  composer.addPass(ripplePass);
  composer.addPass(new OutputPass());
  const RU = ripplePass.uniforms;

  // ---------- theme ----------
  const themeMix = { v: o.theme === 'dark' ? 1 : 0 };
  const tmpA = new THREE.Color(), tmpB = new THREE.Color();
  const mixC = (k, t) => tmpA.set(PALETTE.light[k]).lerp(tmpB.set(PALETTE.dark[k]), t);
  const mixN = (k, t) => PALETTE.light[k] + (PALETTE.dark[k] - PALETTE.light[k]) * t;
  const cur = { bg: new THREE.Color(), orb: new THREE.Color(), lineOp: 0.2, key: 2, hemi: 1 };
  function applyPalette() {
    const t = themeMix.v;
    cur.bg.copy(mixC('bg', t));
    bg.copy(cur.bg);
    scene.fog.color.copy(cur.bg);
    floorMat.color.copy(mixC('floor', t));
    tierMat.color.copy(floorMat.color);
    colMat.color.copy(mixC('column', t));
    lineMat.color.copy(mixC('line', t));
    shadowMat.color.copy(mixC('shadow', t));
    cur.orb.copy(mixC('orb', t));
    orbMat.color.copy(cur.orb);
    cur.lineOp = mixN('lineOp', t);
    cur.key = mixN('key', t);
    cur.hemi = mixN('hemi', t);
    hemi.groundColor.set(t > 0.5 ? 0x14222a : 0x7d8a88);
  }
  applyPalette();

  // ---------- camera rig ----------
  const rig = { pos: new V3(0, 2, 10.5), target: new V3(0, 1, 0) };
  // viewShift: fraction of screen width the focus moves left (to clear a side panel)
  const shift = { v: 0, t: 0, yv: 0, yt: 0 }; // yt: fraction of screen height the focus moves up (phone sheets)
  const par = { yaw: 0, pitch: 0, tyaw: 0, tpitch: 0 };
  let flight = null;

  function flyTo(pose, opts = {}) {
    if (typeof poke === 'function') poke();
    if (flight) { flight.kill(); flight = null; }
    shift.t = pose.shift || 0;
    shift.yt = pose.shiftY || 0;
    if (reducedMotion || opts.instant) { shift.v = shift.t; shift.yv = shift.yt; }
    const toP = pose.pos.clone(), toT = pose.target.clone();
    if (reducedMotion || opts.instant) {
      rig.pos.copy(toP); rig.target.copy(toT);
      return 0;
    }
    const fromP = rig.pos.clone(), fromT = rig.target.clone();
    const dist = fromP.distanceTo(toP);
    const mid = fromP.clone().lerp(toP, 0.5);
    mid.y += dist * 0.16;
    const out = new V3(mid.x, 0, mid.z);
    if (out.lengthSq() > 0.01) mid.addScaledVector(out.normalize(), dist * 0.1);
    const curve = new THREE.CatmullRomCurve3([fromP, mid, toP], false, 'centripetal');
    const t = tune.motion;
    const dur = opts.duration ?? clamp(t.flightMin + dist * 0.04, t.flightMin, t.flightMax);
    const prog = { u: 0 };
    flight = gsap.to(prog, {
      u: 1, duration: dur, ease: 'power3.inOut',
      onUpdate() { curve.getPoint(prog.u, rig.pos); rig.target.lerpVectors(fromT, toT, prog.u); },
      onComplete() { flight = null; },
    });
    return dur;
  }

  // ---------- projection for HTML labels/buttons ----------
  const size = { w: 1, h: 1 };
  const projV = new V3();
  function project(v, out = {}) {
    projV.copy(v).project(camera);
    out.x = (projV.x * 0.5 + 0.5) * size.w;
    out.y = (-projV.y * 0.5 + 0.5) * size.h;
    out.visible = projV.z < 1 && projV.z > -1;
    return out;
  }

  // ---------- views (worlds) ----------
  const ctx = {
    THREE, gsap, scene, camera, rig, flyTo, orbs, project, labelsRoot, tune, accent, glow, levels,
    getLang: o.getLang, isNarrow: () => size.w < 760, aspect: () => size.w / size.h,
    dark: () => themeMix.v, // 0 = paper, 1 = ink (animated)
    bgColor: cur.bg,        // live fog/background colour, for fading things into the air
    /** camera distance so that half-width `hw` fits across `usable` of the screen width */
    fitDist(hw, margin = 1.1, usable = 1) {
      const hfov = 2 * Math.atan(Math.tan((camera.fov * Math.PI) / 360) * (size.w / size.h) * usable);
      return (hw / Math.tan(hfov / 2)) * margin;
    },
    get reducedMotion() { return reducedMotion; },
    shockwave(at) {
      if (reducedMotion) return;
      shock.position.x = at.x; shock.position.z = at.z;
      shockMat.color.copy(glow);
      gsap.killTweensOf(shock.scale); gsap.killTweensOf(shockMat);
      shock.scale.setScalar(0.3);
      shockMat.opacity = 0.55;
      gsap.to(shock.scale, { x: 14, y: 14, z: 14, duration: 1.4, ease: 'power2.out' });
      gsap.to(shockMat, { opacity: 0, duration: 1.4, ease: 'power1.in' });
    },
    emit: () => {},
  };
  const views = {};
  for (const k in o.views) views[k] = o.views[k](ctx);
  let world = null;

  function setWorld(id, opts = {}) {
    const next = views[id] || views.home;
    const prev = world ? (views[world] || views.home) : null;
    if (prev) prev.leave(id);
    world = id;
    next.enter(id, opts);
    return flyTo(next.pose(id), opts);
  }

  // ---------- picking ----------
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  function pick(x, y) {
    ndc.set((x / size.w) * 2 - 1, -(y / size.h) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const v = views[world] || views.home;
    const targets = v.pickables ? v.pickables() : [];
    if (!targets.length) return null;
    orbMesh.boundingSphere = null; // instances move; force a fresh bound
    const hits = ray.intersectObjects(targets, false);
    if (!hits.length) return null;
    const h = hits[0];
    return v.resolve ? v.resolve(h) : null;
  }

  // ---------- ripple ----------
  function ripple(x, y, strength = 1) {
    poke();
    if (reducedMotion) return;
    RU.uCenter.value.set(x / size.w, 1 - y / size.h);
    RU.uStrength.value = strength;
    gsap.killTweensOf(RU.uProgress);
    gsap.fromTo(RU.uProgress, { value: 0 }, { value: 1, duration: tune.motion.ripple, ease: 'power2.out' });
  }

  // ---------- quality tiers ----------
  // 2 = full, 1 = no bloom, 0 = no bloom, no grain, no columns, DPR 1
  let tier = 2;
  let ema = 16, slow = 0;
  function setTier(n) {
    tier = n;
    bloom.enabled = n >= 2;
    RU.uGrain.value = n >= 1 ? tune.quality.grain : 0;
    columns.visible = n >= 1;
    if (n === 0) { dprCap = 1; resize(); }
    document.documentElement.dataset.quality = String(n);
  }
  setTier(tune.quality.startTier ?? 2);

  // ---------- resize ----------
  function resize() {
    size.w = window.innerWidth; size.h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(size.w, size.h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(size.w, size.h);
    bloom.resolution.set(size.w, size.h);
    camera.aspect = size.w / size.h;
    camera.updateProjectionMatrix();
    RU.uAspect.value = size.w / size.h;
    const v = world && (views[world] || views.home);
    if (v && v.onResize) v.onResize();
  }
  window.addEventListener('resize', resize);
  resize();

  // ---------- frame ----------
  const dummy = new THREE.Object3D();
  const instCol = new THREE.Color();
  const offset = new V3(), axis = new V3(), UP = new V3(0, 1, 0);
  let time = 0, last = 0, raf = 0, running = false;
  const frameCbs = [];

  function update(dt) {
    time += dt;
    RU.uTime.value = time;

    // camera with parallax (±8° max)
    const pk = damp(dt, 3);
    par.yaw += (par.tyaw - par.yaw) * pk;
    par.pitch += (par.tpitch - par.pitch) * pk;
    offset.copy(rig.pos).sub(rig.target);
    offset.applyAxisAngle(UP, par.yaw);
    axis.copy(offset).cross(UP).normalize();
    if (axis.lengthSq() > 0) offset.applyAxisAngle(axis, par.pitch);
    camera.position.copy(rig.target).add(offset);
    camera.lookAt(rig.target);
    shift.v += (shift.t - shift.v) * damp(dt, 2.6);
    shift.yv += (shift.yt - shift.yv) * damp(dt, 2.6);
    camera.filmOffset = shift.v * 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * camera.getFilmWidth();
    camera.updateProjectionMatrix();
    if (Math.abs(shift.yv) > 1e-4) {
      // vertical lens shift: move the image up by yv of the screen height (picking stays exact)
      camera.projectionMatrix.elements[9] -= 2 * shift.yv;
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    }

    // accent + fog drift toward the current world's values
    accent.lerp(accentTarget, damp(dt, 2.5));
    const camDist = Math.max(0.1, rig.pos.distanceTo(rig.target));
    const fogEff = fogTarget * clamp(10.5 / camDist, 0.4, 1.4);
    scene.fog.density += (fogEff - scene.fog.density) * damp(dt, 2);

    // lights follow HOME's word-by-word levels
    key.intensity = cur.key * (0.3 + 0.7 * levels.key);
    hemi.intensity = cur.hemi * (0.55 + 0.45 * levels.key);
    orbMat.envMapIntensity = 0.25 + 0.95 * levels.env;
    // glow reads as light on ink, as haze on paper: scale it with the theme
    bloom.strength = 0.12 + 0.48 * themeMix.v;
    lineMat.opacity = cur.lineOp * (0.15 + 0.85 * levels.arch);

    const v = views[world] || views.home;
    for (const id in views) { const w = views[id]; w.update && w.update(time, dt, w === v); }

    // orbs
    const k = damp(dt, 4.2);
    for (let i = 0; i < N; i++) {
      const s = orbState[i];
      s.p.lerp(s.tp, k);
      s.s += (s.ts - s.s) * k;
      s.dim += (s.tdim - s.dim) * k;
      const ph = breathSync ? 0 : s.phase;
      const breath = 1 + tune.motion.breath * Math.sin(time * 0.9 + ph);
      dummy.position.copy(s.p);
      dummy.position.y += Math.sin(time * 0.7 + ph) * 0.05;
      dummy.scale.setScalar(Math.max(0.0001, s.s * breath * (1 + s.hover * 0.08)));
      dummy.updateMatrix();
      orbMesh.setMatrixAt(i, dummy.matrix);
      // dimming fades toward the fog colour, not toward black (no "loser" look)
      const f = 1 - s.dim;
      // Receding never brightens an orb (a brighter orb would read as emphasis).
      // On paper it simply keeps its tone and sinks into the fog; on ink it darkens toward the fog.
      const toward = (c) => Math.min(1, c);
      instCol.setRGB(
        1 + (toward(cur.bg.r / Math.max(cur.orb.r, 0.01)) - 1) * f,
        1 + (toward(cur.bg.g / Math.max(cur.orb.g, 0.01)) - 1) * f,
        1 + (toward(cur.bg.b / Math.max(cur.orb.b, 0.01)) - 1) * f,
      );
      s.tint.lerp(s.ttint, k);
      instCol.multiply(s.tint);
      orbMesh.setColorAt(i, instCol);
      dummy.position.set(s.p.x, 0.012, s.p.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.scale.setScalar(Math.max(0.0001, 1.5 * s.s * s.dim));
      dummy.updateMatrix();
      shadows.setMatrixAt(i, dummy.matrix);
      dummy.rotation.set(0, 0, 0);
    }
    const extra = v.shadowFor ? v.shadowFor() : null;
    dummy.position.set(extra ? extra.x : 0, 0.012, extra ? extra.z : 0);
    dummy.rotation.set(-Math.PI / 2, 0, 0);
    dummy.scale.setScalar(extra ? Math.max(0.0001, extra.s) : 0.0001);
    dummy.updateMatrix();
    shadows.setMatrixAt(N, dummy.matrix);
    dummy.rotation.set(0, 0, 0);
    orbMesh.instanceMatrix.needsUpdate = true;
    orbMesh.instanceColor.needsUpdate = true;
    shadows.instanceMatrix.needsUpdate = true;

    for (const cb of frameCbs) cb(time, dt);
  }

  // Idle throttling: after 4 s without input or camera motion, the slow ambient motion is drawn
  // at ~30 fps instead of 60, halving GPU/CPU work (and battery) while nothing changes.
  let lastActive = performance.now();
  const poke = () => { lastActive = performance.now(); };

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const idle = !flight && now - lastActive > 4000;
    if (idle && last && now - last < 31) return;
    const ms = last ? now - last : 16;
    last = now;
    const dt = Math.min(ms / 1000, 0.05);
    update(dt);
    composer.render(dt);

    // adaptive quality: drop a tier after ~1.5 s above the frame budget (measured only at full rate)
    if (!idle) {
      ema += (ms - ema) * 0.08;
      if (ema > tune.quality.frameBudget) { if (++slow > 90 && tier > 0) { setTier(tier - 1); slow = 0; ema = 16; } }
      else slow = Math.max(0, slow - 2);
    }
  }

  function start() { if (running) return; running = true; last = 0; poke(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  return {
    renderer, camera, ctx,
    start, stop, resize, setWorld, pick, ripple, poke: () => poke(),
    view: (id) => views[id],
    onFrame(cb) { frameCbs.push(cb); },
    setTheme(theme, instant) {
      const to = theme === 'dark' ? 1 : 0;
      gsap.killTweensOf(themeMix);
      const settle = () => { for (const k in views) views[k].onThemeChange && views[k].onThemeChange(); };
      if (instant || reducedMotion) { themeMix.v = to; applyPalette(); settle(); return; }
      gsap.to(themeMix, { v: to, duration: 0.8, ease: 'power2.inOut', onUpdate: applyPalette, onComplete: settle });
    },
    setAccent(hex, instant) { accentTarget.set(hex); if (instant) accent.copy(accentTarget); },
    setFog(d, instant) { fogTarget = d; if (instant) scene.fog.density = d * clamp(10.5 / Math.max(0.1, rig.pos.distanceTo(rig.target)), 0.4, 1.4); },
    setParallax(nx, ny, max) {
      if (reducedMotion) { par.tyaw = par.tpitch = 0; return; }
      const m = max ?? 0.14; // radians ≈ 8°
      par.tyaw = clamp(-nx * m, -0.14, 0.14);
      par.tpitch = clamp(ny * m * 0.5, -0.07, 0.07);
    },
    setReducedMotion(v) { reducedMotion = v; },
    renderOnce() { update(0.016); composer.render(0.016); },
  };
}
