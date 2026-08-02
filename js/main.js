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

    // Parallax on hero image
    if (!prefersReduced) {
      gsap.to("#heroImg", {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
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
     BOOT
     ========================================================= */
  window.addEventListener("DOMContentLoaded", () => {
    initVideo();
    initCursor();
    initNav();
    initReveals();
    initCounters();
    initEmbers();

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
