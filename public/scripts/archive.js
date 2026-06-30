(function () {
  const grid = document.querySelector("[data-archive-grid]");
  const viewer = document.querySelector("[data-collection-viewer]");
  const image = document.querySelector("[data-collection-image]");
  const title = document.querySelector("[data-collection-title]");
  const count = document.querySelector("[data-collection-count]");
  const thumbs = document.querySelector("[data-collection-thumbs]");
  const closeButton = document.querySelector("[data-close-collection]");
  const previousButton = document.querySelector("[data-previous-image]");
  const nextButton = document.querySelector("[data-next-image]");

  if (!grid || !viewer || !image || !title || !count || !thumbs || !closeButton || !previousButton || !nextButton) return;

  let collections = {};
  let activeCollection;
  let activeIndex = 0;
  const preloadedImages = new Set();

  function t(key, params) {
    return window.siteI18n?.t(key, params) || key;
  }

  function preloadImage(src) {
    if (preloadedImages.has(src)) return;

    preloadedImages.add(src);
    const preloader = new Image();
    preloader.decoding = "async";
    preloader.src = src;
  }

  function preloadCollection(collectionName) {
    collections[collectionName]?.images.forEach(preloadImage);
  }

  function preloadAllCollections() {
    Object.keys(collections).forEach(preloadCollection);
  }

  function collectionCountLabel(collection) {
    const countText =
      collection.images.length === 1
        ? t("archive.imageOne")
        : t("archive.imagesMany", { count: collection.images.length });
    return `${countText} - 2026`;
  }

  function renderCards(collectionList) {
    grid.innerHTML = "";

    collectionList.forEach((collection, collectionIndex) => {
      const card = document.createElement("button");
      const previewImages = collection.images.slice(0, 4);

      card.className = "archive-card archive-collection";
      card.type = "button";
      card.dataset.collection = collection.id;
      card.setAttribute("aria-label", `${t("archive.openCollection")} ${collection.title}`);
      card.innerHTML = `
        <span class="archive-preview" aria-hidden="true">
          ${previewImages
            .map(
              (src, imageIndex) =>
                `<img src="${src}" alt="" loading="${collectionIndex < 2 ? "eager" : "lazy"}" decoding="async"${
                  collectionIndex < 2 && imageIndex < 2 ? ' fetchpriority="high"' : ""
                } />`
            )
            .join("")}
        </span>
        <span class="archive-label">
          <span>${collection.title}</span>
          <span>${collectionCountLabel(collection)}</span>
        </span>
      `;

      card.addEventListener("click", () => openCollection(collection.id));
      card.addEventListener("pointerenter", () => preloadCollection(collection.id), { once: true });
      card.addEventListener("focus", () => preloadCollection(collection.id), { once: true });
      grid.append(card);
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = "";

    activeCollection.images.forEach((src, index) => {
      const button = document.createElement("button");
      button.className = "collection-thumb";
      button.type = "button";
      button.setAttribute("aria-label", `${t("archive.viewImage")} ${index + 1}`);
      button.innerHTML = `<img src="${src}" alt="" loading="lazy" decoding="async" />`;
      button.addEventListener("click", () => renderImage(index));
      thumbs.append(button);
    });
  }

  function renderImage(index) {
    activeIndex = (index + activeCollection.images.length) % activeCollection.images.length;
    image.src = activeCollection.images[activeIndex];
    image.alt = `${activeCollection.title} ${activeIndex + 1}`;
    title.textContent = activeCollection.title;
    count.textContent = `${activeIndex + 1} / ${activeCollection.images.length}`;

    [...thumbs.children].forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === activeIndex);
    });
  }

  function openCollection(collectionName) {
    activeCollection = collections[collectionName];
    if (!activeCollection) return;

    renderThumbs();
    renderImage(0);
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    closeButton.focus();
  }

  function closeCollection() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
  }

  closeButton.addEventListener("click", closeCollection);
  previousButton.addEventListener("click", () => renderImage(activeIndex - 1));
  nextButton.addEventListener("click", () => renderImage(activeIndex + 1));

  window.addEventListener("languagechange", () => {
    const collectionList = Object.values(collections);
    if (collectionList.length) renderCards(collectionList);
    if (activeCollection) {
      renderThumbs();
      renderImage(activeIndex);
    }
  });

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) closeCollection();
  });

  document.addEventListener("keydown", (event) => {
    if (!viewer.classList.contains("is-open")) return;

    if (event.key === "Escape") closeCollection();
    if (event.key === "ArrowLeft") renderImage(activeIndex - 1);
    if (event.key === "ArrowRight") renderImage(activeIndex + 1);
  });

  fetch("/images/manifest.json")
    .then((response) => (response.ok ? response.json() : Promise.reject()))
    .then((manifest) => {
      const collectionList = manifest.collections || [];
      collections = Object.fromEntries(collectionList.map((collection) => [collection.id, collection]));
      activeCollection = collectionList[0];
      renderCards(collectionList);

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(preloadAllCollections, { timeout: 2200 });
      } else {
        window.setTimeout(preloadAllCollections, 900);
      }
    })
    .catch(() => {
      grid.innerHTML = `<p class="archive-empty">${t("archive.empty")}</p>`;
    });
})();
