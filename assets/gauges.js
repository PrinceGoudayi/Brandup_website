/* BrandUp — chiffres en 3D qui se remplissent (Three.js) */
(function () {
  var host = document.querySelector('.gauges');
  if (!host || !window.THREE) return;
  var T = THREE, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cells = [].slice.call(host.querySelectorAll('.gcell'));
  var fmt = function (v, dec) { return v.toFixed(dec).replace('.', ','); };
  var renderer;
  try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { fallback(); return; }
  function fallback() {
    host.classList.add('no-webgl');
    var started = false;
    new IntersectionObserver(function (es, ob) {
      if (!es[0].isIntersecting || started) return; started = true; ob.disconnect();
      var t0 = performance.now();
      (function f(now) {
        var q = Math.min(1, (now - t0) / 2200), e = 1 - Math.pow(1 - q, 3);
        cells.forEach(function (c) { var fill = +c.dataset.fill; c.style.setProperty('--p', (fill * e).toFixed(1)); setNum(c, e); });
        if (q < 1) requestAnimationFrame(f);
      })(t0);
    }, { threshold: .3 }).observe(host);
  }
  function setNum(c, e) { var n = c.querySelector('.gnum'); n.textContent = fmt(+c.dataset.count * e, +c.dataset.dec || 0) + (c.dataset.suffix || ''); }
  if (!renderer) return;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var cv = renderer.domElement; cv.className = 'gcanvas'; host.insertBefore(cv, host.firstChild);
  var scene = new T.Scene(), camera = new T.PerspectiveCamera(30, 1, 1, 4000);
  var gs = [];
  var vert = 'varying vec2 vUv; varying vec3 vN; void main(){ vUv=uv; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }';
  var frag = 'precision highp float; varying vec2 vUv; varying vec3 vN; uniform float uP; uniform vec3 uA; uniform vec3 uB;' +
    'void main(){ if (vUv.x < 1.0 - uP) discard; float k = (vUv.x - (1.0 - uP)) / max(uP, .0001);' +
    ' vec3 base = mix(uB, uA, k); float l = dot(normalize(vN), normalize(vec3(.35,.55,.85)))*.5+.5;' +
    ' vec3 col = base*(.5+.75*l) + pow(max(l,0.),6.)*.35; gl_FragColor = vec4(col,1.); }';
  cells.forEach(function (c, i) {
    var g = new T.Group(), R = 52, tube = 9;
    var track = new T.Mesh(new T.TorusGeometry(R, tube, 24, 90), new T.MeshBasicMaterial({ color: 0x2a1a5c, transparent: true, opacity: .75 }));
    var u = { uP: { value: 0 }, uA: { value: new T.Color(0xe91e8c) }, uB: { value: new T.Color(0x8b5cf6) } };
    var fill = new T.Mesh(new T.TorusGeometry(R, tube * 1.02, 24, 120), new T.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, side: T.DoubleSide }));
    var disc = new T.Mesh(new T.CircleGeometry(R + 26, 48), new T.MeshBasicMaterial({ color: 0x1a0f3d, transparent: true, opacity: .55 }));
    disc.position.z = -12;
    var cap = new T.Mesh(new T.SphereGeometry(tube * 1.15, 20, 20), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
    track.rotation.z = fill.rotation.z = Math.PI / 2;
    g.add(disc); g.add(track); g.add(fill); g.add(cap); scene.add(g);
    gs.push({ g: g, u: u, cap: cap, R: R, cell: c, p: 0, ph: i * .9 });
  });
  var W = 0, H = 0, mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  function layout() {
    var r = host.getBoundingClientRect(); W = r.width; H = r.height;
    renderer.setSize(W, H, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = W / H; camera.position.z = (H / 2) / Math.tan(15 * Math.PI / 180); camera.updateProjectionMatrix();
    gs.forEach(function (o) {
      var ring = o.cell.querySelector('.gring').getBoundingClientRect();
      var cx = ring.left - r.left + ring.width / 2, cy = ring.top - r.top + ring.height / 2;
      o.g.position.set(cx - W / 2, H / 2 - cy, 0);
      var s = Math.min(ring.width, ring.height) / 150; o.g.scale.setScalar(s);
    });
  }
  window.addEventListener('resize', layout); window.addEventListener('load', layout); layout();
  host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1; }, { passive: true });
  var start = null, vis = false, done = false, run = false;
  new IntersectionObserver(function (es) {
    vis = es[0].isIntersecting;
    if (vis && start === null) { start = performance.now(); if (reduce) start -= 99999; }
    if (vis && !run) { run = true; loop(); }
  }, { threshold: .25 }).observe(host);
  function loop() {
    if (!vis) { run = false; return; }
    requestAnimationFrame(loop);
    var now = performance.now(), t = now / 1000;
    mouse.x += (mouse.tx - mouse.x) * .06; mouse.y += (mouse.ty - mouse.y) * .06;
    gs.forEach(function (o, i) {
      var q = Math.min(1, Math.max(0, (now - start - i * 160) / 2400)), e = 1 - Math.pow(1 - q, 3);
      var fillv = +o.cell.dataset.fill / 100 * e; o.u.uP.value = fillv;
      var a = fillv * Math.PI * 2; o.cap.position.set(Math.sin(a) * o.R, Math.cos(a) * o.R, 0);
      o.cap.material.opacity = q > 0 && q < 1 ? .9 : (q >= 1 ? .55 + .2 * Math.sin(t * 3 + i) : 0);
      setNum(o.cell, e);
      o.g.rotation.x = -0.5 + mouse.y * .25 + Math.sin(t * .7 + o.ph) * .07;
      o.g.rotation.y = Math.sin(t * .6 + o.ph) * .28 + mouse.x * .3;
    });
    renderer.render(scene, camera);
  }
})();
