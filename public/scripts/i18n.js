(function () {
  const translations = {
    es: {
      "nav.home": "Inicio",
      "nav.information": "Perfil",
      "nav.projects": "Proyectos",
      "nav.archive": "Archivo",
      "nav.booking": "Reservas",
      "nav.menu": "Menu",
      "nav.close": "Cerrar",
      "nav.primary": "Navegacion principal",
      "nav.logo": "Inicio",
      "nav.bookSession": "Reservar sesion",
      "footer.location": "Madrid · Espana · Disponible worldwide",
      "footer.email": "Email",
      "footer.agency": "Agency",
      "home.meta": "Portfolio de Diego Assifawosen",
      "home.cta": "Get in touch",
      "home.emailPlaceholder": "tu email",
      "home.messagePlaceholder": "escribe tu mensaje",
      "home.send": "Enviar",
      "home.sending": "Enviando",
      "home.sent": "Enviado",
      "home.error": "Error",
      "carousel.rayban.subtitle": "Editorial - Madrid - 2026",
      "carousel.bioque.subtitle": "Portrait Series - Madrid - 2026",
      "carousel.editorial.title": "Editorial Session",
      "carousel.editorial.subtitle": "Bioque Studio - Madrid - 2026",
      "profile.meta": "Perfil de Diego Assifawosen",
      "profile.title": "Perfil",
      "profile.intro": "Modelo editorial y comercial con base en Madrid. Disponible para campanas, editoriales, e-commerce, fitting y proyectos audiovisuales.",
      "profile.bio": "Diego Assifawosen es un modelo con presencia editorial, energia tranquila y una imagen versatil para moda, retrato y campanas contemporaneas.",
      "profile.measurements": "Medidas del modelo",
      "profile.height": "Altura",
      "profile.chest": "Pecho",
      "profile.waist": "Cintura",
      "profile.hips": "Cadera",
      "profile.shoe": "Zapato",
      "profile.hair": "Pelo",
      "profile.eyes": "Ojos",
      "profile.black": "Negro",
      "profile.brown": "Marrones",
      "profile.contact": "Contacto",
      "profile.phone": "Telefono",
      "projects.meta": "Proyectos de Diego Assifawosen",
      "projects.title": "Trabajo",
      "projects.intro": "Seleccion de campanas, editoriales y colaboraciones recientes.",
      "booking.meta": "Reservas de sesiones con Diego Assifawosen",
      "booking.title": "Reservas",
      "booking.intro": "Sesiones editoriales, comerciales, test shoots y disponibilidad para proyectos.",
      "booking.calendar": "Google Calendar",
      "booking.copy": "Elige un hueco disponible y confirma la sesion directamente desde la agenda.",
      "booking.button": "Reservar sesion",
      "booking.duration": "Duracion",
      "booking.base": "Base",
      "booking.contact": "Contacto",
      "booking.directEmail": "Email directo",
      "archive.meta": "Archivo de Diego Assifawosen",
      "archive.title": "Archivo",
      "archive.intro": "Polaroids, pruebas de camara, backstage y momentos fuera de campana.",
      "archive.close": "Cerrar",
      "archive.previous": "Prev",
      "archive.next": "Next",
      "archive.closeCollection": "Cerrar coleccion",
      "archive.previousImage": "Imagen anterior",
      "archive.nextImage": "Imagen siguiente",
      "archive.thumbs": "Imagenes de la coleccion",
      "archive.openCollection": "Abrir coleccion",
      "archive.viewImage": "Ver imagen",
      "archive.imageOne": "1 imagen",
      "archive.imagesMany": "{count} imagenes",
      "archive.empty": "No hay colecciones disponibles."
    },
    en: {
      "nav.home": "Home",
      "nav.information": "Profile",
      "nav.projects": "Projects",
      "nav.archive": "Archive",
      "nav.booking": "Bookings",
      "nav.menu": "Menu",
      "nav.close": "Close",
      "nav.primary": "Main navigation",
      "nav.logo": "Home",
      "nav.bookSession": "Book a session",
      "footer.location": "Madrid · Spain · Available worldwide",
      "footer.email": "Email",
      "footer.agency": "Agency",
      "home.meta": "Diego Assifawosen portfolio",
      "home.cta": "Get in touch",
      "home.emailPlaceholder": "your email",
      "home.messagePlaceholder": "write your message",
      "home.send": "Send",
      "home.sending": "Sending",
      "home.sent": "Sent",
      "home.error": "Error",
      "carousel.rayban.subtitle": "Editorial - Madrid - 2026",
      "carousel.bioque.subtitle": "Portrait Series - Madrid - 2026",
      "carousel.editorial.title": "Editorial Session",
      "carousel.editorial.subtitle": "Bioque Studio - Madrid - 2026",
      "profile.meta": "Diego Assifawosen profile",
      "profile.title": "Profile",
      "profile.intro": "Editorial and commercial model based in Madrid. Available for campaigns, editorials, e-commerce, fittings and audiovisual projects.",
      "profile.bio": "Diego Assifawosen is a model with an editorial presence, calm energy and a versatile image for fashion, portraiture and contemporary campaigns.",
      "profile.measurements": "Model measurements",
      "profile.height": "Height",
      "profile.chest": "Chest",
      "profile.waist": "Waist",
      "profile.hips": "Hips",
      "profile.shoe": "Shoe",
      "profile.hair": "Hair",
      "profile.eyes": "Eyes",
      "profile.black": "Black",
      "profile.brown": "Brown",
      "profile.contact": "Contact",
      "profile.phone": "Phone",
      "projects.meta": "Diego Assifawosen projects",
      "projects.title": "Work",
      "projects.intro": "Selected recent campaigns, editorials and collaborations.",
      "booking.meta": "Book sessions with Diego Assifawosen",
      "booking.title": "Bookings",
      "booking.intro": "Editorial sessions, commercial work, test shoots and availability for projects.",
      "booking.calendar": "Google Calendar",
      "booking.copy": "Choose an available slot and confirm the session directly from the calendar.",
      "booking.button": "Book a session",
      "booking.duration": "Duration",
      "booking.base": "Base",
      "booking.contact": "Contact",
      "booking.directEmail": "Direct email",
      "archive.meta": "Diego Assifawosen archive",
      "archive.title": "Archive",
      "archive.intro": "Polaroids, camera tests, backstage and moments outside campaigns.",
      "archive.close": "Close",
      "archive.previous": "Prev",
      "archive.next": "Next",
      "archive.closeCollection": "Close collection",
      "archive.previousImage": "Previous image",
      "archive.nextImage": "Next image",
      "archive.thumbs": "Collection images",
      "archive.openCollection": "Open collection",
      "archive.viewImage": "View image",
      "archive.imageOne": "1 image",
      "archive.imagesMany": "{count} images",
      "archive.empty": "No collections available."
    }
  };

  const supportedLanguages = Object.keys(translations);
  const storageKey = "diego-language";

  function detectLanguage() {
    const saved = window.localStorage.getItem(storageKey);
    if (supportedLanguages.includes(saved)) return saved;

    const browserLanguage = (navigator.language || navigator.languages?.[0] || "es").toLowerCase();
    return browserLanguage.startsWith("en") ? "en" : "es";
  }

  function format(value, params = {}) {
    return Object.entries(params).reduce((text, [key, replacement]) => {
      return text.replaceAll(`{${key}}`, replacement);
    }, value);
  }

  function translate(key, params) {
    const language = document.documentElement.lang || detectLanguage();
    return format(translations[language]?.[key] || translations.es[key] || key, params);
  }

  function applyTranslations(language = detectLanguage()) {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.setAttribute("placeholder", translate(element.dataset.i18nPlaceholder));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });

    document.querySelectorAll("[data-i18n-content]").forEach((element) => {
      element.setAttribute("content", translate(element.dataset.i18nContent));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      document.title = translate(element.dataset.i18nTitle);
    });

    document.querySelectorAll("[data-language-option]").forEach((button) => {
      const isActive = button.dataset.languageOption === language;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
  }

  function setLanguage(language) {
    if (!supportedLanguages.includes(language)) return;
    window.localStorage.setItem(storageKey, language);
    applyTranslations(language);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language-option]");
    if (!button) return;
    setLanguage(button.dataset.languageOption);
  });

  window.siteI18n = {
    t: translate,
    getLanguage: () => document.documentElement.lang || detectLanguage(),
    setLanguage,
    applyTranslations
  };

  applyTranslations();
})();
