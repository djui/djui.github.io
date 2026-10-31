---
name: Uwe Dauernheim
description: Personal site of an engineering leader in Stockholm, set in the Paper style.
colors:
  paper: "#FAFAF7"
  sheet: "#FFFFFF"
  shade: "#F0EFEA"
  stage: "#F4F3EE"
  ink: "#121212"
  ink-hover: "#2E2E2E"
  graphite: "#55534E"
  pencil: "#6F6D67"
  rule: "rgba(18, 18, 18, 0.09)"
  rule-strong: "rgba(18, 18, 18, 0.2)"
  pen-blue: "#2F56C4"
  tape: "rgba(236, 214, 140, 0.6)"
  stamp-green: "#1F7A50"
  stamp-red: "#A8463A"
  danger: "#D14343"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "60px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  body-lg:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  small:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.08em"
rounded:
  hairline: "4px"
  btn: "8px"
  icon: "12px"
  card: "16px"
  big: "24px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
  gutter: "24px"
  gutter-mobile: "16px"
  max: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    typography: "{typography.body}"
    rounded: "{rounded.btn}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.btn}"
    padding: "8px 12px"
  button-ghost-hover:
    backgroundColor: "{colors.shade}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    typography: "{typography.small}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag:
    backgroundColor: "{colors.shade}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-feature:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.big}"
    padding: "24px"
  nav:
    backgroundColor: "rgba(255, 255, 255, 0.72)"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 16px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "8px"
---

# Design System: Uwe Dauernheim

## Overview

**Creative North Star: "The Desk Notebook"**

A working notebook left open on a desk: warm white pages, near-black ink, and the owner's own hand all over it. The printed layer is calm and precise: one Manrope family, a centered single column, generous vertical air, hairline rules. The personal layer sits on top of it: margin notes in pen blue with hand-drawn arrows, a signature that writes itself in, polaroids held on with strips of yellow tape. The two layers never blur. Type and layout stay disciplined so the handwritten artifacts read as genuine asides from a person, not decoration.

Density is low and the rhythm is vertical. Every block sits on the center axis, sections breathe on 96px of padding, and color is almost absent: ink, graphite and pencil greys on paper, with pen blue as the only true hue in the system. Depth comes from paper itself: sheets with hairline borders, and real shadows only on physical objects such as a polaroid or a card you can pick up and swipe.

Light is the only theme today. A dark theme is planned but not designed; see Colors.

**Key Characteristics:**
- Warm white paper, near-black ink, one blue pen.
- One typeface (Manrope 400/500/600), tight negative tracking on large headings.
- Everything centered on one axis, max 1152px, 680px reading measure.
- Handwritten notes, signature, polaroids and tape are the signature motif.
- Flat sheets with hairline rules; shadows only on physical objects.
- Calm, eased motion (one curve) that wipes, lifts and reveals; all of it respects reduced motion.

## Colors

A monochrome ink-on-paper palette with a single pen-blue hue reserved for the human hand.

### Primary
- **Notebook Ink** (`ink`): text, primary buttons, selected chips, focus ring. Black does the job an accent color does elsewhere; the primary call to action is ink on paper.
- **Pressed Ink** (`ink-hover`): hover state of ink-filled controls.

### Secondary
- **Ballpoint Blue** (`pen-blue`): handwriting only. Margin notes, their drawn arrows, and polaroid captions. It marks "a person wrote this".

### Tertiary
- **Masking Tape** (`tape`): the translucent yellow strip holding polaroids.
- **Approval Green** (`stamp-green`) and **Correction Red** (`stamp-red`): the rubber-stamp "yes/no" labels on swipe cards. Stamps, never UI chrome.

### Neutral
- **Desk Paper** (`paper`): page background.
- **Fresh Sheet** (`sheet`): raised surfaces: cards, nav, inputs, polaroid frames.
- **Pencil Shade** (`shade`): hover fills, tags, the Ask answer, skeletons.
- **Stage Grey** (`stage`): the backdrop behind featured app icons.
- **Graphite** (`graphite`): secondary text and body prose after the first paragraph.
- **Pencil** (`pencil`): tertiary text: eyebrows, labels, captions, years, footer. It is the lightest grey allowed for text: 4.95:1 on paper, so it stays readable at 12px.
- **Hairline Rule** (`rule`) and **Firm Rule** (`rule-strong`): borders and dividers; the strong rule is the hover state.
- **Error** (`danger`): error states only.

The display headings fade from pure black (#000000) to mid grey (#666666), left to right: the only gradient in the system.

### Named Rules
**The One Pen Rule.** Pen blue belongs to the handwriting. If it isn't written by hand, it isn't blue.

**The Ink Is the Accent Rule.** No brand color for buttons or links. Emphasis comes from ink weight and contrast, not hue.

**Dark Mode Is Open.** A dark theme is planned but undecided. When it lands it must redefine these same token names on `[data-theme="dark"]` and keep the notebook metaphor (ink and paper inverted, pen still the only hue). Until then, don't hand-tune one-off dark values.

## Typography

**Display Font:** Manrope (with system-ui, sans-serif)
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** One geometric-humanist sans in three weights. Large sizes tighten (-0.02 to -0.03em) and go semibold to feel set rather than typed; the handwriting supplies the contrast a second typeface would.

### Hierarchy
- **Display** (600, 60px → 36px on mobile → 30px under 400px, line-height 1): hero statement only, with the ink fade gradient.
- **Statement** (600, 48px → 36px, line-height 1, -0.03em): the word-by-word tagline reveal and the closing call (36px).
- **Headline** (600, 36px/40px → 30px/36px, -0.02em): section titles, spotlight titles.
- **Title** (600, 20px/28px): card headings ("How I work"). Feature names and FAQ questions use 18px/28px at 600.
- **Body large** (400, 18px/28px): About prose, section intros, FAQ.
- **Body** (400, 16px/24px): default text and buttons (600). Reading measure 680px.
- **Small** (500 or 600, 14px/20px): nav, chips, eyebrows, card text, captions.
- **Label** (600, 12px/16px, 0.08em, uppercase): "Previously at", career heading, swipe-card kicker.

### Named Rules
**The One Family Rule.** Manrope only, weights 400, 500 and 600. Never 700+, never a second webfont. Contrast comes from the hand, not a display face.

**The Balanced Line Rule.** Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

## Layout

A single centered column. Sections are capped at 1152px with 24px gutters (16px under 768px), and nearly every block (titles, prose, career, cards, FAQ, footer) is centered on the page axis. Prose never runs wider than 680px.

Vertical rhythm is a 4px base stepping 4, 8, 12, 16, 24, 32, 48, 64, 96. Sections sit on 96px top and bottom (64px on mobile); the hero opens with 160px of top space (128px mobile) to clear the floating nav.

Grids wrap from the center: career entries and app cards use flex-wrap with `justify-content: center`, so a short last row centers instead of hugging the left. Columns step 3 → 2 → 1 at 1024px and 768px. The app-icon mosaic shows 9, 5, then 3 tiles, with even tiles dropped 24px to stagger the row.

Breakpoints: 400px (smallest display size), 768px (mobile: nav collapses, everything single column), 1024px (tablet: two columns), 1200px (margin notes leave the flow and hang in the right margin).

## Elevation & Depth

Paper is flat. Surfaces are sheets: white on warm white with a hairline rule, and depth on hover comes from a firmer rule plus a small lift, not a shadow. Real shadows appear only on objects that behave physically: the swipeable problem cards and the taped polaroids. The nav and mobile menu use frosted translucency (blur 16px / 24px) so the page shows through.

### Shadow Vocabulary
- **Picked-up card** (`box-shadow: 0 16px 40px -24px rgba(18, 18, 18, 0.35)`): swipe-deck cards; stacked cards behind step down by 10px and 4% scale.
- **Photo on the desk** (`box-shadow: 0 10px 24px -14px rgba(18, 18, 18, 0.45), 0 0 0 1px rgba(18, 18, 18, 0.09)`): polaroids.

### Named Rules
**The Objects Cast Shadows Rule.** Only things you could pick up off a desk get a shadow. Interface surfaces stay flat and use rules.

## Shapes

Soft but not bubbly. Buttons are 8px, list cards and inputs 16px, large sheets (feature cards, spotlight, swipe cards) 24px, app icons 12–24px depending on size, company logos 8–12px. Pills (9999px) are reserved for the floating nav, nav links, chips and tags. Polaroids are the exception: square corners and a deliberate tilt (-4° to 3.5°), with rotated tape at the top. Margin notes are rotated 2–6° too. Straight, centered type next to slightly crooked handmade things is the system's signature tension.

## Components

### Buttons
Quiet and confident: ink, not color.
- **Shape:** gently rounded (8px); pill (9999px) when inside the nav.
- **Primary:** ink fill, white text, 600 weight, 8px 12px padding, optional 20px Phosphor icon with 8px gap.
- **Hover / Focus:** primary lifts 2px and lightens to pressed ink; ghost fills with pencil shade. All buttons press to 98% scale. Focus is a 2px ink outline with a 2px offset.
- **Ghost:** transparent with a hairline border and ink text.

### Chips
- **Style:** pill, hairline border, graphite 14px/500 text, tabular count at 60% opacity.
- **State:** selected chips invert to an ink fill with paper text (`aria-pressed`).

### Cards / Containers
- **Corner Style:** 16px for app cards, 24px for feature cards, spotlight and swipe cards.
- **Background:** fresh sheet on desk paper; featured cards put the 96px icon on a stage-grey band (192px tall).
- **Shadow Strategy:** flat (see Elevation); hover firms the border and lifts 2–4px.
- **Border:** 1px hairline rule.
- **Internal Padding:** 24px (cards), 32px (spotlight), 28px (swipe cards).

### Inputs / Fields
- **Style:** the Ask row is a white sheet with hairline border, 16px radius and 8px padding wrapping a borderless textarea and the primary button.
- **Focus:** the row's border firms (`:focus-within`); no glow.
- **Answer:** shown on pencil shade, 16px 20px padding; loading state uses pencil text.

### Navigation
A floating frosted pill fixed 16px from the top: name on the left, 14px links in graphite (ink + shade fill when current), and a small pill "Book a call" button. Under 768px the links collapse to a two-line toggle that morphs into an X and opens a full-screen frosted menu with 30px links that rise in.

### Handwritten Margin Note (signature)
Handwriting is drawn from PNG masks filled with `currentColor`, so it always takes the pen-blue (or ink) color. Each note pairs with a hand-drawn SVG arrow (2px round stroke) pointing at what it annotates, and is rotated a few degrees. Notes and the signature wipe in left to right like a pen stroke (1.6s) when scrolled into view. On wide screens (≥1200px) notes hang in the right margin; below that they sit in the flow.

### Polaroid (signature)
148px white frame, 10px padding, square photo, pen-blue 14px caption, tilted, with a translucent tape strip. Hover straightens and scales to 1.04.

### Swipe Card (signature)
A stack of 24px-radius sheets with the picked-up shadow; the top card drags (grab cursor) and reveals rotated green/red rubber stamps. Ghost and primary buttons below give the non-gesture path.

## Do's and Don'ts

### Do:
- **Do** keep pen blue (#2F56C4) for handwriting, arrows and polaroid captions only.
- **Do** use ink (#121212) for primary actions and paper/sheet whites for surfaces.
- **Do** center new sections on the page axis with a 680px prose measure and 96px section padding.
- **Do** add handwritten asides, the signature or taped photos to new sections where a personal note genuinely belongs; draw them as masked PNGs in `currentColor` and wipe them in.
- **Do** use the single easing curve `cubic-bezier(0.22, 1, 0.36, 1)` at 300ms (state), 500ms (movement) or 700ms (reveal), and disable movement under `prefers-reduced-motion`.
- **Do** give every handwriting image a `role="img"` and an aria-label with the written words.

### Don't:
- **Don't** add a brand accent color, gradients beyond the ink fade on display headings, or colored button fills.
- **Don't** put shadows on flat UI surfaces; only physical objects (swipe cards, polaroids) cast them.
- **Don't** load a second typeface or use Manrope above 600.
- **Don't** fake handwriting with a script font; use real handwriting assets.
- **Don't** left-align a section in isolation; the composition is centered throughout.
- **Don't** ship one-off dark-mode colors before the dark theme is designed.
