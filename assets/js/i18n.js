let translations = {};
let currentLang = localStorage.getItem("lang") || "en";
let currentService = "financial";

// 🔥 Load translations
async function loadTranslations(lang) {
  const response = await fetch(`lang/${currentLang}.json`);
  translations = await response.json();
}

// 🔥 Render service
function renderService(serviceKey) {
  const data = translations[serviceKey];
  if (!data) return;

  document.getElementById("service-title").textContent = data.title;
  document.getElementById("service-desc").textContent = data.desc;

  const list = document.getElementById("service-list");
  list.innerHTML = "";

  data.items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<i class="bi bi-check-circle"></i> ${item}`;
    list.appendChild(li);
  });
}

// 🔥 Click handling (services)
const links = document.querySelectorAll(".services-list a");

links.forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");

    currentService = this.getAttribute("data-service");
    renderService(currentService);
  });
});

// 🔥 Apply static translations
function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerText = translations[key] || key;
  });
}

// 🔥 Update flag UI
function updateLangUI() {
  const flag = document.getElementById("lang-flag");
  if (!flag) return;

  flag.src = currentLang === "ar"
    ? "assets/img/flags/ksa.png"
    : "assets/img/flags/uk.png";
}

// 🔥 Change language
async function changeLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  await loadTranslations(lang);
  applyTranslations();

  // ✅ keep current service
  renderService(currentService);

  // 🔥 update flag
  updateLangUI();

  // RTL
  document.documentElement.lang = lang;
  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
  document.body.classList.toggle("arabic", lang === "ar");

// 🔥 close mobile menu (important for Dewi)
document.body.classList.remove("mobile-nav-active");

const toggleIcon = document.querySelector(".mobile-nav-toggle");
if (toggleIcon) {
  toggleIcon.classList.remove("bi-x");
  toggleIcon.classList.add("bi-list");
}
}

// 🔥 Toggle button
document.addEventListener("click", function (e) {
  const btn = e.target.closest("#lang-toggle");

  if (btn) {
    const newLang = currentLang === "en" ? "ar" : "en";
    changeLang(newLang);
  }
});

// 🔥 Initial load
document.addEventListener("DOMContentLoaded", async () => {
  await changeLang(currentLang);
});