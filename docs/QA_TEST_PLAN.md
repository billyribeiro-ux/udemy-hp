# QA & Test Plan — udemy-hp

> Last updated: 2026-02-17

---

## Table of Contents

1. [Testing Strategy Overview](#1-testing-strategy-overview)
2. [Vitest Configuration](#2-vitest-configuration)
3. [Playwright Configuration](#3-playwright-configuration)
4. [Component Testing Patterns](#4-component-testing-patterns)
5. [Page-by-Page QA Checklist](#5-page-by-page-qa-checklist)
6. [Form Validation Testing](#6-form-validation-testing)
7. [Responsive Testing](#7-responsive-testing)
8. [Accessibility Testing](#8-accessibility-testing)
9. [Performance Testing](#9-performance-testing)
10. [Cross-Browser Testing](#10-cross-browser-testing)
11. [SEO Validation](#11-seo-validation)
12. [GSAP Animation Testing](#12-gsap-animation-testing)
13. [Pre-Deployment Checklist](#13-pre-deployment-checklist)

---

## 1. Testing Strategy Overview

### Testing Pyramid

```
         ╔══════════╗
         ║   E2E    ║  ← Playwright (critical user flows)
         ╠══════════╣
       ╔══════════════╗
       ║  Component   ║  ← Vitest Browser Mode (Svelte components)
       ╠══════════════╣
    ╔══════════════════╗
    ║     Unit Tests   ║  ← Vitest Node (utils, data, logic)
    ╚══════════════════╝
```

### Layer Responsibilities

| Layer     | Tool                          | Scope                                    | Location                              |
| --------- | ----------------------------- | ---------------------------------------- | ------------------------------------- |
| Unit      | Vitest (Node)                 | Utility functions, data modules, SEO     | `src/**/*.{test,spec}.{js,ts}`        |
| Component | Vitest Browser + Playwright   | Svelte component rendering and behavior  | `src/**/*.svelte.{test,spec}.{js,ts}` |
| E2E       | Playwright                    | Full page flows, navigation, forms       | `e2e/**/*.test.js`                    |

### Test Commands

```bash
# Run all tests
pnpm test

# Unit + component tests only
pnpm test:unit

# Unit tests in watch mode
pnpm test:unit -- --watch

# E2E tests only
pnpm test:e2e

# E2E with headed browser (for debugging)
npx playwright test --headed

# E2E single file
npx playwright test e2e/demo.test.js
```

---

## 2. Vitest Configuration

The project uses a **dual-project** Vitest setup defined in `vite.config.js`:

### Client Project (Component Tests)

- **Name:** `client`
- **Environment:** Vitest Browser Mode with Playwright (Chromium, headless)
- **Include:** `src/**/*.svelte.{test,spec}.{js,ts}`
- **Exclude:** `src/lib/server/**`
- **Purpose:** Test Svelte components in a real browser environment

### Server Project (Unit Tests)

- **Name:** `server`
- **Environment:** Node
- **Include:** `src/**/*.{test,spec}.{js,ts}`
- **Exclude:** `src/**/*.svelte.{test,spec}.{js,ts}`
- **Purpose:** Test utility functions, data modules, SEO helpers

### Global Config

```js
// Assertions are REQUIRED in every test
expect: { requireAssertions: true }
```

This means every test **must** contain at least one `expect()` call or it will fail. This prevents empty / false-positive tests.

### Writing a Unit Test

```js
// src/lib/utils/seo.spec.ts
import { describe, it, expect } from 'vitest';
import { generateMetaTags } from '$utils/seo';

describe('generateMetaTags', () => {
  it('returns correct title format', () => {
    const meta = generateMetaTags({ title: 'About' });
    expect(meta.title).toBe('About | Udemy HP');
  });
});
```

---

## 3. Playwright Configuration

Defined in `playwright.config.js`:

```js
export default defineConfig({
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 4173
  },
  testDir: 'e2e'
});
```

### Key Details

- Tests run against a **production build** (`pnpm run build && pnpm run preview`).
- The preview server runs on **port 4173**.
- All E2E test files live in the `e2e/` directory.

### Recommended Playwright Extensions

Add to `playwright.config.js` as the project grows:

```js
export default defineConfig({
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 4173
  },
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  retries: 1,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } }
  ]
});
```

---

## 4. Component Testing Patterns

### Basic Rendering Test

```js
// src/lib/components/Button.svelte.spec.js
import { describe, it, expect } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

describe('Button', () => {
  it('renders with provided text', async () => {
    const screen = render(Button, { props: { label: 'Click me' } });
    await expect.element(screen.getByText('Click me')).toBeVisible();
  });
});
```

### Testing Props and Variants

```js
describe('Card', () => {
  it('applies the correct CSS class for variant', async () => {
    const screen = render(Card, {
      props: { title: 'Test', variant: 'primary' }
    });
    const card = screen.getByRole('article');
    await expect.element(card).toHaveClass('primary');
  });
});
```

### Testing User Interaction

```js
describe('Nav', () => {
  it('toggles mobile menu on hamburger click', async () => {
    const screen = render(Nav);
    const toggle = screen.getByRole('button', { name: /menu/i });
    await toggle.click();
    await expect.element(screen.getByRole('navigation')).toBeVisible();
  });
});
```

### Testing Slots / Snippets (Svelte 5)

```js
import { render } from 'vitest-browser-svelte';
import { createRawSnippet } from 'svelte';

it('renders children snippet', async () => {
  const children = createRawSnippet(() => ({
    render: () => '<span>Child content</span>'
  }));
  const screen = render(SectionHeader, { props: { children } });
  await expect.element(screen.getByText('Child content')).toBeVisible();
});
```

### Testing Components That Use GSAP

```js
// Mock GSAP for component tests to avoid animation timing issues
import { vi } from 'vitest';

vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn(), from: vi.fn() })),
    registerPlugin: vi.fn()
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { create: vi.fn(), refresh: vi.fn() }
}));
```

---

## 5. Page-by-Page QA Checklist

### Global (All Pages)

- [ ] Nav renders and is sticky / visible on scroll
- [ ] Footer renders with correct links
- [ ] SEOHead component outputs correct `<title>`, `<meta description>`, Open Graph tags
- [ ] Page transitions are smooth (no layout shift)
- [ ] All internal links use SvelteKit `<a>` (not `window.location`)
- [ ] No console errors or warnings
- [ ] Fonts load correctly (no FOUT/FOIT longer than 100ms)

### Home (`/`)

- [ ] Hero section renders headline, subheadline, CTA button
- [ ] StatCounter components animate numbers on scroll
- [ ] Services preview cards render and link to `/services`
- [ ] Blog preview cards render and link to `/blog`
- [ ] Case studies section renders
- [ ] Lead magnet CTA section visible
- [ ] All GSAP animations trigger on scroll

### About (`/about`)

- [ ] Page heading and content render
- [ ] Team / bio information displays
- [ ] Images load with correct alt text

### Services (`/services`)

- [ ] All ServiceCard components render from data
- [ ] Card content matches `src/lib/data/services.ts`
- [ ] Click/hover interactions work

### Blog (`/blog`)

- [ ] BlogCard components render from data
- [ ] Cards display title, excerpt, date
- [ ] Links point to correct blog post routes

### Case Studies (`/case-studies`)

- [ ] CaseStudyCard components render
- [ ] Links point to correct case study routes

### Contact (`/contact`)

- [ ] Contact form renders all fields
- [ ] Validation messages appear on invalid submission
- [ ] Successful submission shows confirmation
- [ ] Form is keyboard accessible

### Lead Magnet (`/lead-magnet`)

- [ ] Landing page renders offer and form
- [ ] Form submission redirects to `/lead-magnet/thank-you`
- [ ] Thank you page renders confirmation message

### Legal Pages (`/privacy`, `/terms`, `/disclaimer`)

- [ ] Content renders correctly
- [ ] Headings are properly structured (h1 > h2 > h3)
- [ ] Links within content work

---

## 6. Form Validation Testing

### Client-Side Validation

```js
// e2e/contact-form.test.js
import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('shows error for empty required fields', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toBeVisible();
  });

  test('shows error for invalid email', async ({ page }) => {
    await page.fill('input[name="email"]', 'not-an-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toContainText('email');
  });

  test('submits successfully with valid data', async ({ page }) => {
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Hello, this is a test.');
    await page.click('button[type="submit"]');
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### Lead Magnet Form

```js
// e2e/lead-magnet.test.js
test('redirects to thank-you page on submission', async ({ page }) => {
  await page.goto('/lead-magnet');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/lead-magnet/thank-you');
});
```

### Validation Rules to Test

| Field   | Rule                          | Test Case                  |
| ------- | ----------------------------- | -------------------------- |
| Name    | Required, min 2 chars         | Empty, single char         |
| Email   | Required, valid format        | Empty, missing @, no TLD   |
| Message | Required, min 10 chars        | Empty, too short           |
| Phone   | Optional, valid format        | Letters, special chars     |

---

## 7. Responsive Testing

### Breakpoints

| Breakpoint | Width   | Device Type          |
| ---------- | ------- | -------------------- |
| xs         | 320px   | Small mobile         |
| sm         | 375px   | iPhone SE / standard |
| md         | 768px   | Tablet portrait      |
| lg         | 1024px  | Tablet landscape     |
| xl         | 1280px  | Small desktop        |
| 2xl        | 1440px  | Standard desktop     |
| 3xl        | 1920px  | Large desktop        |

### Automated Viewport Testing

```js
// e2e/responsive.test.js
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-sm', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'desktop-lg', width: 1440, height: 900 },
  { name: 'desktop-xl', width: 1920, height: 1080 }
];

for (const vp of viewports) {
  test(`homepage renders correctly at ${vp.name} (${vp.width}px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    // No horizontal overflow
    const body = page.locator('body');
    const bodyWidth = await body.evaluate((el) => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(vp.width);
  });
}
```

### Manual Responsive Checklist

- [ ] **320px:** No horizontal scrollbar, text is readable, touch targets >= 44px
- [ ] **375px:** Mobile nav hamburger visible, hero CTA is tappable
- [ ] **768px:** Grid columns shift (e.g., 1-col to 2-col), nav may remain mobile
- [ ] **1024px:** Desktop nav visible, 2-3 column grids display correctly
- [ ] **1280px:** Full layout, images properly sized
- [ ] **1440px:** Content is centered / max-width constrained
- [ ] **1920px:** No awkward whitespace, content does not stretch too wide

---

## 8. Accessibility Testing

### Automated (axe-core via Playwright)

```js
// e2e/accessibility.test.js
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/about', '/services', '/blog', '/case-studies', '/contact',
               '/lead-magnet', '/privacy', '/terms', '/disclaimer'];

for (const path of pages) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

### Manual Accessibility Checklist

- [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Heading hierarchy is sequential (h1 > h2 > h3, no skips)
- [ ] Color contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text
- [ ] Focus indicators are visible on all interactive elements
- [ ] Skip-to-content link present and functional
- [ ] Form inputs have associated `<label>` elements
- [ ] ARIA roles used correctly (no redundant roles on semantic elements)
- [ ] Full keyboard navigation works (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader announces page changes on route navigation
- [ ] No content is conveyed by color alone
- [ ] `prefers-reduced-motion` respected for GSAP animations

### Keyboard Navigation Test

```js
test('keyboard navigation through main nav', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab'); // Skip-to-content link
  await page.keyboard.press('Tab'); // First nav link
  const activeElement = await page.evaluate(() => document.activeElement?.tagName);
  expect(activeElement).toBe('A');
});
```

---

## 9. Performance Testing

### Lighthouse Targets

| Metric          | Target | Notes                          |
| --------------- | ------ | ------------------------------ |
| Performance     | >= 90  | Core Web Vitals must pass      |
| Accessibility   | >= 95  | axe-core clean                 |
| Best Practices  | >= 90  |                                |
| SEO             | >= 95  | All meta tags present          |

### Core Web Vitals Targets

| Metric | Target    | Description                    |
| ------ | --------- | ------------------------------ |
| LCP    | < 2.5s    | Largest Contentful Paint       |
| FID    | < 100ms   | First Input Delay              |
| CLS    | < 0.1     | Cumulative Layout Shift        |
| INP    | < 200ms   | Interaction to Next Paint      |

### Running Lighthouse

```bash
# CLI
npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html

# With specific categories
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,seo

# Programmatic (in CI)
npx lhci autorun --collect.url=http://localhost:4173
```

### Performance Checklist

- [ ] Images optimized (WebP/AVIF, correct dimensions, lazy loaded below fold)
- [ ] Fonts preloaded with `<link rel="preload">`
- [ ] JavaScript bundle < 200KB gzipped
- [ ] CSS is scoped per component (no large global stylesheet)
- [ ] GSAP tree-shaken (only import used plugins)
- [ ] No render-blocking resources
- [ ] Static assets cached with long-lived headers

---

## 10. Cross-Browser Testing

### Target Browsers

| Browser         | Version  | Platform         |
| --------------- | -------- | ---------------- |
| Chrome          | Latest 2 | Windows, macOS   |
| Firefox         | Latest 2 | Windows, macOS   |
| Safari          | Latest 2 | macOS, iOS       |
| Edge            | Latest 2 | Windows          |
| Samsung Internet| Latest   | Android          |

### Playwright Multi-Browser

```js
// playwright.config.js
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } }
]
```

### Cross-Browser Checklist

- [ ] CSS Grid/Flexbox renders consistently
- [ ] GSAP animations run smoothly (no jank on Safari)
- [ ] Fonts render correctly across all browsers
- [ ] Forms submit and validate correctly
- [ ] ScrollTrigger fires at correct positions
- [ ] `backdrop-filter` fallback for Firefox (if used)
- [ ] `:has()` selector fallback (if used, check Firefox support)

---

## 11. SEO Validation

### Per-Page SEO Checklist

- [ ] Unique `<title>` tag (50-60 characters)
- [ ] Unique `<meta name="description">` (150-160 characters)
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:description">` present
- [ ] `<meta property="og:image">` present and valid URL
- [ ] `<meta property="og:url">` matches canonical
- [ ] `<link rel="canonical">` present with correct URL
- [ ] `<html lang="en">` attribute set
- [ ] Single `<h1>` per page
- [ ] Structured data (JSON-LD) for Organization/LocalBusiness

### Technical SEO

- [ ] `robots.txt` exists in `/static/robots.txt` and is correct
- [ ] Sitemap generated and accessible at `/sitemap.xml`
- [ ] All pages return 200 status
- [ ] No broken internal links (404s)
- [ ] Prerendered pages have correct status codes
- [ ] Images have `alt` attributes (also accessibility)
- [ ] Internal links use descriptive anchor text

### Automated SEO Test

```js
// e2e/seo.test.js
import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', title: /Home/i },
  { path: '/about', title: /About/i },
  { path: '/services', title: /Services/i },
  { path: '/contact', title: /Contact/i }
];

for (const { path, title } of pages) {
  test(`${path} has correct SEO meta tags`, async ({ page }) => {
    await page.goto(path);
    // Title
    await expect(page).toHaveTitle(title);
    // Meta description
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute('content', /.{50,}/);
    // Open Graph
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
    // Single H1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });
}
```

---

## 12. GSAP Animation Testing

### Challenges

GSAP animations are side-effectful and timing-dependent. Testing strategies:

1. **Mock GSAP in unit/component tests** to verify animation setup without timing issues.
2. **Use E2E tests** to verify visual outcomes after animations complete.
3. **Test reduced motion** to ensure `prefers-reduced-motion` is respected.

### E2E Animation Verification

```js
// e2e/animations.test.js
test('stat counters animate to final values', async ({ page }) => {
  await page.goto('/');
  // Scroll to stats section
  await page.locator('[data-testid="stats-section"]').scrollIntoViewIfNeeded();
  // Wait for animation to complete
  await page.waitForTimeout(2000);
  // Verify final value
  const counter = page.locator('[data-testid="stat-counter-0"]');
  const text = await counter.textContent();
  expect(parseInt(text || '0')).toBeGreaterThan(0);
});
```

### Reduced Motion Test

```js
test('animations are disabled with prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // Elements should be visible immediately without animation
  const hero = page.locator('[data-testid="hero-title"]');
  await expect(hero).toBeVisible();
  // Verify no transform/opacity animations are applied
  const opacity = await hero.evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
});
```

### ScrollTrigger Test

```js
test('ScrollTrigger activates animations on scroll', async ({ page }) => {
  await page.goto('/');
  // Element should not be animated initially if below fold
  const section = page.locator('[data-testid="services-section"]');
  // Scroll to it
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  // Check that animation has been applied (opacity: 1, transform: none)
  const opacity = await section.evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
});
```

---

## 13. Pre-Deployment Checklist

### Code Quality

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm check` (svelte-check) passes with no errors
- [ ] `pnpm format` has been run (no formatting diff)
- [ ] No `console.log` / `console.debug` statements in production code
- [ ] No `TODO` or `FIXME` comments remaining for this release

### Testing

- [ ] `pnpm test:unit -- --run` passes (all unit + component tests)
- [ ] `pnpm test:e2e` passes (all E2E tests)
- [ ] Lighthouse score >= 90 on all categories
- [ ] Manual QA on all pages at key breakpoints (375, 768, 1280)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Accessibility audit clean (axe-core, keyboard nav)

### Build

- [ ] `pnpm build` completes without errors or warnings
- [ ] `pnpm preview` serves correctly on port 4173
- [ ] No prerender errors (check build output for 404 warnings)
- [ ] Bundle size is within acceptable limits

### Content

- [ ] All placeholder text replaced with real content
- [ ] All images are optimized and have correct alt text
- [ ] Legal pages (privacy, terms, disclaimer) are reviewed
- [ ] Contact form submits to correct endpoint
- [ ] Lead magnet form works end-to-end

### SEO & Analytics

- [ ] All pages have unique title and meta description
- [ ] Open Graph images are correct
- [ ] `robots.txt` is correct
- [ ] Sitemap is generated
- [ ] Analytics/tracking code is in place (if required)
- [ ] Favicon renders correctly in all browsers

---

## Running the Full Test Suite

```bash
# Quick check (lint + type check)
pnpm lint && pnpm check

# Full test run
pnpm test

# Individual layers
pnpm test:unit -- --run    # Unit + Component
pnpm test:e2e              # E2E (builds first)

# Coverage report
pnpm test:unit -- --run --coverage
```
