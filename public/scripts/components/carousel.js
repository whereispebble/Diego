(function () {
  const carousel = document.querySelector("[data-carousel]");

  if (!carousel) return;

  const emailConfig = {
    publicKey: "POrS9J_Lx5StD7b83",
    serviceId: "service_d0g6u2h",
    templateId: "template_izme267"
  };

  const mobileViewport = window.matchMedia("(max-width: 800px)").matches;
  const slides = [...carousel.querySelectorAll(mobileViewport ? ".mobile-slide" : ".desktop-slide")];
  const previousButton = carousel.querySelector(".arrow-prev");
  const nextButton = carousel.querySelector(".arrow-next");
  const title = carousel.querySelector("[data-carousel-title]");
  const subtitle = carousel.querySelector("[data-carousel-subtitle]");
  const mailForm = carousel.querySelector("[data-mail-cta]");
  const metadata = [
    { title: "Ray-Ban", subtitleKey: "carousel.rayban.subtitle" },
    { title: "Bioque Studio", subtitleKey: "carousel.bioque.subtitle" },
    { titleKey: "carousel.editorial.title", subtitleKey: "carousel.editorial.subtitle" }
  ];

  let current = 0;
  let isAnimating = false;
  let introIsRunning = true;
  let timer;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTarget = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introTarget = slides.length - 1;

  function t(key, params) {
    return window.siteI18n?.t(key, params) || key;
  }

  if (!reducedMotion) {
    carousel.classList.add("is-intro");
  }

  slides.forEach((slide, index) => {
    slide.style.setProperty("--slide-index", index);
  });

  function getImageSource(image) {
    return image.currentSrc || image.src;
  }

  function imageIsReady(image) {
    return image.complete && image.naturalWidth > 0;
  }

  function loadImage(image) {
    image.loading = "eager";
    image.fetchPriority = "high";

    if (imageIsReady(image)) {
      return image.decode ? image.decode().catch(() => {}) : Promise.resolve();
    }

    const preloader = new Image();
    preloader.decoding = "async";
    preloader.fetchPriority = "high";

    return new Promise((resolve) => {
      const done = () => resolve();
      preloader.addEventListener("load", done, { once: true });
      preloader.addEventListener("error", done, { once: true });
      preloader.src = getImageSource(image);
    }).then(() => (preloader.decode ? preloader.decode().catch(() => {}) : undefined));
  }

  function preloadSlide(index) {
    const slide = slides[(index + slides.length) % slides.length];
    slide.querySelectorAll("img").forEach((slideImage) => {
      const preloader = new Image();
      preloader.src = getImageSource(slideImage);
    });
  }

  function preloadHeroImages() {
    const criticalImages = slides.flatMap((slide) => [...slide.querySelectorAll("img")]);

    return Promise.allSettled(criticalImages.map(loadImage));
  }

  function delay(duration) {
    return new Promise((resolve) => window.setTimeout(resolve, duration));
  }

  function updateMetadata(index) {
    const item = metadata[index];
    title.textContent = item?.titleKey ? t(item.titleKey) : item?.title || "";
    subtitle.textContent = item?.subtitleKey ? t(item.subtitleKey) : "";
  }

  function setActiveSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
      slide.classList.remove("is-leaving");
    });
    updateMetadata(current);
  }

  function queueNext() {
    window.clearTimeout(timer);
    if (introIsRunning) return;
    preloadSlide(current + 1);
    timer = window.setTimeout(() => render(current + 1), 6200);
  }

  function getDirection(index, next) {
    if (current === slides.length - 1 && next === 0) return "next";
    if (current === 0 && next === slides.length - 1) return "previous";
    return index > current ? "next" : "previous";
  }

  function render(index) {
    if (isAnimating || introIsRunning) return;

    const next = (index + slides.length) % slides.length;
    if (next === current) {
      queueNext();
      return;
    }

    const previous = current;
    const direction = getDirection(index, next);

    isAnimating = true;
    carousel.dataset.direction = direction;
    carousel.classList.add("is-changing");

    slides[previous].classList.add("is-leaving");
    slides[previous].classList.remove("is-active");
    slides[next].classList.add("is-active");

    window.setTimeout(() => {
      current = next;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === current);
        slide.classList.remove("is-leaving");
      });
      updateMetadata(current);
      carousel.classList.remove("is-changing");
      isAnimating = false;
      queueNext();
    }, 1080);
  }

  function applySlide(next, duration) {
    return new Promise((resolve) => {
      const previous = current;
      carousel.dataset.direction = "next";
      carousel.classList.add("is-changing");
      slides[previous].classList.add("is-leaving");
      slides[previous].classList.remove("is-active");
      slides[next].classList.add("is-active");

      window.setTimeout(() => {
        current = next;
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === current);
          slide.classList.remove("is-leaving");
        });
        updateMetadata(current);
        carousel.classList.remove("is-changing");
        resolve();
      }, duration);
    });
  }

  function runIntroTrain(duration) {
    return new Promise((resolve) => {
      const finalOffset = slides.length - 1;

      carousel.style.setProperty("--intro-offset", "0");
      carousel.classList.add("is-intro-train");
      carousel.classList.remove("is-changing");

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          carousel.classList.add("is-intro-moving");
          carousel.style.setProperty("--intro-offset", finalOffset);
        });
      });

      window.setTimeout(() => {
        setActiveSlide(finalOffset);
        carousel.classList.remove("is-intro-moving");
        carousel.classList.remove("is-intro-train");
        carousel.style.removeProperty("--intro-offset");
        resolve();
      }, duration);
    });
  }

  async function runIntro() {
    setActiveSlide(0);
    await Promise.race([preloadHeroImages(), delay(520)]);
    await runIntroTrain(1450);
    carousel.classList.remove("is-intro");
    introIsRunning = false;
    carousel.classList.add("is-ready");
    queueNext();
  }

  previousButton.addEventListener("click", () => render(current - 1));
  nextButton.addEventListener("click", () => render(current + 1));

  carousel.addEventListener(
    "touchstart",
    (event) => {
      if (introIsRunning || event.touches.length !== 1) return;

      touchStartTarget = event.target;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      if (!touchStartTarget || touchStartTarget.closest("input, button, a")) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const isHorizontalSwipe = Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;

      touchStartTarget = null;

      if (!isHorizontalSwipe) return;
      render(deltaX < 0 ? current + 1 : current - 1);
    },
    { passive: true }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") render(current - 1);
    if (event.key === "ArrowRight") render(current + 1);
  });

  if (window.emailjs) {
    window.emailjs.init({ publicKey: emailConfig.publicKey });
  }

  mailForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = mailForm.querySelector("button");

    if (!window.emailjs || !button) return;

    button.textContent = t("home.sending");
    button.disabled = true;
    button.classList.remove("is-error");

    try {
      await window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, mailForm, {
        publicKey: emailConfig.publicKey
      });
      button.textContent = t("home.sent");
      button.classList.add("is-sent");
      mailForm.reset();
    } catch (error) {
      button.textContent = t("home.error");
      button.disabled = false;
      button.classList.add("is-error");
      console.error("EmailJS error", {
        status: error?.status,
        text: error?.text,
        name: error?.name,
        message: error?.message
      });
    }
  });

  window.addEventListener("languagechange", () => {
    updateMetadata(current);
    const button = mailForm?.querySelector("button");
    if (button && !button.disabled && !button.classList.contains("is-error") && !button.classList.contains("is-sent")) {
      button.textContent = t("home.send");
    }
  });

  if (reducedMotion) {
    introIsRunning = false;
    setActiveSlide(introTarget);
    carousel.classList.remove("is-intro", "is-intro-ready");
    carousel.classList.add("is-ready");
    queueNext();
  } else {
    runIntro();
  }
})();
