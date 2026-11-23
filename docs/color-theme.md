# OSWeave Color Theme

_Implemented 2026-11-22 on the `133-implement-site-design` branch._

This document describes the OSWeave color theme, how it is wired into the codebase, and the rules that keep it compliant with **WCAG 2.2 AA**. All theme values live in [`styles/globals.css`](../styles/globals.css).

## Design direction

- **Purple is the primary color.** Buttons, links, focus outlines, and the OSWeave name stay purple.
- **Magenta and turquoise are accents**, used in small, repeated details (dividers, icons, badges) so the site feels colorful without looking disjointed.
- **Light tints fill large areas.** Alternating white and light purple sections give the page rhythm.

## Palette

All colors are Tailwind theme colors, available as utilities such as `bg-osweave-purple-mid` or `text-osweave-turquoise-dark`.

| Token                    | Hex       | Use                                                                      |
| ------------------------ | --------- | ------------------------------------------------------------------------ |
| `osweave-white`          | `#fbf7ff` | Text on purple buttons, secondary button fill                            |
| `osweave-black`          | `#0f001a` | Highlighted text                                                         |
| `osweave-purple-core`    | `#9300ff` | Inline links                                                             |
| `osweave-purple-mid`     | `#6e00c0` | Primary button fill, secondary button text and border, role card top bar |
| `osweave-purple-dark`    | `#490080` | Hover states, focus outlines, FAQ questions                              |
| `osweave-purple-light`   | `#d7a0ff` | Nav bottom border, text-selection background                             |
| `osweave-purple-tint`    | `#f7ecff` | Tinted section and nav background                                        |
| `osweave-magenta-core`   | `#ff00e9` | _(unused; large text on black only)_                                     |
| `osweave-magenta-mid`    | `#a60098` | Section dividers                                                         |
| `osweave-magenta-dark`   | `#4d0046` | _(unused)_                                                               |
| `osweave-magenta-light`  | `#ffa0f7` | _(unused; text on black only)_                                           |
| `osweave-turquoise-core` | `#00e9ff` | _(unused; text on black only)_                                           |
| `osweave-turquoise-mid`  | `#0098a6` | Role card checkmarks                                                     |
| `osweave-turquoise-dark` | `#00464d` | Slack channel badge text                                                 |
| `osweave-turquoise-tint` | `#d9fbff` | Slack channel badge background                                           |

The **mid** shades are the exact midpoint of each color's core and dark values. The **tint** shades are a light color mixed with white (purple: 20% purple-light, turquoise: 15% turquoise-core). These are additions to the original OSWeave palette.

## Semantic tokens

Components should use these names instead of raw palette names, so every pairing only has to be contrast-checked once, in `globals.css`.

| Token          | Maps to       | Use                                               |
| -------------- | ------------- | ------------------------------------------------- |
| `brand`        | purple-core   | Inline link text                                  |
| `brand-hover`  | purple-dark   | Hover color for links and buttons                 |
| `button`       | purple-mid    | Button fill (primary) and text/border (secondary) |
| `brand-subtle` | osweave-white | Secondary button fill, active mobile nav item     |
| `on-brand`     | osweave-white | Text on a `button` or `brand` background          |
| `focus`        | purple-dark   | Keyboard focus outlines and form focus rings      |
| `surface-tint` | purple-tint   | Tinted section and nav backgrounds                |

## Components and utilities

### `Button` (`components/Button.tsx`)

| `color`             | Look                                                              | Use                                                   |
| ------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| `primary` (default) | Purple-mid fill, white text, darkens to purple-dark on hover      | Main calls to action                                  |
| `secondary`         | Near-white fill, purple-mid text and 1px border, darkens on hover | Secondary actions (pagination, Export CSV, Try again) |
| `disabled`          | Gray text with a long-dash outline                                | Status labels for unavailable actions ("All full!")   |

- Hover changes fade over 300ms (`transition-colors duration-300 ease-out`).
- The `disabled` prop fades a real button to 50% opacity and blocks clicks.
- `color="disabled"` always renders a non-interactive `<span>`, even if `href` or `onClick` is passed, so it can never look like a button that does nothing.

`ChoiceCard` (homepage role cards) and the dashboard use `Button` rather than copying its classes.

### `link` utility

Underlined purple-core text that turns purple-dark on hover. Use `className="link"` for every inline text link. The underline is required so links are not identified by color alone.

Exception: links inside a colored `Alert` may keep the alert's color when it carries meaning (for example the yellow link in the warning alert in `data/forms.tsx`). Make sure both the default and hover colors still meet 4.5:1.

### `dashed-outline` utility

A dashed border with custom dash length (10px dashes, 6px gaps, 2px stroke, 6px radius). CSS `border-style: dashed` can't control dash length, so it is drawn as an SVG background. The stroke color (`gray-300`, `#d1d5dc`) is hard-coded in the SVG because data URIs can't read CSS variables.

### Global styles

- **Focus:** every element focused by keyboard gets a 2px purple-dark outline with a 2px offset. The `@tailwindcss/forms` plugin's hard-coded blue focus ring is overridden to purple-dark.
- **Text selection:** `osweave-black` text on a `purple-light` background.

## Page changes

**Homepage (`pages/index.tsx`)**

- Sections alternate white / purple tint: the heading (white), "Join us" (tint), "From VCHI to OSWeave" (white), FAQ (tint, runs to the bottom of the page).
- Body text inside tinted sections is `gray-600` (not `gray-500`) for contrast.
- Section dividers are magenta-mid.
- FAQ question headings are purple-dark.
- Slack channel names are turquoise badges.
- Extra bottom padding below the heading section.

**Role cards (`components/ChoiceCard.tsx`):** purple-mid top bar, turquoise-mid checkmarks, `Button` for the action, `disabled` style for "All full!".

**Navbar (`components/Nav.tsx`):** purple tint background, purple-light bottom border, `gray-600` links, purple current-page underline.

**Dashboard (`pages/dashboard.tsx`):** "All full!" labels use the `disabled` button style.

**Forms and admin:** checkboxes, radios, and focus rings use the theme; input borders darkened to `gray-500`; old orange, indigo, and blue accents replaced.

**Copy:** "All full!" capitalization made consistent.

## Accessibility (WCAG 2.2 AA)

### Contrast reference

| Pairing                                      | Ratio    | Requirement  |
| -------------------------------------------- | -------- | ------------ |
| White text on purple-mid button              | 8.2:1    | 4.5:1 text   |
| White text on purple-dark (hover)            | 12.5:1   | 4.5:1 text   |
| Purple-core link on white                    | 5.4:1    | 4.5:1 text   |
| Purple-core link on purple tint              | 5.0:1    | 4.5:1 text   |
| Purple-core link on any Alert background     | ≥ 5.2:1  | 4.5:1 text   |
| `gray-600` text on purple tint               | 6.6:1    | 4.5:1 text   |
| `gray-500` text on purple tint               | 4.2:1 ❌ | Don't use    |
| Purple-dark FAQ question on purple tint      | 11.5:1   | 4.5:1 text   |
| Turquoise-dark on turquoise tint (badges)    | 9.7:1    | 4.5:1 text   |
| `osweave-black` on purple-light (selection)  | 10.0:1   | 4.5:1 text   |
| Yellow-700 link on yellow-50 (warning alert) | 4.76:1   | 4.5:1 text   |
| Yellow-800 link hover on yellow-50           | 6.64:1   | 4.5:1 text   |
| Purple-dark focus outline on white           | 12.5:1   | 3:1 non-text |
| Turquoise-mid checkmark on `gray-50`         | 3.3:1    | 3:1 non-text |
| `gray-500` input border on white             | 4.8:1    | 3:1 non-text |

Dividers, the dashed "All full!" outline, and the role card top bar are decorative and have no contrast requirement.

### Issues fixed along the way

- **No visible focus indicator (2.4.7):** buttons used `focus:shadow-outline`, which doesn't exist in Tailwind v4.
- **Faint input borders (1.4.11):** `gray-300` borders were about 1.5:1.
- **Faint mobile menu icon (1.4.11):** `gray-400` was 2.6:1.
- **Low-contrast hover (1.4.3):** the warning-alert link hovered to `yellow-600` (2.83:1).
- **Low-contrast checkmarks (1.4.11):** the old `green-500` was about 2.2:1.
- **Broken ARIA reference:** role card buttons pointed `aria-describedby` at an element that didn't exist.

### Rules for future changes

1. Use semantic tokens (`brand`, `button`, `focus`, ...) in components, not raw palette names.
2. Use `className="link"` for inline links and keep them underlined.
3. On `surface-tint` backgrounds, use `gray-600` or darker for text.
4. Bright colors (magenta-core, magenta-light, turquoise-core, purple-light) are only readable as text on `osweave-black`.
5. Check every state (default, hover, focus), not only the default.
6. When adding or changing a color, re-check contrast and update the ratios in `globals.css` and this document.
7. Contrast math doesn't cover everything. Also tab through pages to check focus, and run an automated checker such as axe DevTools.

## Not yet done

- **Mobile layout:** the tinted nav and the mobile menu were not visually checked at phone width.
- **Ideas not pursued yet:**
  - A dark `osweave-black` footer.
  - Alert colors moved onto the palette.
  - Tinted dashboard status pills.
