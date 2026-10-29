const PLATFORMS = { mac: "macOS", ios: "iOS", watch: "watchOS", web: "Web", chrome: "Chrome", cli: "CLI" };
const FILTERS = [["all", "All"], ["mac", "macOS"], ["ios", "iPhone and Watch"], ["web", "Web"], ["chrome", "Chrome"], ["cli", "CLI"]];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ROOT = document.documentElement.dataset.root ?? "../";
const asset = p => p && !/^https?:/.test(p) ? ROOT + p : p;
const onIos = a => a.platforms.includes("ios") || a.platforms.includes("watch");
const matches = (a, f) => f === "all" || (f === "ios" ? onIos(a) : a.platforms.includes(f));

function icon(app) {
  return app.icon
    ? `<span class="icon"><img src="${esc(asset(app.icon))}" alt="" loading="lazy" width="96" height="96"></span>`
    : `<span class="icon icon-letter" style="--tint:${app.tint}" aria-hidden="true">${esc(app.name[0])}</span>`;
}
const tags = app => `<span class="tags">${app.platforms.map(p => `<span class="tag">${PLATFORMS[p]}</span>`).join("")}</span>`;
const wrap = (app, cls, inner) => app.url
  ? `<a class="${cls}" href="${esc(app.url)}" style="--tint:${app.tint}">${inner}</a>`
  : `<div class="${cls} is-static" style="--tint:${app.tint}">${inner}</div>`;

function renderMosaic(apps) {
  const withIcons = apps.filter(a => a.icon);
  document.getElementById("mosaic").innerHTML = withIcons.slice(0, 9).map(a =>
    `<span class="mosaic-tile"><img src="${esc(asset(a.icon))}" alt="${esc(a.name)}" width="96" height="96"></span>`).join("");
  document.getElementById("app-count").textContent = apps.length;
}

function renderFeatured(apps) {
  const lead = shuffle(apps.filter(a => a.featured === "lead"))[0];
  const rest = shuffle(apps.filter(a => a.featured && a !== lead)).slice(0, 2);
  document.getElementById("featured").innerHTML = [lead, ...rest].map(a => wrap(a, "feat", `
    <span class="feat-stage">${icon(a)}</span>
    <span class="feat-body">
      <span class="feat-name">${esc(a.name)}</span>
      <span class="feat-text">${esc(a.tagline)}</span>
      <span class="feat-meta">${tags(a)}${a.cta ? `<span class="feat-cta">${esc(a.cta)}<i class="ph ph-arrow-right" aria-hidden="true"></i></span>` : ""}</span>
    </span>`)).join("");
}

function renderGrid(apps, filter) {
  const list = apps.filter(a => matches(a, filter));
  const grid = document.getElementById("grid");
  grid.innerHTML = list.length
    ? list.map(a => wrap(a, "card", `${icon(a)}<span class="card-body"><span class="card-name">${esc(a.name)}</span><span class="card-text">${esc(a.tagline)}</span>${tags(a)}</span>`)).join("")
    : `<div class="empty"><i class="ph ph-magnifying-glass" aria-hidden="true"></i><p>No apps for this platform yet.</p><button class="btn btn-sm btn-ghost" type="button" data-reset>Show all apps</button></div>`;
}

function renderFilters(apps) {
  const count = f => apps.filter(a => matches(a, f)).length;
  const el = document.getElementById("filters");
  el.innerHTML = FILTERS.filter(([f]) => count(f) > 0).map(([f, label]) =>
    `<button class="chip" type="button" data-f="${f}" aria-pressed="${f === "all"}">${label}<span class="chip-n">${count(f)}</span></button>`).join("");
  const select = f => {
    el.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.f === f)));
    renderGrid(apps, f);
  };
  el.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) select(b.dataset.f); });
  document.getElementById("grid").addEventListener("click", e => { if (e.target.closest("[data-reset]")) select("all"); });
}

function renderExperiments(items) {
  if (!items?.length) return;
  document.getElementById("experiments").innerHTML = `<p class="section-label">Experiments and toys</p><ul>${items.map(x =>
    `<li><a href="${esc(x.url)}">${esc(x.name)}<span>${esc(x.tagline)}</span></a></li>`).join("")}</ul>`;
}

function renderSkeletons() {
  document.getElementById("featured").innerHTML = Array(3).fill(`<div class="feat skeleton"><span class="feat-stage"></span><span class="feat-body"><span class="sk-line"></span><span class="sk-line short"></span></span></div>`).join("");
  document.getElementById("grid").innerHTML = Array(6).fill(`<div class="card skeleton"><span class="icon"></span><span class="card-body"><span class="sk-line"></span><span class="sk-line short"></span></span></div>`).join("");
}

function renderError() {
  document.getElementById("featured").innerHTML = "";
  document.getElementById("grid").innerHTML = `<div class="empty error" role="alert"><i class="ph ph-warning-circle" aria-hidden="true"></i><p>The app list didn’t load. Check your connection and reload, or browse my repositories on GitHub.</p><a class="btn btn-sm btn-ghost" href="https://github.com/djui?tab=repositories">Open GitHub</a></div>`;
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");
  const setOpen = open => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (open) {
      menu.hidden = false;
      menu.querySelectorAll("li").forEach((li, i) => li.style.transitionDelay = `${Math.min(i * 60, 400)}ms`);
      requestAnimationFrame(() => menu.classList.add("is-open"));
    } else {
      menu.classList.remove("is-open");
      setTimeout(() => { if (!menu.classList.contains("is-open")) menu.hidden = true; }, 500);
    }
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setOpen(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links.map(a => document.querySelector(a.getAttribute("href")));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => s && io.observe(s));
}

function setupReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("is-in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -10% 0px" });
  els.forEach(el => io.observe(el));
}

function setupTagline() {
  const el = document.getElementById("tagline");
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="word">${esc(w)}</span>`).join(" ");
  const words = [...el.querySelectorAll(".word")];
  if (reduceMotion) { words.forEach(w => w.classList.add("is-lit")); return; }
  const io = new IntersectionObserver(entries => {
    const hits = entries.filter(en => en.isIntersecting).map(en => en.target).sort((a, b) => words.indexOf(a) - words.indexOf(b));
    hits.forEach((w, i) => { w.style.transitionDelay = `${i * 70}ms`; w.classList.add("is-lit"); io.unobserve(w); });
  }, { rootMargin: "0px 0px -40% 0px" });
  words.forEach(w => io.observe(w));
}

setupNav();
setupReveals();
setupTagline();
renderSkeletons();
fetch(ROOT + "apps.json")
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(({ apps, experiments }) => {
    renderMosaic(apps);
    renderFeatured(apps);
    renderFilters(apps);
    renderGrid(apps, "all");
    renderExperiments(experiments);
  })
  .catch(renderError);
