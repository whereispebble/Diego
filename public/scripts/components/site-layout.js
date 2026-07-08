(function () {
  const navigation = [
    { id: "home", key: "nav.home", label: "Inicio", href: "/" },
    { id: "information", key: "nav.information", label: "Perfil", href: "/perfil.html" },
    { id: "projects", key: "nav.projects", label: "Videobook", href: "/videobook.html" },
    { id: "archive", key: "nav.archive", label: "Proyectos", href: "/archivo.html" }
  ];

  function translate(key, fallback) {
    return window.siteI18n?.t(key) || fallback;
  }

  function languageSwitcher() {
    return `
      <div class="language-switcher" aria-label="Language">
        <button type="button" data-language-option="es" aria-pressed="false">ES</button>
        <button type="button" data-language-option="en" aria-pressed="false">EN</button>
      </div>
    `;
  }

  function emailLink() {
    const subject = encodeURIComponent("Contacto para Diego Assifawosen");
    const body = encodeURIComponent(
      "Hola Diego,\n\nMe gustaria contactar contigo para una posible colaboracion.\n\nGracias."
    );
    return `mailto:diegotbenitez@gmail.com?subject=${subject}&body=${body}`;
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const activePage = this.getAttribute("active-page") || "home";
      const links = navigation
        .map(
          ({ id, key, label, href }) => `
            <a class="nav-button ${activePage === id ? "is-active" : ""}" href="${href}">
              <span class="nav-label" data-i18n="${key}" data-text="${translate(key, label)}">${translate(key, label)}</span>
            </a>
          `
        )
        .join("");

      const mobileLinks = [
        ...navigation,
        { id: "booking", key: "nav.booking", label: "Reservas", href: "/reservas.html" }
      ]
        .map(
          ({ key, label, href }) => `
            <a class="mobile-link" href="${href}" data-i18n="${key}">${translate(key, label)}</a>
          `
        )
        .join("");

      this.innerHTML = `
        <a class="site-logo" href="/" aria-label="${translate("nav.logo", "Inicio")}" data-i18n-aria-label="nav.logo">DIEGO ASSIFAWOSEN</a>
        <nav class="desktop-nav" aria-label="${translate("nav.primary", "Navegacion principal")}" data-i18n-aria-label="nav.primary">
          ${links}
          <a class="nav-button nav-icon" href="/reservas.html" aria-label="${translate("nav.bookSession", "Reservar sesion")}" data-i18n-aria-label="nav.bookSession">
            <span class="calendar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <rect x="4.5" y="5.5" width="15" height="14" rx="1.5"></rect>
                <path d="M8 3.5v4M16 3.5v4M4.5 10h15"></path>
              </svg>
            </span>
          </a>
          ${languageSwitcher()}
        </nav>
        <button class="menu-button" type="button" aria-expanded="false" data-i18n="nav.menu">${translate("nav.menu", "Menu")}</button>
        <div class="mobile-menu">
          <nav>${mobileLinks}${languageSwitcher()}</nav>
        </div>
      `;

      const menuButton = this.querySelector(".menu-button");
      const mobileMenu = this.querySelector(".mobile-menu");

      const closeMenu = () => {
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("is-locked");
        menuButton.textContent = translate("nav.menu", "Menu");
        menuButton.dataset.i18n = "nav.menu";
        menuButton.setAttribute("aria-expanded", "false");
      };

      menuButton.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("is-open");
        document.body.classList.toggle("is-locked", isOpen);
        const key = isOpen ? "nav.close" : "nav.menu";
        menuButton.textContent = translate(key, isOpen ? "Cerrar" : "Menu");
        menuButton.dataset.i18n = key;
        menuButton.setAttribute("aria-expanded", String(isOpen));
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
      });

      window.addEventListener("languagechange", () => {
        this.querySelectorAll(".nav-label").forEach((label) => {
          label.dataset.text = label.textContent;
        });
      });

      window.siteI18n?.applyTranslations();
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="bottom-bar">
          <div class="bottom-links">
            <a href="https://www.instagram.com/diegobennitezz/" target="_blank" rel="noopener">Instagram</a>
            <a href="${emailLink()}" data-i18n="footer.email">${translate("footer.email", "Email")}</a>
            <a href="https://wa.me/34663269208" target="_blank" rel="noopener" data-i18n="footer.whatsapp">${translate("footer.whatsapp", "WhatsApp")}</a>
          </div>
          <span data-i18n="footer.location">${translate("footer.location", "Madrid · Espana · Disponible worldwide")}</span>
          <div class="bottom-links">
            <a href="#" data-placeholder-link>© 2026</a>
          </div>
        </footer>
      `;

      this.querySelectorAll("[data-placeholder-link]").forEach((link) => {
        link.addEventListener("click", (event) => event.preventDefault());
      });

      window.siteI18n?.applyTranslations();
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);

  document.querySelectorAll(".project, .archive-card, [data-placeholder-link]").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });
})();
