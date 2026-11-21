// worlds/chamber.js — the parliament inside PARTITI.
// 400 seats rise row by row on the agora's tiers (a plain chamber: seats are NOT coloured by
// party, because the parties' real seat counts are not part of the data), the Presidency bench
// and the speaker's lectern face them, and every party orb carries its symbol as a medallion,
// all at the same size (your note: "hanno tutti la stessa dimensione").

const ROWS = [5.35, 6.15, 6.95, 7.75, 8.55, 9.35];
const SEATS = 400;

function seatLayout() {
  const sum = ROWS.reduce((a, b) => a + b, 0);
  const counts = ROWS.map((r) => Math.floor((SEATS * r) / sum));
  counts[counts.length - 1] += SEATS - counts.reduce((a, b) => a + b, 0);
  const out = [];
  ROWS.forEach((r, k) => {
    // rows from 6.2 outwards sit on the agora's four tiers (heights from scene.js)
    const y = r < 6.2 ? 0 : 0.12 + 0.16 * Math.min(3, Math.floor((r - 6.2) / 0.9)) + 0.002;
    for (let i = 0; i < counts[k]; i++) {
      const a = Math.PI + 0.13 + (i / (counts[k] - 1)) * (Math.PI - 0.26);
      out.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, y, row: k, a });
    }
  });
  return out;
}

export function createChamber(ctx) {
  const { THREE } = ctx;
  const V3 = THREE.Vector3;
  const seats = seatLayout();

  // seats: a chair with a back, as one box that grows from the floor
  const seatGeo = new THREE.BoxGeometry(0.2, 0.28, 0.17);
  seatGeo.translate(0, 0.14, 0);
  const seatMat = new THREE.MeshStandardMaterial({ color: '#cfd6d4', roughness: 0.85, envMapIntensity: 0 });
  const seatMesh = new THREE.InstancedMesh(seatGeo, seatMat, SEATS);
  seatMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const base = seats.map((s) => {
    const o = new THREE.Object3D();
    o.position.set(s.x, s.y, s.z);
    o.lookAt(0, s.y, 0); // every seat faces the Presidency
    return o;
  });

  // Presidency bench + speaker's lectern, facing the seats
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#0E4A5A', roughness: 0.6, envMapIntensity: 0.3 });
  const topMat = new THREE.MeshStandardMaterial({ color: '#F7F5F0', roughness: 0.5, envMapIntensity: 0.3 });
  const pres = new THREE.Group();
  const geos = [];
  const box = (w, h, d, mat, x, y, z) => { const g = new THREE.BoxGeometry(w, h, d); geos.push(g); const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); pres.add(m); return m; };
  box(3.0, 0.46, 0.4, bodyMat, 0, 0.23, 2.7);    // bench
  box(3.08, 0.03, 0.48, topMat, 0, 0.475, 2.7);  // its top
  box(0.95, 0.24, 0.4, bodyMat, 0, 0.61, 2.86);  // raised central desk
  box(1.0, 0.03, 0.46, topMat, 0, 0.745, 2.86);
  box(0.44, 0.74, 0.28, bodyMat, 0, 0.37, 1.45); // lectern (tribuna)
  box(0.5, 0.03, 0.34, topMat, 0, 0.755, 1.45);
  ctx.scene.add(seatMesh, pres);
  pres.scale.y = 0.0001;

  // logo medallions: one sprite per orb slot; textures cached per party
  const texCache = new Map();
  function logoTexture(party) {
    if (texCache.has(party.id)) return texCache.get(party.id);
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = new Image();
    img.onload = () => {
      const g = c.getContext('2d');
      g.clearRect(0, 0, 256, 256);
      g.save();
      g.beginPath(); g.arc(128, 128, 116, 0, Math.PI * 2); g.closePath();
      g.fillStyle = '#ffffff'; g.fill(); g.clip();
      const s = Math.max(232 / img.width, 232 / img.height); // cover, like your .plogo
      g.drawImage(img, 128 - (img.width * s) / 2, 128 - (img.height * s) / 2, img.width * s, img.height * s);
      g.restore();
      g.lineWidth = 12; g.strokeStyle = party.color || '#5b6878';
      g.beginPath(); g.arc(128, 128, 120, 0, Math.PI * 2); g.stroke();
      tex.needsUpdate = true;
    };
    img.src = party.logo; // data: URI from data/logos.js
    texCache.set(party.id, tex);
    return tex;
  }
  const sprites = [];
  function sprite(i) {
    while (sprites.length <= i) {
      const m = new THREE.SpriteMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const sp = new THREE.Sprite(m);
      sp.renderOrder = 2;
      ctx.scene.add(sp);
      sprites.push({ sp, m, o: 0, id: null });
    }
    return sprites[i];
  }

  let rise = 0, riseT = 0, lastRise = -1;
  const toCam = new V3();
  const smooth = (x) => x * x * (3 - 2 * x);
  const seatCol = { light: new THREE.Color('#cfd6d4'), dark: new THREE.Color('#22343d') };
  const bodyCol = { light: new THREE.Color('#0E4A5A'), dark: new THREE.Color('#1B5969') };
  const topCol = { light: new THREE.Color('#F7F5F0'), dark: new THREE.Color('#9fb0b5') };

  return {
    setActive(v) { riseT = v ? 1 : 0; },
    update(t, dt, live, parties, orbs, hovered, sel) {
      const dark = ctx.dark();
      seatMat.color.copy(seatCol.light).lerp(seatCol.dark, dark);
      bodyMat.color.copy(bodyCol.light).lerp(bodyCol.dark, dark);
      topMat.color.copy(topCol.light).lerp(topCol.dark, dark);

      // the chamber rises row by row (front first), and folds back down on leave
      rise += (riseT - rise) * (1 - Math.exp(-dt * (riseT ? 1.6 : 3)));
      if (Math.abs(rise - lastRise) > 1e-4) {
        lastRise = rise;
        const d = new THREE.Object3D();
        seats.forEach((s, i) => {
          const u = smooth(Math.min(1, Math.max(0, rise * 1.7 - s.row * 0.12)));
          d.position.copy(base[i].position); d.quaternion.copy(base[i].quaternion);
          d.scale.set(1, Math.max(0.0001, u), 1);
          d.updateMatrix();
          seatMesh.setMatrixAt(i, d.matrix);
        });
        seatMesh.instanceMatrix.needsUpdate = true;
        pres.scale.y = Math.max(0.0001, smooth(Math.min(1, rise * 1.3)));
      }
      seatMesh.visible = pres.visible = rise > 0.002;

      // medallions on the orbs
      for (let i = 0; i < orbs.count; i++) {
        const p = parties[i];
        const sp = sprite(i);
        if (p && sp.id !== p.id) { sp.m.map = logoTexture(p); sp.m.needsUpdate = true; sp.id = p.id; }
        const st = orbs.state[i];
        const target = live && p ? 0.25 + 0.75 * st.dim : 0;
        sp.o += (target - sp.o) * (1 - Math.exp(-dt * 4));
        sp.m.opacity = sp.o;
        sp.sp.visible = sp.o > 0.01;
        toCam.copy(ctx.camera.position).sub(st.p).normalize();
        // just outside the glass (radius 0.42 × breathing × hover) so the sphere never pokes through
        sp.sp.position.copy(st.p).addScaledVector(toCam, 0.6 * st.s);
        sp.sp.position.y += Math.sin(t * 0.7) * 0.05; // the orbs' shared bob (PARTITI is in sync)
        const sc = 0.6 * st.s * (1 + st.hover * 0.08);
        sp.sp.scale.set(sc, sc, 1);
      }
    },
    dispose() {
      ctx.scene.remove(seatMesh, pres);
      seatGeo.dispose(); seatMat.dispose(); seatMesh.dispose();
      geos.forEach((g) => g.dispose()); bodyMat.dispose(); topMat.dispose();
      sprites.forEach(({ sp, m }) => { ctx.scene.remove(sp); m.dispose(); });
      sprites.length = 0;
      texCache.forEach((tx) => tx.dispose()); texCache.clear();
    },
  };
}
