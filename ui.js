// Animations d'apparition au défilement (style Apple).
(function () {
  var SELECTOR =
    "main > section, .panel, .vehicle-card, .article-card, .promo-frame, .trust-strip > div, .spec-item, .fact";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var supported = "IntersectionObserver" in window;

  var io = null;
  if (supported && !reduce) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }

  function setupReveals() {
    var targets = document.querySelectorAll(SELECTOR);
    targets.forEach(function (el, i) {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = "1";

      if (!io) {
        el.classList.add("is-visible");
        return;
      }
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min((i % 6) * 60, 300) + "ms";
      io.observe(el);
    });
  }

  window.refreshReveals = setupReveals;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupReveals);
  } else {
    setupReveals();
  }
  window.addEventListener("load", setupReveals);
})();
