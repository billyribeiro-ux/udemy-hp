# ShipForge — Capstone Implementation Guide

A step-by-step guide to rebuilding ShipForge from scratch. Work through each phase in order. Every step tells you **what to do**, **which file to create**, **key code patterns**, and **how to verify** your work.

---

## Phase 1: Project Setup

### Step 1.1 — Create a New SvelteKit Project

**What to do:** Scaffold a new SvelteKit project using the official create tool.

**Commands:**

```bash
pnpm create svelte@latest shipforge-capstone
cd shipforge-capstone
```

Select the following options when prompted:

- Template: Skeleton project
- Type checking: Yes, using TypeScript
- Additional options: Add ESLint, add Prettier

**Key code pattern:** The scaffolded project gives you `src/routes/+page.svelte`, `svelte.config.js`, and `vite.config.ts` out of the box.

**Verification:** Run `pnpm dev` and confirm the dev server starts on `http://localhost:5173` with no errors.

---

### Step 1.2 — Configure TypeScript

**What to do:** Ensure strict mode is enabled in `tsconfig.json`.

**File:** `tsconfig.json`

**Key code pattern:**

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Verification:** Run `pnpm check` and resolve any type errors.

---

### Step 1.3 — Install Dependencies

**What to do:** Install the runtime and dev dependencies the project needs.

**Commands:**

```bash
pnpm add gsap phosphor-svelte
```

**Key code pattern:** After installation, verify the packages appear in `package.json` under `dependencies`.

**Verification:** Run `pnpm install` and confirm no peer-dependency warnings.

---

### Step 1.4 — Set Up Design Tokens in `app.css`

**What to do:** Create a global stylesheet with CSS custom properties for colors, spacing, typography, and breakpoints.

**File:** `src/app.css`

**Key code pattern:**

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1e40af;
  --color-secondary: #7c3aed;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-bg: #ffffff;
  --color-bg-alt: #f8fafc;
  --color-border: #e2e8f0;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;

  /* Typography */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-heading: 'Inter', system-ui, -apple-system, sans-serif;
  --text-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.35vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.1rem + 1.2vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.2rem + 2vw, 2.5rem);
  --text-4xl: clamp(2.25rem, 1.3rem + 3vw, 3.5rem);

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

  /* Layout */
  --max-width: 1200px;
  --header-height: 4rem;
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
```

**Verification:** Import the stylesheet in `+layout.svelte` (`import '../app.css'`), run the dev server, and confirm the reset styles are applied.

---

### Step 1.5 — Configure Aliases in `svelte.config.js`

**What to do:** Ensure `$lib` alias is configured (it is by default in SvelteKit) and add any custom aliases you need.

**File:** `svelte.config.js`

**Key code pattern:**

```js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    }),
    alias: {
      $components: 'src/lib/components',
      $actions: 'src/lib/actions',
      $data: 'src/lib/data',
      $types: 'src/lib/types'
    }
  }
};

export default config;
```

**Verification:** Create a test import using one of the aliases and confirm it resolves correctly with `pnpm check`.

---

## Phase 2: Foundation

### Step 2.1 — Create Type Definitions

**What to do:** Define TypeScript interfaces for all data structures used across the project.

**File:** `src/lib/types.ts`

**Key code pattern:**

```ts
export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  image: string;
  results: { metric: string; value: string }[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}
```

**Verification:** Run `pnpm check` — no type errors. Import a type in a component and confirm it resolves.

---

### Step 2.2 — Build the Design Token System

**What to do:** This was mostly done in Step 1.4. Now extend it with utility classes if needed, and create any Svelte-specific style helpers.

**File:** `src/app.css` (extend what you created earlier)

**Key code pattern:**

```css
/* Utility classes */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin-inline: auto;
  padding-inline: var(--space-lg);
}

.visually-hidden {
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

**Verification:** Apply `.container` to a `<div>` in `+page.svelte` and confirm it centers content with max width.

---

### Step 2.3 — Create Layout (Nav, Footer, `+layout.svelte`)

**What to do:** Build the root layout with a navigation bar and footer that appear on every page.

**Files:**

- `src/lib/components/Nav.svelte`
- `src/lib/components/Footer.svelte`
- `src/routes/+layout.svelte`

**Key code pattern (`+layout.svelte`):**

```svelte
<script lang="ts">
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<Nav />
<main>
  {@render children()}
</main>
<Footer />
```

**Key code pattern (`Nav.svelte`):**

```svelte
<script lang="ts">
  import type { NavItem } from '$lib/types';

  const navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ];

  let mobileMenuOpen = $state(false);
</script>

<header class="nav">
  <div class="container nav__inner">
    <a href="/" class="nav__logo">ShipForge</a>
    <nav aria-label="Main navigation">
      <ul class="nav__list">
        {#each navItems as item}
          <li><a href={item.href}>{item.label}</a></li>
        {/each}
      </ul>
    </nav>
    <button
      class="nav__toggle"
      aria-expanded={mobileMenuOpen}
      aria-label="Toggle menu"
      onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
    >
      Menu
    </button>
  </div>
</header>
```

**Verification:** Run the dev server. Navigate between pages and confirm the Nav and Footer persist. Check that the mobile menu button toggles `aria-expanded`.

---

### Step 2.4 — Build Core Components (Button, Card, SectionHeader)

**What to do:** Create reusable, typed, styled components used across multiple pages.

**Files:**

- `src/lib/components/Button.svelte`
- `src/lib/components/Card.svelte`
- `src/lib/components/SectionHeader.svelte`

**Key code pattern (`Button.svelte`):**

```svelte
<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    variant = 'primary',
    href,
    children
  }: {
    variant?: 'primary' | 'secondary' | 'ghost';
    href?: string;
    children: Snippet;
  } = $props();
</script>

{#if href}
  <a {href} class="button button--{variant}">
    {@render children()}
  </a>
{:else}
  <button class="button button--{variant}">
    {@render children()}
  </button>
{/if}

<style>
  .button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--radius-md);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s, transform 0.1s;
  }

  .button--primary {
    background-color: var(--color-primary);
    color: white;
  }

  .button--primary:hover {
    background-color: var(--color-primary-dark);
  }

  .button--secondary {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  .button--ghost {
    background-color: transparent;
    color: var(--color-text);
  }
</style>
```

**Verification:** Import `Button` into `+page.svelte` and render all three variants. Confirm styling and hover states work.

---

## Phase 3: Pages

### Step 3.1 — Build Home Page

**What to do:** Create the home page with hero section, services overview, social proof, and CTA.

**Files:**

- `src/routes/+page.svelte`
- `src/routes/+page.ts` (load function for data / prerender)

**Key code pattern:**

```svelte
<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SectionHeader from '$lib/components/SectionHeader.svelte';
</script>

<section class="hero">
  <div class="container">
    <h1>Ship faster. Scale smarter.</h1>
    <p>We build high-performance web applications that drive revenue.</p>
    <div class="hero__actions">
      <Button href="/contact">Get Started</Button>
      <Button variant="secondary" href="/case-studies">See Our Work</Button>
    </div>
  </div>
</section>

<!-- Services overview, testimonials, CTA sections follow the same pattern -->
```

**Verification:** The home page renders with all sections. Links navigate correctly. Layout is responsive from mobile to desktop.

---

### Step 3.2 — Build Services Page

**What to do:** Display the full list of services with descriptions and feature lists.

**Files:**

- `src/routes/services/+page.svelte`
- `src/routes/services/+page.ts`
- `src/lib/data/services.ts` (typed service data)

**Key code pattern (`services.ts`):**

```ts
import type { Service } from '$lib/types';

export const services: Service[] = [
  {
    icon: 'rocket',
    title: 'Web Application Development',
    description: 'Custom SvelteKit applications built for speed and scale.',
    features: ['SvelteKit architecture', 'TypeScript', 'API integration', 'Real-time features']
  }
  // ... more services
];
```

**Verification:** All services render in a grid. Each card shows icon, title, description, and features.

---

### Step 3.3 — Build Case Studies Page

**What to do:** Create a case studies listing page and individual case study detail pages.

**Files:**

- `src/routes/case-studies/+page.svelte`
- `src/routes/case-studies/[slug]/+page.svelte`
- `src/routes/case-studies/[slug]/+page.ts`
- `src/lib/data/case-studies.ts`

**Key code pattern (dynamic load):**

```ts
import type { PageLoad } from './$types';
import { caseStudies } from '$lib/data/case-studies';
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
  const study = caseStudies.find((s) => s.slug === params.slug);
  if (!study) throw error(404, 'Case study not found');
  return { study };
};
```

**Verification:** The listing page shows all case studies. Clicking one navigates to `/case-studies/[slug]` with full detail. A non-existent slug shows the 404 page.

---

### Step 3.4 — Build About Page

**What to do:** Create the About page with company story, values, and team members.

**Files:**

- `src/routes/about/+page.svelte`
- `src/lib/data/team.ts`

**Key code pattern:** Use `{#each}` to render team member cards with photo, name, role, and bio.

**Verification:** All team members render. Images load (or have proper alt text placeholders). The page is responsive.

---

### Step 3.5 — Build Blog Page

**What to do:** Create a blog listing page and individual post pages.

**Files:**

- `src/routes/blog/+page.svelte`
- `src/routes/blog/[slug]/+page.svelte`
- `src/routes/blog/[slug]/+page.ts`
- `src/lib/data/blog-posts.ts`

**Key code pattern:** Same dynamic routing pattern as case studies. Blog listing shows title, excerpt, date, and tags. Detail page shows full content.

**Verification:** Blog listing page shows all posts sorted by date. Individual post pages render correctly with proper metadata.

---

### Step 3.6 — Build Contact Page

**What to do:** Create a contact page with a validated form.

**Files:**

- `src/routes/contact/+page.svelte`

**Key code pattern:**

```svelte
<script lang="ts">
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let errors = $state<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
    if (!message.trim()) newErrors.message = 'Message is required';
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (validate()) {
      // Submit logic
    }
  }
</script>

<form onsubmit={handleSubmit} novalidate>
  <label for="name">Name</label>
  <input id="name" bind:value={name} />
  {#if errors.name}<span class="error">{errors.name}</span>{/if}

  <label for="email">Email</label>
  <input id="email" type="email" bind:value={email} />
  {#if errors.email}<span class="error">{errors.email}</span>{/if}

  <label for="message">Message</label>
  <textarea id="message" bind:value={message}></textarea>
  {#if errors.message}<span class="error">{errors.message}</span>{/if}

  <Button>Send Message</Button>
</form>
```

**Verification:** Submit the form empty — all validation errors appear. Fill in valid data — errors disappear. Form submission does not reload the page.

---

### Step 3.7 — Build Lead Magnet Funnel

**What to do:** Create a lead magnet landing page with an email capture form and a thank-you page.

**Files:**

- `src/routes/free-guide/+page.svelte`
- `src/routes/free-guide/thank-you/+page.svelte`

**Key code pattern:** Similar form pattern to the Contact page but simpler (just name and email). On successful submission, redirect to the thank-you page using `goto('/free-guide/thank-you')`.

**Verification:** The lead magnet page renders with a compelling headline and email form. Submitting navigates to the thank-you page.

---

### Step 3.8 — Build Legal Pages

**What to do:** Create Privacy Policy and Terms of Service pages.

**Files:**

- `src/routes/privacy/+page.svelte`
- `src/routes/terms/+page.svelte`

**Key code pattern:** These are primarily content pages. Use semantic HTML (`<article>`, `<h2>`, `<p>`, `<ul>`) for the legal text. Add proper `<svelte:head>` metadata.

**Verification:** Both pages render with readable, well-structured content. Links from the Footer navigate to them correctly.

---

## Phase 4: Enhancement

### Step 4.1 — Add GSAP Animation System

**What to do:** Create a reusable Svelte action for GSAP-powered scroll animations.

**Files:**

- `src/lib/actions/animate.ts`

**Key code pattern:**

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimateParams {
  type?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right';
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function animateOnScroll(node: HTMLElement, params: AnimateParams = {}) {
  const { type = 'fade-up', delay = 0, duration = 0.8, stagger = 0 } = params;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return {};

  const animations: Record<string, gsap.TweenVars> = {
    'fade-up': { y: 40, opacity: 0 },
    'fade-in': { opacity: 0 },
    'slide-left': { x: -60, opacity: 0 },
    'slide-right': { x: 60, opacity: 0 }
  };

  const tween = gsap.from(node, {
    ...animations[type],
    delay,
    duration,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: node,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });

  return {
    destroy() {
      tween.scrollTrigger?.kill();
      tween.kill();
    }
  };
}
```

**Usage in a component:**

```svelte
<script lang="ts">
  import { animateOnScroll } from '$lib/actions/animate';
</script>

<div use:animateOnScroll={{ type: 'fade-up', delay: 0.2 }}>
  Content animates in on scroll.
</div>
```

**Verification:** Scroll down on a page with animated elements. Elements fade/slide into view. Disable animations in OS settings and confirm they are skipped.

---

### Step 4.2 — Implement SEO Metadata

**What to do:** Create a reusable SEO component and add it to every page.

**Files:**

- `src/lib/components/SEO.svelte`

**Key code pattern:**

```svelte
<script lang="ts">
  import type { SEOProps } from '$lib/types';

  let { title, description, canonical, ogImage }: SEOProps = $props();

  const siteName = 'ShipForge';
  const fullTitle = `${title} | ${siteName}`;
  const defaultOgImage = '/og-default.jpg';
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage ?? defaultOgImage} />
  <meta property="og:type" content="website" />
  {#if canonical}
    <link rel="canonical" href={canonical} />
  {/if}
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>
```

**Verification:** Inspect the `<head>` of each page in browser dev tools. Confirm title, description, and OG tags are unique and correct per page.

---

### Step 4.3 — Add Form Validation

**What to do:** If not already done in Step 3.6, ensure all forms have client-side validation with clear error messages and accessible error announcements.

**Key code pattern:** Use `aria-describedby` on inputs that point to their error message elements. Use `aria-live="polite"` on error containers so screen readers announce errors.

**Verification:** Submit forms with invalid data. Confirm error messages appear next to the correct fields. Use a screen reader or inspect ARIA attributes.

---

### Step 4.4 — Responsive Testing

**What to do:** Test every page at common breakpoints: 320px, 375px, 768px, 1024px, 1440px.

**Checklist:**

- No horizontal overflow at any breakpoint.
- Navigation collapses to a mobile menu below 768px.
- Text is readable without zooming at every size.
- Touch targets are at least 44x44px on mobile.
- Images scale proportionally.

**Verification:** Use browser dev tools responsive mode. Walk through every page at each breakpoint. Fix any layout issues.

---

## Phase 5: Production

### Step 5.1 — Build Verification

**What to do:** Run the full build and preview it locally.

**Commands:**

```bash
pnpm check          # TypeScript and Svelte checks
pnpm build          # Production build
pnpm preview        # Serve the production build locally
```

**Verification:** All three commands succeed with zero errors. Preview the site and click through every page.

---

### Step 5.2 — Accessibility Audit

**What to do:** Run automated and manual accessibility checks.

**Steps:**

1. Run Lighthouse accessibility audit on every page (target: 95+).
2. Install and run `axe DevTools` browser extension.
3. Navigate the entire site using only keyboard (Tab, Shift+Tab, Enter, Escape).
4. Test with a screen reader (VoiceOver on Mac, NVDA on Windows).

**Checklist:**

- All images have descriptive `alt` text.
- All form inputs have associated `<label>` elements.
- Focus indicator is visible on all interactive elements.
- Skip-to-content link is present and functional.
- Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text).
- ARIA landmarks are used correctly (`<nav>`, `<main>`, `<footer>`).

**Verification:** Zero accessibility errors in Lighthouse and axe. Full keyboard navigation works end to end.

---

### Step 5.3 — Performance Optimization

**What to do:** Optimize for Core Web Vitals.

**Steps:**

1. Run Lighthouse performance audit (target: 90+).
2. Optimize images: convert to WebP/AVIF, add `width`/`height` attributes, use `loading="lazy"`.
3. Preload critical fonts.
4. Verify no unused CSS or JS is shipped.
5. Check network waterfall for render-blocking resources.

**Key code pattern (font preloading in `app.html`):**

```html
<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
```

**Verification:** Lighthouse performance score is 90+. LCP under 2.5s. CLS under 0.1. No layout shift visible during page load.

---

### Step 5.4 — Deployment

**What to do:** Deploy the built site to your hosting provider.

**Option A — Vercel:**

```bash
pnpm add -D @sveltejs/adapter-vercel
# Update svelte.config.js to use adapter-vercel
# Push to GitHub; Vercel auto-deploys
```

**Option B — Static hosting (Netlify, Cloudflare Pages, GitHub Pages):**

```bash
# Keep adapter-static in svelte.config.js
pnpm build
# Upload the 'build' directory to your host
```

**Post-deployment checklist:**

- [ ] Site loads on the production URL.
- [ ] HTTPS is active.
- [ ] All pages render correctly (no 404s for known routes).
- [ ] Forms submit without errors.
- [ ] Animations play on scroll.
- [ ] Meta tags are correct (check with Open Graph debugger tools).
- [ ] `robots.txt` and `sitemap.xml` are accessible.

**Verification:** Visit the production URL. Walk through every page and feature. Share a link on social media to verify OG previews render correctly.

---

## Summary Checklist

| Phase | Steps | Key Deliverable |
|-------|-------|-----------------|
| 1. Setup | 5 steps | Configured SvelteKit project with tokens and TypeScript |
| 2. Foundation | 4 steps | Type system, layout, core components |
| 3. Pages | 8 steps | All application pages with data and routing |
| 4. Enhancement | 4 steps | Animations, SEO, validation, responsive QA |
| 5. Production | 4 steps | Deployed, accessible, performant website |

**Total: 25 steps from empty directory to production deployment.**

---

## Tips for Success

1. **Commit after every step.** Use conventional commits (`feat:`, `fix:`, `style:`, `docs:`). This gives you a clear history and the ability to roll back.
2. **Run `pnpm check` frequently.** Catching type errors early saves hours of debugging later.
3. **Test on real devices.** Browser dev tools responsive mode is useful but not a substitute for testing on actual phones and tablets.
4. **Reference the ShipForge source.** When you get stuck on a step, look at the corresponding file in the original ShipForge project for guidance. The goal is to understand the code well enough to write it yourself.
5. **Take notes.** Write down what you learned, what was confusing, and what clicked. These notes become invaluable when you build your next project.
