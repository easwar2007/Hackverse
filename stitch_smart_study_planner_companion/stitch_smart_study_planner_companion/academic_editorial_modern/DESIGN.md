---
name: Academic Editorial Modern
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ffb4a1'
  on-secondary: '#5d1805'
  secondary-container: '#7f301b'
  on-secondary-container: '#ffa087'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffdbd2'
  secondary-fixed-dim: '#ffb4a1'
  on-secondary-fixed: '#3c0800'
  on-secondary-fixed-variant: '#7c2e19'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 3rem
    fontWeight: '400'
    lineHeight: 3.5rem
    letterSpacing: -0.02em
  display-sm:
    fontFamily: Newsreader
    fontSize: 2.25rem
    fontWeight: '400'
    lineHeight: 2.75rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: 2.25rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.625rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.45rem
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
  numeral-timer:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '300'
    lineHeight: 3.75rem
    letterSpacing: -0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system synthesizes the quiet dignity of classical university press publications with the sharp efficiency of a high-performance productivity client. Built for rigorous students, researchers, and competitive academic candidates, it replaces the juvenile gamification tropes of standard study apps with a disciplined, editorial atmosphere that evokes quiet focus halls, archival parchment, and architectural structure.

The design movement anchors in **Academic-Editorial Modernism**: 
- **Editorial Structure**: Structural hairline dividers, authoritative typographic hierarchy, and asymmetric mastheads reminiscent of contemporary literary reviews and syllabus journals.
- **Sleek Utility**: Dense yet breathing micro-surfaces, deliberate mono-styled metrics, precision progress dials, and clean tactile feedback.
- **Tone**: Rigorous, luminous, erudite, and non-distracting.

## Colors

The palette balances nocturnal study endurance with scholarly warmth. 

- **Primary (`#6366F1` - Royal Indigo/Violet)**: Signifies machine intelligence, algorithmic scheduling, and automated knowledge synthesis. Used for active focus states, primary CTAs, and AI-assisted summaries.
- **Secondary (`#E07A5F` - Terracotta Sienna)**: Represents academic stamina, streak discipline, and reward tokens. Applied to study streaks, time alerts, and interactive commitment gates.
- **Tertiary (`#10B981` - Sage Emerald)**: Dedicated to cognitive completion, verified test answers, and mastery checkpoints.
- **Neutral Foundation (`#0F172A` - Midnight Slate / `#0B132B` - Nocturne Abyss)**: Serves as the canvas base. Surface depth is built using stepped slate-indigo containers:
  - Base Ground: `#080D1A`
  - Card/Container Level 1: `#0F172A`
  - Elevated Container Level 2: `#1E293B`
  - Hairline Rim Strokes: `rgba(255, 255, 255, 0.08)`
- **Text & Editorial Accents**: Text utilizes Ivory Cream (`#FAF8F5`) for primary headings, Warm Parchment (`#E2DCD5`) for body copy, and Muted Sandstone (`#94A3B8`) for metadata and footnotes.

## Typography

The type system is built on a high-contrast editorial pairing:

- **Display & Headings (Newsreader)**: Injects academic pedigree, literature heritage, and intellectual gravitas. Used for course names, module titles, reflective prompts, and section headers. Features natural italic forms for philosophical sub-headers and scholarly annotations.
- **Functional Interface & Metadata (Plus Jakarta Sans)**: Delivers geometric clarity and optical balance. Used for timers, progress percentages, navigation tabs, study deck controls, and multi-script localization.
- **Multilingual Integrity**: Plus Jakarta Sans provides unified baseline alignment across English, Tamil (தமிழ்), Hindi (हिन्दी), and Tanglish, maintaining consistent vertical rhythm regardless of font script height.

## Layout & Spacing

A strictly regimented fluid grid tailored for high-density academic organization:

- **Mobile Canvas (360px – 428px)**: 4-column layout with `margin: 1rem` (16px) and `gutter: 1rem` (16px). All micro-cards (e.g., flashcard pills, coin trackers, stats) snap to 2-column or 4-column widths.
- **Tablet/Foldable Canvas (600px+)**: 8-column layout with `margin-md: 1.5rem` and split-pane architecture (course syllabus on left 3 columns, active focus monitor on remaining 5).
- **Rhythm**: All paddings adhere to a strict 4px/8px modular base scale to keep metadata clusters structurally ordered without visually overwhelming the user.

## Elevation & Depth

Visual hierarchy does not use harsh, muddy drop shadows. Instead, it relies on **chiseled luminous layering**:

- **Subsurface Hierarchy**: 
  - Level 0 (Canvas): Pure Nocturne `#080D1A`.
  - Level 1 (Static Cards/Panels): `#0F172A` with a 1px boundary stroke of `rgba(255, 255, 255, 0.06)`.
  - Level 2 (Floating Action/Active Focus): `#1E293B` elevated by a dual ambient halo: `0 8px 32px -4px rgba(11, 19, 43, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)`.
- **AI Focus Glow**: State cards actively monitored by AI models utilize an ambient diffuse back-glow colored `#6366F1` at 12% opacity with a 48px blur radius.
- **Frosted Translucency**: Sticky top bars, call notification shields, and the bottom nav dock use `backdrop-filter: blur(16px)` with `background: rgba(15, 23, 42, 0.82)`.

## Shapes

The interface balances soft architectural geometry with purposeful precision:

- Standard structural cards, catalogue units, and modal dialogues use **roundedness 2** (8px base, 16px for primary modules, 24px for full-bleed sheet headers).
- Interactive pills, status indicators, and reward coins use continuous pill-radii (`9999px`) to maintain tactile distinction against rectangular content blocks.
- Hairline stroke weight is anchored at 1px, shifting to 1.5px on focused input containers.

## Components

### Course Catalogue Cards
Structured like modern syllabus folios. The card header features the discipline tag in uppercase tracking alongside a Newsreader module title. A horizontal micro-track highlights completion percentage, flanked by an estimated study workload indicator (e.g., "4.5 hrs remaining") in sandstone monospace-proportioned numerals.

### Focus Lock Timer Dial
A center-anchored, circular tactile chronometer. The inner ring displays the `numeral-timer` typography. The outer track is an SVG perimeter meter that transitions from Terracotta Sienna (`#E07A5F`) during standard focus sessions into Royal Violet (`#6366F1`) when an automated Deep-Work lock is engaged. Surrounding controls are minimalist, touch-friendly flat cylinders.

### Incoming Call Notification Banner
A high-priority, non-intrusive floating island situated at the top margin. Deep navy base with a gentle amber peripheral glow warning of an active focus interruption. It provides clear caller ID in clean sans-serif and two distinct quick-action buttons: "Silence & Send AI Study Auto-Reply" and "Emergency Allow".

### Multi-Tab Language Selector
A horizontal segmented rail with zero layout shift across localized strings. The active state indicator slides smoothly behind the chosen language (English, தமிழ், हिन्दी, Tanglish) using an indigo-tinted slate pill with 1px border.

### Interactive Test Quiz Cards
Academic-paper-style interface. Questions are set in authoritative Newsreader headline styling. Options are encased in rounded-lg slate containers; selected options display a subtle 1px violet rim, while verified correct feedback triggers a Sage Green (`#10B981`) ambient wash and fill state.

### Credit Reward Coin Counters
A pill container housing a metallic terracotta-amber medal icon paired with a bold, legible numeric value. Counter updates trigger a single-cycle, subtle vertical digit slide rather than exaggerated particle confetti, preserving an adult, study-focused user experience.