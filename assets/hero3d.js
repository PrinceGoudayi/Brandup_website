/* BrandUp — scène 3D de l'accueil (Three.js)
   Mécanique inspirée du layer « Kimi » (getlayers.ai) :
   1) l'armure qui recouvre le guépard « brûle » au chargement,
   2) elle ne revient que là où le curseur vient de passer (traînée qui s'efface). */
(function () {
  var host = document.getElementById('hero3d');
  if (!host || !window.THREE || !window.BU_ICON) return;
  var T = THREE;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { host.classList.add('no-webgl'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  var scene = new T.Scene();
  var camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  var world = new T.Group(); scene.add(world);

  /* ---------- Cheetah plane with burn + cursor-trail shader ---------- */
  var ICON_RATIO = 543 / 900;
  var PW = 7.2, PH = PW * ICON_RATIO;
  var baseTex = new T.TextureLoader().load(window.BU_ICON, function () { host.classList.add('ready'); });
  baseTex.minFilter = T.LinearFilter;

  function makeCover() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 618;
    var g = c.getContext('2d');
    var grd = g.createLinearGradient(0, 0, 1024, 618);
    grd.addColorStop(0, '#0a0517'); grd.addColorStop(.5, '#1a0d3a'); grd.addColorStop(1, '#07030f');
    g.fillStyle = grd; g.fillRect(0, 0, 1024, 618);
    var r = 34, h = r * Math.sqrt(3);
    g.lineWidth = 2.5;
    for (var row = -1; row < 618 / h + 2; row++) {
      for (var col = -1; col < 1024 / (r * 1.5) + 2; col++) {
        var x = col * r * 1.5, y = row * h + (col % 2 ? h / 2 : 0);
        g.beginPath();
        for (var k = 0; k < 6; k++) {
          var a = Math.PI / 3 * k;
          g.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        }
        g.closePath();
        g.strokeStyle = 'rgba(167,139,250,' + (0.25 + 0.35 * ((row * 7 + col * 13) % 5) / 5) + ')';
        g.stroke();
        if ((row * 5 + col * 3) % 11 === 0) { g.fillStyle = 'rgba(196,181,253,.35)'; g.fill(); }
      }
    }
    var sh = g.createLinearGradient(0, 0, 1024, 0);
    sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(.5, 'rgba(255,255,255,.18)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = sh; g.fillRect(0, 0, 1024, 618);
    var t = new T.CanvasTexture(c); t.minFilter = T.LinearFilter; return t;
  }
  var coverTex = makeCover();

  var TW = 384, TH = Math.round(384 * ICON_RATIO);
  var trailCanvas = document.createElement('canvas'); trailCanvas.width = TW; trailCanvas.height = TH;
  var tg = trailCanvas.getContext('2d'); tg.fillStyle = '#000'; tg.fillRect(0, 0, TW, TH);
  var trailTex = new T.CanvasTexture(trailCanvas); trailTex.minFilter = T.LinearFilter;

  var uniforms = {
    uBase: { value: baseTex }, uCover: { value: coverTex }, uTrail: { value: trailTex },
    uBurn: { value: reduce ? 1 : 0 }, uDone: { value: reduce ? 1 : 0 }, uTime: { value: 0 }
  };
  var mat = new T.ShaderMaterial({
    uniforms: uniforms, transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: [
      'precision highp float; varying vec2 vUv;',
      'uniform sampler2D uBase,uCover,uTrail; uniform float uBurn,uDone,uTime;',
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.;a*=.5;}return v;}',
      'void main(){',
      ' vec4 base=texture2D(uBase,vUv); vec4 cover=texture2D(uCover,vUv);',
      ' float n=fbm(vUv*vec2(5.,3.)+vec2(0.,uTime*.03));',
      ' float edge=uBurn*1.3-n;',
      ' float burnt=smoothstep(0.,.03,edge);',
      ' float trail=texture2D(uTrail,vUv).r*uDone;',
      ' float vis=max(1.-burnt,trail)*base.a;',
      ' float glow=smoothstep(0.,.05,edge)*(1.-smoothstep(.05,.22,edge))*(1.-uDone);',
      ' vec3 col=mix(base.rgb,cover.rgb,vis);',
      ' col+=glow*vec3(1.,.45,.15)*1.7*base.a;',
      ' float rim=trail*(1.-trail)*4.; col+=rim*vec3(.65,.4,1.)*.9*base.a;',
      ' gl_FragColor=vec4(col,base.a);',
      '}'
    ].join('\n')
  });
  var cheetah = new T.Mesh(new T.PlaneGeometry(PW, PH), mat);
  world.add(cheetah);

  /* ---------- Floating website windows (vrais sites) ---------- */
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function windowTexture(key, label) {
    var c = document.createElement('canvas'); c.width = 640; c.height = 400;
    var g = c.getContext('2d'), tex = new T.CanvasTexture(c); tex.minFilter = T.LinearFilter;
    function frame(img) {
      g.clearRect(0, 0, 640, 400);
      g.save(); roundRect(g, 0, 0, 640, 400, 22); g.clip();
      g.fillStyle = '#0b0618'; g.fillRect(0, 0, 640, 400);
      if (img) {
        var ar = 640 / 364, ir = img.width / img.height, sw, sh, sx, sy;
        if (ir > ar) { sh = img.height; sw = sh * ar; sx = (img.width - sw) / 2; sy = 0; }
        else { sw = img.width; sh = sw / ar; sx = 0; sy = 0; }
        g.drawImage(img, sx, sy, sw, sh, 0, 36, 640, 364);
      }
      var bar = g.createLinearGradient(0, 0, 640, 0); bar.addColorStop(0, '#1d1045'); bar.addColorStop(1, '#120a2b');
      g.fillStyle = bar; g.fillRect(0, 0, 640, 36);
      ['#ff5f57', '#febc2e', '#28c840'].forEach(function (col, i) { g.fillStyle = col; g.beginPath(); g.arc(22 + i * 20, 18, 5.5, 0, 7); g.fill(); });
      g.fillStyle = 'rgba(255,255,255,.1)'; roundRect(g, 120, 8, 400, 20, 10); g.fill();
      g.restore();
      g.fillStyle = 'rgba(124,58,237,.92)'; roundRect(g, 18, 358, g.measureText ? 22 + label.length * 11 : 120, 28, 14); g.fill();
      g.fillStyle = '#fff'; g.font = '700 15px sans-serif'; g.fillText(label, 30, 377);
      tex.needsUpdate = true;
    }
    frame(null);
    var im = new Image(); im.onload = function () { frame(im); };
    im.src = (window.BU_SITES || {})[key] || '';
    return tex;
  }

  var panelDefs = [
    { k: 'jeweller-hero', l: 'Vitrine', p: [-4.7, 2.3, -1.5], r: [0.08, 0.42, 0.05], s: 1.0 },
    { k: 'nexora-site', l: 'Catalogue', p: [-5.1, -0.35, 0.2], r: [-0.1, 0.36, -0.07], s: 0.9 },
    { k: 'nike-site', l: 'Boutique', p: [5.2, -0.4, -0.6], r: [0.07, -0.48, 0.05], s: 1.0 },
    { k: 'jeweller-products', l: 'Votre marque', p: [5.1, 2.5, -2.4], r: [-0.05, -0.4, -0.09], s: 0.92 }
  ];
  var panels = panelDefs.map(function (d, i) {
    var grp = new T.Group();
    var geo = new T.PlaneGeometry(2.9, 1.8125);
    var m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: windowTexture(d.k, d.l), transparent: true, side: T.DoubleSide }));
    var edges = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.55 }));
    grp.add(m); grp.add(edges);
    grp.position.set(d.p[0], d.p[1], d.p[2]); grp.rotation.set(d.r[0], d.r[1], d.r[2]); grp.scale.setScalar(d.s);
    grp.userData = { base: d.p.slice(), rot: d.r.slice(), ph: i * 1.7 };
    world.add(grp); return grp;
  });

  /* ---------- Particles ---------- */
  var N = window.innerWidth < 720 ? 650 : 1500;
  var pg = new T.BufferGeometry(), pos = new Float32Array(N * 3);
  for (var i = 0; i < N; i++) { pos[i * 3] = (Math.random() - .5) * 26; pos[i * 3 + 1] = (Math.random() - .5) * 16; pos[i * 3 + 2] = (Math.random() - .5) * 14 - 2; }
  pg.setAttribute('position', new T.BufferAttribute(pos, 3));
  var pts = new T.Points(pg, new T.PointsMaterial({ size: 0.055, color: 0xa78bfa, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false }));
  scene.add(pts);

  /* ---------- Layout / resize ---------- */
  function layout() {
    var w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    var narrow = camera.aspect < 0.9;
    camera.position.z = narrow ? 15.5 : (camera.aspect < 1.3 ? 12.5 : 10);
    cheetah.position.set(narrow ? 0.1 : 0.7, narrow ? 2.5 : 0.55, 0);
    cheetah.scale.setScalar(narrow ? 0.62 : 1);
    panels.forEach(function (p, i) { p.visible = !narrow; if (narrow) { p.position.x = p.userData.base[0] * 0.55; } else { p.position.x = p.userData.base[0]; } });
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', layout); layout();

  /* ---------- Pointer ---------- */
  var ray = new T.Raycaster(), ndc = new T.Vector2();
  var mouse = { x: 0, y: 0, tx: 0, ty: 0, last: -1e9, has: false };
  function onMove(ev) {
    var r = host.getBoundingClientRect();
    var cx = (ev.touches ? ev.touches[0].clientX : ev.clientX), cy = (ev.touches ? ev.touches[0].clientY : ev.clientY);
    mouse.tx = ((cx - r.left) / r.width) * 2 - 1; mouse.ty = -(((cy - r.top) / r.height) * 2 - 1);
    mouse.last = performance.now(); mouse.has = true;
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  var lastUV = null;
  function paint(u, v) {
    var x = u * TW, y = (1 - v) * TH;
    if (lastUV) {
      tg.strokeStyle = 'rgba(255,255,255,.95)'; tg.lineWidth = 56; tg.lineCap = 'round';
      tg.beginPath(); tg.moveTo(lastUV[0], lastUV[1]); tg.lineTo(x, y); tg.stroke();
    }
    var gr = tg.createRadialGradient(x, y, 0, x, y, 40);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    tg.fillStyle = gr; tg.beginPath(); tg.arc(x, y, 40, 0, 7); tg.fill();
    lastUV = [x, y];
  }

  /* ---------- Loop ---------- */
  var running = true, t0 = performance.now(), burnStart = 600, burnDur = 2800;
  new IntersectionObserver(function (es) { running = es[0].isIntersecting; if (running) tick(); }).observe(host);

  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    var now = performance.now(), t = (now - t0) / 1000;
    uniforms.uTime.value = t;
    if (!reduce) {
      var b = Math.min(1, Math.max(0, (now - t0 - burnStart) / burnDur));
      uniforms.uBurn.value = b; if (b >= 1) uniforms.uDone.value = 1;
    }
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;
    world.rotation.y = mouse.x * 0.16; world.rotation.x = -mouse.y * 0.08;
    pts.rotation.y = t * 0.015 + mouse.x * 0.05; pts.rotation.x = mouse.y * 0.03;
    panels.forEach(function (p) {
      var u = p.userData, ph = t * 0.7 + u.ph;
      p.position.y = u.base[1] + Math.sin(ph) * 0.14;
      p.rotation.y = u.rot[1] + Math.sin(ph * 0.6) * 0.06 + mouse.x * 0.12;
      p.rotation.x = u.rot[0] + Math.cos(ph * 0.5) * 0.04;
    });
    var sy = window.scrollY || 0; var k = Math.min(1, sy / (host.clientHeight || 800));
    camera.position.y = -k * 1.2; renderer.domElement.style.opacity = String(1 - k * 0.85);

    /* trail: fade, then paint real pointer (or ghost pointer when idle) */
    tg.fillStyle = 'rgba(0,0,0,0.045)'; tg.fillRect(0, 0, TW, TH);
    if (uniforms.uDone.value > 0 || reduce) {
      var realActive = mouse.has && (now - mouse.last < 1800);
      var u, v, ok = false;
      if (realActive) {
        ndc.set(mouse.tx, mouse.ty); ray.setFromCamera(ndc, camera);
        var hit = ray.intersectObject(cheetah);
        if (hit.length) { u = hit[0].uv.x; v = hit[0].uv.y; ok = true; }
      } else if (!reduce) {
        u = 0.5 + 0.36 * Math.sin(t * 0.8); v = 0.5 + 0.26 * Math.sin(t * 1.25 + 1.2); ok = true;
      }
      if (ok) paint(u, v); else lastUV = null;
    }
    trailTex.needsUpdate = true;
    renderer.render(scene, camera);
  }
  tick();
})();
