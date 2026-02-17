# ShipForge — CSS Design System

A comprehensive guide to the CSS architecture powering the ShipForge agency website. This system is defined entirely in `src/app.css` (377 lines) and enforced through scoped component styles.

---

## Table of Contents

1. [Philosophy](#philosophy)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Spacing](#spacing)
5. [Layout](#layout)
6. [Visual Tokens](#visual-tokens)
7. [Global Utilities](#global-utilities)
8. [Responsive Strategy](#responsive-strategy)
9. [Dark Sections](#dark-sections)
10. [Component Styling Patterns](#component-styling-patterns)
11. [Accessibility Defaults](#accessibility-defaults)

---

## Philosophy

ShipForge follows a **mobile-first, design-token-driven** approach with no utility-class framework (no Tailwind, no Bootstrap):

- **CSS Custom Properties** serve as the single source of truth for all visual decisions — colors, spacing, typography, shadows, and more.
- **Scoped component styles** keep each `.svelte` component self-contained. The Svelte compiler automatically scopes `<style>` blocks so class names never collide across components.
- **Global utilities** are limited to a small set of layout primitives (`.container`, `.section`, `.grid`) and accessibility helpers (`.skip-link`, `.sr-only`).
- **No preprocessor** — plain CSS custom properties provide theming and consistency without the build complexity of Sass or Less.
- **Fluid typography** via `clamp()` eliminates abrupt text-size jumps between breakpoints.

This architecture makes the design system easy to maintain: change a token value in `:root` and every component that references it updates automatically.

---

## Design Tokens

All tokens are declared as CSS custom properties on `:root` in `src/app.css`.

### Colors

#### Primary Palette

| Token                     | Value       | Usage                              |
| ------------------------- | ----------- | ---------------------------------- |
| `--color-primary-50`      | `#eef2ff`   | Tinted backgrounds, selection bg   |
| `--color-primary-100`     | `#e0e7ff`   | Hover backgrounds, selection color |
| `--color-primary-light`   | `#6366f1`   | Lighter interactive elements       |
| `--color-primary`         | `#4f46e5`   | Buttons, links, focus rings        |
| `--color-primary-dark`    | `#3730a3`   | Hover states, selection text       |

#### Secondary & Accent

| Token                     | Value       | Usage                              |
| ------------------------- | ----------- | ---------------------------------- |
| `--color-secondary`       | `#06b6d4`   | Secondary buttons, highlights      |
| `--color-secondary-dark`  | `#0891b2`   | Secondary hover states             |
| `--color-accent`          | `#f59e0b`   | Badges, attention elements         |
| `--color-accent-dark`     | `#d97706`   | Accent hover states                |

#### Status Colors

| Token              | Value       | Usage                 |
| ------------------ | ----------- | --------------------- |
| `--color-success`  | `#10b981`   | Success messages      |
| `--color-error`    | `#ef4444`   | Error states, alerts  |
| `--color-warning`  | `#f59e0b`   | Warning indicators    |

#### Gray Scale

A full neutral palette for text, backgrounds, and borders:

| Token                | Value       |
| -------------------- | ----------- |
| `--color-gray-50`    | `#f9fafb`   |
| `--color-gray-100`   | `#f3f4f6`   |
| `--color-gray-200`   | `#e5e7eb`   |
| `--color-gray-300`   | `#d1d5db`   |
| `--color-gray-400`   | `#9ca3af`   |
| `--color-gray-500`   | `#6b7280`   |
| `--color-gray-600`   | `#4b5563`   |
| `--color-gray-700`   | `#374151`   |
| `--color-gray-800`   | `#1f2937`   |
| `--color-gray-900`   | `#111827`   |
| `--color-gray-950`   | `#030712`   |
| `--color-white`      | `#ffffff`   |
| `--color-black`      | `#000000`   |

#### Semantic Tokens

These reference the gray scale and provide role-based naming for consistent usage:

| Token                    | Resolves To              | Usage                    |
| ------------------------ | ------------------------ | ------------------------ |
| `--color-text`           | `--color-gray-900`       | Primary body text        |
| `--color-text-secondary` | `--color-gray-600`       | Supporting text          |
| `--color-text-muted`     | `--color-gray-400`       | Placeholder, disabled    |
| `--color-text-inverse`   | `--color-white`          | Text on dark backgrounds |
| `--color-bg`             | `--color-white`          | Page background          |
| `--color-bg-alt`         | `--color-gray-50`        | Alternate section bg     |
| `--color-bg-dark`        | `--color-gray-900`       | Dark section bg          |
| `--color-border`         | `--color-gray-200`       | Default borders          |

---

## Typography

### Font Families

| Token            | Stack                                                                 | Usage             |
| ---------------- | --------------------------------------------------------------------- | ----------------- |
| `--font-sans`    | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Body text         |
| `--font-heading` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Headings (h1-h6) |
| `--font-mono`    | `'JetBrains Mono', 'Fira Code', monospace`                           | Code blocks       |

Inter is used for both body and headings, differentiated by weight and letter-spacing rather than typeface. JetBrains Mono is reserved for code-related content.

### Fluid Type Scale

Every font size uses `clamp()` to scale fluidly between a minimum (mobile) and maximum (desktop) value. The middle value includes a viewport-width component that drives the interpolation:

| Token         | clamp() Definition                                | Min       | Max        |
| ------------- | ------------------------------------------------- | --------- | ---------- |
| `--text-xs`   | `clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem)`     | 12px      | 13px       |
| `--text-sm`   | `clamp(0.8125rem, 0.775rem + 0.3vw, 0.875rem)`   | 13px      | 14px       |
| `--text-base` | `clamp(0.9375rem, 0.875rem + 0.4vw, 1.0625rem)`  | 15px      | 17px       |
| `--text-lg`   | `clamp(1.0625rem, 1rem + 0.5vw, 1.25rem)`        | 17px      | 20px       |
| `--text-xl`   | `clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)`        | 20px      | 24px       |
| `--text-2xl`  | `clamp(1.5rem, 1.3rem + 1vw, 1.875rem)`          | 24px      | 30px       |
| `--text-3xl`  | `clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem)`        | 30px      | 40px       |
| `--text-4xl`  | `clamp(2.25rem, 1.75rem + 2vw, 3.25rem)`         | 36px      | 52px       |
| `--text-5xl`  | `clamp(2.75rem, 2rem + 3vw, 4rem)`               | 44px      | 64px       |

### Heading Styles

Headings are defined globally in `app.css` with specific weight, line-height, and letter-spacing values:

| Element | Font Size     | Weight | Line Height | Letter Spacing |
| ------- | ------------- | ------ | ----------- | -------------- |
| `h1`    | `--text-5xl`  | 800    | 1.1         | -0.025em       |
| `h2`    | `--text-4xl`  | 700    | 1.15        | -0.02em        |
| `h3`    | `--text-2xl`  | 600    | 1.25        | (none)         |
| `h4`    | `--text-xl`   | 600    | 1.3         | (none)         |

All headings use `--font-heading` (Inter). The negative letter-spacing on `h1` and `h2` tightens the tracking at large sizes for a more polished display feel.

Body paragraphs use `--text-base` with `line-height: 1.7` for comfortable reading.

---

## Spacing

A linear spacing scale based on `0.25rem` increments:

| Token         | Value      | Pixels (at 16px root) |
| ------------- | ---------- | --------------------- |
| `--space-1`   | `0.25rem`  | 4px                   |
| `--space-2`   | `0.5rem`   | 8px                   |
| `--space-3`   | `0.75rem`  | 12px                  |
| `--space-4`   | `1rem`     | 16px                  |
| `--space-5`   | `1.25rem`  | 20px                  |
| `--space-6`   | `1.5rem`   | 24px                  |
| `--space-8`   | `2rem`     | 32px                  |
| `--space-10`  | `2.5rem`   | 40px                  |
| `--space-12`  | `3rem`     | 48px                  |
| `--space-16`  | `4rem`     | 64px                  |
| `--space-20`  | `5rem`     | 80px                  |
| `--space-24`  | `6rem`     | 96px                  |
| `--space-32`  | `8rem`     | 128px                 |

### Usage Guidelines

- **`--space-1` to `--space-3`**: Inline spacing, icon gaps, tight padding (e.g., badge padding, button icon spacing).
- **`--space-4` to `--space-6`**: Component-level padding, form field spacing, card internal padding.
- **`--space-8` to `--space-12`**: Section gaps, grid gaps, larger component margins.
- **`--space-16` to `--space-32`**: Page-level section padding, hero vertical spacing, major layout gaps.

---

## Layout

### Container System

The `.container` class provides a centered, max-width wrapper with responsive horizontal padding:

| Token                | Value      | Usage                              |
| -------------------- | ---------- | ---------------------------------- |
| `--container-sm`     | `640px`    | Narrow content (e.g., blog post)   |
| `--container-md`     | `768px`    | Medium content (`.container--narrow`) |
| `--container-lg`     | `1024px`   | Not directly used as max-width     |
| `--container-xl`     | `1200px`   | Default `.container` max-width     |
| `--container-2xl`    | `1400px`   | Wide content (`.container--wide`)  |
| `--container-padding`| Responsive | Horizontal padding (see below)     |

Container padding increases at each breakpoint:

| Breakpoint       | `--container-padding` value | Actual size |
| ---------------- | --------------------------- | ----------- |
| Default (mobile) | `--space-5`                 | 1.25rem     |
| `>= 768px`       | `--space-8`                 | 2rem        |
| `>= 1024px`      | `--space-12`                | 3rem        |

```css
.container {
    width: 100%;
    max-width: var(--container-xl);    /* 1200px */
    margin-inline: auto;
    padding-inline: var(--container-padding);
}

.container--narrow { max-width: var(--container-md); }  /* 768px */
.container--wide   { max-width: var(--container-2xl); } /* 1400px */
```

### Section Padding

The `.section` class applies responsive vertical padding:

| Breakpoint       | `padding-block`   | Actual size |
| ---------------- | ----------------- | ----------- |
| Default (mobile) | `--space-16`      | 4rem        |
| `>= 768px`       | `--space-20`      | 5rem        |
| `>= 1024px`      | `--space-24`      | 6rem        |

### Grid System

The `.grid` class creates a CSS Grid layout with `--space-8` (2rem) gap. Column variants collapse to single-column on mobile and expand at specific breakpoints:

| Class       | Mobile  | >= 640px | >= 768px | >= 1024px |
| ----------- | ------- | -------- | -------- | --------- |
| `.grid--2`  | 1 col   | 2 cols   | 2 cols   | 2 cols    |
| `.grid--3`  | 1 col   | 1 col    | 2 cols   | 3 cols    |
| `.grid--4`  | 1 col   | 2 cols   | 2 cols   | 4 cols    |

This staggered approach ensures content remains readable on smaller screens while taking full advantage of wider viewports.

---

## Visual Tokens

### Border Radius Scale

| Token           | Value       | Usage                              |
| --------------- | ----------- | ---------------------------------- |
| `--radius-sm`   | `0.375rem`  | Small elements (badges, tags)      |
| `--radius-md`   | `0.5rem`    | Buttons, input fields              |
| `--radius-lg`   | `0.75rem`   | Cards, dropdowns                   |
| `--radius-xl`   | `1rem`      | Large cards, modals                |
| `--radius-2xl`  | `1.5rem`    | Hero elements, featured content    |
| `--radius-full` | `9999px`    | Pills, avatars, circular elements  |

### Shadow Scale

| Token          | Value                                                                   | Usage                    |
| -------------- | ----------------------------------------------------------------------- | ------------------------ |
| `--shadow-sm`  | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                        | Subtle depth (buttons)   |
| `--shadow-md`  | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`    | Cards at rest            |
| `--shadow-lg`  | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`  | Cards on hover, elevated |
| `--shadow-xl`  | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Modals, hero elements    |

### Transition Tokens

| Token               | Value       | Usage                                 |
| ------------------- | ----------- | ------------------------------------- |
| `--transition-fast` | `150ms ease`| Micro-interactions (focus, active)    |
| `--transition-base` | `250ms ease`| Standard hover transitions            |
| `--transition-slow` | `400ms ease`| Layout shifts, panel reveals          |

### Z-Index Scale

A five-level z-index scale prevents stacking-context chaos:

| Token           | Value | Usage                       |
| --------------- | ----- | --------------------------- |
| `--z-dropdown`  | 100   | Dropdown menus              |
| `--z-sticky`    | 200   | Sticky navigation bar       |
| `--z-overlay`   | 300   | Background overlays         |
| `--z-modal`     | 400   | Modal dialogs               |
| `--z-toast`     | 500   | Toast notifications, alerts |

---

## Global Utilities

### Layout Classes

```css
.container          /* Centered max-width wrapper (1200px) */
.container--narrow  /* Narrow variant (768px) */
.container--wide    /* Wide variant (1400px) */
.section            /* Responsive vertical padding */
.section--dark      /* Dark background with inverse text */
.section--alt       /* Light gray alternate background */
.grid               /* CSS Grid with 2rem gap */
.grid--2            /* 2-column responsive grid */
.grid--3            /* 3-column responsive grid */
.grid--4            /* 4-column responsive grid */
```

### Accessibility Helpers

#### Skip Link

The `.skip-link` is visually hidden off-screen until it receives focus, at which point it slides into view at the top of the page:

```css
.skip-link {
    position: absolute;
    top: -100%;
    left: var(--space-4);
    z-index: var(--z-toast);
    padding: var(--space-3) var(--space-6);
    background-color: var(--color-primary);
    color: var(--color-white);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: var(--text-sm);
    transition: top var(--transition-fast);
}

.skip-link:focus {
    top: var(--space-4);
}
```

#### Screen Reader Only

The `.sr-only` class hides content visually while keeping it accessible to screen readers:

```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
```

### Focus Styles

All focusable elements receive a visible focus indicator via `:focus-visible`:

```css
:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}
```

This only appears for keyboard navigation (not mouse clicks), thanks to the `:focus-visible` pseudo-class.

### Selection Styles

Text selection uses brand colors for a polished feel:

```css
::selection {
    background-color: var(--color-primary-100);
    color: var(--color-primary-dark);
}
```

---

## Responsive Strategy

### Breakpoints

ShipForge uses three breakpoints, always applied with `min-width` (mobile-first):

| Name  | Width      | Typical trigger                                  |
| ----- | ---------- | ------------------------------------------------ |
| `sm`  | `640px`    | 2-column grids appear, form layouts shift        |
| `md`  | `768px`    | Desktop nav visible, 3-column grids, wider padding |
| `lg`  | `1024px`   | Full grid layouts (3-4 cols), maximum padding    |

### Mobile-First Approach

All base styles target the smallest screens. Enhancements are layered on via `@media (min-width: ...)` queries. This means:

1. **Default CSS** = mobile layout (single column, compact padding).
2. **`@media (min-width: 640px)`** = small tablet adjustments (2-column grids).
3. **`@media (min-width: 768px)`** = tablet/small desktop (navigation switch, wider containers).
4. **`@media (min-width: 1024px)`** = full desktop (all grid columns, maximum spacing).

### Fluid Typography via clamp()

Rather than changing font sizes at breakpoints, the `clamp()` function provides smooth scaling:

```css
/* Example: --text-4xl */
font-size: clamp(2.25rem, 1.75rem + 2vw, 3.25rem);
/*              min (36px)  preferred     max (52px)  */
```

The preferred value (`1.75rem + 2vw`) grows linearly with the viewport, clamped between the min and max. This eliminates the need for font-size media queries entirely.

---

## Dark Sections

### The `.section--dark` Pattern

Dark sections invert the color scheme for visual contrast between page regions:

```css
.section--dark {
    background-color: var(--color-bg-dark);   /* --color-gray-900: #111827 */
    color: var(--color-text-inverse);          /* --color-white: #ffffff */
}
```

### Color Inversion Approach

When building components that appear inside `.section--dark`, use the semantic color tokens for adaptability:

- Use `currentColor` or `inherit` for text that should follow the section's color.
- Use `--color-text-inverse` explicitly for elements that need white text regardless of context.
- Backgrounds within dark sections can use `--color-gray-800` or `--color-gray-700` for subtle layering.
- Borders should shift to a lighter gray (e.g., `--color-gray-700`) for visibility against the dark background.

The `.section--alt` variant provides a softer contrast using `--color-bg-alt` (`--color-gray-50`), useful for alternating light sections.

---

## Component Styling Patterns

### Using Tokens in Scoped Styles

Every component `<style>` block should reference design tokens rather than hard-coded values:

```svelte
<style>
    .card {
        padding: var(--space-6);
        border-radius: var(--radius-lg);
        background: var(--color-bg);
        box-shadow: var(--shadow-md);
        transition: box-shadow var(--transition-base),
                    transform var(--transition-base);
    }
</style>
```

### BEM-Like Naming Within Components

Although Svelte scopes all styles, BEM-style naming is used for readability and to communicate structure:

```
.nav                    /* Block */
.nav__link              /* Element */
.nav__link--active      /* Modifier */

.service-card           /* Block */
.service-card__icon     /* Element */
.service-card__title    /* Element */
```

This naming convention makes it clear which elements belong to which component, even when reading the markup in isolation.

### Hover / Focus State Patterns

Interactive elements follow a consistent state pattern:

```svelte
<style>
    .card {
        box-shadow: var(--shadow-md);
        transform: translateY(0);
        transition: box-shadow var(--transition-base),
                    transform var(--transition-base);
    }

    .card:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
    }

    .button--primary {
        background-color: var(--color-primary);
        transition: background-color var(--transition-fast);
    }

    .button--primary:hover {
        background-color: var(--color-primary-dark);
    }

    /* Focus styles inherit the global :focus-visible rule,
       but can be customized per component if needed */
    .button:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
</style>
```

Key principles:
- Always use `transform` and `opacity` for animated properties (GPU-accelerated, no layout thrash).
- Use `--transition-fast` for micro-interactions (button press, focus ring).
- Use `--transition-base` for visual state changes (card hover, shadow changes).
- Use `--transition-slow` for larger layout transitions (panel reveals, menu slides).

---

## Accessibility Defaults

The CSS reset in `app.css` includes several accessibility-first defaults:

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }

    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

When the user has requested reduced motion at the OS level, **all CSS animations and transitions are effectively disabled**. This works in tandem with the JavaScript-level `prefersReducedMotion()` check in the GSAP layer.

### Smooth Scrolling

Smooth scrolling is enabled by default (`scroll-behavior: smooth` on `html`) but is automatically disabled for users who prefer reduced motion.

### Font Smoothing

```css
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

### Tap Highlight Removal

```css
*, *::after, *::before {
    -webkit-tap-highlight-color: transparent;
}
```

This prevents the blue/gray flash on mobile taps while the project provides its own `:focus-visible` and `:active` styling.
