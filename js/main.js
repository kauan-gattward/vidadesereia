/* Vida de Sereia — vanilla JS. Coloque o número do WhatsApp (DDI+DDD+número, só dígitos) para trocar os botões do Direct por wa.me com mensagem pronta. */
(function () {
  'use strict';
  var WHATSAPP = ''; // ex.: '5573999999999' (não encontrado publicamente)
  var doc = document.documentElement;
  doc.classList.remove('no-js'); doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- loader ---------- */
  function initLoader() {
    var loader = $('#loader'), pct = $('#pct'), done = false;
    var imgs = $$('img').filter(function (i) { return i.loading !== 'lazy' && i.id !== 'lbimg'; });
    var n = 0, total = Math.max(imgs.length, 1);
    function tick() { n++; if (pct) pct.textContent = Math.min(100, Math.round(n / total * 100)) + '%'; }
    imgs.forEach(function (i) { if (i.complete) tick(); else { i.addEventListener('load', tick); i.addEventListener('error', tick); } });
    function finish() {
      if (done) return; done = true;
      if (pct) pct.textContent = '100%';
      if (loader) loader.classList.add('done');
      setTimeout(function () { doc.classList.add('ready'); }, reduce ? 0 : 250);
    }
    window.addEventListener('load', function () { setTimeout(finish, reduce ? 0 : 500); });
    setTimeout(finish, 2600);
  }

  /* ---------- kinetic headline (textContent only) ---------- */
  function splitWords(el) {
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    var delay = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      var text = node.textContent, host;
      if (node.nodeType === 3) { host = document.createDocumentFragment(); }
      else { host = node.cloneNode(false); }
      text.split(/\s+/).filter(Boolean).forEach(function (w) {
        var o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true');
        var i = document.createElement('span'); i.textContent = w; i.style.transitionDelay = (delay += 0.08) + 's';
        o.appendChild(i); host.appendChild(o); host.appendChild(document.createTextNode(' '));
      });
      el.replaceChild(host, node);
    });
  }

  /* ---------- nav + accessible menu ---------- */
  var scrollY0 = 0;
  function lock() { scrollY0 = window.scrollY; document.body.style.top = -scrollY0 + 'px'; document.body.classList.add('locked'); }
  function unlock() { document.body.classList.remove('locked'); document.body.style.top = ''; window.scrollTo({ top: scrollY0, left: 0, behavior: 'instant' }); }
  function trap(container, e) {
    var f = $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', container).filter(function (x) { return x.offsetParent !== null || x === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function initNav() {
    var nav = $('#nav'), burger = $('#burger'), menu = $('#menu'), navEl = burger.parentNode;
    var mq = window.matchMedia('(max-width: 900px)');
    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      $('.sr-only', burger).textContent = open ? 'Fechar menu' : 'Abrir menu';
      menu.classList.toggle('open', open);
      if (open) { lock(); var a = $('a', menu); if (a) a.focus(); } else { unlock(); }
    }
    burger.addEventListener('click', function () { setOpen(burger.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a || !menu.classList.contains('open')) return;
      e.preventDefault(); setOpen(false); var t = $(a.getAttribute('href'));
      if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
    });
    document.addEventListener('keydown', function (e) {
      if (!menu.classList.contains('open')) return;
      if (e.key === 'Escape') { setOpen(false); burger.focus(); }
      if (e.key === 'Tab') trap(navEl, e);
    });
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () { if (!mq.matches && menu.classList.contains('open')) setOpen(false); });
    var onS = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
    window.addEventListener('scroll', onS, { passive: true }); onS();
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    var els = $$('.rv');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- tilt cards ---------- */
  function initTilt() {
    if (reduce || !fine) return;
    $$('.tilt, .tilt-soft').forEach(function (card) {
      var max = card.classList.contains('tilt') ? 10 : 6;
      var target = card.classList.contains('tilt-soft') ? $('.frame', card) : card;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        target.style.transform = 'rotateY(' + ((x - .5) * max * 2) + 'deg) rotateX(' + ((.5 - y) * max * 2) + 'deg) translateZ(0)';
        card.style.setProperty('--gx', x * 100 + '%'); card.style.setProperty('--gy', y * 100 + '%');
      });
      card.addEventListener('pointerleave', function () { target.style.transform = ''; });
    });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (reduce || !fine) return;
    $$('.mag').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + x * .25 + 'px,' + y * .35 + 'px)';
        b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ---------- cursor ---------- */
  function initCursor() {
    if (!fine || reduce) return;
    doc.classList.add('has-cursor');
    var ring = $('.cursor'), dot = $('.cursor-dot'), x = -100, y = -100, rx = x, ry = y, raf = 0;
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY; dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    function loop() {
      rx += (x - rx) * .2; ry += (y - ry) * .2;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      raf = (Math.abs(x - rx) + Math.abs(y - ry) > .3 && !document.hidden) ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener('pointerover', function (e) { ring.classList.toggle('hover', !!e.target.closest('a,button,summary,.card')); });
  }

  /* ---------- scroll-driven 3D scenes + horizontal gallery ---------- */
  function initScroll() {
    var scenes = $$('.scene'), hs = $('#hs'), track = $('#hstrack'), bar = $('#hsbar'), sticky = hs && $('.hs-sticky', hs);
    var pinned = false;
    function setupPin() {
      if (!hs) return;
      var should = !reduce && window.innerWidth >= 700;
      hs.classList.toggle('pin', should); pinned = should;
      if (should) { var dist = track.scrollWidth - window.innerWidth; hs.style.height = (window.innerHeight + Math.max(dist, 0)) + 'px'; }
      else { hs.style.height = ''; track.style.transform = ''; }
    }
    var ticking = false;
    function frame() {
      ticking = false; var vh = window.innerHeight;
      if (!reduce) scenes.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var p = Math.min(Math.max((vh - r.top) / vh, 0), 1); // 0 entering → 1 settled
        var k = 1 - p;
        s.style.transform = k > 0.001 ? 'perspective(1400px) rotateX(' + (k * 12).toFixed(2) + 'deg) scale(' + (1 - k * .06).toFixed(3) + ')' : '';
      });
      if (pinned) {
        var r2 = hs.getBoundingClientRect(), dist = track.scrollWidth - window.innerWidth;
        var p2 = Math.min(Math.max(-r2.top / Math.max(r2.height - vh, 1), 0), 1);
        track.style.transform = 'translate3d(' + (-p2 * dist).toFixed(1) + 'px,0,0)';
        bar.style.width = (p2 * 100) + '%';
      } else if (sticky) {
        var m = sticky.scrollWidth - sticky.clientWidth; bar.style.width = (m > 0 ? sticky.scrollLeft / m * 100 : 0) + '%';
      }
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', req, { passive: true });
    if (sticky) sticky.addEventListener('scroll', req, { passive: true });
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { setupPin(); req(); }, 150); });
    window.addEventListener('load', function () { setupPin(); req(); });
    setupPin(); req();
    if (hs && 'IntersectionObserver' in window) { var pio = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { $$('img', hs).forEach(function (i) { i.loading = 'eager'; }); pio.disconnect(); } }, { rootMargin: '600px 0px' }); pio.observe(hs); }
  }

  /* ---------- lightbox (focus trap, Esc, back button) ---------- */
  function initLightbox() {
    var lb = $('#lb'), im = $('#lbimg'), cap = $('#lbcap'), items = $$('[data-full]'), idx = 0, opener = null, isOpen = false;
    function show(i) {
      idx = (i + items.length) % items.length; var b = items[idx];
      im.src = b.getAttribute('data-full'); var alt = $('img', b); im.alt = alt ? alt.alt : '';
      cap.textContent = b.getAttribute('data-cap') || '';
    }
    function open(i) {
      if (isOpen) return;
      opener = document.activeElement; show(i); lb.hidden = false; lb.classList.add('open'); isOpen = true; lock();
      history.pushState({ lb: true }, ''); $('.x', lb).focus();
    }
    function close(fromPop) {
      if (!isOpen) return; isOpen = false; lb.classList.remove('open'); lb.hidden = true; unlock();
      if (!fromPop && history.state && history.state.lb) history.back();
      if (opener) opener.focus();
    }
    items.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
    $('.x', lb).addEventListener('click', function () { close(false); });
    $('.prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(false); });
    window.addEventListener('popstate', function () { if (isOpen) close(true); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') close(false);
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'Tab') trap(lb, e);
    });
    var sx = 0; lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); }, { passive: true });
  }

  /* ---------- buy buttons: WhatsApp if configured, else copy message + Direct ---------- */
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('show'); }, 4200);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).catch(function () {});
    var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta);
  }
  function initBuy() {
    $$('.buy').forEach(function (a) {
      var msg = a.getAttribute('data-msg');
      if (WHATSAPP) { a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg); var s = $('span', a); if (s && /Direct/.test(s.textContent)) s.textContent = 'Comprar no WhatsApp'; return; }
      a.addEventListener('click', function () { copy(msg); toast('Mensagem copiada ✨ É só colar no Direct da @vidadesereiaitacare e enviar.'); });
    });
  }

  /* ---------- WebGL sun-glow ocean ---------- */
  function initOcean() {
    var c = $('#ocean'); if (!c) return;
    var gl = null; try { gl = c.getContext('webgl', { antialias: false, alpha: true, powerPreference: 'low-power' }); } catch (e) {}
    if (!gl) { c.remove(); return; }
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = ['precision mediump float;uniform vec2 r;uniform float t;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}',
      'void main(){vec2 uv=gl_FragCoord.xy/r;float hz=.42;vec2 sp=r.x<r.y?vec2(.78,.9):vec2(.68,.62);',
      'vec3 sky=mix(vec3(1.,.42,.29),vec3(1.,.74,.42),smoothstep(hz,1.,uv.y));sky=mix(sky,vec3(.71,.27,.11),smoothstep(.75,1.,uv.y)*.6);',
      'float d=length((uv-sp)*vec2(r.x/r.y,1.));vec3 col=sky+vec3(1.,.85,.5)*(.25/(d*8.+.3))*.6;col=mix(col,vec3(1.,.82,.45),smoothstep(.09,.07,d));',
      'if(uv.y<hz){float y=(hz-uv.y);vec2 q=vec2(uv.x*r.x/r.y*(1.+y*3.),1./(y+.02));float w=fbm(q*vec2(3.,.5)+vec2(t*.05,-t*.6));',
      'vec3 sea=mix(vec3(.04,.43,.42),vec3(.02,.15,.16),smoothstep(0.,hz,y));',
      'float g=smoothstep(.55,1.,w)*exp(-pow((uv.x-sp.x)*(3.-y*3.),2.)*6.);sea+=vec3(1.,.8,.45)*g*1.4;sea+=vec3(.2,.5,.5)*w*.15;col=sea;}',
      'col+=(h(gl_FragCoord.xy+t)-.5)*.04;gl_FragColor=vec4(col,1.);}'].join('\n');
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) { c.remove(); return; }
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.remove(); return; }
    gl.useProgram(pr);
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var ur = gl.getUniformLocation(pr, 'r'), ut = gl.getUniformLocation(pr, 't');
    var visible = true, raf = 0, t0 = performance.now();
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2) * (window.innerWidth < 700 ? .6 : .75);
      c.width = Math.round(c.clientWidth * dpr); c.height = Math.round(c.clientHeight * dpr);
      gl.viewport(0, 0, c.width, c.height); gl.uniform2f(ur, c.width, c.height);
    }
    function draw(now) { gl.uniform1f(ut, (now - t0) / 1000); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
    function loop(now) { draw(now); raf = (visible && !document.hidden) ? requestAnimationFrame(loop) : 0; }
    function start() { if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(loop); }
    size(); draw(performance.now() + 4000); start();
    window.addEventListener('resize', function () { size(); draw(performance.now()); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; start(); }).observe(c);
    document.addEventListener('visibilitychange', start);
    c.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; visible = false; c.classList.add('lost'); });
  }

  /* ---------- pause CSS animations offscreen / hidden tab ---------- */
  function initPause() {
    var els = $$('.marquee, .badge');
    function vis() { els.forEach(function (e) { e.classList.toggle('paused', document.hidden || e.dataset.off === '1'); }); }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { x.target.dataset.off = x.isIntersecting ? '0' : '1'; }); vis(); });
      els.forEach(function (e) { io.observe(e); });
    }
    document.addEventListener('visibilitychange', vis);
  }

  function boot() {
    var y = $('#yr'); if (y) y.textContent = String(new Date().getFullYear());
    $$('.kinetic').forEach(splitWords);
    initLoader(); initNav(); initReveal(); initTilt(); initMagnetic(); initCursor(); initScroll(); initLightbox(); initBuy(); initOcean(); initPause();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
