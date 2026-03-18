let translations = {};

async function loadTranslations(lang) {
  const response = await fetch(`lang/${lang}.json`);
  translations = await response.json();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.innerText = translations[key] || key;
  });
}

async function changeLang(lang) {
  localStorage.setItem("lang", lang);

  await loadTranslations(lang);
  applyTranslations();

 // Update dropdown label with flag
  document.getElementById("current-lang").innerHTML =
    lang === "ar"
      ? '<img src="assets/img/flags/ksa.png" class="lang-flag">'
      : '<img src="assets/img/flags/uk.png" class="lang-flag">';
  // RTL support
  document.documentElement.lang = lang;
  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
  document.body.classList.toggle("arabic", lang === "ar");
}

// Load saved language on start
document.addEventListener("DOMContentLoaded", async () => {
  const lang = localStorage.getItem("lang") || "en";
  await changeLang(lang);
});