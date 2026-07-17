(() => {
  "use strict";

  const doc = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  body.classList.add("js");

  // Mobile navigation.
  const menuButton = document.querySelector(".menu-btn");
  const menu = document.querySelector(".nav-links");
  if (menuButton && menu) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Site-wide reveal system with accessible motion fallback.
  const revealTargets = [
    ".section-head", ".impact-panel", ".statement > div", ".statement-box",
    ".service-card", ".case", ".process-card", ".insight-card", ".cta",
    ".page-hero .container > *", ".long-copy > *", ".contact-card", ".form-card",
    ".checks .check", ".partner-runway-heading > *"
  ];
  const revealEls = [...document.querySelectorAll(revealTargets.join(","))];
  revealEls.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.setProperty("--reveal-delay", `${Math.min((index % 6) * 65, 325)}ms`);
  });

  const heroArt = document.querySelector(".hero-art");
  if (heroArt) heroArt.classList.add("reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    revealEls.concat(heroArt ? [heroArt] : []).forEach(el => observer.observe(el));
  } else {
    revealEls.concat(heroArt ? [heroArt] : []).forEach(el => el.classList.add("in-view"));
  }

  // Progress bar, compact header, safe scroll parallax and process progress.
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  body.prepend(progress);

  const header = document.querySelector(".site-header");
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];
  const processShell = document.querySelector(".process-shell");
  let ticking = false;

  const updateScroll = () => {
    const scrollY = window.scrollY || 0;
    const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
    doc.style.setProperty("--scroll-progress", `${Math.min(scrollY / maxScroll * 100, 100)}%`);
    if (header) header.classList.toggle("is-scrolled", scrollY > 24);

    if (!reduceMotion && window.innerWidth > 640) {
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -150 || rect.top > window.innerHeight + 150) return;
        const speed = Number(el.dataset.parallax || 0.02);
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = Math.max(-42, Math.min(42, -centerOffset * speed));
        if (el.classList.contains("hero-art")) {
          el.style.setProperty("--hero-lift", `${shift}px`);
        } else {
          el.style.transform = `translate3d(0, ${shift}px, 0)`;
        }
      });
    }

    if (processShell) {
      const rect = processShell.getBoundingClientRect();
      const start = window.innerHeight * 0.8;
      const end = -rect.height * 0.15;
      const ratio = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      processShell.style.setProperty("--process-progress", `${ratio * 100}%`);
    }
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  updateScroll();

  // Pointer-driven dashboard depth and ambient cursor light.
  if (finePointer && !reduceMotion) {
    body.classList.add("has-pointer");
    window.addEventListener("pointermove", event => {
      doc.style.setProperty("--pointer-x", `${event.clientX}px`);
      doc.style.setProperty("--pointer-y", `${event.clientY}px`);
    }, { passive: true });

    if (heroArt) {
      heroArt.addEventListener("pointermove", event => {
        const rect = heroArt.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        heroArt.style.setProperty("--hero-ry", `${px * 4}deg`);
        heroArt.style.setProperty("--hero-rx", `${py * -4}deg`);
        heroArt.querySelectorAll("[data-depth]").forEach(layer => {
          const depth = Number(layer.dataset.depth || 0.12);
          layer.style.setProperty("--depth-x", `${px * depth * 70}px`);
          layer.style.setProperty("--depth-y", `${py * depth * 70}px`);
        });
      });
      heroArt.addEventListener("pointerleave", () => {
        heroArt.style.setProperty("--hero-ry", "0deg");
        heroArt.style.setProperty("--hero-rx", "0deg");
        heroArt.querySelectorAll("[data-depth]").forEach(layer => {
          layer.style.setProperty("--depth-x", "0px");
          layer.style.setProperty("--depth-y", "0px");
        });
      });
    }

    // Cursor-aware card glow. No excessive tilting to preserve readability.
    document.querySelectorAll(".service-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--card-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--card-y", `${event.clientY - rect.top}px`);
      });
    });
  }

  // Contact form mailto fallback.
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const subject = encodeURIComponent(`RevenueStack Media inquiry — ${data.get("company") || data.get("name")}`);
      const emailBody = encodeURIComponent(
`Name: ${data.get("name")}
Email: ${data.get("email")}
Company / Network: ${data.get("company")}
Interest: ${data.get("service")}

Message:
${data.get("message")}`
      );
      window.location.href = `mailto:hello@revenuestackmedia.com?subject=${subject}&body=${emailBody}`;
      const success = document.querySelector(".success");
      if (success) success.style.display = "block";
    });
  }
})();
