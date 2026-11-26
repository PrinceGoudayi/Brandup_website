/* BrandUp — galerie portfolio 3D (Three.js) : anneau de cartes, glisser/molette/flèches, filtre par métier */
(function () {
  var host = document.getElementById('gallery3d');
  var data = window.BU_PORTFOLIO || [];
  if (!host) return;
  var grid = document.getElementById('pgrid'), modal = document.getElementById('pmodal');
  var cur = 'all';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var badge = function (t) { return t === 'realisation' ? '<span class="bdg ok">Réalisation</span>' : '<span class="bdg">Inspiration</span>'; };

  /* ---------- HTML grid + modal (toujours disponibles, même sans WebGL) ---------- */
  function renderGrid() {
    var items = data.filter(function (d) { return cur === 'all' || d.cat === cur; });
    grid.innerHTML = items.map(function (d) {
      return '<button class="pcard tilt" data-id="' + d.id + '"><span class="pimg"><img src="' + d.img + '" alt="' + d.title + '" loading="lazy"></span><span class="pmeta">' + badge(d.type) + '<b>' + d.title + '</b><i>' + window.BU_CATS[d.cat] + '</i></span></button>';
    }).join('');
    [].forEach.call(grid.querySelectorAll('.pcard'), function (b) { b.addEventListener('click', function () { openModal(b.dataset.id); }); });
    if (window.BU_TILT) window.BU_TILT(grid);
  }
  function openModal(id) {
    var d = data.filter(function (x) { return x.id === id; })[0]; if (!d) return;
    modal.querySelector('.mimg').src = d.full || d.img;
    modal.querySelector('.mbody').innerHTML = badge(d.type) + '<h3>' + d.title + '</h3><p>' + d.desc + '</p><p class="mut">' + window.BU_CATS[d.cat] + '</p>' +
      (d.url ? '<a class="btn btn-p btn-sm" href="' + d.url + '" target="_blank" rel="noopener">Voir le site</a>' : '') +
      (d.type === 'inspiration' ? '<p class="mut small">Référence de style, pas un projet livré. Nous la remplaçons par nos réalisations au fur et à mesure.</p>' : '');
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }
  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('mx')) closeModal(); });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---------- 3D ring ---------- */
  var T = window.THREE, renderer = null;
  if (T) { try { renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { renderer = null; } }
  if (!renderer) { host.classList.add('no-webgl'); setupFilters(function () { renderGrid(); }); renderGrid(); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); host.appendChild(renderer.domElement);
  var scene = new T.Scene(), camera = new T.PerspectiveCamera(36, 1, .1, 100);
  var ring = new T.Group(); scene.add(ring);
  var cards = [], rot = 0, target = 0, vel = 0, dragging = false, lastX = 0, moved = 0, idle = performance.now();
  var loader = new T.TextureLoader();
  var ray = new T.Raycaster(), ndc = new T.Vector2();

  function clearRing() { cards.forEach(function (c) { ring.remove(c.grp); c.grp.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); }); cards = []; }
  function buildRing() {
    clearRing();
    var items = data.filter(function (d) { return cur === 'all' || d.cat === cur; });
    var n = items.length, R = Math.max(4.2, n * 0.95);
    items.forEach(function (d, i) {
      var grp = new T.Group(), H = 3.1;
      var mat = new T.MeshBasicMaterial({ color: 0x2a1a5c, transparent: true, side: T.DoubleSide });
      var mesh = new T.Mesh(new T.PlaneGeometry(1, 1), mat); mesh.scale.set(H * 1.5, H, 1);
      var edge = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(1, 1)), new T.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: .8 })); edge.scale.copy(mesh.scale);
      var glow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: .16, depthWrite: false })); glow.scale.set(H * 1.5 + .5, H + .5, 1); glow.position.z = -.04;
      grp.add(glow); grp.add(mesh); grp.add(edge);
      var a = (i / n) * Math.PI * 2; grp.userData = { a: a, R: R, d: d, mesh: mesh, edge: edge, glow: glow };
      ring.add(grp); cards.push({ grp: grp, d: d });
      loader.load(d.img, function (tx) {
        tx.minFilter = T.LinearFilter; mat.map = tx; mat.color.set(0xffffff); mat.needsUpdate = true;
        var ar = tx.image.width / tx.image.height, w = Math.max(1.6, Math.min(5.2, H * ar));
        mesh.scale.set(w, H, 1); edge.scale.set(w, H, 1); glow.scale.set(w + .5, H + .5, 1);
      });
    });
    rot = target = 0; ring.userData.R = R; ring.userData.n = n; ring.position.z = -R;
    var empty = document.getElementById('gempty'); if (empty) empty.style.display = n ? 'none' : 'block';
  }
  function resize() {
    var w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
    camera.aspect = w / h; camera.position.set(0, .35, w / h < .8 ? 14 : (w / h < 1.2 ? 10.5 : 8.2)); camera.lookAt(0, 0, -2); camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  function step() { var n = ring.userData.n || 1; return (Math.PI * 2) / n; }
  function snap() { var s = step(); target = Math.round(target / s) * s; }
  function go(dir) { target += dir * step(); idle = performance.now(); }
  host.addEventListener('pointerdown', function (e) { dragging = true; lastX = e.clientX; moved = 0; vel = 0; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); target += dx * 0.006; idle = performance.now(); });
  host.addEventListener('pointerup', function (e) {
    dragging = false;
    if (moved < 6) {
      var r = host.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)); ray.setFromCamera(ndc, camera);
      var meshes = cards.map(function (c) { return c.grp.userData.mesh; }), hit = ray.intersectObjects(meshes);
      if (hit.length) { var c = cards.filter(function (c) { return c.grp.userData.mesh === hit[0].object; })[0]; var s = step(); var ang = ((c.grp.userData.a + rot) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI; if (Math.abs(ang) < s * .6) { openModal(c.d.id); return; } target -= ang; }
    }
    snap();
  });
  host.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); target -= e.deltaX * .003; idle = performance.now(); clearTimeout(host._w); host._w = setTimeout(snap, 140); } }, { passive: false });
  var gprev = document.getElementById('gprev'), gnext = document.getElementById('gnext');
  if (gprev) gprev.addEventListener('click', function () { go(1); });
  if (gnext) gnext.addEventListener('click', function () { go(-1); });
  window.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') go(1); if (e.key === 'ArrowRight') go(-1); });

  var vis = true; new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) tick(); }).observe(host);
  var t0 = performance.now();
  function tick() {
    if (!vis) return; requestAnimationFrame(tick);
    var t = (performance.now() - t0) / 1000;
    if (!dragging && !reduce && performance.now() - idle > 3800) { target -= step(); idle = performance.now(); }
    rot += (target - rot) * 0.085;
    var R = ring.userData.R || 5;
    cards.forEach(function (c) {
      var u = c.grp.userData, ang = u.a + rot;
      c.grp.position.set(Math.sin(ang) * R, Math.sin(t * .8 + u.a * 3) * .06, Math.cos(ang) * R);
      c.grp.rotation.y = ang; /* regarde vers l'extérieur */
      var front = (Math.cos(ang) + 1) / 2; /* 1 = devant */
      var sc = .62 + .38 * front; c.grp.scale.setScalar(sc);
      u.mesh.material.opacity = .35 + .65 * front; u.edge.material.opacity = .25 + .65 * front; u.glow.material.opacity = .05 + .2 * front;
    });
    renderer.render(scene, camera);
  }
  function setupFilters(cb) {
    [].forEach.call(document.querySelectorAll('.fbtn'), function (b) {
      b.addEventListener('click', function () {
        [].forEach.call(document.querySelectorAll('.fbtn'), function (x) { x.classList.remove('on'); }); b.classList.add('on');
        cur = b.dataset.cat; cb(); history.replaceState(null, '', cur === 'all' ? location.pathname : '#' + cur);
      });
    });
    var h = (location.hash || '').replace('#', ''); if (h && window.BU_CATS[h]) { cur = h; [].forEach.call(document.querySelectorAll('.fbtn'), function (x) { x.classList.toggle('on', x.dataset.cat === h); }); }
  }
  setupFilters(function () { buildRing(); renderGrid(); });
  buildRing(); renderGrid(); tick();
})();
