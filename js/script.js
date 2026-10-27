const slides = document.querySelectorAll(".slide");
let current = 0;
let timer;

const show = (i) => {
  slides[current].classList.remove("active");
  current = (i + slides.length) % slides.length;
  slides[current].classList.add("active");
};

const start = () => {
  timer = setInterval(() => show(current + 1), 5000);
};

const restart = () => {
  clearInterval(timer);
  start();
};

document.querySelector(".next").addEventListener("click", () => {
  show(current + 1);
  restart();
});

document.querySelector(".prev").addEventListener("click", () => {
  show(current - 1);
  restart();
});

start();

// TOGGLE
const toggle = document.querySelector(".theme-toggle");

toggle.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

// SOLD SECTION
const cards = document.querySelectorAll(".sold-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

cards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.15}s`;
  observer.observe(card);
});

// FIND
const findForm = document.querySelector("#findForm");

findForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { location, type, beds, minPrice, maxPrice } = Object.fromEntries(
    new FormData(findForm),
  );

  const range =
    minPrice || maxPrice
      ? `₱${minPrice || 0} to ₱${maxPrice || "any"}`
      : "any price";

  findForm.parentElement.querySelector(".find-result").textContent =
    `Searching: ${type} in ${location}, ${beds} bedrooms, ${range}`;
});

// AFFILIATIONS MARQUEE (JS-driven, hindi apektado ng reduced-motion)
window.addEventListener("load", () => {
  const marquee = document.querySelector(".marquee");
  const mTrack = document.querySelector(".marquee-track");
  if (!marquee || !mTrack) return;

  const originals = [...mTrack.children];
  const setWidth = mTrack.scrollWidth;
  if (!setWidth) return;

  // clone hanggang sapat para walang puwang
  while (mTrack.scrollWidth < marquee.offsetWidth + setWidth) {
    originals.forEach((li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelector("img").alt = "";
      mTrack.appendChild(clone);
    });
  }

  const speed = 50; // px per second
  let x = 0;
  let last = performance.now();
  let paused = false;

  marquee.addEventListener("mouseenter", () => (paused = true));
  marquee.addEventListener("mouseleave", () => (paused = false));

  const tick = (now) => {
    const dt = (now - last) / 1000;
    last = now;
    if (!paused) {
      x -= speed * dt;
      if (x <= -setWidth) x += setWidth;
      mTrack.style.transform = `translateX(${x}px)`;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
});

// GALLERY ACCORDION + LIGHTBOX
const panels = document.querySelectorAll(".panel");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");

const activate = (panel) => {
  panels.forEach((p) => p.classList.remove("active"));
  panel.classList.add("active");
};

panels.forEach((panel) => {
  panel.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover)").matches) activate(panel);
  });

  panel.addEventListener("click", () => {
    if (!panel.classList.contains("active")) {
      activate(panel);
      return;
    }
    lightboxImg.src = panel.dataset.full;
    lightboxImg.alt = panel.querySelector("img").alt;
    lightbox.showModal();
  });
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) lightbox.close();
});

// SERVICES
const svcItems = document.querySelectorAll(".svc-item");
const svcImgs = document.querySelectorAll(".svc-visual img");

const setService = (i) => {
  svcItems.forEach((el, n) => el.classList.toggle("active", n === i));
  svcImgs.forEach((el, n) => el.classList.toggle("active", n === i));
};

svcItems.forEach((item, i) => {
  item.addEventListener("click", () => setService(i));
  item.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover)").matches) setService(i);
  });
});
