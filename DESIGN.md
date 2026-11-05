---
name: OrbChat
description: A distilled, code-first room utility on the Orb Games deep-navy canvas.
colors:
  page: "#06081f"
  line: "#24356f"
  line-strong: "#3653b3"
  action: "#2563eb"
  action-hover: "#1d4ed8"
  signal: "#66c2ff"
  text: "#f7f8ff"
  label: "#dce4ff"
  muted: "#aebce8"
  placeholder: "#8c9bc9"
  danger: "#ff9caf"
  focus: "#94d5ff"
  action-disabled: "#24479d"
typography:
  body:
    fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif'
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: '"Nunito", ui-sans-serif, system-ui, sans-serif'
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.45
rounded:
  action: "10px"
spacing:
  hairline-inset: "2px"
  compact: "6px"
  control-gap: "16px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    height: "46px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    height: "46px"
  button-compact:
    backgroundColor: "{colors.action}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 19px"
    height: "46px"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "0"
    padding: "0 2px"
    height: "48px"
---

# Design System: OrbChat

## Overview

**Creative North Star: "The Open Room Line"**

OrbChat is a free-standing room utility, not a branded destination or miniature app shell. Room entry and conversation sit directly on a solid deep-navy page; open spacing and hairline rules provide all necessary structure. The interface should feel immediate, quiet, and native to Orb Games without importing its site chrome.

The system is code-first and deliberately reduced. Nunito keeps the utility approachable, accessible solid blue actions establish the path forward, and every visible element serves the short story: name yourself, create or enter a room, then exchange temporary messages.

**Key Characteristics:**

- One free-standing control column, capped at 500px.
- Solid deep-navy canvas with no gradients, cards, or ornamental containers.
- Accessible solid blue actions and bright-blue informational emphasis.
- Transparent underlined fields and hairline conversation structure.
- No visible logo, heading, connection badge, or repeated status decoration.

## Colors

The palette uses one uninterrupted navy world, high-contrast cool text, and a single accessible blue action family.

### Primary

- **Action Blue:** The default fill for every enabled action.
- **Pressed Blue:** The darker hover treatment for actions; it changes state without introducing a new hue.
- **Signal Sky:** Room codes, message authors, and the text caret—information that should be found quickly but is not itself an action.

### Tertiary

- **Recovery Rose:** Validation, creation failures, and plain connection-recovery text.
- **Focus Sky:** The explicit keyboard focus ring and focused-field underline.

### Neutral

- **Continuous Navy:** The sole page and interface canvas.
- **Hairline Blue:** Default field underlines, message separators, and conversation boundaries.
- **Active Hairline:** Hovered underlines, selection fill, and scrollbar thumbs.
- **Starlight:** Primary message and input text.
- **Cool Label:** Field labels and readable disabled-action text.
- **Cloud Blue:** Dividers, system messages, and room-label context.
- **Quiet Placeholder:** Placeholder and empty-conversation copy.
- **Disabled Blue:** Inactive actions while work is pending or the connection is unavailable.

### Named Rules

**The One Canvas Rule.** Keep the page and utility on Continuous Navy; never introduce a second surface to imply a card, well, header, or nested shell.

**The Action Contrast Rule.** Enabled actions use Action Blue and hover to Pressed Blue; Signal Sky is informational, not an alternate button color.

## Typography

**Display Font:** None; the utility intentionally has no display heading.

**Body Font:** Nunito (with ui-sans-serif, system-ui, sans-serif fallback)

**Label Font:** Nunito (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Nunito supplies a friendly Orb Games family resemblance while compact weights and sizes keep the interface utilitarian. Hierarchy comes from weight, size, case, and tracking—not from a second family or decorative headline.

### Hierarchy

- **Body:** Medium-weight 15px text with 1.5 line-height for inputs and participant messages.
- **Label:** Extra-bold 12px text for field labels, buttons, status copy, author names, and system messages.
- **Room Code:** Extra-bold 20px Signal Sky text with tabular numerals, uppercase characters, and .16em tracking.
- **Divider and Room Context:** Extra-bold 12px text with uppercase treatment and restrained tracking.

### Named Rules

**The No Headline Rule.** The first viewport begins with the display-name field; do not add a title, logo, wordmark, tagline, or introductory copy above it.

**The Code Clarity Rule.** Room codes remain uppercase, tabular, and widely tracked so they can be read and shared without ambiguity.

## Layout

The interface is one centered column with a maximum width of 500px. Desktop and embedded views center it in both axes with fluid page padding; there is no outer shell treatment beyond the width constraint. Room entry is a vertical sequence: display name, full-width creation action, ruled text divider, then a flexible code field paired with an intrinsic-width Enter action.

Conversation preserves the same column. The room line sits above a scrollable message list bounded only by top and bottom hairlines. Messages stack as rows, and the composer repeats the flexible-field-plus-compact-action pattern. Paired controls use a 16px gap; the name field closes its group with 24px of space.

At 430px and below, the page becomes top-led rather than vertically centered, using 42px top, 20px horizontal, and 24px bottom padding. The column remains full width, while the message list grows to 56vh with a 280px minimum height.

## Elevation & Depth

OrbChat is completely flat. It uses no shadows, gradients, translucent panels, raised surfaces, or tonal containers. Depth is unnecessary because spacing, one-pixel rules, type hierarchy, and state color already make the path legible.

### Named Rules

**The Hairlines-Only Rule.** When separation is required, use open space or a one-pixel line; never solve hierarchy with a card, background patch, or shadow.

## Shapes

Actions are the only visibly enclosed shapes and use gently rounded 10px corners. Fields are transparent with square geometry and a single bottom rule. Conversation rows are unboxed and square. Fully rounded geometry appears only on the scrollbar thumb, never as a status pill or interface container.

**The Enclosure Has Meaning Rule.** A filled rounded shape means “action.” Do not reuse it for identity, status, messages, sections, or decoration.

## Components

### Buttons

- **Shape:** Gently rounded 10px corners with a 46px minimum height.
- **Primary:** Full-width Action Blue with white extra-bold 12px text.
- **Compact:** The same action treatment with intrinsic width and 19–20px horizontal padding for Enter and Send.
- **Hover / Focus / Active:** Hover shifts to Pressed Blue; keyboard focus uses a 3px Focus Sky outline with 3px offset; active moves down 1px.
- **Disabled:** Disabled Blue with Cool Label text. Creation uses a waiting cursor while pending; disconnected composer actions remain visibly inactive.

### Inputs / Fields

- **Style:** Transparent, square, 48px high, with a one-pixel Hairline Blue bottom border and 2px horizontal inset.
- **Focus:** The underline shifts to Focus Sky; no glow, fill, or enclosing outline is added.
- **Content:** Default fields use Body typography. Room-code input is uppercase with tabular characters and .16em tracking.
- **Error / Disabled:** Errors appear as plain Recovery Rose text below the relevant action group. The message field is disabled whenever the socket is not connected.

### Entry Divider

- **Style:** Uppercase “or enter a code” text centered between two one-pixel Hairline Blue rules.
- **Spacing:** 25px above and 17px below, keeping the two entry paths distinct without adding a container.

### Conversation List

- **Structure:** A 250–410px scroll region on larger views, bounded by top and bottom hairlines.
- **Message:** Each participant message is a flat row with 13–14px vertical padding and a bottom hairline. The author appears above the body in Signal Sky.
- **System Message:** Centered compact Cloud Blue text in the same open list; it never resembles a participant bubble.
- **Empty State:** Centered Quiet Placeholder text reading “No messages yet”; no illustration or empty-state card.

### Connection Recovery

- **Style:** Plain Recovery Rose text beneath the conversation list, shown only after connection loss.
- **Behavior:** The notice instructs the person to refresh and rejoin, while both composer controls are disabled. Connecting and connected states remain available to assistive technology without visible badges.

## Do's and Don'ts

### Do:

- **Do** keep entry and conversation directly on Continuous Navy in one 500px column.
- **Do** use Action Blue and Pressed Blue for enabled action states with explicit Focus Sky keyboard outlines.
- **Do** use spacing and one-pixel lines to organize fields, dividers, messages, and the conversation viewport.
- **Do** keep connection recovery visible as plain text and disable the entire composer when disconnected.
- **Do** preserve readable mobile padding, touch targets, and reduced-motion behavior.

### Don't:

- **Don't** add a logo, wordmark, title, branded header, intro copy, or navigation chrome.
- **Don't** add a gradient, outer card, boxed message well, message bubbles, raised surface, or shadow.
- **Don't** add Ready, Connected, Connecting, or Disconnected badges; routine state stays visually silent.
- **Don't** use ornamental containers, repeated status decoration, or shipping raster artwork.
- **Don't** introduce a second font, decorative display type, or a competing accent hue.
