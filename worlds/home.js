// worlds/home.js — HOME: a breathing ring of glass orbs around one glowing "Click" orb.
// Each orb carries a party symbol (same size for all, alphabetical order, the ring keeps turning
// so no party holds a fixed front position), so the page reads at once as a political site.
import { PARTITI } from '../data/partiti.js';
// Two parts: homeUI (DOM, works without WebGL) and homeView (3D, receives THREE via ctx).

/** DOM side: word-by-word hero + the literal "Click" button. */
export function homeUI({ root, gsap, reducedMotion, onWord }) {
  const words = [...root.querySelectorAll('.hero .w')];
  const enter = root.querySelector('#enter-orb');
  let played = false;

  function reveal() {
    gsap.killTweensOf(words);
    if (reducedMotion()) {
      gsap.set(words, { opacity: 1, y: 0 });
      words.forEach((_, i) => onWord(i, true));
      return;
    }
    const first = !played;
    played = true;
    words.forEach((w, i) => {
      gsap.fromTo(w, { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        delay: (first ? 0.05 : 0.15) + i * (first ? 0.32 : 0.18), // text first: it is the page's main content
        onStart: () => onWord(i, false),
      });
    });
  }

  /** Pin the HTML "Click" button over the glowing orb (3D mode only). */
  function place(p) {
    if (!enter) return;
    enter.style.transform = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px) translate(-50%, -50%)`;
  }

  return { reveal, place, enter };
}

/** 3D side. */
export function homeView(ctx) {
  const { THREE, orbs, levels, gsap } = ctx;
  const CENTER = new THREE.Vector3(0, 1.15, 0);

  // The one glowing orb. HDR emissive (> 1) so it is the only thing that blooms.
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: ctx.glow.clone(), roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08,
    emissive: ctx.glow.clone(), emissiveIntensity: 3,
  });
  const clickOrb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 64, 48), orbMat);
  clickOrb.position.copy(CENTER);
  clickOrb.scale.setScalar(0.0001);
  const haloMat = new THREE.MeshBasicMaterial({ color: ctx.glow.clone(), transparent: true, opacity: 0.75, depthWrite: false });
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.009, 8, 160), haloMat);
  halo.position.copy(CENTER);
  ctx.scene.add(clickOrb, halo);

  // party symbols on the orbs: round medallions just in front of the glass, facing the camera
  const ALPHA = [...PARTITI].sort((x, y) => x.name.localeCompare(y.name, 'it', { sensitivity: 'base' }));
  const medals = ALPHA.slice(0, orbs.count).map((party) => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = new Image();
    img.onload = () => {
      const g = c.getContext('2d');
      g.save(); g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.closePath();
      g.fillStyle = '#ffffff'; g.fill(); g.clip();
      const k = Math.max(232 / img.width, 232 / img.height);
      g.drawImage(img, 128 - (img.width * k) / 2, 128 - (img.height * k) / 2, img.width * k, img.height * k);
      g.restore();
      g.lineWidth = 10; g.strokeStyle = party.color || '#5b6878';
      g.beginPath(); g.arc(128, 128, 121, 0, Math.PI * 2); g.stroke();
      tex.needsUpdate = true;
    };
    if (party.logo) img.src = party.logo;
    const m = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }); // crisp, not veiled by the haze
    const sp = new THREE.Sprite(m);
    sp.renderOrder = 2;
    ctx.scene.add(sp);
    return { sp, m, o: 0 };
  });
  const toCam = new THREE.Vector3();

  const cs = { s: 0, ts: 0 };
  let ringRot = 0;
  let active = false;

  function light(i, instant) {
    const keyName = ['key', 'env', 'arch'][i];
    if (!keyName) return;
    gsap.killTweensOf(levels, keyName);
    if (instant) levels[keyName] = 1;
    else gsap.to(levels, { [keyName]: 1, duration: 1.1, ease: 'power2.out' });
  }

  return {
    clickOrb,
    anchor: CENTER,
    light,
    dimForIntro() { levels.key = 0.15; levels.env = 0.1; levels.arch = 0; },
    pose() {
      const n = ctx.isNarrow();
      // Camera high enough that the ring reads as an ellipse around the Click orb (no orb crosses it).
      // Desktop: viewShift moves the scene right, clear of the hero type.
      if (n) {
        const d = Math.max(12, ctx.fitDist(3.0, 1.0));
        return { pos: new THREE.Vector3(0, 1.1 + d * 0.5, d), target: new THREE.Vector3(0, 2.2, 0), shift: 0, shiftY: 0.2 }; // above the headline and the briefing strip
      }
      return { pos: new THREE.Vector3(0, 4.6, 10.2), target: new THREE.Vector3(0, 0.95, 0), shift: -0.2 };
    },
    enter() {
      active = true;
      cs.ts = 1;
      orbs.setSync(false);
      orbs.state.forEach((s) => { s.ts = 1; s.tdim = 1; s.ttint.setRGB(1, 1, 1); });
    },
    leave() { active = false; cs.ts = 0; },
    update(t, dt, isActive) {
      cs.s += (cs.ts - cs.s) * (1 - Math.exp(-dt * (cs.ts ? 4 : 6)));
      if (isActive && active) {
        ringRot += dt * 0.05;
        const ring = orbs.ring(ctx.isNarrow() ? 2.7 : 3.2, 1.0, ringRot);
        orbs.state.forEach((s, i) => s.tp.copy(ring[i]));
      }
      const pulse = 1 + 0.035 * Math.sin(t * 1.6);
      clickOrb.scale.setScalar(Math.max(0.0001, cs.s * pulse));
      clickOrb.position.y = CENTER.y + Math.sin(t * 0.8) * 0.05;
      // on paper a softer emission keeps the saffron saturated instead of blooming to cream
      const gain = 0.35 + 2.25 * ctx.dark();
      orbMat.emissiveIntensity = (0.35 + gain * levels.arch) * (0.88 + 0.12 * Math.sin(t * 1.6));
      orbMat.roughness = 0.18 + 0.2 * (1 - ctx.dark());
      haloMat.opacity = 0.75 * cs.s * levels.arch;
      halo.position.copy(clickOrb.position);
      halo.quaternion.copy(ctx.camera.quaternion);
      const hs = cs.s * (1 + 0.06 * Math.sin(t * 1.6 - 0.6));
      halo.scale.setScalar(Math.max(0.0001, hs));
      halo.visible = cs.s > 0.04;
      clickOrb.visible = cs.s > 0.04;
      // symbols follow their orbs (same bob as the orb), fade in with the home, out when leaving
      medals.forEach((md, i) => {
        const st = orbs.state[i];
        md.o += ((active ? 1 : 0) - md.o) * (1 - Math.exp(-dt * (active ? 2.2 : 6)));
        md.m.opacity = md.o * Math.min(1, st.s);
        md.sp.visible = md.m.opacity > 0.01;
        if (!md.sp.visible) return;
        toCam.copy(ctx.camera.position).sub(st.p).normalize();
        md.sp.position.copy(st.p).addScaledVector(toCam, 0.6 * st.s);
        md.sp.position.y += Math.sin(t * 0.7 + st.phase) * 0.05;
        const sc = 0.62 * st.s;
        md.sp.scale.set(sc, sc, 1);
      });
    },
    pickables() { return active ? [clickOrb, orbs.mesh] : []; },
    resolve(hit) { return { type: 'enter', point: hit.object === clickOrb ? CENTER : hit.point }; },
    shadowFor() { return { x: 0, z: 0, s: 2.2 * cs.s }; },
  };
}
