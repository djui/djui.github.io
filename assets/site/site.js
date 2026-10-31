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
  const lead = shuffle(apps.filter(a => a.featured === "lead" && a.icon));
  const rest = shuffle(apps.filter(a => a.featured && a.featured !== "lead" && a.icon));
  document.getElementById("mosaic").innerHTML = [...lead, ...rest].slice(0, 9).map(a =>
    `<a class="mosaic-tile" href="${esc(a.url)}" title="${esc(a.name)}: ${esc(a.tagline)}"><img src="${esc(asset(a.icon))}" alt="${esc(a.name)}" width="96" height="96"></a>`).join("");
  document.getElementById("app-count").textContent = apps.length;
}

function setupAppsToggle() {
  const toggle = document.getElementById("apps-toggle");
  const all = document.getElementById("apps-all");
  toggle.addEventListener("click", () => {
    const open = all.hidden;
    all.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("[data-closed]").hidden = open;
    toggle.querySelector("[data-open]").hidden = !open;
    toggle.classList.toggle("is-open", open);
  });
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
  document.getElementById("mosaic").innerHTML = Array(9).fill(`<span class="mosaic-tile skeleton"></span>`).join("");
  document.getElementById("grid").innerHTML = Array(6).fill(`<div class="card skeleton"><span class="icon"></span><span class="card-body"><span class="sk-line"></span><span class="sk-line short"></span></span></div>`).join("");
}

function renderError() {
  document.getElementById("mosaic").innerHTML = "";
  document.getElementById("apps-all").hidden = false;
  document.getElementById("apps-toggle").hidden = true;
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

  // Watch every section, so the highlight clears in sections the nav doesn't list.
  const links = [...document.querySelectorAll(".nav-links a")];
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const ids = [en.target.id, ...[...en.target.querySelectorAll("[id]")].map(el => el.id)].map(id => "#" + id);
      const hit = links.find(a => ids.includes(a.getAttribute("href")));
      links.forEach(a => a.toggleAttribute("aria-current", a === hit));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main > section, #career").forEach(s => io.observe(s));
}

function setupReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) return;
  // Sections only start hidden once this script runs, so the page still reads if it fails.
  document.documentElement.classList.add("js-reveal");
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

// The Ask form stays hidden until the Worker in worker/ is deployed and its URL is set here.
const ASK_URL = "https://ask-uwe.uwe-af1.workers.dev";
const BOOKING_URL = document.querySelector(".nav-cta").href;
const bookingLink = note => `${BOOKING_URL}?notes=${encodeURIComponent(note)}`;

// Each card is a problem a founder might have; `where` and `story` are the proof that I've worked on it.
const PROBLEMS = [
  { k: "Payments", big: "Our payments can’t afford to fail", logo: "klarna", where: "Klarna · 2010 to 2013", story: "I built distributed payment systems in Erlang, then led the development line." },
  { k: "Scale", big: "Our product has to work for millions of people", logo: "spotify", where: "Spotify · 2013 to 2015", story: "I was a backend engineer on search and charts." },
  { k: "Fintech", big: "We need a payments platform built from scratch", logo: "pfc", where: "Betalo and P.F.C. · 2016 to 2019", story: "I was lead technical architect for a payment platform and a neobank." },
  { k: "Hypergrowth", big: "We’re growing faster than our systems", logo: "voi", where: "Voi · 2019 to 2020", story: "I was VP of Software Engineering in urban mobility." },
  { k: "Health", big: "People trust us with private questions", logo: "grace-health", where: "Grace Health · 2020 to 2023", story: "I was Head of Technology for a women’s health app." },
  { k: "Industry", big: "Our software has to run a factory floor", logo: "northvolt", where: "Northvolt · 2023 to 2025", story: "I was senior engineering manager for manufacturing systems and data." },
  { k: "AI", big: "We need AI that does real work, not demos", logo: "aris-machina", where: "Aris Machina · 2025 to 2026", story: "I was Head of Engineering, building AI for manufacturing." },
  { k: "Hands-on", big: "We need a leader who still ships code", logo: null, where: "21 apps on the side", story: "I build Mac, iPhone and web apps, most of them running fully on device." },
];

function setupDeck() {
  const deck = document.getElementById("deck");
  const actions = document.getElementById("deck-actions");
  const count = document.getElementById("deck-count");
  let i = 0, liked = [], busy = false;

  const render = () => {
    busy = false;
    if (i >= PROBLEMS.length) return renderResult();
    actions.hidden = false;
    const stack = PROBLEMS.slice(i, i + 3).reverse();
    deck.innerHTML = stack.map((p, n) => `
      <article class="swipe-card"${n < stack.length - 1 ? ` aria-hidden="true"` : ""}>
        <span class="stamp y" aria-hidden="true">We have this</span><span class="stamp n" aria-hidden="true">Not for us</span>
        <span class="k">${esc(p.k)}</span>
        <h3 class="big">${esc(p.big)}</h3>
        <span class="where">${p.logo ? `<img src="${ROOT}assets/logos/${p.logo}.png" alt="" width="24" height="24">` : ""}${esc(p.where)}</span>
        <p class="story">${esc(p.story)}</p>
      </article>`).join("");
    count.textContent = `${i + 1} of ${PROBLEMS.length}`;
    drag(deck.lastElementChild);
  };

  const renderResult = () => {
    const hadFocus = actions.contains(document.activeElement);
    actions.hidden = true;
    count.textContent = "";
    const note = liked.length ? `Swiped right on: ${liked.join(", ")}.` : "";
    deck.innerHTML = `<div class="deck-result">
      <h3>${liked.length ? `${liked.length} of ${PROBLEMS.length} sound familiar` : "None of these? Fair."}</h3>
      <p>${liked.length ? `${esc(liked.join(", "))}. Let’s talk about it.` : "Tell me what you’re working on instead."}</p>
      <a class="btn btn-primary" href="${esc(note ? bookingLink(note) : BOOKING_URL)}"><i class="ph ph-calendar-check" aria-hidden="true"></i>Book a 20 minute call</a>
      <button class="btn btn-ghost" type="button" data-restart>Start over</button>
    </div>`;
    // The swipe buttons just disappeared; keep keyboard users on the next step.
    if (hadFocus) deck.querySelector(".btn-primary").focus();
  };

  const decide = yes => {
    const top = deck.querySelector(".swipe-card:last-child");
    if (!top || busy) return;
    busy = true;
    if (yes) liked.push(PROBLEMS[i].k);
    i++;
    top.style.transform = `translateX(${yes ? 480 : -480}px) rotate(${yes ? 16 : -16}deg)`;
    top.style.opacity = "0";
    setTimeout(render, reduceMotion ? 0 : 300);
  };

  function drag(card) {
    let x0 = null, dx = 0;
    const [yes, no] = card.querySelectorAll(".stamp");
    card.addEventListener("pointerdown", e => { x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.classList.add("is-dragging"); });
    card.addEventListener("pointermove", e => {
      if (x0 === null) return;
      dx = e.clientX - x0;
      card.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`;
      yes.style.opacity = Math.max(0, dx / 100);
      no.style.opacity = Math.max(0, -dx / 100);
    });
    const end = () => {
      if (x0 === null) return;
      x0 = null;
      card.classList.remove("is-dragging");
      if (Math.abs(dx) > 100) return decide(dx > 0);
      card.style.transform = "";
      yes.style.opacity = no.style.opacity = "0";
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }

  actions.addEventListener("click", e => { const b = e.target.closest("[data-swipe]"); if (b) decide(b.dataset.swipe === "yes"); });
  deck.addEventListener("click", e => { if (e.target.closest("[data-restart]")) { i = 0; liked = []; render(); } });
  addEventListener("keydown", e => {
    if (!deck.closest("section").matches(":hover, :focus-within")) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable]")) return;
    if (e.key === "ArrowRight") decide(true);
    if (e.key === "ArrowLeft") decide(false);
  });
  render();
}

function setupAsk() {
  if (!ASK_URL) return;
  const form = document.getElementById("ask");
  const input = document.getElementById("ask-input");
  const out = document.getElementById("ask-answer");
  form.hidden = false;
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    out.hidden = false;
    out.className = "ask-answer is-loading";
    out.textContent = "Thinking…";
    try {
      const r = await fetch(ASK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || r.status);
      out.className = "ask-answer";
      out.innerHTML = `${esc(data.answer)} <a href="${esc(bookingLink(`From Ask: ${question}`))}">Book a 20 minute call</a>`;
    } catch (err) {
      out.className = "ask-answer";
      out.innerHTML = `I couldn’t answer that right now. <a href="${esc(BOOKING_URL)}">Book a call</a> and ask me directly.`;
    }
  });
}

function setupInk() {
  const els = document.querySelectorAll(".ink");
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  els.forEach(el => el.classList.add("is-waiting"));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const delay = el.classList.contains("ink-signature") && el.previousElementSibling?.classList.contains("ink-note") ? 1400 : 200;
    setTimeout(() => { el.classList.remove("is-waiting"); el.classList.add("is-writing"); }, delay);
    io.unobserve(el);
  }), { rootMargin: "0px 0px -15% 0px" });
  els.forEach(el => io.observe(el));
}

setupNav();
setupReveals();
setupTagline();
setupDeck();
setupAsk();
setupInk();
setupAppsToggle();
renderSkeletons();
fetch(ROOT + "apps.json")
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(({ apps, experiments }) => {
    renderMosaic(apps);
    renderFilters(apps);
    renderGrid(apps, "all");
    renderExperiments(experiments);
  })
  .catch(renderError);
