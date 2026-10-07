---
name: Academic Editorial Light
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#e3e8f9'
  surface-container-highest: '#dde2f3'
  on-surface: '#161c27'
  on-surface-variant: '#414845'
  inverse-surface: '#2a303d'
  inverse-on-surface: '#ecf0ff'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3c6657'
  primary: '#07372a'
  on-primary: '#ffffff'
  primary-container: '#234e40'
  on-primary-container: '#91beac'
  inverse-primary: '#a3d0be'
  secondary: '#9d4322'
  on-secondary: '#ffffff'
  secondary-container: '#fd8c65'
  on-secondary-container: '#742505'
  tertiary: '#27322d'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d4942'
  on-tertiary-container: '#abb8af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd9'
  primary-fixed-dim: '#a3d0be'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#234e40'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#7e2c0c'
  tertiary-fixed: '#d9e6dd'
  tertiary-fixed-dim: '#bdcac1'
  on-tertiary-fixed: '#131e18'
  on-tertiary-fixed-variant: '#3e4943'
  background: '#f9f9ff'
  on-background: '#161c27'
  surface-variant: '#dde2f3'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Newsreader
    fontSize: 34px
    fontWeight: '400'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system draws inspiration from historic university archives, fine press journals, and prestigious library reading rooms. It rejects modern high-tech clichés, ephemeral neon, and aggressive artificiality in favor of permanence, gravitas, and tactile editorial restraint. 

The aesthetic is built upon crisp parchment paper textures, disciplined typographic hierarchy, and measured scholastic cadence. It speaks directly to researchers, scholars, curators, and deep thinkers who value contemplative study, intellectual rigor, and institutional authority. Interfaces prioritize readability, long-form legibility, and architectural structure over flash and distraction.

## Colors

The palette is grounded in physical paper and archival printing materials:
- **Base Canvas & Surfaces**: Crisp warm off-white (`#fbfbf9`) serves as the primary canvas, layered against secondary parchment backgrounds (`#f5f4f0`) and subtle container fills (`#eeebe2`).
- **Primary Ink**: Scholastic forest green (`#234e40`) provides authoritative presence for primary actions, focused tabs, selected states, and pivotal scholarly landmarks.
- **Secondary Accent**: Rich terracotta and cognac (`#9c4221`) brings warmth, designated for critical annotations, marginalia highlights, secondary CTAs, and active citations.
- **Tertiary Neutral**: Muted slate-forest (`#546059`) bridges metadata, secondary captions, and publication dates.
- **Typography & Outlines**: Deep intellectual navy ink (`#1a202c` down to `#111827`) provides high-contrast, fatigue-free reading. Borders mimic delicate binding thread and debossed deckle edges using muted bone and rule tones (`#e5e3da` and `#d8d4c7`).

## Typography

The typographic engine pairs the literary authority of **Newsreader** (used for major titles, essayistic summaries, pull quotes, and narrative body copy) with the structural lucidity of **Inter** (employed for metadata, interface controls, navigation, and compact tabular notes).

Headings honor the conventions of university presses: italicization is reserved for journal volume titles, Latin designations, and monograph subtitles. All small metadata labels and section index headers utilize subtle letter-spaced small caps or uppercase styles for clean architectural definition.

## Layout & Spacing

The layout adopts a disciplined 12-column editorial grid on desktop, scaling to 8 columns on tablet, and a strict single or 2-column flow on mobile. Reading panes preserve optimal eye-tracking width, capping long-form monograph and summary blocks at 68ch to 75ch. 

Asymmetrical layouts are encouraged: expansive primary reading areas are coupled with narrower marginalia sidebars (2 to 3 columns) intended for citations, footnotes, linguistic translation annotations, and cross-references. Outer margins remain generous to emulate archival broadsheets and leather-bound leaves.

## Elevation & Depth

Visual hierarchy eschews dramatic drop shadows and synthetic colored glows. Instead, physical sheet layering and papercraft borders provide spatial separation:

1. **Subtle Tonal Stacking**: The page canvas is rendered in `#fbfbf9`. Floating reading drawers and elevated cards sit on `#f5f4f0` or pure white `#ffffff`, separated by micro-borders in `#e5e3da`.
2. **Bookbinding Hairlines**: Dividers, rule marks, and header lines use 1px solid lines with `#e5e3da` to structure dense information cleanly.
3. **Archival Press Shadows**: When an element must distinctly float over content (such as an academic modal, lexicon popover, or dropdown menu), use a soft, ambient, highly diffused warm shadow with zero harshness: `0 4px 20px -2px rgba(26, 32, 44, 0.06), 0 2px 6px -1px rgba(26, 32, 44, 0.04)`.

## Shapes

The geometry reflects crisp, cut book-cloth and heavy rag paper. Surfaces maintain a restrained `0.25rem` (`4px`) corner radius, avoiding bulbous or pill-shaped consumer app aesthetics. 

Cards, text inputs, and action buttons feature this subtle softening to prevent severe clinical harshness while preserving the architectural, bookish character of physical printed matter.

## Components

### Buttons
- **Primary Scholastic Action**: Deep forest green (`#234e40`) background with parchment-white text (`#fbfbf9`), subtle border, and 4px radius. Hover shifts to deeper green (`#1b3d32`).
- **Secondary Annotation Button**: Warm bone surface (`#f5f4f0`) with fine border (`#e5e3da`) and navy ink text (`#1a202c`). Hover state transitions to soft sand (`#eeebe2`).
- **Editorial Text Button**: Understated text action with terracotta (`#9c4221`) or navy text, featuring an editorial underline offset by 3px.

### Cards & Curated Summary Containers
- Built on `#ffffff` or `#fbfbf9` with a crisp 1px border (`#e5e3da`). 
- Summary cards open with an italicized Newsreader title or volume indicator, accompanied by an archival tag (e.g., *Curated Summary*, *Research Dossier*).

### Chips & Badges
- Low-saturation, scholarly status indicators. 
- Taxonomy tags utilize `#f5f4f0` background, `#546059` typography, and fine hairlines. Active or marked tags use terracotta tinting (`#fdf4f0` background with `#9c4221` text and border).

### Input Fields & Search Bars
- Framed in clean `#e5e3da` borders against pure parchment backgrounds. 
- Focus states shift the border to deep scholastic green (`#234e40`) with an intentional absence of fuzzy halos or bright focus rings. 
- Placeholder text carries warm intellectual gray tones (`#718096`).

### Checkboxes & Radio Controls
- Square with 2px softening for checkboxes; circular for radios. 
- Border in `#d8d4c7`; checked state fills with forest green (`#234e40`) displaying a crisp white indicator.

### Scholastic Additions
- **Marginalia / Sidenote Rails**: Pinned aside the main text body to host translation notes, source citations, and critical commentary.
- **Archival Pull-Quotes**: Displayed in Newsreader italic with an authoritative terracotta or forest green 2px vertical left rule.
- **Citation Badges**: Superscript bracketed markers (`[1]`, `[Ann.]`) that trigger concise contextual popovers upon interaction.