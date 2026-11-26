(function () {
  'use strict';

  // ===== THEME TOGGLE =====
  (function () {
    var saved = localStorage.getItem('bu-theme');
    if (saved === 'light') document.body.classList.add('light');

    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isLight = document.body.classList.toggle('light');
      localStorage.setItem('bu-theme', isLight ? 'light' : 'dark');
      // Update nav scroll colour too
      updateNavBg();
    });
  })();

  function updateNavBg() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var isLight = document.body.classList.contains('light');
    if (window.scrollY > 40) {
      nav.style.background = isLight ? 'rgba(244,245,255,0.97)' : 'rgba(9,10,16,0.94)';
    } else {
      nav.style.background = isLight ? 'rgba(244,245,255,0.88)' : 'rgba(9,10,16,0.78)';
    }
  }

  // Navigation Mobile
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Fermeture du menu au clic sur un lien
  var navLinks = document.querySelectorAll('.links a');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (nav) nav.classList.remove('open');
    });
  });

  // FAQ Accordéon
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (!item) return;
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
      } else {
        item.classList.remove('open');
      }
    });
  });

  // Effet d'élévation de navbar au scroll
  window.addEventListener('scroll', function () {
    updateNavBg();
  }, { passive: true });

  // Hero parallax pointer vars
  var hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('pointermove', function (e) {
      hero.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
    }, { passive: true });
  }

  // 3D Tilt Effect
  window.BU_TILT = function (root) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover:hover)').matches) return;
    var tilts = (root || document).querySelectorAll('.tilt');
    tilts.forEach(function (el) {
      if (el._t) return; el._t = 1;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(),
            x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + (x * 12).toFixed(2) + 'deg) rotateX(' + (-y * 12).toFixed(2) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = '';
      });
    });
  };
  window.BU_TILT();

})();
