/* Shared helpers for the 3D activity prototypes. Requires vendor/three-r149.min.js */
window.TD = (function () {
  function scene(host, opts) {
    opts = opts || {};
    const ren = new THREE.WebGLRenderer({ antialias: true });
    ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    ren.shadowMap.enabled = true;
    ren.shadowMap.type = THREE.PCFSoftShadowMap;
    host.prepend(ren.domElement);
    const sc = new THREE.Scene();
    sc.background = new THREE.Color(opts.bg || '#d6e8f5');
    const cam = new THREE.PerspectiveCamera(opts.fov || 36, 1, 0.5, 800);
    sc.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(-25, 60, 35); dl.castShadow = true; dl.shadow.mapSize.set(2048, 2048);
    Object.assign(dl.shadow.camera, { left: -60, right: 60, top: 60, bottom: -60, far: 200 });
    sc.add(dl);
    const tgt = new THREE.Vector3().fromArray(opts.target || [0, 0, 0]);
    const o = { az: opts.az || 0, el: opts.el || 0.4, rad: opts.rad || 60 };
    const baseRad = o.rad;
    const lim = Object.assign({ az: [-1.2, 1.2], el: [0.05, 1.3], rad: [20, 160] }, opts.lim || {});
    function place() {
      cam.position.set(tgt.x + o.rad * Math.cos(o.el) * Math.sin(o.az), tgt.y + o.rad * Math.sin(o.el), tgt.z + o.rad * Math.cos(o.el) * Math.cos(o.az));
      cam.lookAt(tgt);
    }
    function size() {
      const W = host.clientWidth, H = host.clientHeight;
      ren.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
      // pull the camera back on narrow screens so the whole scene fits
      const a = W / H; o.rad = a < 1.6 ? baseRad * Math.min(2.3, Math.pow(1.6 / a, opts.fit || 0.85)) : baseRad;
      lim.rad[1] = Math.max(lim.rad[1], o.rad * 1.2); place();
    }
    window.addEventListener('resize', size);
    // orbit on empty-space drag, if allowed
    let drag = null;
    const cv = ren.domElement;
    const api = { ren, sc, cam, tgt, o, place, size, onPick: null, pickables: [], orbit: opts.orbit !== false };
    const ray = new THREE.Raycaster(), mp = new THREE.Vector2();
    function pick(e) {
      const r = cv.getBoundingClientRect();
      mp.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
      ray.setFromCamera(mp, cam);
      return ray.intersectObjects(api.pickables, true)[0];
    }
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, az: o.az, el: o.el, moved: false, touch: e.pointerType === 'touch' }; if (!drag.touch) cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointercancel', () => { drag = null; });
    cv.addEventListener('pointermove', e => {
      if (drag) {
        if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) drag.moved = true;
        if (drag.moved && api.orbit) {
          o.az = Math.max(lim.az[0], Math.min(lim.az[1], drag.az - (e.clientX - drag.x) * 0.006));
          if (!drag.touch) o.el = Math.max(lim.el[0], Math.min(lim.el[1], drag.el + (e.clientY - drag.y) * 0.005));
          place();
        }
      } else {
        const h = pick(e); cv.style.cursor = h ? 'pointer' : (api.orbit ? 'grab' : 'default');
      }
    });
    cv.addEventListener('pointerup', e => {
      if (drag && !drag.moved && api.onPick) { const h = pick(e); if (h) api.onPick(h.object, h); }
      drag = null;
    });
    if (opts.zoom !== false) cv.addEventListener('wheel', e => { e.preventDefault(); o.rad = Math.max(lim.rad[0], Math.min(lim.rad[1], o.rad + e.deltaY * 0.05)); place(); }, { passive: false });
    // fixed readout panel in the corner of the stage, so numbers never sit on moving parts
    // on phones the panel sits under the picture instead of over it
    api.hud = function (cls, el) {
      const d = el || document.createElement('div'); d.className = 'hud ' + (cls || ''); d.setAttribute('aria-hidden', 'true');
      if (window.matchMedia && matchMedia('(max-width:700px)').matches) { d.classList.add('out'); host.after(d); } else if (!el) host.appendChild(d);
      return d;
    };
    const labels = [];
    api.label = function (text, cls) {
      const d = document.createElement('div'); d.className = 'tdl ' + (cls || ''); d.textContent = text; host.appendChild(d);
      const l = { d, v: new THREE.Vector3(), show: true }; labels.push(l); return l;
    };
    api.removeLabel = function (l) { const i = labels.indexOf(l); if (i >= 0) labels.splice(i, 1); l.d.remove(); };
    const ticks = [];
    api.onTick = f => ticks.push(f);
    function loop(t) {
      ticks.forEach(f => f(t));
      ren.render(sc, cam);
      const W = host.clientWidth, H = host.clientHeight;
      labels.forEach(l => {
        if (!l.show) { l.d.style.display = 'none'; return; }
        const p = l.v.clone().project(cam);
        if (p.z > 1) { l.d.style.display = 'none'; return; }
        l.d.style.display = '';
        l.d.style.left = ((p.x + 1) / 2 * W) + 'px'; l.d.style.top = ((1 - p.y) / 2 * H) + 'px';
      });
      requestAnimationFrame(loop);
    }
    size(); requestAnimationFrame(loop);
    return api;
  }
  const M = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.5 }, o || {}));
  function mesh(sc, geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); m.castShadow = m.receiveShadow = true; sc.add(m); return m; }
  function textTex(t, bg, fg, w, h, font) {
    const c = document.createElement('canvas'); c.width = w || 512; c.height = h || 128;
    const x = c.getContext('2d'); x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height);
    let fs = Math.round(c.height * 0.45); x.font = `700 ${fs}px ${font || 'Lexend,Arial,sans-serif'}`;
    while (x.measureText(t).width > c.width * 0.9 && fs > 10) { fs -= 2; x.font = `700 ${fs}px ${font || 'Lexend,Arial,sans-serif'}`; }
    x.fillStyle = fg || '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, c.width / 2, c.height / 2 + 2);
    const T = new THREE.CanvasTexture(c); T.anisotropy = 8; return T;
  }
  const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const bsp = q => 'https://research.ebsco.com/c/cqb6z7/search/results?autocorrect=y&db=buh&expanders=concept&limiters=None&searchMode=enhanced&q=' + encodeURIComponent(q).replace(/%20/g, '+');
  return { scene, M, mesh, textTex, RM, esc, bsp };
})();
