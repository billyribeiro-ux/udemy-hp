# ShipForge — Architecture Guide

A comprehensive technical reference for the ShipForge agency website, built with SvelteKit 2 and Svelte 5.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Directory Structure](#directory-structure)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Styling Architecture](#styling-architecture)
6. [Animation Architecture](#animation-architecture)
7. [SEO Architecture](#seo-architecture)

---

## System Architecture

### Overview

ShipForge is a statically prerendered marketing website built on **SvelteKit 2** with **Svelte 5**. Every page is prerendered at build time (`export const prerender = true` in the root layout), producing static HTML that can be deployed to any CDN or static host.

### Rendering Strategy

```
Build Time                         Runtime
┌──────────────────┐              ┌──────────────────┐
│  SvelteKit Build │              │  Static HTML/CSS  │
│  (vite build)    │──prerender──▶│  served from CDN  │
│                  │              │                   │
│  All routes      │              │  Client-side JS   │
│  rendered to     │              │  hydrates for     │
│  static HTML     │              │  interactivity    │
└──────────────────┘              └──────────────────┘
```

- **Adapter**: `@sveltejs/adapter-auto` (auto-selects the appropriate adapter for the deployment target)
- **Preprocessors**: `vitePreprocess()` for TypeScript/CSS and `mdsvex` for Markdown content (`.svx` files)
- **Prerendering**: Enabled globally via `+layout.ts` — every route produces a static HTML file

### File-Based Routing

SvelteKit maps the filesystem under `src/routes/` directly to URL paths:

```
src/routes/+page.svelte          →  /
src/routes/about/+page.svelte    →  /about
src/routes/services/+page.svelte →  /services
src/routes/blog/+page.svelte     →  /blog
```

Each route is a self-contained page component that imports shared components from `$lib/components` and static data from `$lib/data`.

### Component Hierarchy (Text Diagram)

```
app.html (HTML Shell)
└── +layout.svelte (Root Layout)
    ├── <Nav />              ← Sticky navigation (desktop + mobile)
    ├── <main #main-content>
    │   └── {@render children()}   ← Active route page
    │       ├── <SEOHead />        ← Per-page meta tags
    │       ├── <SectionHeader />  ← Section titles
    │       ├── <ServiceCard />    ← Service listings
    │       ├── <CaseStudyCard />  ← Case study listings
    │       ├── <BlogCard />       ← Blog post previews
    │       ├── <StatCounter />    ← Stat display
    │       ├── <Button />         ← CTAs and form actions
    │       ├── <Card />           ← Generic content cards
    │       └── <ChapterPreview /> ← Lead magnet preview
    └── <Footer />           ← Site-wide footer
```

### Path Aliases

Configured in `svelte.config.js` for cleaner imports:

| Alias          | Maps To                  |
| -------------- | ------------------------ |
| `$lib`         | `./src/lib`              |
| `$components`  | `./src/lib/components`   |
| `$assets`      | `./src/lib/assets`       |
| `$utils`       | `./src/lib/utils`        |
| `$types`       | `./src/lib/types`        |

---

## Directory Structure

```
src/
├── app.css                    # Design system + global styles (377 lines)
├── app.html                   # HTML shell with font preloading
├── lib/
│   ├── components/            # Reusable UI components
│   │   ├── index.ts           # Barrel export for all components
│   │   ├── Nav.svelte         # Sticky nav with mobile slide-in panel
│   │   ├── Footer.svelte      # Site footer with nav + legal links
│   │   ├── SEOHead.svelte     # <svelte:head> meta tag injection
│   │   ├── Button.svelte      # Polymorphic button/link component
│   │   ├── Card.svelte        # Generic card with icon + body slots
│   │   ├── SectionHeader.svelte # Eyebrow + title + subtitle block
│   │   ├── ServiceCard.svelte # Service listing card
│   │   ├── CaseStudyCard.svelte # Case study card with metrics
│   │   ├── BlogCard.svelte    # Blog post preview card
│   │   ├── StatCounter.svelte # Stat display (value + label)
│   │   ├── HeroSection.svelte # Hero section (planned)
│   │   └── ChapterPreview.svelte # Lead magnet chapter preview (planned)
│   ├── data/                  # Static data modules
│   │   ├── services.ts        # Service definitions (4 services)
│   │   ├── case-studies.ts    # Case study entries (4 studies)
│   │   ├── blog-posts.ts      # Blog post metadata (6 posts)
│   │   └── navigation.ts     # Main nav + footer nav links
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts           # All domain interfaces
│   ├── utils/                 # Utility functions
│   │   ├── gsap.ts            # GSAP animation primitives
│   │   ├── animations.ts      # Svelte use: actions wrapping GSAP
│   │   └── seo.ts             # SEO schema builders + meta helpers
│   └── assets/                # Static assets imported via bundler
│       ├── book_cover.png
│       ├── phone_cover.png
│       └── favicon.svg
├── routes/                    # SvelteKit file-based routes
│   ├── +layout.svelte         # Root layout (Nav + Footer wrapper)
│   ├── +layout.ts             # Prerender config + site metadata
│   ├── +page.svelte           # Home page (/)
│   ├── services/
│   │   └── +page.svelte       # Services listing (/services)
│   ├── case-studies/
│   │   └── +page.svelte       # Case studies listing (/case-studies)
│   ├── about/
│   │   └── +page.svelte       # About page (/about)
│   ├── blog/
│   │   └── +page.svelte       # Blog listing (/blog)
│   ├── lead-magnet/
│   │   ├── +page.svelte       # Lead magnet landing (/lead-magnet)
│   │   └── thank-you/
│   │       └── +page.svelte   # Thank-you page (/lead-magnet/thank-you)
│   ├── contact/
│   │   └── +page.svelte       # Contact form (/contact)
│   ├── login/
│   │   └── +page.svelte       # Login page (/login)
│   ├── privacy/
│   │   └── +page.svelte       # Privacy policy (/privacy)
│   ├── terms/
│   │   └── +page.svelte       # Terms of service (/terms)
│   ├── disclaimer/
│   │   └── +page.svelte       # Disclaimer (/disclaimer)
│   └── page.svelte.spec.js    # Unit test for home page
└── static/                    # Served at root (no processing)
    ├── robots.txt
    └── favicon.svg
```

---

## Component Architecture

All components are exported from `$lib/components/index.ts` as a barrel module, enabling clean named imports:

```ts
import { Button, SEOHead, Nav, Footer } from '$lib/components';
```

### Component Reference

#### Nav

| Property | Description |
| -------- | ----------- |
| **File** | `Nav.svelte` |
| **Purpose** | Sticky top navigation bar with responsive mobile menu |
| **State** | `mobileOpen` (`$state`) — controls mobile slide-in panel visibility |
| **Data source** | `mainNav` from `$lib/data/navigation` |
| **Features** | Active link highlighting via `$page.url.pathname`, keyboard escape to close, overlay backdrop, Phosphor icons (Anchor, List, X) |
| **Accessibility** | `aria-label`, `aria-expanded`, `aria-controls`, `aria-current="page"`, `role="dialog"` on mobile panel |

#### Footer

| Property | Description |
| -------- | ----------- |
| **File** | `Footer.svelte` |
| **Purpose** | Site-wide footer with brand, navigation, and legal links |
| **Data source** | `mainNav` and `footerNav` from `$lib/data/navigation` |
| **Layout** | 3-column responsive grid (brand / navigation / legal) |

#### SEOHead

| Property | Description |
| -------- | ----------- |
| **File** | `SEOHead.svelte` |
| **Purpose** | Injects `<title>`, meta description, Open Graph, Twitter Card, and JSON-LD structured data into `<svelte:head>` |
| **Props** | `metadata: SEOMetadata` |
| **Derived** | `jsonLdScript` — serialized JSON-LD string computed from `metadata.schema` |

#### Button

| Property | Description |
| -------- | ----------- |
| **File** | `Button.svelte` |
| **Purpose** | Polymorphic button/anchor component — renders `<a>` when `href` is provided, `<button>` otherwise |
| **Props** | `variant` (`primary`, `secondary`, `outline`, `ghost`), `size` (`sm`, `md`, `lg`), `href?`, `type?`, `disabled?`, `onclick?`, `class?`, `children` (Snippet) |
| **Rest props** | Spread to the underlying element via `{...restProps}` |

#### Card

| Property | Description |
| -------- | ----------- |
| **File** | `Card.svelte` |
| **Purpose** | Generic container card with optional icon snippet |
| **Props** | `children` (Snippet), `icon?` (Snippet), `padding` (`sm`, `md`, `lg`), `class?` |
| **Behavior** | Hover lift effect with shadow transition |

#### SectionHeader

| Property | Description |
| -------- | ----------- |
| **File** | `SectionHeader.svelte` |
| **Purpose** | Consistent section heading block with optional eyebrow and subtitle |
| **Props** | `eyebrow?`, `title`, `subtitle?`, `align` (`center`, `left`) |

#### ServiceCard

| Property | Description |
| -------- | ----------- |
| **File** | `ServiceCard.svelte` |
| **Purpose** | Displays a single service with icon, description, and feature checklist |
| **Props** | `service: Service` |
| **Icons** | Dynamically resolved from a `Record<string, Component>` icon map using Phosphor icons |

#### CaseStudyCard

| Property | Description |
| -------- | ----------- |
| **File** | `CaseStudyCard.svelte` |
| **Purpose** | Case study preview with tags, description, metrics grid, and link |
| **Props** | `caseStudy: CaseStudy` |
| **Layout** | Metrics displayed in a 2-column sub-grid |

#### BlogCard

| Property | Description |
| -------- | ----------- |
| **File** | `BlogCard.svelte` |
| **Purpose** | Blog post preview with date, category badge, excerpt, and read time |
| **Props** | `post: BlogPost` |
| **Helpers** | `formatDate()` — converts ISO date string to human-readable format |

#### StatCounter

| Property | Description |
| -------- | ----------- |
| **File** | `StatCounter.svelte` |
| **Purpose** | Displays a large stat value with a label beneath it |
| **Props** | `value: string`, `label: string`, `class?` |

### Component Dependency Graph

```
+layout.svelte
├── Nav
│   └── navigation.ts (mainNav)
├── Footer
│   └── navigation.ts (mainNav, footerNav)
│
Page Routes
├── SEOHead
│   └── seo.ts (schema builders)
├── SectionHeader
├── Button
├── Card
├── ServiceCard
│   └── services.ts
├── CaseStudyCard
│   └── case-studies.ts
├── BlogCard
│   └── blog-posts.ts
└── StatCounter
```

---

## Data Flow

### Static Data Imports

All content data lives in TypeScript modules under `$lib/data/`. These are plain arrays of typed objects imported directly into page components at build time:

```
$lib/data/services.ts       →  Service[]        →  ServiceCard
$lib/data/case-studies.ts   →  CaseStudy[]      →  CaseStudyCard
$lib/data/blog-posts.ts     →  BlogPost[]       →  BlogCard
$lib/data/navigation.ts     →  NavLink[]         →  Nav, Footer
```

Because prerendering is enabled, this data is embedded into the HTML at build time. There are no API calls or runtime data fetching.

### Form State Management

Forms (e.g., the Contact page) use Svelte 5 reactivity primitives for local state management:

```ts
// Reactive form data object
let formData: ContactFormData = $state({
  name: '',
  email: '',
  company: '',
  service: '',
  message: ''
});

// Reactive error map
let errors: Partial<Record<keyof ContactFormData, string>> = $state({});

// Reactive submission flags
let submitting = $state(false);
let submitted = $state(false);
```

Template bindings use `bind:value` for two-way data binding. Validation runs synchronously on submit, populating the `errors` state object. The UI conditionally renders error messages and success states based on these reactive values.

### SEO Metadata Flow

Each page provides its own metadata to the `SEOHead` component:

```
Page Component
  └── <SEOHead metadata={...} />
        ├── <title>
        ├── <meta name="description">
        ├── <meta property="og:*">
        ├── <meta name="twitter:*">
        └── <script type="application/ld+json"> (if schema provided)
```

Schema objects are constructed using utility functions from `$lib/utils/seo.ts`:

```ts
buildOrganizationSchema()     // Organization JSON-LD
buildWebPageSchema(meta)      // WebPage JSON-LD
buildServiceSchema(name, desc) // Service JSON-LD
buildBlogPostSchema(post)     // BlogPosting JSON-LD
```

### Layout Data

The root `+layout.ts` exports a `load` function that provides site-wide metadata:

```ts
export const prerender = true;

export function load() {
  return {
    siteTitle: 'ShipForge',
    siteDescription: 'Fullstack Development & SEO Agency'
  };
}
```

---

## Styling Architecture

### Design Tokens (CSS Custom Properties)

All design decisions are encoded as CSS custom properties in `app.css`, organized into categories:

| Category       | Examples                                               |
| -------------- | ------------------------------------------------------ |
| **Colors**     | `--color-primary`, `--color-gray-500`, `--color-error` |
| **Typography** | `--font-sans`, `--text-base`, `--text-5xl`             |
| **Spacing**    | `--space-1` (0.25rem) through `--space-32` (8rem)      |
| **Layout**     | `--container-xl` (1200px), `--container-padding`       |
| **Borders**    | `--radius-sm` through `--radius-full`                  |
| **Shadows**    | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |
| **Transitions**| `--transition-fast` (150ms), `--transition-base` (250ms) |
| **Z-index**    | `--z-dropdown` (100) through `--z-toast` (500)         |

### Fluid Typography

Font sizes use `clamp()` for smooth scaling between mobile and desktop without breakpoint jumps:

```css
--text-base: clamp(0.9375rem, 0.875rem + 0.4vw, 1.0625rem);
--text-5xl:  clamp(2.75rem, 2rem + 3vw, 4rem);
```

### Mobile-First Breakpoint Strategy

The project uses three primary breakpoints, applied mobile-first with `min-width`:

| Breakpoint | Width     | Usage                                    |
| ---------- | --------- | ---------------------------------------- |
| `sm`       | `640px`   | 2-column grids, form row layout          |
| `md`       | `768px`   | Desktop nav visible, 3-column grids      |
| `lg`       | `1024px`  | Full grid layouts, increased padding     |

Container padding is responsive, increasing at each breakpoint:

```css
:root {
  --container-padding: var(--space-5);   /* mobile default: 1.25rem */
}
@media (min-width: 768px) {
  :root { --container-padding: var(--space-8); }   /* 2rem */
}
@media (min-width: 1024px) {
  :root { --container-padding: var(--space-12); }  /* 3rem */
}
```

### Scoped Styles per Component

Each `.svelte` component contains a `<style>` block that is **automatically scoped** by the Svelte compiler. Class names use BEM-style naming (e.g., `.nav__link--active`, `.service-card__icon`) to maintain readability and avoid collisions.

### Global Utility Classes

A small set of layout utility classes are defined in `app.css`:

| Class              | Purpose                                    |
| ------------------ | ------------------------------------------ |
| `.container`       | Max-width centered container with padding  |
| `.container--narrow` | Narrower variant (`--container-md`)      |
| `.container--wide` | Wider variant (`--container-2xl`)          |
| `.section`         | Vertical padding block for page sections   |
| `.section--dark`   | Dark background variant                    |
| `.section--alt`    | Alternate (light gray) background          |
| `.grid`            | CSS Grid with gap                          |
| `.grid--2/3/4`     | Responsive column grids                    |
| `.skip-link`       | Accessible skip-to-content link            |
| `.sr-only`         | Screen reader only (visually hidden)       |

### Accessibility Defaults

- `::selection` uses brand colors for text selection
- `:focus-visible` applies a consistent `2px solid var(--color-primary)` outline
- `prefers-reduced-motion: reduce` disables all animations and transitions globally

---

## Animation Architecture

### GSAP Integration Pattern

Animations are built on [GSAP](https://gsap.com/) with the ScrollTrigger plugin. The integration follows a two-layer architecture:

```
Layer 1: gsap.ts (Animation Primitives)
  ├── fadeInUp()        — Fade in from below with ScrollTrigger
  ├── staggerIn()       — Stagger children elements into view
  ├── heroReveal()      — Sequenced hero section timeline
  ├── animateCounter()  — Animated number counter
  └── cleanupScrollTriggers() — Global cleanup

Layer 2: animations.ts (Svelte Actions)
  ├── use:fadeInUp      — Action wrapping fadeInUp()
  ├── use:staggerChildren — Action wrapping staggerIn()
  ├── use:heroAnimation — Action wrapping heroReveal()
  └── use:counter       — Action wrapping animateCounter()
```

### Svelte Action-Based Approach

GSAP animations are exposed as Svelte `use:` actions, providing a clean declarative API in templates:

```svelte
<div use:fadeInUp>Fades in when scrolled into view</div>
<div use:fadeInUp={{ delay: 0.2, y: 60 }}>With options</div>
<div use:staggerChildren={{ selector: '.card', stagger: 0.15 }}>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

Each action returns a `{ destroy }` function that automatically kills the GSAP tween and associated ScrollTrigger when the component unmounts, preventing memory leaks.

### ScrollTrigger Lifecycle Management

ScrollTrigger instances are carefully managed to avoid leaks:

1. **Creation**: Each animation function creates its own ScrollTrigger and returns a `{ kill }` function
2. **Cleanup per element**: The `kill()` function filters `ScrollTrigger.getAll()` for triggers matching the element and destroys them
3. **Svelte lifecycle**: The `use:` action's `destroy` callback calls `kill()` on component unmount
4. **Global cleanup**: `cleanupScrollTriggers()` is available for route-level cleanup if needed
5. **SSR safety**: All animation functions check `browser` from `$app/environment` and return no-ops on the server

### Reduced Motion Handling

Every animation function checks `prefers-reduced-motion` before animating:

```ts
export function prefersReducedMotion(): boolean {
  if (!browser) return true; // Treat SSR as reduced motion
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

When reduced motion is preferred:
- Elements are immediately set to their final state (`opacity: 1, y: 0`) via `gsap.set()`
- No tweens or ScrollTriggers are created
- Counter values display their target number instantly
- A no-op `{ kill: () => {} }` is returned

Additionally, `app.css` includes a global CSS rule that forces `animation-duration: 0.01ms` and `transition-duration: 0.01ms` for all elements when `prefers-reduced-motion: reduce` is active.

### Hero Animation Sequence

The `heroReveal()` function orchestrates a timeline of staggered reveals using `data-animate` attributes:

```
t=0.0s  [data-animate="headline"]  → fade in + slide up
t=0.4s  [data-animate="subtitle"]  → fade in + slide up (overlaps)
t=0.6s  [data-animate="cta"]       → fade in + slide up + scale
t=0.8s  [data-animate="badge"]     → fade in + scale
```

---

## SEO Architecture

### Meta Tag Component (SEOHead)

The `SEOHead` component is the single point of control for all page-level SEO metadata. Each page passes an `SEOMetadata` object:

```ts
interface SEOMetadata {
  title: string;           // Page title
  description: string;     // Meta description
  canonical?: string;      // Canonical URL
  ogImage?: string;        // Open Graph image URL
  ogType?: string;         // OG type (default: 'website')
  twitterCard?: string;    // Twitter card type (default: 'summary_large_image')
  schema?: Record<string, unknown>;  // JSON-LD structured data
}
```

The component injects the following into `<svelte:head>`:

1. `<title>` tag
2. `<meta name="description">`
3. `<link rel="canonical">` (if provided)
4. Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`, `og:url`)
5. Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
6. `<script type="application/ld+json">` (if schema provided)

### Schema.org Structured Data

The `$lib/utils/seo.ts` module provides factory functions for building JSON-LD objects:

| Function                     | Schema Type    | Use Case                          |
| ---------------------------- | -------------- | --------------------------------- |
| `buildOrganizationSchema()`  | Organization   | Site-wide business identity       |
| `buildWebPageSchema(meta)`   | WebPage        | Generic page markup               |
| `buildServiceSchema(n, d)`   | Service        | Individual service pages          |
| `buildBlogPostSchema(post)`  | BlogPosting    | Blog article pages                |

All schemas reference `https://schema.org` as the context and include the `Organization` as the publisher/provider where applicable.

### Utility Functions

| Function              | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `buildPageTitle(t)`   | Formats title as `"Page Title \| ShipForge"`    |
| `getDefaultMeta()`    | Returns default SEOMetadata for the site        |

### Constants

```ts
const SITE_NAME = 'ShipForge';
const SITE_URL = 'https://shipforge.dev';
const DEFAULT_OG_IMAGE = 'https://shipforge.dev/og-image.png';
```

### SEO Infrastructure in `app.html`

The HTML shell provides foundational SEO elements:
- `lang="en"` on the `<html>` element
- `meta charset="utf-8"` and `meta viewport`
- `meta theme-color` set to brand primary (`#4f46e5`)
- SVG favicon via `<link rel="icon">`
- Font preconnect hints for Google Fonts
- `data-sveltekit-preload-data="hover"` for navigation performance
