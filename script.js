const artworks = [
  { file: "image_1.webp", title: "Soft Bloom", description: "Розмиті форми й теплі кольори створюють відчуття руху, світла та ніжності.", tags: ["Soft focus", "Pastel", "Floral mood"] },
  { file: "image_2.webp", title: "Quiet Petals", description: "Світла абстрактна композиція, у якій прозорі відтінки переплітаються з природними формами.", tags: ["Light", "Organic forms", "Dreamy"] },
  { file: "image_3.webp", title: "Petal Study", description: "М’які лінії та делікатні переходи кольору утворюють спокійний візуальний ритм.", tags: ["Abstract", "Motion", "Pastel"] },
  { file: "image_4.webp", title: "Blush in Motion", description: "Теплі персикові й рожеві тони нагадують фрагмент квітки, знятий крізь м’яке світло.", tags: ["Blush", "Texture", "Floral mood"] },
  { file: "image_5.webp", title: "Lavender Haze", description: "Пастельні фіолетові та молочні відтінки створюють майже невагому композицію.", tags: ["Lavender", "Dreamy", "Soft focus"] },
  { file: "image_6.webp", title: "Golden Hour", description: "Світло-жовті акценти та розмиті форми додають композиції тепла й глибини.", tags: ["Warm light", "Organic forms", "Abstract"] },
  { file: "image_7.webp", title: "Petal Whisper", description: "Ніжні відтінки й плавні форми створюють відчуття тихого руху.", tags: ["Petals", "Soft light", "Pastel"] },
  { file: "image_8.webp", title: "Apricot Veil", description: "Персикові акценти розчиняються у світлому тлі та м’яких текстурах.", tags: ["Apricot", "Texture", "Dreamy"] },
  { file: "image_9.webp", title: "Rose Atmosphere", description: "Рожеві й теплі нейтральні відтінки утворюють делікатну абстрактну композицію.", tags: ["Rose", "Atmosphere", "Abstract"] },
  { file: "image_10.webp", title: "Blooming Light", description: "Розсіяне світло та органічні лінії завершують добірку спокійним кольоровим акцентом.", tags: ["Light", "Organic forms", "Floral mood"] }
];

const gallery = document.querySelector("#gallery-grid");
const sentinel = document.querySelector("#loading-sentinel");
const dialog = document.querySelector("#art-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDescription = document.querySelector("#dialog-description");
const dialogTags = document.querySelector("#dialog-tags");
const dialogIndex = document.querySelector("#dialog-index");
const closeButton = document.querySelector("#dialog-close");
const status = document.querySelector("#gallery-status");

let nextArtworkIndex = 0;
let lastFocusedCard = null;
const initialBatchSize = artworks.length;
const nextBatchSize = 6;
let isAppendingBatch = false;

function createArtworkCard(artwork, index) {
  const card = document.createElement("button");
  card.className = "art-card";
  card.type = "button";
  card.setAttribute("aria-label", `Відкрити роботу «${artwork.title}»`);

  const image = document.createElement("img");
  image.src = `images/${artwork.file}`;
  image.alt = `Абстрактна квіткова композиція — ${artwork.title}`;
  image.loading = "lazy";
  image.decoding = "async";
  image.draggable = false;

  const title = document.createElement("span");
  title.className = "art-card-title";
  title.textContent = artwork.title;

  card.append(image, title);
  card.addEventListener("click", () => openArtwork(artwork, index, card));
  return card;
}

function appendBatch(count) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i += 1) {
    const artworkIndex = nextArtworkIndex % artworks.length;
    const artwork = artworks[artworkIndex];
    const globalIndex = nextArtworkIndex;
    const card = createArtworkCard(artwork, globalIndex);
    card.style.animationDelay = `${Math.min(i * 35, 210)}ms`;
    fragment.appendChild(card);
    nextArtworkIndex += 1;
  }

  gallery.appendChild(fragment);
  status.textContent = `У галереї показано ${nextArtworkIndex} зображень.`;
}

function fitDialogToImage() {
  if (!dialogImage.naturalWidth || !dialogImage.naturalHeight) return;

  const ratio = dialogImage.naturalWidth / dialogImage.naturalHeight;
  const mobile = window.matchMedia("(max-width: 650px)").matches;
  const viewportHeight = Math.max(280, window.innerHeight - (mobile ? 32 : 80));
  const viewportWidth = Math.max(280, window.innerWidth - (mobile ? 20 : 80));

  if (mobile) {
    const imageWidth = viewportWidth;
    const imageHeight = Math.min(imageWidth / ratio, window.innerHeight * 0.58);
    dialog.style.setProperty("--dialog-width", `${viewportWidth}px`);
    dialog.style.setProperty("--dialog-height", `${Math.min(window.innerHeight - 20, imageHeight + 300)}px`);
    dialog.style.setProperty("--artwork-width", "minmax(0, 1fr)");
    dialog.style.setProperty("--mobile-artwork-height", `${imageHeight}px`);
  } else {
    const infoWidth = 370;
    const imageHeight = Math.min(790, viewportHeight, (viewportWidth - infoWidth) / ratio);
    const imageWidth = imageHeight * ratio;
    dialog.style.setProperty("--dialog-width", `${imageWidth + infoWidth}px`);
    dialog.style.setProperty("--dialog-height", `${imageHeight}px`);
    dialog.style.setProperty("--artwork-width", `${imageWidth}px`);
    dialog.style.setProperty("--mobile-artwork-height", "");
  }
}

function openArtwork(artwork, index, card) {
  lastFocusedCard = card;
  dialogImage.alt = `Зображення «${artwork.title}»`;
  dialogImage.onload = fitDialogToImage;
  dialogImage.src = `images/${artwork.file}`;
  dialog.classList.toggle("is-portrait", artwork.file === "image_1.webp" || artwork.file === "image_2.webp");
  dialogTitle.textContent = artwork.title;
  dialogDescription.textContent = artwork.description;
  dialogIndex.textContent = `ARTWORK ${String((index % artworks.length) + 1).padStart(2, "0")}  /  ${String(artworks.length).padStart(2, "0")}`;

  dialogTags.replaceChildren();
  artwork.tags.forEach((tagText) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    dialogTags.appendChild(tag);
  });

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    document.body.classList.add("dialog-open");
    closeButton.focus();
  }
}

function closeArtwork() {
  if (dialog.open) dialog.close();
}

window.addEventListener("resize", () => {
  if (dialog.open) fitDialogToImage();
});

closeButton.addEventListener("click", closeArtwork);

dialog.addEventListener("click", (event) => {
  // Clicking the backdrop closes the dialog; clicks inside the panel do not.
  if (event.target === dialog) closeArtwork();
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (lastFocusedCard && document.contains(lastFocusedCard)) lastFocusedCard.focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog.open) closeArtwork();
});

appendBatch(initialBatchSize);

// Нескінченне прокручування: наступні зображення додаються, коли користувач
// наближається до нижньої межі галереї.
const galleryObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting) && !isAppendingBatch) {
    isAppendingBatch = true;
    appendBatch(nextBatchSize);
    requestAnimationFrame(() => { isAppendingBatch = false; });
  }
}, {
  root: null,
  rootMargin: "650px 0px",
  threshold: 0
});
galleryObserver.observe(sentinel);



// --- Практична робота 5: SPA-навігація та збереження глобального стану ---
const pageSections = document.querySelectorAll(".page-section");
const navLinks = document.querySelectorAll(".nav-link");
const validRoutes = new Set(["gallery", "about", "feedback", "ui-kit"]);

function showRoute(routeName) {
  const route = validRoutes.has(routeName) ? routeName : "gallery";

  pageSections.forEach((section) => {
    section.classList.toggle("is-hidden", section.dataset.page !== route);
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  window.scrollTo({ top: 0, behavior: "auto" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const nextRoute = link.dataset.route;
    if (location.hash === `#${nextRoute}`) {
      showRoute(nextRoute);
    } else {
      location.hash = nextRoute;
    }
  });
});

window.addEventListener("hashchange", () => {
  showRoute(location.hash.slice(1));
});

// Перший розділ відкривається за замовчуванням; прямі хеш-посилання також працюють.
showRoute(location.hash.slice(1) || "gallery");

// Глобальний секундомір розташований поза секціями, тому не скидається під час SPA-переходів.
const sessionTimer = document.querySelector("#session-timer");
const sessionStartedAt = Date.now();

function updateSessionTimer() {
  const elapsedSeconds = Math.floor((Date.now() - sessionStartedAt) / 1000);
  const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  sessionTimer.textContent = `${hours}:${minutes}:${seconds}`;
}
updateSessionTimer();
window.setInterval(updateSessionTimer, 1000);

// --- Практична робота 4: тема, вподобання, форма та BOM ---
const themeToggle = document.querySelector("#theme-toggle");
const likeButton = document.querySelector("#like-button");
const likeLabel = document.querySelector("#like-label");
const likeCount = document.querySelector("#like-count");
const feedbackForm = document.querySelector("#feedback-form");
const nameInput = document.querySelector("#feedback-name");
const messageInput = document.querySelector("#feedback-message");
const nameError = document.querySelector("#name-error");
const messageError = document.querySelector("#message-error");
const characterCount = document.querySelector("#character-count");
const formStatus = document.querySelector("#form-status");
const feedbackList = document.querySelector("#feedback-list");
const backToTop = document.querySelector("#back-to-top");
const connectionStatus = document.querySelector("#connection-status");

const likedArtworks = new Set();
const likeCounts = new Map();
let currentArtworkKey = null;

function updateThemeButton(isDark) {
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Увімкнути світлу тему" : "Увімкнути темну тему");
  themeToggle.querySelector(".theme-icon").innerHTML = isDark
    ? '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>'
    : '<path d="M20.2 15.1A8.2 8.2 0 0 1 8.9 3.8 8.4 8.4 0 1 0 20.2 15.1Z"></path>';
}

const savedTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
document.body.dataset.theme = savedTheme;
updateThemeButton(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  document.body.dataset.theme = isDark ? "dark" : "light";
  updateThemeButton(isDark);
});

function renderLikeState() {
  const isLiked = likedArtworks.has(currentArtworkKey);
  likeButton.classList.toggle("is-liked", isLiked);
  likeButton.setAttribute("aria-pressed", String(isLiked));
  likeLabel.textContent = isLiked ? "Подобається" : "Подобається";
  likeCount.textContent = String(likeCounts.get(currentArtworkKey) || 0);
}

likeButton.addEventListener("click", () => {
  if (!currentArtworkKey) return;
  const count = likeCounts.get(currentArtworkKey) || 0;

  if (likedArtworks.has(currentArtworkKey)) {
    likedArtworks.delete(currentArtworkKey);
    likeCounts.set(currentArtworkKey, Math.max(0, count - 1));
  } else {
    likedArtworks.add(currentArtworkKey);
    likeCounts.set(currentArtworkKey, count + 1);
  }

  renderLikeState();
});

const originalOpenArtwork = openArtwork;
openArtwork = function (artwork, index, card) {
  currentArtworkKey = artwork.file;
  if (!likeCounts.has(currentArtworkKey)) likeCounts.set(currentArtworkKey, 0);
  originalOpenArtwork(artwork, index, card);
  renderLikeState();
};

function validateField(input, errorElement, minLength, label) {
  const value = input.value.trim();
  let message = "";

  if (!value) {
    message = "Будь ласка, заповни це поле.";
  } else if (value.length < minLength) {
    message = `Введи щонайменше ${minLength} символи.`;
  }

  errorElement.textContent = message;
  input.classList.toggle("is-invalid", Boolean(message));
  input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

nameInput.addEventListener("blur", () => {
  if (nameInput.value.trim()) validateField(nameInput, nameError, 2, "ім’я");
});
messageInput.addEventListener("blur", () => {
  if (messageInput.value.trim()) validateField(messageInput, messageError, 5, "відгук");
});

nameInput.addEventListener("input", () => {
  if (nameInput.classList.contains("is-invalid")) validateField(nameInput, nameError, 2, "ім’я");
});
messageInput.addEventListener("input", () => {
  characterCount.textContent = `${messageInput.value.length} / 400`;
  if (messageInput.classList.contains("is-invalid")) validateField(messageInput, messageError, 5, "відгук");
});

feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameIsValid = validateField(nameInput, nameError, 2, "ім’я");
  const messageIsValid = validateField(messageInput, messageError, 5, "відгук");

  if (!nameIsValid || !messageIsValid) {
    formStatus.textContent = "Перевір, будь ласка, поля, позначені червоним.";
    formStatus.classList.add("is-error");
    (!nameIsValid ? nameInput : messageInput).focus();
    return;
  }

  const item = document.createElement("article");
  item.className = "feedback-item";

  const author = document.createElement("strong");
  author.textContent = nameInput.value.trim();

  const text = document.createElement("p");
  text.textContent = messageInput.value.trim();

  item.append(author, text);
  feedbackList.prepend(item);

  formStatus.textContent = "Дякуємо! Відгук додано на цю сторінку.";
  formStatus.classList.remove("is-error");
  feedbackForm.reset();
  characterCount.textContent = "0 / 400";
  nameError.textContent = "";
  messageError.textContent = "";
  nameInput.classList.remove("is-invalid");
  messageInput.classList.remove("is-invalid");
  nameInput.setAttribute("aria-invalid", "false");
  messageInput.setAttribute("aria-invalid", "false");
});

// BOM: window dimensions, scroll position, browser events and scrolling.
function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 420);
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
window.addEventListener("resize", () => {
  // window.innerWidth / innerHeight are also used by fitDialogToImage().
  document.documentElement.dataset.viewport = window.innerWidth < 650 ? "small" : "large";
  updateBackToTop();
});
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function updateConnectionStatus() {
  const isOnline = navigator.onLine;
  connectionStatus.textContent = isOnline ? "З’єднання доступне" : "Немає з’єднання";
  connectionStatus.classList.toggle("is-offline", !isOnline);
}
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);
updateConnectionStatus();

// Логотип повертає користувача до галереї без перезавантаження документа.
document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  if (location.hash === "#gallery") showRoute("gallery");
  else location.hash = "gallery";
});


// --- Практична робота 6: Screen States та керування каталогом ---
const stateContainers = document.querySelectorAll("[data-state]");
const stateButtons = document.querySelectorAll("[data-show-state]");
const searchInput = document.querySelector("#artwork-search");
const galleryTools = document.querySelector("#gallery-tools");
const refreshGalleryButton = document.querySelector("#refresh-gallery");
const resetGalleryButton = document.querySelector("#reset-gallery");
const retryGalleryButton = document.querySelector("#retry-gallery");
let loadingTimeout = null;
let currentSearch = "";

function renderState(stateName) {
  const allowedStates = new Set(["loading", "content", "empty", "error"]);
  const nextState = allowedStates.has(stateName) ? stateName : "content";

  stateContainers.forEach((container) => {
    const isActive = container.dataset.state === nextState;
    container.hidden = !isActive;
    container.classList.toggle("is-current-state", isActive);
  });
  stateButtons.forEach((button) => {
    const isActive = button.dataset.showState === nextState;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  galleryTools.hidden = nextState !== "content" && nextState !== "empty";
}

function renderFilteredGallery(query) {
  currentSearch = query.trim().toLocaleLowerCase("uk");
  gallery.replaceChildren();
  nextArtworkIndex = 0;
  galleryObserver.unobserve(sentinel);

  const matches = artworks.filter((artwork) =>
    `${artwork.title} ${artwork.description} ${artwork.tags.join(" ")}`.toLocaleLowerCase("uk").includes(currentSearch)
  );

  if (!matches.length) {
    renderState("empty");
    status.textContent = "За вашим запитом нічого не знайдено.";
    return;
  }

  const fragment = document.createDocumentFragment();
  matches.forEach((artwork, index) => fragment.appendChild(createArtworkCard(artwork, index)));
  gallery.appendChild(fragment);
  renderState("content");
  status.textContent = `Знайдено робіт: ${matches.length}.`;
  if (!currentSearch) {
    nextArtworkIndex = matches.length;
    galleryObserver.observe(sentinel);
  }
}

function simulateGalleryLoading() {
  window.clearTimeout(loadingTimeout);
  renderState("loading");
  loadingTimeout = window.setTimeout(() => {
    if (currentSearch) searchInput.value = "";
    currentSearch = "";
    renderFilteredGallery("");
    renderState("content");
  }, 1700);
}

stateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    window.clearTimeout(loadingTimeout);
    const requestedState = button.dataset.showState;
    if (requestedState === "content") {
      renderFilteredGallery(currentSearch);
    } else {
      renderState(requestedState);
    }
  });
});

searchInput.addEventListener("input", () => renderFilteredGallery(searchInput.value));
refreshGalleryButton.addEventListener("click", simulateGalleryLoading);
resetGalleryButton.addEventListener("click", () => {
  searchInput.value = "";
  renderFilteredGallery("");
});
retryGalleryButton.addEventListener("click", simulateGalleryLoading);

// Початковий стан — каталог із даними.
renderState("content");
