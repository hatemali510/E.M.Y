let translations = {};
let currentLang = "en";
let currentService = "financial";
async function loadTranslations(lang) {
  const response = await fetch(`lang/${lang}.json`);
  translations = await response.json();
}

// 🔥 Render function
function renderService(serviceKey) {
  console.log(serviceKey)
  const data = translations[serviceKey];
  console.log(data);
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


// 🔥 Click handling
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
  renderService("financial");

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