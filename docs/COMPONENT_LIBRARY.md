# ShipForge — Component Library Reference

Complete reference for every reusable component in the ShipForge design system. All components are located in `src/lib/components/` and re-exported from the barrel file `src/lib/components/index.ts`.

**Import pattern:**

```svelte
<script lang="ts">
  import { Button, Card, SectionHeader } from '$lib/components';
</script>
```

---

## 1. Button

**File:** `src/lib/components/Button.svelte`

**Purpose:** A polymorphic call-to-action element that renders as either an `<a>` tag (when `href` is provided) or a `<button>` tag. Supports four visual variants and three sizes.

### Props

| Prop       | Type                                           | Default     | Required | Description                                    |
|------------|-------------------------------------------------|-------------|----------|------------------------------------------------|
| `variant`  | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | No       | Visual style variant                           |
| `size`     | `'sm' \| 'md' \| 'lg'`                         | `'md'`      | No       | Button size (padding and font size)            |
| `href`     | `string`                                        | `undefined` | No       | If provided, renders as `<a>` instead of `<button>` |
| `type`     | `'button' \| 'submit' \| 'reset'`              | `'button'`  | No       | HTML button type attribute (ignored when `href` is set) |
| `disabled` | `boolean`                                       | `false`     | No       | Disables the button (forces `<button>` rendering) |
| `children` | `Snippet`                                       | —           | Yes      | Button content (text, icons, etc.)             |
| `onclick`  | `(e: MouseEvent) => void`                       | `undefined` | No       | Click event handler (button mode only)         |
| `class`    | `string`                                        | `''`        | No       | Additional CSS classes                         |

**Rest props** are spread onto the underlying element.

### Usage

```svelte
<script lang="ts">
  import { Button } from '$lib/components';
</script>

<!-- Primary link button -->
<Button href="/contact" variant="primary" size="lg">
  Get Started
</Button>

<!-- Secondary action button -->
<Button variant="secondary" onclick={() => console.log('clicked')}>
  Learn More
</Button>

<!-- Outline style -->
<Button variant="outline" size="sm">
  Cancel
</Button>

<!-- Ghost style (minimal) -->
<Button variant="ghost">
  Skip
</Button>

<!-- Disabled state -->
<Button disabled>
  Unavailable
</Button>
```

### Accessibility Notes

- When rendered as a `<button>`, the native button semantics are preserved.
- When rendered as an `<a>`, ensure the `href` leads to a meaningful destination.
- Focus-visible styling uses a 2px primary-colored outline with a 2px offset.
- Disabled buttons have `cursor: not-allowed` and reduced opacity (0.5).

### Responsive Behavior

Button sizing is controlled by the `size` prop. The component uses `inline-flex` layout, so it sizes to its content by default. Use utility classes or parent layout to control width at different breakpoints.

---

## 2. SectionHeader

**File:** `src/lib/components/SectionHeader.svelte`

**Purpose:** A structured heading group for page sections, consisting of an optional eyebrow label, a title (`<h2>`), and an optional subtitle. Provides consistent typography and spacing across all sections.

### Props

| Prop       | Type                   | Default    | Required | Description                                        |
|------------|------------------------|------------|----------|----------------------------------------------------|
| `eyebrow`  | `string`               | `undefined`| No       | Small uppercase label above the title              |
| `title`    | `string`               | —          | Yes      | Main section heading (rendered as `<h2>`)          |
| `subtitle` | `string`               | `undefined`| No       | Descriptive text below the title                   |
| `align`    | `'center' \| 'left'`   | `'center'` | No       | Text alignment and horizontal positioning          |

### Usage

```svelte
<script lang="ts">
  import { SectionHeader } from '$lib/components';
</script>

<!-- Centered with all parts -->
<SectionHeader
  eyebrow="Our Services"
  title="What We Build"
  subtitle="Full-stack solutions tailored to your business needs."
/>

<!-- Left-aligned, no eyebrow -->
<SectionHeader
  title="Recent Projects"
  align="left"
/>
```

### Accessibility Notes

- The title renders as an `<h2>`, so ensure proper heading hierarchy on the page.
- The eyebrow is a `<span>` and does not interfere with heading structure.

### Responsive Behavior

- Max width is capped at `48rem` to maintain readable line lengths.
- When `align="center"`, the header is horizontally centered with `margin-inline: auto`.

---

## 3. Card

**File:** `src/lib/components/Card.svelte`

**Purpose:** A generic content container with optional icon slot and configurable padding. Used as a building block for custom card layouts throughout the site.

### Props

| Prop       | Type                     | Default     | Required | Description                                 |
|------------|--------------------------|-------------|----------|---------------------------------------------|
| `children` | `Snippet`                | —           | Yes      | Main card body content                      |
| `icon`     | `Snippet`                | `undefined` | No       | Optional icon rendered above the body       |
| `padding`  | `'sm' \| 'md' \| 'lg'`  | `'md'`      | No       | Internal padding size                       |
| `class`    | `string`                 | `''`        | No       | Additional CSS classes                      |

### Usage

```svelte
<script lang="ts">
  import { Card } from '$lib/components';
  import Lightning from 'phosphor-svelte/lib/Lightning';
</script>

<!-- Card with icon -->
<Card padding="lg">
  {#snippet icon()}
    <Lightning size={32} weight="duotone" />
  {/snippet}
  <h3>Fast Performance</h3>
  <p>Optimized for speed and efficiency.</p>
</Card>

<!-- Simple card without icon -->
<Card padding="sm">
  <p>Minimal content card.</p>
</Card>
```

### Accessibility Notes

- The card is a `<div>` — it has no implicit ARIA role. Content inside should provide its own semantic structure (headings, paragraphs, etc.).
- Hover effects (shadow and lift) are purely visual.

### Responsive Behavior

- The card expands to fill its parent container width.
- Padding scales via the `padding` prop: `sm` = `--space-4`, `md` = `--space-6`, `lg` = `--space-8`.
- Hover state lifts the card 2px with a large box shadow.

---

## 4. ServiceCard

**File:** `src/lib/components/ServiceCard.svelte`

**Purpose:** Displays a single service offering with a mapped Phosphor icon, title, description, and a feature checklist. Designed for the services grid on the home page.

### Props

| Prop      | Type      | Default | Required | Description                               |
|-----------|-----------|---------|----------|-------------------------------------------|
| `service` | `Service` | —       | Yes      | Service data object (from `$lib/types`)   |

**`Service` type:**

```ts
interface Service {
  title: string;
  description: string;
  icon: string;          // Key: 'code' | 'magnifying-glass' | 'palette' | 'lightning'
  features: string[];
  slug: string;
}
```

### Icon Mapping

The component maps the `service.icon` string to a Phosphor icon component:

| Key                 | Icon Component    | Visual          |
|---------------------|-------------------|-----------------|
| `'code'`            | `Code`            | Code brackets   |
| `'magnifying-glass'`| `MagnifyingGlass` | Search lens     |
| `'palette'`         | `Palette`         | Paint palette   |
| `'lightning'`       | `Lightning`       | Lightning bolt  |

### Usage

```svelte
<script lang="ts">
  import { ServiceCard } from '$lib/components';

  const service = {
    title: 'Web Development',
    description: 'Custom full-stack web applications built with modern tools.',
    icon: 'code',
    features: ['SvelteKit', 'TypeScript', 'PostgreSQL'],
    slug: 'web-development'
  };
</script>

<ServiceCard {service} />
```

### Accessibility Notes

- The icon container has `aria-hidden="true"` since it is decorative.
- The feature list has `aria-label="Features of {service.title}"` for screen readers.
- Each feature check icon is wrapped in a `<span>` with `aria-hidden="true"`.
- The card is an `<article>` element, providing semantic grouping.

### Responsive Behavior

- Uses `height: 100%` and `display: flex; flex-direction: column` to ensure equal-height cards in grid layouts.
- The feature list uses `margin-top: auto` to push it to the bottom.
- Hover state lifts the card 2px with border color transition and elevated shadow.

---

## 5. CaseStudyCard

**File:** `src/lib/components/CaseStudyCard.svelte`

**Purpose:** Showcases a client case study with tags, metrics grid, and a link to the full case study page. Designed for the portfolio/case studies section.

### Props

| Prop        | Type        | Default | Required | Description                                  |
|-------------|-------------|---------|----------|----------------------------------------------|
| `caseStudy` | `CaseStudy` | —       | Yes      | Case study data object (from `$lib/types`)   |

**`CaseStudy` type:**

```ts
interface CaseStudy {
  title: string;
  client: string;
  description: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  image: string;
  slug: string;
}
```

### Usage

```svelte
<script lang="ts">
  import { CaseStudyCard } from '$lib/components';

  const caseStudy = {
    title: 'E-Commerce Platform Redesign',
    client: 'TechStart Inc.',
    description: 'Complete redesign resulting in 3x conversion rate.',
    tags: ['SvelteKit', 'SEO', 'E-Commerce'],
    metrics: [
      { label: 'Conversion Rate', value: '+200%' },
      { label: 'Load Time', value: '0.8s' }
    ],
    image: '/images/case-studies/techstart.webp',
    slug: 'techstart-redesign'
  };
</script>

<CaseStudyCard {caseStudy} />
```

### Accessibility Notes

- The tags container has `aria-label="Tags"` for screen reader context.
- The metrics grid uses `role="list"` and `role="listitem"` with `aria-label="Key metrics"`.
- The "View Case Study" link includes `aria-label="Read case study: {caseStudy.title}"` for clear link purpose.
- The component is an `<article>` element.

### Responsive Behavior

- Full-height flex column layout for consistent card heights in grids.
- Metrics grid uses `grid-template-columns: repeat(2, 1fr)` for a 2-column metric layout.
- The metrics section uses `margin-top: auto` to anchor at the bottom of the card.
- Hover lifts the card 2px with border color and shadow transitions.

---

## 6. BlogCard

**File:** `src/lib/components/BlogCard.svelte`

**Purpose:** Displays a blog post preview with date, category badge, title, excerpt, read time, and a "Read More" link. Designed for the blog listing section.

### Props

| Prop   | Type       | Default | Required | Description                              |
|--------|------------|---------|----------|------------------------------------------|
| `post` | `BlogPost` | —       | Yes      | Blog post data object (from `$lib/types`)|

**`BlogPost` type:**

```ts
interface BlogPost {
  title: string;
  excerpt: string;
  date: string;       // ISO date string, e.g. '2025-01-15'
  category: string;
  slug: string;
  readTime: string;   // e.g. '5 min read'
}
```

### Usage

```svelte
<script lang="ts">
  import { BlogCard } from '$lib/components';

  const post = {
    title: 'Why SvelteKit Is the Future of Web Development',
    excerpt: 'Exploring the benefits of server-side rendering with Svelte.',
    date: '2025-06-01',
    category: 'Engineering',
    slug: 'sveltekit-future',
    readTime: '5 min read'
  };
</script>

<BlogCard {post} />
```

### Accessibility Notes

- The date uses a `<time>` element with a `datetime` attribute for machine readability.
- The "Read More" link includes `aria-label="Read article: {post.title}"` to identify the link target.
- The component is an `<article>` element.

### Responsive Behavior

- Full-height flex column layout for grid alignment.
- The excerpt area uses `flex-grow: 1` so cards align footers regardless of content length.
- The footer is anchored to the bottom with `margin-top: auto` and a top border separator.
- Hover lifts the card 2px with border color and shadow transitions.

---

## 7. StatCounter

**File:** `src/lib/components/StatCounter.svelte`

**Purpose:** Displays a single statistic with a large highlighted value and a descriptive label. Used in stats/metrics sections to showcase key numbers.

### Props

| Prop    | Type     | Default | Required | Description                          |
|---------|----------|---------|----------|--------------------------------------|
| `value` | `string` | —       | Yes      | The statistic value (e.g. `"150+"`)  |
| `label` | `string` | —       | Yes      | Descriptive label below the value    |
| `class` | `string` | `''`    | No       | Additional CSS classes               |

### Usage

```svelte
<script lang="ts">
  import { StatCounter } from '$lib/components';
</script>

<div class="stats-grid">
  <StatCounter value="150+" label="Projects Delivered" />
  <StatCounter value="99%" label="Client Satisfaction" />
  <StatCounter value="50+" label="Happy Clients" />
  <StatCounter value="5+" label="Years Experience" />
</div>
```

### Accessibility Notes

- The value is stored in a `data-value` attribute on the `<span>`, which can be used by animation scripts (e.g., GSAP counter animations).
- The label uses uppercase text transform and letter spacing for visual hierarchy.

### Responsive Behavior

- Uses flexbox column layout centered within its container.
- The value uses `--text-4xl` font size with tight line-height (1.1).
- The component sizes to fit its parent — place in a CSS Grid or Flexbox container for multi-stat layouts.

---

## 8. SEOHead

**File:** `src/lib/components/SEOHead.svelte`

**Purpose:** Renders all SEO-related `<head>` metadata including title, meta description, Open Graph tags, Twitter Card tags, canonical URL, and JSON-LD structured data. Uses SvelteKit's `<svelte:head>` for SSR-compatible head management.

### Props

| Prop       | Type          | Default | Required | Description                                |
|------------|---------------|---------|----------|--------------------------------------------|
| `metadata` | `SEOMetadata` | —       | Yes      | SEO metadata object (from `$lib/types`)    |

**`SEOMetadata` type:**

```ts
interface SEOMetadata {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;        // Defaults to 'website'
  twitterCard?: string;   // Defaults to 'summary_large_image'
  schema?: Record<string, unknown>;
}
```

### Usage

```svelte
<script lang="ts">
  import { SEOHead } from '$lib/components';
</script>

<SEOHead metadata={{
  title: 'ShipForge — Fullstack Development & SEO Agency',
  description: 'We build fast, accessible, and search-optimized web applications.',
  canonical: 'https://shipforge.dev',
  ogImage: 'https://shipforge.dev/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  schema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ShipForge',
    url: 'https://shipforge.dev'
  }
}} />
```

### Accessibility Notes

- This component produces no visible DOM output — it only modifies the document `<head>`.
- Proper meta descriptions and structured data improve discoverability for assistive technology users who rely on search engines.

### Responsive Behavior

- No visual output; not applicable.

---

## 9. Nav

**File:** `src/lib/components/Nav.svelte`

**Purpose:** The site-wide sticky navigation bar. Renders the ShipForge brand mark, desktop navigation links, and a mobile hamburger menu with a slide-in panel. Uses Phosphor Icons for the brand logo, hamburger, and close icons.

### Props

This component accepts **no props**. It reads navigation data from `$lib/data/navigation` (`mainNav`) and the current route from `$app/stores` (`page`).

### Internal State

| State        | Type      | Description                              |
|--------------|-----------|------------------------------------------|
| `mobileOpen` | `boolean` | Whether the mobile slide-in menu is open |

### Usage

```svelte
<script lang="ts">
  import { Nav } from '$lib/components';
</script>

<Nav />
```

Typically placed in the root `+layout.svelte`:

```svelte
<Nav />
<main>
  <slot />
</main>
<Footer />
```

### Icons Used

| Icon     | Size | Weight | Purpose                    |
|----------|------|--------|----------------------------|
| `Anchor` | 28   | bold   | Brand logo in the navbar   |
| `List`   | 24   | bold   | Mobile menu open (hamburger)|
| `X`      | 24   | bold   | Mobile menu close          |

### Accessibility Notes

- The `<nav>` element has `aria-label="Main navigation"`.
- Active links use `aria-current="page"` for screen reader indication.
- The mobile toggle button has dynamic `aria-expanded` and `aria-label` attributes.
- The mobile panel uses `role="dialog"` and `aria-modal="true"` when open.
- The `aria-controls="mobile-menu"` on the toggle references the panel's `id`.
- The overlay has `aria-hidden="true"` since it is decorative.
- Pressing `Escape` closes the mobile menu via keyboard event handling.

### Responsive Behavior

- **Desktop (768px+):** Horizontal link list is visible; hamburger button and mobile panel are hidden.
- **Mobile (<768px):** Links are hidden; hamburger button is visible. The menu slides in from the right as a fixed panel (max width `min(80vw, 20rem)`) with a dark overlay behind it.
- The nav bar is `position: sticky` at the top with `backdrop-filter: blur(8px)` and semi-transparent background.

---

## 10. Footer

**File:** `src/lib/components/Footer.svelte`

**Purpose:** The site-wide footer with the ShipForge brand, description, navigation links, legal links, and a copyright notice. Uses a dark background (`--color-gray-900`) for visual separation.

### Props

This component accepts **no props**. It reads navigation data from `$lib/data/navigation` (`mainNav` and `footerNav`).

### Usage

```svelte
<script lang="ts">
  import { Footer } from '$lib/components';
</script>

<Footer />
```

### Icons Used

| Icon     | Size | Weight | Purpose               |
|----------|------|--------|-----------------------|
| `Anchor` | 24   | bold   | Brand logo in footer  |

### Accessibility Notes

- The brand link has `aria-label="ShipForge home"`.
- Navigation lists use `role="list"` for explicit list semantics.
- Link colors provide sufficient contrast against the dark background (gray-400 on gray-900).

### Responsive Behavior

- **Desktop (768px+):** Three-column grid layout — brand column (2fr), navigation (1fr), legal links (1fr).
- **Mobile (<768px):** Single-column stack with `--space-10` gap between sections.
- The copyright bar spans full width with a top border separator.
- The brand description is capped at `max-width: 28rem` for readability.
