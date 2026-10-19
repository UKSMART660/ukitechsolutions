/* UKITECHSOLUTIONS interactions — no framework required */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.documentElement.classList.add("js-ready");

  const toastRegion = $("#toastRegion");
  function notify(message) {
    if (!toastRegion) return;
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    toastRegion.appendChild(item);
    window.setTimeout(() => item.remove(), 4200);
  }

  // Mobile navigation
  const navToggle = $("#navToggle");
  const primaryNav = $("#primaryNav");
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const open = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    $$(".primary-nav a").forEach(link => link.addEventListener("click", () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
    }));
    document.addEventListener("click", event => {
      if (!primaryNav.contains(event.target) && !navToggle.contains(event.target)) {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        primaryNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
        navToggle.focus();
      }
    });
  }

  // Theme preference
  const themeToggle = $("#themeToggle");
  const savedTheme = (() => { try { return localStorage.getItem("ukitech-theme"); } catch (_) { return null; } })();
  if (savedTheme === "light") document.body.classList.add("light-theme");
  function updateThemeButton() {
    if (!themeToggle) return;
    const light = document.body.classList.contains("light-theme");
    themeToggle.innerHTML = light
      ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
    themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
  }
  updateThemeButton();
  if (themeToggle) themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const light = document.body.classList.contains("light-theme");
    try { localStorage.setItem("ukitech-theme", light ? "light" : "dark"); } catch (_) {}
    updateThemeButton();
  });

  // Scroll reveal, with graceful fallback
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Search across visible cards on pages with a search input
  const searchInput = $("#siteSearch");
  const searchButton = $("#searchButton");
  const searchStatus = $("#searchStatus");
  function runSearch() {
    if (!searchInput) return;
    const term = searchInput.value.trim().toLowerCase();
    const cards = $$(".topic-card");
    let shown = 0;
    cards.forEach(card => {
      const searchableText = (card.innerText || card.textContent || "").toLowerCase();
      const matches = !term || searchableText.includes(term);
      card.hidden = !matches;
      if (matches) shown++;
    });
    if (searchStatus) searchStatus.textContent = term ? `${shown} learning ${shown === 1 ? "item" : "items"} found.` : "";
    const grid = $(".topic-grid");
    if (grid && term) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (searchButton) searchButton.addEventListener("click", runSearch);
  if (searchInput) searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") { event.preventDefault(); runSearch(); }
  });
  if (searchInput) searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) runSearch();
  });

  // Production contact form: submits to the server API. It does not claim success unless the server confirms storage.
  const contactForm = $("#contactForm");
  if (contactForm) contactForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    const status = $("#contactStatus");
    const button = contactForm.querySelector('button[type="submit"]');
    const original = button ? button.innerHTML : "";
    if (button) { button.disabled = true; button.textContent = "Sending securely…"; }
    if (status) status.textContent = "Submitting your message…";
    try {
      const formData = new FormData(contactForm);
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Your message could not be submitted. Please call or WhatsApp us.");
      if (status) status.textContent = result.message || "Your message was received by the server.";
      contactForm.reset();
      notify("Your message was submitted successfully.");
    } catch (error) {
      if (status) status.textContent = error.message || "Unable to reach the server. Please call or WhatsApp us.";
      notify("Message not sent. Please try again or contact us directly.");
    } finally {
      if (button) { button.disabled = false; button.innerHTML = original; }
    }
  });

  // Customer call and WhatsApp shortcuts are intentionally available on every page.
  if (!document.querySelector(".floating-contact")) {
    const shortcuts = document.createElement("div");
    shortcuts.className = "floating-contact";
    shortcuts.innerHTML = '<a class="call-link" href="tel:+2349067177330" aria-label="Call UKITECHSOLUTIONS"><i class="fa-solid fa-phone" aria-hidden="true"></i><span>Call us</span></a><a href="https://wa.me/2349067177330" target="_blank" rel="noopener noreferrer" aria-label="Chat with UKITECHSOLUTIONS on WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>WhatsApp</span></a>';
    document.body.appendChild(shortcuts);
  }

  // Back-to-top button and current year
  const year = $("#currentYear");
  if (year) year.textContent = new Date().getFullYear();
  const backToTop = $("#backToTop");
  const updateBackToTop = () => {
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 450);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // External links open safely in a new tab; current-page nav is already marked in HTML.
  // Add a subtle load state without blocking content.
  window.addEventListener("pageshow", () => document.body.classList.add("page-ready"));
})();