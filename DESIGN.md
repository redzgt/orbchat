---
name: OrbChat
description: A compact, electric-blue room utility in the Orb Games visual world.
colors:
  page: "#06081f"
  surface: "#0d1236"
  surface-raised: "#121b4e"
  field: "#080c28"
  line: "#263a8c"
  line-soft: "#1a275f"
  blue: "#2f8dff"
  blue-bright: "#54b8ff"
  purple: "#7766ff"
  text: "#f7f8ff"
  muted: "#aebce8"
  danger: "#ff8fa5"
  success: "#55e0ad"
  focus: "#82c9ff"
typography:
  headline:
    fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(21px, 5vw, 25px)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif'
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.45
rounded:
  control: "12px"
  message-well: "14px"
  widget: "16px"
  pill: "999px"
spacing:
  xs: "7px"
  sm: "9px"
  md: "12px"
  lg: "16px"
  xl: "22px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: "44px"
    width: "100%"
  button-secondary:
    backgroundColor: "#294bc2"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 17px"
    height: "44px"
  input:
    backgroundColor: "{colors.field}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "44px"
  status-pill:
    backgroundColor: "{colors.field}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "28px"
---

# Design System: OrbChat

## Overview

**Creative North Star: "The Electric Room Key"**

OrbChat is one compact path into a temporary room. Its visual system makes the experience feel immediate and contained: deep navy surfaces create a private enclosure, electric blue provides structure and action, and the supplied full OrbChat wordmark establishes its place in the Orb Games family.

The system is a compact embedded utility, not a dashboard. Nunito, rounded controls, short labels, and dense but breathable spacing keep it friendly without weakening its code-first purpose. The same visual language must remain complete when the widget expands to a full mobile viewport.

**Key Characteristics:**

- Deep navy surfaces with electric-blue structure and restrained purple energy.
- Compact, centered composition built around one clear task path.
- Heavy, rounded Nunito typography with small, legible status labels.
- Rounded controls and containers with explicit focus and connection states.
- Full OrbChat wordmark as the primary identity asset.

## Colors

The palette layers cool navy surfaces and uses luminous blue sparingly for action, identity, room codes, and focus.

### Primary

- **Orb Electric Blue:** The primary action and structural accent; it anchors gradients and identifies interactive emphasis.
- **Signal Blue:** The brighter blue reserved for room codes, message authors, and other high-value information.

### Secondary

- **Arc Purple:** The secondary endpoint in the primary action gradient; use it to add Orb Games energy without becoming a separate action color.

### Tertiary

- **Alert Rose:** Validation errors and disconnected state.
- **Connected Mint:** Ready and connected state.
- **Focus Sky:** Keyboard focus outlines and focused field borders.

### Neutral

- **Deep Space:** The page-level canvas and outermost dark field.
- **Room Navy:** The default widget and container surface.
- **Raised Navy:** The elevated message surface.
- **Input Navy:** The recessed field and message-well surface.
- **Structural Blue:** The stronger border and hover-stroke color.
- **Soft Structure:** The quiet divider, field border, and topbar separator.
- **Starlight:** The default high-contrast text color.
- **Cloud Blue:** Secondary text, status labels, and explanatory copy.

### Named Rules

**The Electric Structure Rule.** Blue marks action, focus, and essential room information; it is not ambient decoration.

**The Navy Layer Rule.** Separate regions by moving between the established navy surfaces before adding borders or shadows.

## Typography

**Display Font:** Nunito (with ui-sans-serif, system-ui, sans-serif fallback)  
**Body Font:** Nunito (with ui-sans-serif, system-ui, sans-serif fallback)  
**Label Font:** Nunito (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Nunito gives the utility the rounded, approachable character of Orb Games while its heavier weights keep short instructions, controls, and room codes decisive at compact sizes.

### Hierarchy

- **Headline:** Extra-bold, fluid compact headline with tight tracking. Use once to state the current task.
- **Body:** Medium-weight explanatory and message copy with open leading for legibility in the narrow widget.
- **Label:** Extra-bold compact text for field labels, buttons, errors, and statuses. Uppercase and tracked variants are reserved for codes, dividers, and micro-statuses.

### Named Rules

**The One Family Rule.** Use Nunito throughout; hierarchy comes from weight, size, tracking, and case rather than a second typeface.

**The Code Clarity Rule.** Room codes use uppercase tabular characters with generous tracking so every character can be shared and checked quickly.

## Layout

The core spatial model is a single widget no wider than 460px, centered in the available viewport with fluid outer padding. A 64px minimum-height branded bar sits above a compact content region. The primary content inset is 22px; controls use 44px touch heights, 9px paired-control gaps, and 16–20px separation between task groups.

Layouts stay one-dimensional unless a field and its immediate action belong together. These pairs use a flexible input plus an intrinsic-width button. At 430px and below, the widget becomes the viewport: outer padding, corner rounding, and drop shadow disappear; content inset tightens to 16px; and the branded bar reduces its horizontal inset while preserving its height and hierarchy.

## Elevation & Depth

Depth is a hybrid of tonal layering and restrained ambient shadow. Navy surface shifts do most of the structural work. The widget receives one broad shadow when floating on desktop; controls and focused fields use smaller shadows only to reinforce action or state. The mobile full-viewport treatment is flat.

### Shadow Vocabulary

- **Widget Float:** A broad, low-contrast black shadow that separates the centered utility from the page canvas.
- **Action Lift:** A compact shadow beneath the primary action.
- **Field Focus:** A small shadow paired with the focus border on an active field.

### Named Rules

**The Tonal-First Rule.** Establish hierarchy with navy surface changes; shadow supports a layer but never defines it alone.

## Shapes

The form language is consistently rounded and compact. Controls and message bubbles use gently rounded 12px corners; the message well uses 14px; and the desktop widget uses 16px. Status indicators and scrollbar thumbs are fully pill-shaped. Circles are reserved for tiny state dots. On narrow screens, the widget radius is removed because the widget becomes the page.

**The Nested Radius Rule.** Inner elements are never rounder than the container that holds them, except purpose-built pills and state dots.

## Components

### Buttons

- **Shape:** Gently rounded control corners with a 44px minimum touch height.
- **Primary:** Full-width electric-blue-to-purple action with white extra-bold text and a compact action shadow.
- **Secondary:** Solid structural blue with white extra-bold text and horizontal padding sized to its label.
- **Hover / Focus / Active:** Hover brightens without changing hue; focus uses a 3px Focus Sky outline with a 3px offset; active moves down by 1px. Disabled actions desaturate and reduce opacity while retaining their label.

### Cards / Containers

- **Corner Style:** 16px for the desktop widget, 12px for individual message bubbles.
- **Background:** Room Navy for the shell, Raised Navy for message content, and Input Navy for recessed wells.
- **Shadow Strategy:** The widget floats only on wider viewports; nested containers rely on tonal separation.
- **Border:** One-pixel Soft Structure separators and field strokes; avoid outlining every surface.
- **Internal Padding:** 22px for the main widget content, reduced to 16px on narrow screens.

### Inputs / Fields

- **Style:** Recessed Input Navy, one-pixel Soft Structure border, 12px corners, 44px height, and 13px horizontal padding.
- **Focus:** Shift to a slightly lighter navy, Focus Sky border, and a restrained focus shadow.
- **Content:** Standard inputs use body text. Room codes use uppercase, tabular characters, and wide tracking.
- **Error / Disabled:** Validation copy appears below the relevant group in Alert Rose; disabled action states remain readable and visibly inactive.

### Status Pills

- **Style:** A 28px-high dark pill with compact extra-bold text and a 7px circular state dot.
- **State:** Connected and ready use Connected Mint; connecting uses warm amber; disconnected uses Alert Rose.

### Message Well and Bubbles

- **Well:** A fixed-height, scrollable Input Navy region with 14px corners and 14px padding.
- **Bubble:** Raised Navy with 12px corners and compact body copy. Author names use Signal Blue and extra-bold label text.
- **System Message:** Centered, smaller, muted text on a transparent background; it must not resemble a participant message.

### Brand Bar

- **Style:** A 64px minimum-height navy bar with the supplied full OrbChat wordmark at left and one compact state pill at right.
- **Identity:** Preserve the wordmark's proportions and use it as the primary logo; do not substitute text or an unrelated icon.

## Do's and Don'ts

### Do:

- **Do** keep room entry and messaging inside a single compact path with the most important action visually dominant.
- **Do** use the established navy layers before reaching for extra borders or shadows.
- **Do** reserve electric blue for action, focus, and essential room information.
- **Do** preserve clear hover, focus, active, connected, connecting, disconnected, validation, and disabled states.
- **Do** let the widget become the full page at narrow mobile widths.

### Don't:

- **Don't** add dashboard chrome, navigation, onboarding panels, or decorative modules around the utility.
- **Don't** replace the supplied full OrbChat wordmark with plain text, a cropped symbol, or a new logo treatment.
- **Don't** introduce sharp rectangular controls, pale surfaces, or typefaces outside the Nunito system.
- **Don't** use purple as an independent semantic action or status color; it supports the primary action gradient.
- **Don't** use shadow as the only cue separating nested navy surfaces.
