# ShipForge — Master Specification

> **Version:** 1.0.0
> **Last Updated:** February 17, 2026
> **Status:** Living Document

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Route Map](#3-route-map)
4. [Component Library](#4-component-library)
5. [Data Layer](#5-data-layer)
6. [Design System](#6-design-system)
7. [SEO Strategy](#7-seo-strategy)
8. [Animation System](#8-animation-system)
9. [Accessibility](#9-accessibility)
10. [Performance](#10-performance)
11. [Development Commands](#11-development-commands)
12. [Deployment](#12-deployment)

---

## 1. Project Overview

### Brand Identity

| Attribute   | Value                                           |
| ----------- | ----------------------------------------------- |
| **Name**    | ShipForge                                       |
| **Tagline** | Build Faster. Rank Higher. Convert More.        |
| **Domain**  | `https://shipforge.dev`                         |
| **Email**   | `hello@shipforge.dev`                           |
| **Icon**    | Phosphor `Anchor` icon (bold weight, 28px nav)  |

### Business Description

ShipForge is a **Fullstack App/Web Development + SEO Agency** that builds high-performance web applications engineered to dominate search rankings and turn visitors into customers. The company positions itself as a boutique engineering studio offering four core services:

1. Fullstack Web Development (SvelteKit, Next.js, TypeScript)
2. Technical SEO (audits, Core Web Vitals, schema markup)
3. UI/UX Design (responsive design systems, accessibility-first)
4. Performance Optimization (Lighthouse scores, bundle reduction, CDN)

### Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **Framework**      | SvelteKit (Svelte 5 with runes)               |
| **Language**       | TypeScript (strict mode)                      |
| **Styling**        | CSS custom properties (design tokens), scoped component styles |
| **Animation**      | GSAP 3 + ScrollTrigger                        |
| **Icons**          | Phosphor Icons (`phosphor-svelte` v3)         |
| **Content**        | MDsveX (Markdown + Svelte)                    |
| **Package Manager**| pnpm (with workspace support via `pnpm-workspace.yaml`) |
| **Build Tool**     | Vite 7                                        |
| **Linting**        | ESLint 9 + `eslint-plugin-svelte`             |
| **Formatting**     | Prettier + `prettier-plugin-svelte`           |
| **Unit Testing**   | Vitest 4 + `vitest-browser-svelte` (Playwright browser provider) |
| **E2E Testing**    | Playwright                                    |
| **Type Checking**  | `svelte-check` 4                              |

### Project Structure

```
udemy-hp/
├── docs/                         # Documentation (this file)
├── e2e/                          # Playwright end-to-end tests
│   └── demo.test.js
├── src/
│   ├── app.css                   # Global design system + reset
│   ├── app.html                  # HTML shell template
│   ├── lib/
│   │   ├── assets/               # Static assets (images, favicon)
│   │   │   ├── book_cover.png
│   │   │   ├── phone_cover.png
│   │   │   └── favicon.svg
│   │   ├── components/           # Reusable UI components
│   │   │   ├── index.ts          # Barrel exports
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── BlogCard.svelte
│   │   │   ├── CaseStudyCard.svelte
│   │   │   ├── ServiceCard.svelte
│   │   │   ├── StatCounter.svelte
│   │   │   ├── SectionHeader.svelte
│   │   │   ├── SEOHead.svelte
│   │   │   ├── Nav.svelte
│   │   │   └── Footer.svelte
│   │   ├── data/                 # Static data modules
│   │   │   ├── blog-posts.ts
│   │   │   ├── case-studies.ts
│   │   │   ├── navigation.ts
│   │   │   └── services.ts
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── utils/                # Utility modules
│   │       ├── gsap.ts           # GSAP animation utilities
│   │       └── seo.ts            # SEO schema & meta utilities
│   └── routes/                   # SvelteKit file-based routes
│       ├── +layout.svelte        # Root layout (Nav + Footer)
│       ├── +layout.ts            # Layout data (prerender = true)
│       ├── +page.svelte          # Home page
│       ├── about/+page.svelte
│       ├── blog/+page.svelte
│       ├── case-studies/+page.svelte
│       ├── contact/+page.svelte
│       ├── disclaimer/+page.svelte
│       ├── lead-magnet/
│       │   ├── +page.svelte
│       │   └── thank-you/+page.svelte
│       ├── privacy/+page.svelte
│       ├── services/+page.svelte
│       └── terms/+page.svelte
├── static/                       # Publicly served static files
│   ├── favicon.svg
│   └── robots.txt
├── eslint.config.js
├── package.json
├── playwright.config.js
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── svelte.config.js
├── tsconfig.json
└── vite.config.js
```

### Path Aliases

Configured in `svelte.config.js` for clean imports:

| Alias          | Resolves To               |
| -------------- | ------------------------- |
| `$lib`         | `./src/lib`               |
| `$components`  | `./src/lib/components`    |
| `$assets`      | `./src/lib/assets`        |
| `$utils`       | `./src/lib/utils`         |
| `$types`       | `./src/lib/types`         |

---

## 2. Architecture Overview

### SvelteKit File-Based Routing

The application uses SvelteKit's filesystem-based router. Each directory under `src/routes/` maps to a URL path, and `+page.svelte` files define the page content for that route.

- **Root layout** (`+layout.svelte`): Wraps all pages with the `Nav` and `Footer` components, imports global CSS, and renders a skip-link for accessibility.
- **Layout data** (`+layout.ts`): Exports `prerender = true` for static site generation and provides `siteTitle` and `siteDescription` to all pages.

### Component-Driven Architecture

The project follows a component-driven approach where:

1. **Reusable components** live in `src/lib/components/` and are exported through a barrel file (`index.ts`).
2. **Page-level composition** occurs in route `+page.svelte` files, which compose reusable components with page-specific layout and styles.
3. **Data separation** is achieved through dedicated data modules in `src/lib/data/`, keeping content out of components.
4. **Type safety** is enforced via TypeScript interfaces in `src/lib/types/index.ts`.

### Design Token System

All visual design decisions are encoded as CSS custom properties in `:root` (defined in `src/app.css`). Components reference tokens exclusively rather than hard-coded values, ensuring consistency and enabling future theming.

### GSAP Animation System

GSAP is initialized only in browser environments (`$app/environment`). All animation utilities in `src/lib/utils/gsap.ts` respect the user's `prefers-reduced-motion` setting and provide cleanup functions for proper lifecycle management.

### SEO-First Architecture

Every page includes an `<SEOHead>` component that renders:
- `<title>` and `<meta name="description">`
- Canonical URLs
- Open Graph and Twitter Card meta tags
- JSON-LD structured data via `<script type="application/ld+json">`

Schema generation is handled by utility functions in `src/lib/utils/seo.ts`.

### Preprocessors

Configured in `svelte.config.js`:

1. **`vitePreprocess()`** — Handles TypeScript, PostCSS, and other Vite-native transforms.
2. **`mdsvex()`** — Enables Markdown content with `.svx` file extension support, allowing Svelte components inside Markdown.

---

## 3. Route Map

### Public Routes

| Route                    | Page Title                                    | Purpose                                                         |
| ------------------------ | --------------------------------------------- | --------------------------------------------------------------- |
| `/`                      | ShipForge — Fullstack Development & SEO Agency | Home page with hero, services preview, stats, case studies, CTA |
| `/services`              | Services \| ShipForge                         | Full services listing with process workflow                     |
| `/case-studies`          | Case Studies \| ShipForge                     | Portfolio of client projects with metrics                       |
| `/about`                 | About \| ShipForge                            | Company story, values, team description                         |
| `/blog`                  | Blog \| ShipForge                             | Blog listing with category filtering                            |
| `/contact`               | Contact \| ShipForge                          | Contact form with validation + company info sidebar             |
| `/lead-magnet`           | Free Guide: The Fullstack SEO Playbook        | Lead capture page for free download                             |
| `/lead-magnet/thank-you` | Thank You \| ShipForge                        | Post-submission confirmation with next steps                    |

### Legal Routes

| Route         | Page Title                    | Purpose                     |
| ------------- | ----------------------------- | --------------------------- |
| `/privacy`    | Privacy Policy \| ShipForge  | Privacy policy document     |
| `/terms`      | Terms of Service \| ShipForge | Terms of service document   |
| `/disclaimer` | Disclaimer \| ShipForge      | Legal disclaimer document   |

### Route Details

#### `/` (Home)

Sections rendered in order:
1. **Hero** — Dark background with gradient overlays, headline, subtitle, two CTA buttons
2. **Services Preview** — 4-column grid of `ServiceCard` components (all services)
3. **Stats** — 4-column grid with key metrics (150+ Projects, 98 Lighthouse, 12x Traffic, 4.9 Satisfaction)
4. **Case Studies Preview** — 2-column grid showing first 2 case studies
5. **CTA Section** — Gradient background with consultation call-to-action

#### `/services`

Sections rendered in order:
1. **Hero Banner** — Gradient background with eyebrow, heading, subtitle
2. **Services Grid** — 2-column grid of all `ServiceCard` components
3. **Process Section** — 4-step numbered workflow (Discovery, Design, Build, Launch)
4. **CTA** — Dark background with contact link

#### `/case-studies`

Sections rendered in order:
1. **Hero Banner** — Gradient background
2. **Case Studies Grid** — 2-column grid of all `CaseStudyCard` components
3. **CTA** — Dark background with project start link

#### `/about`

Sections rendered in order:
1. **Hero** — Dark background with brand description
2. **Story** — Two-column layout (text + core values card)
3. **Values** — 3-column grid of value cards (Technical Excellence, Measurable Results, Transparent Process)
4. **Team** — Description of boutique team approach
5. **CTA** — Dark background with contact link

#### `/blog`

Features:
- Client-side category filtering (`All`, `Engineering`, `SEO`, `Strategy`)
- Uses `$state` and `$derived` runes for reactive filtering
- Empty state with reset button when no posts match filter
- CTA linking to lead magnet download

#### `/contact`

Features:
- Full contact form with fields: Name, Email, Company (optional), Service (dropdown), Message
- Client-side validation with error messages per field
- Loading state with spinner during submission
- Success state with confirmation message
- Sidebar with email, response time, and social links (GitHub, LinkedIn, Twitter)

#### `/lead-magnet`

Features:
- Two-column layout: form + decorative book mockup
- Simple form: First Name + Email Address
- Benefits list with Phosphor icons
- Redirects to `/lead-magnet/thank-you` on success
- Book mockup shows chapter preview list

#### `/lead-magnet/thank-you`

Features:
- `<meta name="robots" content="noindex, nofollow">` to prevent indexing
- Success confirmation with checkmark icon
- "What's Next?" section with 3 navigation cards (Case Studies, Blog, Contact)
- Back to Home button

---

## 4. Component Library

All components live in `src/lib/components/` and are exported via `src/lib/components/index.ts`.

### Button

**File:** `Button.svelte`
**Purpose:** Polymorphic button/link component supporting multiple visual variants and sizes.

| Prop       | Type                                           | Default     | Description                        |
| ---------- | ---------------------------------------------- | ----------- | ---------------------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual style variant              |
| `size`     | `'sm' \| 'md' \| 'lg'`                        | `'md'`      | Size variant                       |
| `href`     | `string \| undefined`                          | `undefined` | If set, renders as `<a>` element   |
| `type`     | `'button' \| 'submit' \| 'reset'`             | `'button'`  | HTML button type                   |
| `disabled` | `boolean`                                      | `false`     | Disabled state                     |
| `children` | `Snippet`                                      | (required)  | Button content                     |
| `onclick`  | `(e: MouseEvent) => void`                      | `undefined` | Click handler                      |
| `class`    | `string`                                       | `''`        | Additional CSS classes             |

**Behavior:**
- Renders `<a>` when `href` is provided (and not disabled), `<button>` otherwise.
- Spreads `...restProps` for flexibility.
- Active state: `translateY(1px)` on press.
- Focus: 2px solid primary outline with 2px offset.

### Card

**File:** `Card.svelte`
**Purpose:** Generic content card with optional icon slot and configurable padding.

| Prop       | Type                       | Default | Description           |
| ---------- | -------------------------- | ------- | --------------------- |
| `children` | `Snippet`                  | (req)   | Card body content     |
| `icon`     | `Snippet \| undefined`     | `undef` | Optional icon slot    |
| `padding`  | `'sm' \| 'md' \| 'lg'`    | `'md'`  | Padding size variant  |
| `class`    | `string`                   | `''`    | Additional CSS classes|

**Behavior:**
- Hover: `box-shadow: var(--shadow-lg)` + `translateY(-2px)`.

### SectionHeader

**File:** `SectionHeader.svelte`
**Purpose:** Consistent section heading with optional eyebrow text and subtitle.

| Prop       | Type                    | Default    | Description                     |
| ---------- | ----------------------- | ---------- | ------------------------------- |
| `eyebrow`  | `string \| undefined`   | `undefined`| Uppercase label above title     |
| `title`    | `string`                | (required) | Section heading (renders `<h2>`)|
| `subtitle` | `string \| undefined`   | `undefined`| Descriptive paragraph           |
| `align`    | `'center' \| 'left'`    | `'center'` | Text alignment                  |

**Behavior:**
- Max width `48rem`, centered with `margin-inline: auto` when `align='center'`.
- Bottom margin `var(--space-12)` to separate from content.

### ServiceCard

**File:** `ServiceCard.svelte`
**Purpose:** Displays a service offering with icon, title, description, and feature checklist.

| Prop      | Type      | Default    | Description           |
| --------- | --------- | ---------- | --------------------- |
| `service` | `Service` | (required) | Service data object   |

**Behavior:**
- Maps `service.icon` string to Phosphor component via internal `iconMap`: `code` -> `Code`, `magnifying-glass` -> `MagnifyingGlass`, `palette` -> `Palette`, `lightning` -> `Lightning`.
- Each feature renders with a green `Check` icon.
- Full-height flex column with features pushed to bottom via `margin-top: auto`.
- Hover: shadow + lift + border color change.

### CaseStudyCard

**File:** `CaseStudyCard.svelte`
**Purpose:** Displays a case study with tags, client info, description, metrics grid, and link.

| Prop        | Type        | Default    | Description             |
| ----------- | ----------- | ---------- | ----------------------- |
| `caseStudy` | `CaseStudy` | (required) | Case study data object  |

**Behavior:**
- Tags rendered as pill badges (uppercase, primary color on primary-50 background).
- Metrics displayed in a 2x2 grid with large bold values.
- "View Case Study" link with arrow icon that increases gap on hover.
- Full-height flex layout with metrics pushed to bottom.

### BlogCard

**File:** `BlogCard.svelte`
**Purpose:** Displays a blog post preview with metadata, title, excerpt, and read-more link.

| Prop   | Type       | Default    | Description            |
| ------ | ---------- | ---------- | ---------------------- |
| `post` | `BlogPost` | (required) | Blog post data object  |

**Behavior:**
- Formats date using `toLocaleDateString('en-US', { year, month: 'short', day })`.
- Meta row: calendar icon + date, category badge.
- Footer: clock icon + read time, "Read More" link with arrow.
- Full-height flex layout with excerpt growing to fill space.
- Title links to `/blog/{post.slug}`.

### StatCounter

**File:** `StatCounter.svelte`
**Purpose:** Displays a single statistic with large value and label.

| Prop    | Type     | Default | Description            |
| ------- | -------- | ------- | ---------------------- |
| `value` | `string` | (req)   | Statistic value text   |
| `label` | `string` | (req)   | Statistic label text   |
| `class` | `string` | `''`    | Additional CSS classes |

**Behavior:**
- Centered flex column.
- Value: heading font, `--text-4xl`, 800 weight, primary color.
- Label: `--text-sm`, uppercase, letter-spacing `0.05em`.

### SEOHead

**File:** `SEOHead.svelte`
**Purpose:** Renders all SEO-related meta tags into `<svelte:head>`.

| Prop       | Type          | Default    | Description        |
| ---------- | ------------- | ---------- | ------------------ |
| `metadata` | `SEOMetadata` | (required) | SEO metadata object|

**Renders:**
- `<title>` tag
- `<meta name="description">`
- `<link rel="canonical">` (if `canonical` provided)
- Open Graph: `og:title`, `og:description`, `og:type`, `og:image`, `og:url`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD structured data via `<script type="application/ld+json">` (if `schema` provided)

**Derived state:** `jsonLdScript` uses `$derived` rune to serialize schema when present.

### Nav

**File:** `Nav.svelte`
**Purpose:** Sticky top navigation with responsive mobile slide-in panel.

**Props:** None (consumes `mainNav` data directly).

**Features:**
- Sticky positioning with backdrop blur and semi-transparent white background.
- Desktop: horizontal link list (hidden below `768px`).
- Mobile: hamburger toggle (Phosphor `List`/`X` icons) with slide-in panel from right.
- Active state detection via `$page.url.pathname` comparison.
- `aria-current="page"` on active link.
- `aria-expanded`, `aria-controls`, `aria-label` on toggle button.
- Mobile panel uses `role="dialog"` and `aria-modal`.
- Overlay click and `Escape` key close the mobile menu.
- Brand: Phosphor `Anchor` icon + "ShipForge" text.

### Footer

**File:** `Footer.svelte`
**Purpose:** Site footer with brand, navigation links, legal links, and copyright.

**Props:** None (consumes `mainNav` and `footerNav` data directly).

**Layout:**
- Dark background (`--color-gray-900`).
- 3-column grid on desktop (brand | navigation | legal), single column on mobile.
- Bottom bar with copyright and current year.

---

## 5. Data Layer

All static data lives in `src/lib/data/` as typed TypeScript modules.

### `services.ts`

Exports: `services: Service[]` (4 items)

| Service                    | Icon              | Slug                       | Features Count |
| -------------------------- | ----------------- | -------------------------- | -------------- |
| Fullstack Web Development  | `code`            | `fullstack-development`    | 6              |
| Technical SEO              | `magnifying-glass` | `technical-seo`           | 6              |
| UI/UX Design               | `palette`         | `ui-ux-design`             | 6              |
| Performance Optimization   | `lightning`       | `performance-optimization` | 6              |

### `case-studies.ts`

Exports: `caseStudies: CaseStudy[]` (4 items)

| Title                          | Client               | Tags                              | Slug                   |
| ------------------------------ | -------------------- | --------------------------------- | ---------------------- |
| E-Commerce Platform Rebuild    | NovaMart             | SvelteKit, E-Commerce, Performance | `novamart-ecommerce`  |
| SaaS Dashboard Redesign        | DataPulse            | TypeScript, Dashboard, Real-time   | `datapulse-dashboard` |
| SEO Turnaround for Legal Firm  | Sterling & Associates | SEO, Content Strategy, Lead Gen   | `sterling-seo`        |
| Startup MVP to Scale           | FlowState            | MVP, Scaling, SvelteKit            | `flowstate-mvp`       |

Each case study includes 4 metrics with `label` and `value` pairs.

### `blog-posts.ts`

Exports: `blogPosts: BlogPost[]` (6 items)

| Title                                                  | Category    | Date       | Read Time |
| ------------------------------------------------------ | ----------- | ---------- | --------- |
| Why SvelteKit is the Best Framework for SEO in 2026    | Engineering | 2026-02-10 | 8 min     |
| Core Web Vitals: The Complete Technical Guide          | SEO         | 2026-02-03 | 12 min    |
| TypeScript Patterns Every Svelte Developer Should Know | Engineering | 2026-01-27 | 10 min    |
| The ROI of Web Performance: Numbers That Matter        | Strategy    | 2026-01-20 | 6 min     |
| Structured Data Strategy for Service Businesses        | SEO         | 2026-01-13 | 9 min     |
| GSAP + SvelteKit: Production Animation Patterns        | Engineering | 2026-01-06 | 11 min    |

### `navigation.ts`

Exports two arrays:

**`mainNav: NavLink[]`** (5 items) — Used in `Nav` and `Footer`:

| Label        | Href           |
| ------------ | -------------- |
| Services     | `/services`    |
| Case Studies | `/case-studies`|
| About        | `/about`       |
| Blog         | `/blog`        |
| Contact      | `/contact`     |

**`footerNav: NavLink[]`** (3 items) — Used in `Footer`:

| Label            | Href           |
| ---------------- | -------------- |
| Privacy Policy   | `/privacy`     |
| Terms of Service | `/terms`       |
| Disclaimer       | `/disclaimer`  |

### Type Definitions (`src/lib/types/index.ts`)

| Interface           | Fields                                                                      |
| ------------------- | --------------------------------------------------------------------------- |
| `Service`           | `title`, `description`, `icon`, `features: string[]`, `slug`               |
| `CaseStudy`         | `title`, `client`, `description`, `tags: string[]`, `metrics: {label, value}[]`, `image`, `slug` |
| `TeamMember`        | `name`, `role`, `bio`, `image`                                              |
| `BlogPost`          | `title`, `excerpt`, `date`, `category`, `slug`, `readTime`                  |
| `ContactFormData`   | `name`, `email`, `company`, `service`, `message`                            |
| `LeadMagnetFormData`| `name`, `email`                                                             |
| `NavLink`           | `label`, `href`                                                             |
| `SEOMetadata`       | `title`, `description`, `canonical?`, `ogImage?`, `ogType?`, `twitterCard?`, `schema?` |

---

## 6. Design System

The entire design system is defined as CSS custom properties in `src/app.css` and consumed by all components via `var()` references. No Tailwind, no utility-class framework — all styling is hand-crafted, scoped, and token-driven.

### Color Tokens

#### Primary Palette

| Token                   | Value     | Usage                            |
| ----------------------- | --------- | -------------------------------- |
| `--color-primary`       | `#4f46e5` | Buttons, links, active states    |
| `--color-primary-light` | `#6366f1` | Hover accents                    |
| `--color-primary-dark`  | `#3730a3` | Dark hover states, CTA gradients |
| `--color-primary-50`    | `#eef2ff` | Light backgrounds, badges        |
| `--color-primary-100`   | `#e0e7ff` | Focus rings, selections          |

#### Secondary Palette

| Token                      | Value     | Usage                    |
| -------------------------- | --------- | ------------------------ |
| `--color-secondary`        | `#06b6d4` | Secondary buttons        |
| `--color-secondary-dark`   | `#0891b2` | Secondary hover, accents |

#### Accent & Status

| Token              | Value     | Usage            |
| ------------------ | --------- | ---------------- |
| `--color-accent`   | `#f59e0b` | Highlights       |
| `--color-success`  | `#10b981` | Success states   |
| `--color-error`    | `#ef4444` | Error messages   |
| `--color-warning`  | `#f59e0b` | Warning states   |

#### Neutral Palette

Full gray scale from `--color-gray-50` (`#f9fafb`) through `--color-gray-950` (`#030712`), plus `--color-white` (`#ffffff`) and `--color-black` (`#000000`).

#### Semantic Color Mappings

| Token                   | Maps To              | Usage                   |
| ----------------------- | -------------------- | ----------------------- |
| `--color-text`          | `--color-gray-900`   | Primary body text       |
| `--color-text-secondary`| `--color-gray-600`   | Descriptions, subtitles |
| `--color-text-muted`    | `--color-gray-400`   | Placeholders, metadata  |
| `--color-text-inverse`  | `--color-white`      | Text on dark backgrounds|
| `--color-bg`            | `--color-white`      | Page background         |
| `--color-bg-alt`        | `--color-gray-50`    | Alternate section bg    |
| `--color-bg-dark`       | `--color-gray-900`   | Dark sections, hero     |
| `--color-border`        | `--color-gray-200`   | Card borders, dividers  |

### Typography

#### Font Families

| Token            | Stack                                                              | Usage       |
| ---------------- | ------------------------------------------------------------------ | ----------- |
| `--font-sans`    | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Body text   |
| `--font-heading` | Same as `--font-sans`                                              | Headings    |
| `--font-mono`    | `'JetBrains Mono', 'Fira Code', monospace`                        | Code blocks |

Fonts are loaded via Google Fonts with `preconnect` hints in `app.html`:
- **Inter**: weights 400, 500, 600, 700, 800
- **JetBrains Mono**: weights 400, 500

#### Font Size Scale (Fluid Typography)

All sizes use `clamp()` for smooth scaling between viewport widths:

| Token        | Min       | Max        | Usage                    |
| ------------ | --------- | ---------- | ------------------------ |
| `--text-xs`  | `0.75rem` | `0.8125rem`| Tags, fine print         |
| `--text-sm`  | `0.8125rem`| `0.875rem`| Labels, metadata         |
| `--text-base`| `0.9375rem`| `1.0625rem`| Body text               |
| `--text-lg`  | `1.0625rem`| `1.25rem` | Subtitles, lead text     |
| `--text-xl`  | `1.25rem` | `1.5rem`   | Card titles              |
| `--text-2xl` | `1.5rem`  | `1.875rem` | Section subheadings      |
| `--text-3xl` | `1.875rem`| `2.5rem`   | Section headings         |
| `--text-4xl` | `2.25rem` | `3.25rem`  | Page headings, stat values|
| `--text-5xl` | `2.75rem` | `4rem`     | Hero headlines           |

#### Heading Styles

| Element | Size        | Weight | Line Height | Letter Spacing |
| ------- | ----------- | ------ | ----------- | -------------- |
| `h1`    | `--text-5xl`| 800    | 1.1         | `-0.025em`     |
| `h2`    | `--text-4xl`| 700    | 1.15        | `-0.02em`      |
| `h3`    | `--text-2xl`| 600    | 1.25        | —              |
| `h4`    | `--text-xl` | 600    | 1.3         | —              |
| `p`     | `--text-base`| —     | 1.7         | —              |

### Spacing Scale

A consistent spacing scale based on `0.25rem` (4px) increments:

| Token        | Value    | Pixels |
| ------------ | -------- | ------ |
| `--space-1`  | `0.25rem`| 4px    |
| `--space-2`  | `0.5rem` | 8px    |
| `--space-3`  | `0.75rem`| 12px   |
| `--space-4`  | `1rem`   | 16px   |
| `--space-5`  | `1.25rem`| 20px   |
| `--space-6`  | `1.5rem` | 24px   |
| `--space-8`  | `2rem`   | 32px   |
| `--space-10` | `2.5rem` | 40px   |
| `--space-12` | `3rem`   | 48px   |
| `--space-16` | `4rem`   | 64px   |
| `--space-20` | `5rem`   | 80px   |
| `--space-24` | `6rem`   | 96px   |
| `--space-32` | `8rem`   | 128px  |

### Layout Primitives

#### Container

| Class               | Max Width          | Description                   |
| ------------------- | ------------------ | ----------------------------- |
| `.container`        | `1200px` (xl)      | Standard content width        |
| `.container--narrow`| `768px` (md)       | Legal pages, narrow text      |
| `.container--wide`  | `1400px` (2xl)     | Wide content layouts          |

Container padding is responsive:
- Default: `--space-5` (20px)
- `>=768px`: `--space-8` (32px)
- `>=1024px`: `--space-12` (48px)

#### Section

| Class            | Description                                  |
| ---------------- | -------------------------------------------- |
| `.section`       | Vertical padding: 64px -> 80px -> 96px       |
| `.section--dark` | Dark background with inverse text            |
| `.section--alt`  | Light gray alternate background              |

#### Grid

| Class      | Columns (mobile -> sm -> md -> lg)   |
| ---------- | ------------------------------------ |
| `.grid`    | Base grid with `--space-8` gap       |
| `.grid--2` | 1 -> 2 cols (at 640px)               |
| `.grid--3` | 1 -> 2 cols (at 768px) -> 3 (1024px) |
| `.grid--4` | 1 -> 2 cols (at 640px) -> 4 (1024px) |

### Container Breakpoints

| Token             | Value    |
| ----------------- | -------- |
| `--container-sm`  | `640px`  |
| `--container-md`  | `768px`  |
| `--container-lg`  | `1024px` |
| `--container-xl`  | `1200px` |
| `--container-2xl` | `1400px` |

### Border Radius Tokens

| Token           | Value     | Usage                   |
| --------------- | --------- | ----------------------- |
| `--radius-sm`   | `0.375rem`| Small badges            |
| `--radius-md`   | `0.5rem`  | Buttons, inputs         |
| `--radius-lg`   | `0.75rem` | Cards                   |
| `--radius-xl`   | `1rem`    | Large cards, panels     |
| `--radius-2xl`  | `1.5rem`  | Hero sections           |
| `--radius-full` | `9999px`  | Pills, avatar circles   |

### Shadow Tokens

| Token          | Value                                                            | Usage            |
| -------------- | ---------------------------------------------------------------- | ---------------- |
| `--shadow-sm`  | `0 1px 2px 0 rgb(0 0 0 / 0.05)`                                 | Subtle elevation |
| `--shadow-md`  | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Button hover  |
| `--shadow-lg`  | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Card hover   |
| `--shadow-xl`  | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Overlays     |

### Transition Tokens

| Token               | Value       | Usage                |
| -------------------- | ---------- | -------------------- |
| `--transition-fast`  | `150ms ease`| Hover states, toggles|
| `--transition-base`  | `250ms ease`| Card interactions    |
| `--transition-slow`  | `400ms ease`| Panel slides         |

### Z-Index Scale

| Token           | Value | Usage                |
| --------------- | ----- | -------------------- |
| `--z-dropdown`  | `100` | Dropdowns            |
| `--z-sticky`    | `200` | Sticky nav           |
| `--z-overlay`   | `300` | Mobile menu overlay  |
| `--z-modal`     | `400` | Mobile menu panel    |
| `--z-toast`     | `500` | Skip link, toasts    |

---

## 7. SEO Strategy

### Meta Tag Architecture

Every page renders the `<SEOHead>` component, which accepts an `SEOMetadata` object and outputs:

```html
<!-- Standard -->
<title>{metadata.title}</title>
<meta name="description" content="{metadata.description}" />
<link rel="canonical" href="{metadata.canonical}" />

<!-- Open Graph -->
<meta property="og:title" content="{metadata.title}" />
<meta property="og:description" content="{metadata.description}" />
<meta property="og:type" content="{metadata.ogType ?? 'website'}" />
<meta property="og:image" content="{metadata.ogImage}" />
<meta property="og:url" content="{metadata.canonical}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="{metadata.twitterCard ?? 'summary_large_image'}" />
<meta name="twitter:title" content="{metadata.title}" />
<meta name="twitter:description" content="{metadata.description}" />
<meta name="twitter:image" content="{metadata.ogImage}" />

<!-- JSON-LD -->
<script type="application/ld+json">{schema}</script>
```

### Title Pattern

All page titles follow the pattern: `{Page Name} | ShipForge`

The utility function `buildPageTitle(title: string)` appends `| ShipForge` to any page name. The home page uses the full brand title: `ShipForge — Fullstack Development & SEO Agency`.

### Schema Markup (JSON-LD)

The `src/lib/utils/seo.ts` module provides factory functions for structured data:

#### `buildOrganizationSchema()`

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ShipForge",
  "url": "https://shipforge.dev",
  "logo": "https://shipforge.dev/logo.svg",
  "description": "Fullstack App/Web Development + SEO Agency",
  "sameAs": ["https://twitter.com/shipforge", "https://github.com/shipforge"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@shipforge.dev"
  }
}
```

Applied on: Home page (`/`).

#### `buildWebPageSchema(meta)`

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{title}",
  "description": "{description}",
  "url": "{canonical}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "ShipForge",
    "url": "https://shipforge.dev"
  }
}
```

#### `buildServiceSchema(name, description)`

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "{name}",
  "description": "{description}",
  "provider": { "Organization schema" }
}
```

#### `buildBlogPostSchema(post)`

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "description": "{description}",
  "datePublished": "{date}",
  "url": "{url}",
  "publisher": { "Organization schema" }
}
```

### Canonical URLs

- The home page sets `canonical: 'https://shipforge.dev'`.
- Other pages should set canonical to their full URL (e.g., `https://shipforge.dev/services`).

### Default SEO Configuration

The `getDefaultMeta()` function returns:

| Field          | Value                                                  |
| -------------- | ------------------------------------------------------ |
| `title`        | `ShipForge — Fullstack Development & SEO Agency`       |
| `description`  | `We build high-performance web applications and optimize them for search engines. SvelteKit experts delivering measurable results.` |
| `ogImage`      | `https://shipforge.dev/og-image.png`                   |
| `ogType`       | `website`                                              |
| `twitterCard`  | `summary_large_image`                                  |

### Robots Configuration

`static/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://shipforge.dev/sitemap.xml
```

### No-Index Pages

The `/lead-magnet/thank-you` page includes `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing of the post-submission confirmation page.

### HTML Shell SEO Setup (`app.html`)

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#4f46e5" />
<link rel="icon" href="%sveltekit.assets%/favicon.svg" type="image/svg+xml" />
```

---

## 8. Animation System

### Overview

The animation system is built on GSAP 3 with ScrollTrigger, wrapped in lifecycle-safe utility functions in `src/lib/utils/gsap.ts`. All animations are opt-in and respect the user's motion preferences.

### Plugin Registration

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { browser } from '$app/environment';

if (browser) {
  gsap.registerPlugin(ScrollTrigger);
}
```

ScrollTrigger is only registered in browser environments to prevent SSR errors.

### Reduced-Motion Compliance

Every animation function begins by checking `prefersReducedMotion()`:

```typescript
export function prefersReducedMotion(): boolean {
  if (!browser) return true;  // Server-side: assume reduced motion
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

When reduced motion is preferred, elements are immediately set to their final visible state with no animation.

The global CSS also includes a comprehensive reduced-motion media query that forces all CSS animations and transitions to near-zero duration:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Animation Functions

#### `fadeInUp(node, options?)`

Fades an element in from below when it scrolls into view.

| Option     | Type     | Default | Description          |
| ---------- | -------- | ------- | -------------------- |
| `delay`    | `number` | `0`     | Delay in seconds     |
| `duration` | `number` | `0.8`   | Duration in seconds  |
| `y`        | `number` | `40`    | Starting Y offset    |

- **Trigger:** `start: 'top 85%'`, fires once.
- **Easing:** `power3.out`
- **Returns:** `{ kill: () => void }` for cleanup.

#### `staggerIn(parent, childSelector, options?)`

Staggers child elements into view.

| Option     | Type     | Default | Description             |
| ---------- | -------- | ------- | ----------------------- |
| `stagger`  | `number` | `0.1`   | Delay between children  |
| `duration` | `number` | `0.6`   | Duration per child      |
| `y`        | `number` | `30`    | Starting Y offset       |

- **Trigger:** `start: 'top 80%'`, fires once.
- **Easing:** `power3.out`

#### `heroReveal(container)`

Orchestrated timeline animation for hero sections. Targets elements by `data-animate` attribute:

| Attribute                  | Animation                                          | Timing       |
| -------------------------- | -------------------------------------------------- | ------------ |
| `data-animate="headline"`  | Fade in from `y: 50`, `duration: 0.9`              | Start        |
| `data-animate="subtitle"`  | Fade in from `y: 30`, `duration: 0.7`              | `-=0.5`      |
| `data-animate="cta"`       | Fade in from `y: 20, scale: 0.95`, `duration: 0.5` | `-=0.3`      |
| `data-animate="badge"`     | Fade in from `scale: 0.8`, `duration: 0.5`         | `-=0.2`      |

#### `animateCounter(node, target, options?)`

Animates a number counting up from 0 to target value.

| Option     | Type     | Default | Description            |
| ---------- | -------- | ------- | ---------------------- |
| `duration` | `number` | `2`     | Duration in seconds    |
| `suffix`   | `string` | `''`    | Text appended to value |
| `prefix`   | `string` | `''`    | Text prepended to value|

- **Trigger:** `start: 'top 85%'`, fires once.
- **Easing:** `power2.out`
- **Update:** Sets `node.textContent` on each frame via `onUpdate`.

#### `cleanupScrollTriggers()`

Kills all active ScrollTrigger instances. Should be called on component destroy to prevent memory leaks.

### Cleanup Pattern

All animation functions return an object with a `kill()` method that:
1. Kills the GSAP tween/timeline.
2. Finds and kills associated ScrollTrigger instances by matching `trigger === node`.

---

## 9. Accessibility

### Skip Link

The root layout (`+layout.svelte`) renders a skip link as the first focusable element:

```html
<a class="skip-link" href="#main-content">Skip to main content</a>
```

- Positioned offscreen by default (`top: -100%`).
- Slides into view on focus (`top: var(--space-4)`).
- High z-index (`--z-toast: 500`).
- `<main id="main-content">` provides the skip target.

### Focus Management

- **Global focus style:** All focusable elements receive `outline: 2px solid var(--color-primary); outline-offset: 2px;` on `:focus-visible`.
- **Button component:** Explicit `:focus-visible` styles with primary outline.
- **Form inputs:** Custom focus with border color change and box-shadow ring.
- **Mobile nav toggle:** Proper focus indication with background color change.

### ARIA Attributes

| Component    | Attributes Used                                                                    |
| ------------ | ---------------------------------------------------------------------------------- |
| **Nav**      | `aria-label="Main navigation"`, `aria-expanded`, `aria-controls`, `aria-label` on toggle, `aria-current="page"` on active links, `role="dialog"`, `aria-modal` on mobile menu |
| **Footer**   | `role="list"` on link lists                                                         |
| **SEOHead**  | Semantic `<title>` and meta descriptions                                            |
| **ServiceCard** | `aria-hidden="true"` on decorative icon, `aria-label` on features list           |
| **CaseStudyCard** | `role="list"` + `role="listitem"` on metrics, `aria-label` on link           |
| **BlogCard** | `aria-label` on "Read article" link, `<time datetime>` on dates                    |
| **Blog page** | `role="group"` + `aria-label` on filter, `aria-pressed` on filter buttons         |
| **Contact form** | Proper `<label>` + `id` associations, required field indicators                |

### Screen Reader Support

- `.sr-only` utility class for visually hidden but accessible text.
- `aria-hidden="true"` on decorative icons (service card icons, check marks).
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, `<article>`, `<header>`, `<section>`, `<time>`.
- `aria-label` on sections with `aria-labelledby` pointing to heading IDs.

### Color Contrast

- Primary text (`--color-gray-900`) on white background: exceeds WCAG AAA.
- Secondary text (`--color-gray-600`) on white: meets WCAG AA.
- White text on dark backgrounds (`--color-gray-900`): exceeds WCAG AAA.
- Primary color (`#4f46e5`) on white: meets WCAG AA for large text.
- Error red (`#ef4444`) on white: meets WCAG AA.

### Keyboard Navigation

- All interactive elements are keyboard-accessible.
- Mobile menu closes on `Escape` key press.
- Tab order follows document flow.
- `<button>` elements used for interactive non-link actions.
- `<a>` elements used for navigation.
- No keyboard traps.

### Reduced Motion

- CSS `prefers-reduced-motion: reduce` media query disables all CSS animations and transitions.
- GSAP utilities check `prefersReducedMotion()` and skip animations.
- `scroll-behavior` set to `auto` when reduced motion is preferred.

---

## 10. Performance

### Static Prerendering

The root layout (`+layout.ts`) exports `prerender = true`, which instructs SvelteKit to generate static HTML for all routes at build time. This means:

- Zero server runtime required for page serving.
- HTML is ready immediately (no SSR delay at request time).
- Pages can be served from a CDN edge.

### Font Optimization

Fonts are loaded from Google Fonts with optimization hints in `app.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- **`preconnect`** establishes early connections to font servers, eliminating DNS/TLS latency.
- **`display=swap`** ensures text renders immediately with system fonts, then swaps when web fonts load (prevents FOIT).
- Only the required weights are loaded (Inter: 400-800, JetBrains Mono: 400-500).

### Image Optimization Approach

- SVG favicon for crisp rendering at any size.
- `<img>` elements globally set to `display: block; max-width: 100%` to prevent layout shifts.
- Case study images referenced by path (ready for optimization pipeline).
- Assets in `$lib/assets/` are processed by Vite's asset pipeline (hashing, optimization).

### Minimal JS Bundle

- **Svelte 5 runes** (`$state`, `$derived`, `$props`) compile to minimal reactive code with no virtual DOM overhead.
- **Scoped CSS** — Each component's styles are scoped at build time, eliminating unused CSS.
- **Tree-shakeable icons** — Phosphor icons are imported individually (`phosphor-svelte/lib/IconName`), not from a barrel file, ensuring unused icons are excluded from the bundle.
- **No CSS framework** — Zero Tailwind, Bootstrap, or utility-class runtime cost.
- **GSAP conditional loading** — ScrollTrigger is only registered in browser environments.

### Data Loading Strategy

- **`preload-data="hover"`** set on `<body>` in `app.html`, which triggers SvelteKit to preload page data when a user hovers over a link, making navigations feel instant.

### CSS Performance

- **CSS custom properties** for theming avoid runtime class computation.
- **`backdrop-filter: blur(8px)`** on nav for frosted glass effect (GPU-accelerated).

### Rendering Optimizations

- **`-webkit-font-smoothing: antialiased`** for consistent text rendering.
- **`box-sizing: border-box`** on all elements via universal reset.
- **`overflow-wrap: break-word`** on text elements to prevent horizontal overflow.

---

## 11. Development Commands

All commands use **pnpm** as the package manager.

### Core Commands

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `pnpm dev`            | Start Vite dev server with HMR                           |
| `pnpm build`          | Production build (static prerendering)                   |
| `pnpm preview`        | Serve the production build locally                       |

### Quality Assurance

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `pnpm check`          | Run `svelte-kit sync` then `svelte-check` for type errors|
| `pnpm check:watch`    | Same as `check` but in watch mode                        |
| `pnpm lint`           | Prettier format check + ESLint                           |
| `pnpm format`         | Auto-format all files with Prettier                      |

### Testing

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `pnpm test:unit`      | Run Vitest unit tests (browser mode with Playwright)     |
| `pnpm test:e2e`       | Run Playwright end-to-end tests                          |
| `pnpm test`           | Run unit tests (single run) then E2E tests               |

### Internal

| Command               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `pnpm prepare`        | Run `svelte-kit sync` (generates types, runs on install) |

### Testing Configuration

#### Unit Tests (Vitest)

Configured in `vite.config.js` with two test projects:

1. **Client tests** (`*.svelte.{test,spec}.{js,ts}`)
   - Run in browser via Playwright (headless Chromium)
   - Use `vitest-browser-svelte` for component testing
   - Exclude `src/lib/server/**`

2. **Server tests** (`*.{test,spec}.{js,ts}`, excluding `.svelte.*`)
   - Run in Node.js environment

Global setting: `expect: { requireAssertions: true }` — every test must contain at least one assertion.

#### E2E Tests (Playwright)

Configured in `playwright.config.js`:
- Builds and previews the app before running tests
- Serves on port `4173`
- Test files in `e2e/` directory

---

## 12. Deployment

### Adapter

The project uses `@sveltejs/adapter-auto`, which automatically detects the deployment platform and applies the appropriate adapter:

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
// ...
adapter: adapter()
```

Supported platforms (auto-detected):
- **Vercel** — `@sveltejs/adapter-vercel`
- **Netlify** — `@sveltejs/adapter-netlify`
- **Cloudflare Pages** — `@sveltejs/adapter-cloudflare`
- **Azure Static Web Apps** — `@sveltejs/adapter-azure-swa`
- Fallback to `@sveltejs/adapter-static` if no platform is detected

### Static Prerendering

With `prerender = true` in the root layout, all routes are pre-rendered to static HTML at build time. This means the deployed output is a set of static files that can be served by any static hosting provider or CDN.

### MDsveX Support

The project supports `.svx` files (Markdown with Svelte) via the MDsveX preprocessor. The Svelte config declares both `.svelte` and `.svx` as valid extensions:

```javascript
extensions: ['.svelte', '.svx']
```

### Environment Variables

The project does not currently define environment variables. The SEO utility module hard-codes the site URL and defaults:

```typescript
const SITE_NAME = 'ShipForge';
const SITE_URL = 'https://shipforge.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
```

For production, these could be migrated to environment variables using SvelteKit's `$env/static/public` module:

```typescript
import { PUBLIC_SITE_URL } from '$env/static/public';
```

### Build Output

The `pnpm build` command produces:
1. Pre-rendered HTML for every route.
2. Hashed and minified JavaScript chunks.
3. Scoped and minified CSS.
4. Static assets from `static/` copied to the output root.

### Recommended Deployment Checklist

- [ ] Set `PUBLIC_SITE_URL` environment variable if migrating from hard-coded URLs.
- [ ] Ensure `og-image.png` and `logo.svg` are placed in the `static/` directory.
- [ ] Verify `robots.txt` sitemap URL points to the correct domain.
- [ ] Configure HTTP headers for caching (immutable hashed assets, short TTL for HTML).
- [ ] Set up redirect rules for any URL changes.
- [ ] Enable HTTPS (required for `preconnect` and service worker features).
- [ ] Test Lighthouse scores post-deployment.
- [ ] Validate structured data with Google's Rich Results Test.
- [ ] Submit sitemap to Google Search Console.

---

## Appendix A: Svelte 5 Patterns Used

This project uses **Svelte 5 runes** throughout:

| Rune         | Usage                                                    |
| ------------ | -------------------------------------------------------- |
| `$props()`   | Declare component props with TypeScript `interface Props` |
| `$state()`   | Reactive local state (form data, mobile menu, filters)   |
| `$derived()` | Computed values (filtered posts, JSON-LD serialization)  |
| `Snippet`    | Typed children/slot content (Button, Card)               |
| `{@render}`  | Render Snippet content in templates                      |

### Component Pattern

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'secondary';
    children: Snippet;
  }

  let { variant = 'primary', children }: Props = $props();
</script>

<div class="component component--{variant}">
  {@render children()}
</div>
```

---

## Appendix B: Phosphor Icons Used

All icons are imported individually from `phosphor-svelte/lib/` for optimal tree-shaking:

| Icon             | Weight     | Used In                  |
| ---------------- | ---------- | ------------------------ |
| `Anchor`         | bold       | Nav, Footer (brand logo) |
| `List`           | bold       | Nav (mobile open)        |
| `X`              | bold       | Nav (mobile close)       |
| `Code`           | duotone    | ServiceCard              |
| `MagnifyingGlass`| duotone    | ServiceCard, Lead Magnet |
| `Palette`        | duotone    | ServiceCard              |
| `Lightning`      | duotone/bold | ServiceCard, About, Lead Magnet |
| `Check`          | bold       | ServiceCard              |
| `ArrowRight`     | bold       | CaseStudyCard, BlogCard, Thank You |
| `Clock`          | regular/duotone | BlogCard, Contact    |
| `CalendarBlank`  | regular    | BlogCard                 |
| `EnvelopeSimple` | duotone    | Contact                  |
| `CheckCircle`    | fill       | Contact, Thank You       |
| `LinkedinLogo`   | regular    | Contact                  |
| `TwitterLogo`    | regular    | Contact                  |
| `GithubLogo`     | regular    | Contact                  |
| `SpinnerGap`     | —          | Contact, Lead Magnet     |
| `CaretDown`      | —          | Contact (select)         |
| `Lightbulb`      | bold/duotone | About                  |
| `ChartLineUp`    | duotone    | About                    |
| `Eye`            | duotone    | About                    |
| `Target`         | bold       | About                    |
| `Rocket`         | bold/duotone | About, Lead Magnet, Thank You |
| `BookOpen`       | duotone    | Lead Magnet              |
| `Globe`          | bold       | Lead Magnet              |
| `Shield`         | bold       | Lead Magnet              |
| `Briefcase`      | duotone    | Thank You                |
| `Article`        | duotone    | Thank You                |
| `House`          | bold       | Thank You                |

---

## Appendix C: CSS Reset Summary

The global reset in `app.css` normalizes browser defaults:

- **Box model:** `box-sizing: border-box` on all elements.
- **Margins/padding:** Reset to `0` on all elements.
- **Media elements:** `display: block; max-width: 100%` on images, video, SVG, canvas.
- **Forms:** Inherit font on inputs, buttons, textareas, selects.
- **Links:** Inherit color, remove text-decoration.
- **Lists:** Remove list-style.
- **Buttons:** Remove background, border, set cursor to pointer.
- **Typography:** Reset margins, set `overflow-wrap: break-word` on headings and paragraphs.
- **Selection:** Primary-100 background with primary-dark text.
- **Smooth scrolling:** Enabled by default, disabled for reduced motion.
- **Tap highlight:** Removed on mobile (`-webkit-tap-highlight-color: transparent`).
- **Text rendering:** Antialiased (`-webkit-font-smoothing`, `-moz-osx-font-smoothing`).
