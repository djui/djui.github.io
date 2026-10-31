# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: hiring decision-makers (founders, CEOs, CTOs, board members) looking for an engineering leader at Head of Engineering, CTO, or senior engineering management level. They arrive from LinkedIn, a referral, or a recruiter's link, skim on desktop or phone, and need to decide quickly whether Uwe fits a difficult problem they have.

Secondary: recruiters screening candidates, and people who use or discover his apps.

## Product Purpose

djui.github.io is Uwe Dauernheim's personal site. It presents him as an engineering leader in Stockholm who is open to his next role, and showcases the 21 apps he builds in his spare time as proof that he stays hands-on.

Success is any contact: a booked 20 minute intro call (cal.com/uwe-dauernheim/intro), a LinkedIn message, or a question asked in the Ask box. All count equally.

## Positioning

Sixteen years across payments, music, mobility, health, energy and AI (Klarna, Spotify, Voi, Grace Health, Northvolt, Aris Machina), combined with a live body of shipped personal software. The common thread is not one industry but making difficult technical systems useful, dependable and understandable. Tagline: "Curious by nature. Driven by people. Grounded in purpose."

Target roles: engineering leadership where software and AI meet consequential, real-world problems: AI-native products, physical systems, advanced industry, health, sustainability, or sport. Stockholm; on site, hybrid, or remote.

## Operating Context

- Single long page (`index.html`) with sections: hero (role, last job, availability), a swipeable problem deck ("Do you have one of these problems?") with the Ask box, About (with What I'm exploring now) + Career, How I work, tagline, Beyond the job title (polaroids), Apps (icon mosaic, then a "See all 21 apps" toggle with filters and grid; side-project spotlight), hiring FAQ, closing call to action.
- Light and dark themes follow the visitor's system setting.
- Apps are data-driven from `apps.json` (id, name, tagline, platforms, url, cta, icon, tint, featured), rendered by `assets/site/site.js`.
- The Ask box calls a Cloudflare Worker (`worker/`) that answers with Claude Haiku from `worker/src/context.md` only, at most 3 sentences, rate-limited; it stays hidden until `ASK_URL` is set.

## Capabilities and Constraints

- Plain static HTML/CSS/JS on GitHub Pages (`index.html`, `assets/site/site.css`, `assets/site/site.js`, `apps.json`). No build step.
- External dependencies: Google Fonts and Phosphor icons via unpkg; the Worker is the only backend.
- "No cookies, no tracking" is a public promise in the footer; keep it true.
- The Ask bot must only state facts already public in `worker/src/context.md`; it answers like a colleague and says "I don't know" plainly.
- `.nojekyll` is set, so GitHub Pages serves files as they are. The old Jekyll blog was removed in 2026; it lives on in git history only.

## Brand Commitments

- Voice: first person, direct, warm, plain. No corporate filler or ceremony. Short sentences; a little playfulness and human touch (handwritten margin notes, signature, "Coffee in Stockholm is on me").
- Handwriting assets in `assets/handwriting/` and the signature are part of his identity.
- Values to reflect, not claim loudly: curiosity, purpose, honesty, simplicity without oversimplification, excellence without status-seeking.

## Evidence on Hand

- Career history with company logos (`assets/logos/`) linking to LinkedIn pages.
- 21 apps with icons (`assets/icons/`) and real URLs in `apps.json`.
- Side project havewecuredcanceryet.org.
- Personal photos (`assets/photos/`: sailing, race medals including Ironman Tallinn and Kalmar, flying).
- Fuller factual profile in `worker/src/context.md`.
- No testimonials, references, quotes, metrics or case studies exist on the site. Do not invent them; "ask my old teams, not me" points visitors to real references instead.

## Product Principles

1. Every section should help a hiring decision-maker answer "can he help with our difficult problem?" and make contacting him easy.
2. Show, don't claim: shipped apps, real history and concrete problems beat adjectives.
3. Honest and human over polished and corporate.
4. Respect the visitor: no tracking, no gimmicks that block content, fast on any device.

## Accessibility & Inclusion

Keep the existing baseline: skip link, semantic landmarks, labelled handwriting images, keyboard-operable deck and FAQ, and reduced-motion support for any animation.
