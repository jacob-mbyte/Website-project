const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

const store = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch {}
  }
};

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = store.get("theme") || (prefersDark ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  store.set("theme", next);
});

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const revealEls = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("section[id]");
const anchors = document.querySelectorAll(".nav-links a");

function setActiveNav(id) {
  anchors.forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#" + id);
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((section) => spyObserver.observe(section));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

const lastSection = sections[sections.length - 1];

function syncLastSection() {
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;
  if (atBottom) setActiveNav(lastSection.id);
}

window.addEventListener("scroll", syncLastSection, { passive: true });
window.addEventListener("resize", syncLastSection);
syncLastSection();