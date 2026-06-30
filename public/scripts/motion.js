(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) return;

  document.documentElement.classList.add("motion-ready");

  const motionTargets = [
    ...document.querySelectorAll(".inner-header, .about-grid, .project, .archive-card, .slide-meta")
  ];

  motionTargets.forEach((target, index) => {
    target.dataset.motion = "";
    target.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  motionTargets.forEach((target) => observer.observe(target));

  if (window.matchMedia("(pointer: coarse)").matches) return;

  let targetScroll = window.scrollY;
  let currentScroll = window.scrollY;
  let frame = null;

  function clamp(value) {
    return Math.max(0, Math.min(value, document.documentElement.scrollHeight - window.innerHeight));
  }

  function tick() {
    currentScroll += (targetScroll - currentScroll) * 0.12;
    window.scrollTo(0, currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.45) {
      frame = window.requestAnimationFrame(tick);
    } else {
      currentScroll = targetScroll;
      frame = null;
    }
  }

  window.addEventListener(
    "wheel",
    (event) => {
      if (document.body.classList.contains("is-locked")) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

      event.preventDefault();
      targetScroll = clamp(targetScroll + event.deltaY);

      if (!frame) {
        currentScroll = window.scrollY;
        frame = window.requestAnimationFrame(tick);
      }
    },
    { passive: false }
  );

  window.addEventListener("resize", () => {
    targetScroll = clamp(window.scrollY);
    currentScroll = targetScroll;
  });
})();
