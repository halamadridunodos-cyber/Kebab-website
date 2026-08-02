/* =========================================================
   O'Bresse — interactions & animations
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis;
  if (!prefersReduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.getElementById("nav")?.classList.remove("open");
        scrollTo(id);
      }
    });
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================================================
     PRELOADER
     ========================================================= */
  function runPreloader() {
    const pre = document.getElementById("preloader");
    const tl = gsap.timeline();
    tl.to(".preloader__mark", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
      .to(".preloader__word span", { y: 0, duration: 0.7, stagger: 0.04, ease: "power3.out" }, "-=0.3")
      .to(".preloader__bar i", { width: "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.4")
      .to(pre, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut",
        onComplete: () => { document.body.classList.add("loaded"); pre.style.display = "none"; },
      })
      .add(revealHero, "-=0.5");
  }

  /* =========================================================
     HERO reveal
     ========================================================= */
  function revealHero() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".hero__title .word > span", { y: 0, duration: 1, stagger: 0.06 })
      .to(".hero .reveal-up", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, "-=0.6");

    // Scroll pan : révèle la devanture complète (enseigne → vitrine → terrasse)
    if (!prefersReduced) {
      gsap.fromTo("#heroImg",
        { backgroundPositionY: "42%" },
        {
          backgroundPositionY: "88%", ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        }
      );
    }
  }

  /* =========================================================
     Generic reveal-up + reveal-lines on scroll
     ========================================================= */
  function initReveals() {
    gsap.utils.toArray(".reveal-up").forEach((el) => {
      if (el.closest(".hero")) return; // hero handled above
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    gsap.utils.toArray(".reveal-lines").forEach((title) => {
      const spans = title.querySelectorAll("span > *");
      gsap.set(title.querySelectorAll("span"), {});
      const inner = title.querySelectorAll("span");
      // wrap: our markup uses <span>text</span>; animate translateY of the text
      gsap.from(inner, {
        yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.1,
        scrollTrigger: { trigger: title, start: "top 85%" },
      });
    });
  }

  /* =========================================================
     Counters (stats)
     ========================================================= */
  function initCounters() {
    gsap.utils.toArray(".stat__num").forEach((el) => {
      const end = parseFloat(el.dataset.count || "0");
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => gsap.to(obj, {
          v: end, duration: 1.6, ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.v); },
        }),
      });
    });
  }

  /* =========================================================
     NAV shrink + burger
     ========================================================= */
  function initNav() {
    const nav = document.getElementById("nav");
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => nav.classList.toggle("shrink", self.scroll() > 80),
      onToggle: (self) => nav.classList.toggle("shrink", self.isActive),
    });
    // simpler: on scroll
    window.addEventListener("scroll", () => {
      nav.classList.toggle("shrink", window.scrollY > 60);
    }, { passive: true });

    document.getElementById("burger")?.addEventListener("click", () => nav.classList.toggle("open"));
  }

  /* =========================================================
     CUSTOM CURSOR
     ========================================================= */
  function initCursor() {
    if (isTouch) return;
    const cursor = document.getElementById("cursor");
    const label = cursor.querySelector(".cursor__label");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hover");
        label.textContent = el.getAttribute("data-cursor");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hover");
        label.textContent = "";
      });
    });
  }

  /* =========================================================
     EMBERS canvas (subtle floating braise particles)
     ========================================================= */
  function initEmbers() {
    if (prefersReduced) return;
    const canvas = document.getElementById("embers");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const section = canvas.parentElement;
    let w, h, particles = [], raf = null, active = false;

    function resize() {
      w = canvas.width = section.offsetWidth;
      h = canvas.height = section.offsetHeight;
    }
    function make() {
      const count = Math.min(70, Math.floor(w / 24));
      particles = Array.from({ length: count }, () => spawn());
    }
    function spawn() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * h,
        r: Math.random() * 2 + 0.5,
        vy: -(Math.random() * 0.5 + 0.15),
        vx: (Math.random() - 0.5) * 0.3,
        life: Math.random(),
        flick: Math.random() * 0.02 + 0.005,
      };
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y += p.vy; p.x += p.vx + Math.sin(p.y * 0.01) * 0.2;
        p.life += p.flick;
        const alpha = (0.35 + Math.sin(p.life) * 0.35) * Math.min(1, p.y / h);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(224,135,46,${alpha})`);
        g.addColorStop(1, "rgba(224,135,46,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fill();
        if (p.y < -10) Object.assign(p, spawn(), { y: h + 10 });
      });
      raf = requestAnimationFrame(draw);
    }
    function start() { if (!active) { active = true; draw(); } }
    function stop() { active = false; cancelAnimationFrame(raf); }

    resize(); make();
    window.addEventListener("resize", () => { resize(); make(); });
    // only animate while section is in view (perf)
    ScrollTrigger.create({
      trigger: section, start: "top bottom", end: "bottom top",
      onEnter: start, onEnterBack: start, onLeave: stop, onLeaveBack: stop,
    });
  }

  /* =========================================================
     Ensure the broche video keeps playing (autoplay guards)
     ========================================================= */
  function initVideo() {
    const v = document.getElementById("brocheVideo");
    if (!v) return;
    v.muted = true;
    const tryPlay = () => { const p = v.play(); if (p) p.catch(() => {}); };
    tryPlay();
    // resume if a browser pauses it when off-screen / on tab return
    document.addEventListener("visibilitychange", () => { if (!document.hidden) tryPlay(); });
    v.addEventListener("pause", () => { if (!document.hidden) tryPlay(); });
    // kick once on first interaction as a safety net
    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true, passive: true });
  }

  /* =========================================================
     CARTE — filtres par catégorie
     ========================================================= */
  function initCarteFilter() {
    const filters = document.getElementById("carteFilters");
    if (!filters) return;
    const cats = gsap.utils.toArray(".cat");
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.cat;
      cats.forEach((c) => {
        const show = cat === "all" || c.dataset.cat === cat;
        c.classList.toggle("is-hidden", !show);
        if (show) { gsap.fromTo(c, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }); }
      });
      ScrollTrigger.refresh();
    });
  }

  /* =========================================================
     FAQ — accordéon
     ========================================================= */
  function initFaq() {
    gsap.utils.toArray(".qa").forEach((qa) => {
      const btn = qa.querySelector(".qa__q");
      const ans = qa.querySelector(".qa__a");
      btn.addEventListener("click", () => {
        const isOpen = qa.classList.contains("open");
        document.querySelectorAll(".qa.open").forEach((o) => {
          if (o !== qa) { o.classList.remove("open"); gsap.to(o.querySelector(".qa__a"), { height: 0, duration: 0.4, ease: "power2.inOut" }); }
        });
        if (isOpen) {
          qa.classList.remove("open");
          gsap.to(ans, { height: 0, duration: 0.4, ease: "power2.inOut" });
        } else {
          qa.classList.add("open");
          gsap.set(ans, { height: "auto" });
          gsap.from(ans, { height: 0, duration: 0.45, ease: "power2.out" });
        }
      });
    });
  }

  /* =========================================================
     AVIS GOOGLE — note + nombre d'avis mis à jour automatiquement
     -----------------------------------------------------------
     ⚙️  Pour activer la mise à jour en direct depuis Google :
        1. Créez une clé « Places API (New) » (console Google Cloud),
           restreinte au domaine de votre site.
        2. Récupérez le Place ID de la fiche O'Bresse.
        3. Renseignez CONFIG.placeId et CONFIG.apiKey ci-dessous.
     Sans configuration (ou en cas d'échec réseau), les valeurs de
     repli affichées restent 4,8 ★ et 27 avis.
     ========================================================= */
  function initGoogleRating() {
    const CONFIG = { placeId: "", apiKey: "" };

    const noteEl = document.getElementById("gNote");
    const countEl = document.getElementById("gCount");
    const fillEl = document.getElementById("gStarsFill");
    if (!noteEl || !countEl || !fillEl) return;

    const fr = (n) => String(n).replace(".", ",");
    const setStars = (rating) => { fillEl.style.width = Math.max(0, Math.min(100, (rating / 5) * 100)) + "%"; };

    const fbNote = parseFloat(noteEl.dataset.fallback || "4.8");
    const fbCountText = countEl.dataset.fallback || "plus de 30"; // texte de repli (non chiffré tant que l'API n'est pas branchée)

    // Anime uniquement la note (le compteur de repli reste "plus de 30")
    function renderNote(rating, animate) {
      setStars(rating);
      if (animate && !prefersReduced) {
        const a = { v: 0 };
        gsap.to(a, { v: rating, duration: 1.4, ease: "power2.out", onUpdate: () => (noteEl.textContent = fr(a.v.toFixed(1))) });
      } else {
        noteEl.textContent = fr(rating.toFixed(1));
      }
    }
    // Affiche le VRAI nombre d'avis (une fois l'API Google branchée), avec compte à rebours
    function renderCount(count, animate) {
      if (animate && !prefersReduced) {
        const b = { v: 0 };
        gsap.to(b, { v: count, duration: 1.6, ease: "power2.out", onUpdate: () => (countEl.textContent = Math.round(b.v)) });
      } else {
        countEl.textContent = count;
      }
    }

    setStars(fbNote);
    countEl.textContent = fbCountText;
    // Anime la note de repli quand le bandeau entre dans le viewport
    ScrollTrigger.create({ trigger: ".rating", start: "top 88%", once: true, onEnter: () => renderNote(fbNote, true) });

    // Tentative de mise à jour en direct (Places API New) → vrai nombre d'avis Google
    if (CONFIG.placeId && CONFIG.apiKey) {
      fetch(`https://places.googleapis.com/v1/places/${CONFIG.placeId}`, {
        headers: { "X-Goog-Api-Key": CONFIG.apiKey, "X-Goog-FieldMask": "rating,userRatingCount" },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => {
          if (typeof d.rating === "number") renderNote(d.rating, true);
          if (typeof d.userRatingCount === "number") renderCount(d.userRatingCount, true);
        })
        .catch(() => { /* conserve le repli : 4,8 · plus de 30 */ });
    }
  }

  /* =========================================================
     SCROLL PROGRESS BAR
     ========================================================= */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    gsap.to(bar, {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: () => document.documentElement.scrollHeight - window.innerHeight, scrub: 0.25, invalidateOnRefresh: true },
    });
  }

  /* =========================================================
     BOOT
     ========================================================= */
  window.addEventListener("DOMContentLoaded", () => {
    initVideo();
    initCursor();
    initNav();
    initReveals();
    initCounters();
    initCarteFilter();
    initFaq();
    initGoogleRating();
    initScrollProgress();

    if (prefersReduced) {
      document.body.classList.add("loaded");
      document.getElementById("preloader").style.display = "none";
      gsap.set(".hero__title .word > span", { y: 0 });
      gsap.set(".hero .reveal-up", { opacity: 1, y: 0 });
    } else {
      window.addEventListener("load", runPreloader);
      // fallback if load takes too long
      setTimeout(() => { if (!document.body.classList.contains("loaded")) runPreloader(); }, 2500);
    }

    ScrollTrigger.refresh();
  });
})();
