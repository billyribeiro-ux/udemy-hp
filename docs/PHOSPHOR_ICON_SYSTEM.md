# ShipForge — Phosphor Icon System

## What Is Phosphor Icons

[Phosphor Icons](https://phosphoricons.com/) is a flexible, open-source icon family designed for clarity and consistency. It provides over 1,200 icons across six weights, making it suitable for interfaces of any scale. The Svelte integration (`phosphor-svelte`) delivers first-class component support with typed props and tree-shaking.

---

## Installation

Phosphor Icons is installed via the `phosphor-svelte` package. It is listed as a production dependency in the project:

```bash
pnpm add phosphor-svelte
```

**Current version in ShipForge:** `^3.1.0`

---

## Import Pattern

Icons are imported individually from their deep-path module to ensure optimal tree-shaking:

```svelte
<script lang="ts">
  import Anchor from 'phosphor-svelte/lib/Anchor';
  import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
  import Lightning from 'phosphor-svelte/lib/Lightning';
</script>
```

Each icon is a standalone Svelte component that accepts `size`, `color`, and `weight` props.

---

## Available Weights

Every Phosphor icon supports six visual weights:

| Weight     | Description                                      |
|------------|--------------------------------------------------|
| `thin`     | 1px stroke — ultra-light, minimal style          |
| `light`    | 1.5px stroke — subtle and elegant                |
| `regular`  | 2px stroke — the default, general-purpose weight |
| `bold`     | 3px stroke — strong emphasis, high contrast      |
| `fill`     | Solid filled — maximum visual weight             |
| `duotone`  | Two-tone layered rendering with partial opacity  |

---

## Props Reference

| Prop     | Type     | Default     | Description                                    |
|----------|----------|-------------|------------------------------------------------|
| `size`   | `number \| string` | `24`       | Width and height of the icon in pixels |
| `color`  | `string` | `"currentColor"` | CSS color value applied to the icon       |
| `weight` | `"thin" \| "light" \| "regular" \| "bold" \| "fill" \| "duotone"` | `"regular"` | Visual weight of the icon |

### Example

```svelte
<Lightning size={32} weight="duotone" color="var(--color-primary)" />
```

---

## Usage in Svelte Components

Icons are used as inline Svelte components. They inherit `currentColor` by default, so they match the text color of their parent element.

```svelte
<script lang="ts">
  import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
</script>

<a href="/about" class="link">
  Learn More
  <ArrowRight size={16} weight="bold" />
</a>
```

Icons can also be passed as Snippet props (e.g., the `Card` component's `icon` snippet slot):

```svelte
<Card>
  {#snippet icon()}
    <Lightning size={32} weight="duotone" />
  {/snippet}
  Card content here
</Card>
```

---

## Icon Inventory

All Phosphor icons currently used across the ShipForge codebase:

### Components (`src/lib/components/`)

| Icon             | File                 | Size | Weight    | Purpose                        |
|------------------|----------------------|------|-----------|--------------------------------|
| `Code`           | `ServiceCard.svelte` | 32   | duotone   | Web development service icon   |
| `MagnifyingGlass`| `ServiceCard.svelte` | 32   | duotone   | SEO service icon               |
| `Palette`        | `ServiceCard.svelte` | 32   | duotone   | Design service icon            |
| `Lightning`      | `ServiceCard.svelte` | 32   | duotone   | Performance service icon       |
| `Check`          | `ServiceCard.svelte` | 16   | bold      | Feature list checkmark         |
| `ArrowRight`     | `CaseStudyCard.svelte` | 16 | bold      | "View Case Study" link arrow   |
| `CalendarBlank`  | `BlogCard.svelte`    | 14   | regular   | Post date indicator            |
| `Clock`          | `BlogCard.svelte`    | 14   | regular   | Read time indicator            |
| `ArrowRight`     | `BlogCard.svelte`    | 14   | bold      | "Read More" link arrow         |
| `List`           | `Nav.svelte`         | 24   | bold      | Mobile hamburger menu icon     |
| `X`              | `Nav.svelte`         | 24   | bold      | Mobile menu close icon         |
| `Anchor`         | `Nav.svelte`         | 28   | bold      | Brand logo icon                |
| `Anchor`         | `Footer.svelte`      | 24   | bold      | Brand logo icon (footer)       |

### Pages (`src/routes/`)

| Icon             | File                              | Purpose                          |
|------------------|-----------------------------------|----------------------------------|
| `Lightbulb`      | `about/+page.svelte`              | Innovation / idea value          |
| `ChartLineUp`    | `about/+page.svelte`              | Growth / analytics value         |
| `Eye`            | `about/+page.svelte`              | Vision / transparency value      |
| `Rocket`         | `about/+page.svelte`              | Launch / momentum value          |
| `Lightning`      | `about/+page.svelte`              | Speed / performance value        |
| `Target`         | `about/+page.svelte`              | Precision / goals value          |
| `CheckCircle`    | `lead-magnet/+page.svelte`        | Benefit confirmation             |
| `BookOpen`       | `lead-magnet/+page.svelte`        | Guide / learning content         |
| `Rocket`         | `lead-magnet/+page.svelte`        | Launch / getting started         |
| `MagnifyingGlass`| `lead-magnet/+page.svelte`        | SEO / search topic               |
| `Lightning`      | `lead-magnet/+page.svelte`        | Performance topic                |
| `Globe`          | `lead-magnet/+page.svelte`        | Web / global reach topic         |
| `Shield`         | `lead-magnet/+page.svelte`        | Security / trust topic           |
| `SpinnerGap`     | `lead-magnet/+page.svelte`        | Loading state spinner            |
| `CheckCircle`    | `lead-magnet/thank-you/+page.svelte` | Success confirmation          |
| `Briefcase`      | `lead-magnet/thank-you/+page.svelte` | Case studies CTA              |
| `Article`        | `lead-magnet/thank-you/+page.svelte` | Blog CTA                     |
| `Rocket`         | `lead-magnet/thank-you/+page.svelte` | Getting started CTA           |
| `House`          | `lead-magnet/thank-you/+page.svelte` | Home page CTA                 |
| `ArrowRight`     | `lead-magnet/thank-you/+page.svelte` | Navigation arrow              |
| `EnvelopeSimple` | `contact/+page.svelte`            | Contact / email                  |
| `CheckCircle`    | `contact/+page.svelte`            | Success confirmation             |
| `Clock`          | `contact/+page.svelte`            | Response time indicator          |
| `LinkedinLogo`   | `contact/+page.svelte`            | LinkedIn social link             |
| `TwitterLogo`    | `contact/+page.svelte`            | Twitter social link              |
| `GithubLogo`     | `contact/+page.svelte`            | GitHub social link               |
| `SpinnerGap`     | `contact/+page.svelte`            | Form submission loading state    |
| `CaretDown`      | `contact/+page.svelte`            | Select dropdown indicator        |

---

## Accessibility

### Decorative Icons

Icons that are purely decorative (next to text that already conveys meaning) must be hidden from assistive technology:

```svelte
<div aria-hidden="true">
  <Lightning size={32} weight="duotone" />
</div>
```

This pattern is used in `ServiceCard.svelte` for the service icon container.

### Interactive Icons

Icons inside interactive elements (buttons, links) where the icon is the only content must have an accessible label on the parent element:

```svelte
<button aria-label="Open menu">
  <List size={24} weight="bold" />
</button>
```

This pattern is used in `Nav.svelte` for the mobile menu toggle.

### Icons Alongside Text

When an icon appears next to descriptive text, no additional aria attributes are needed on the icon — the text provides the accessible name:

```svelte
<a href="/blog/{post.slug}" class="blog-card__link" aria-label="Read article: {post.title}">
  Read More
  <ArrowRight size={14} weight="bold" />
</a>
```

---

## Consistent Sizing Conventions

The project follows these sizing tiers for visual consistency:

| Size   | Usage                                  | Examples                              |
|--------|----------------------------------------|---------------------------------------|
| `14px` | Inline metadata (dates, read times)    | `CalendarBlank`, `Clock` in BlogCard  |
| `16px` | Inline actions, list markers           | `Check` in ServiceCard, `ArrowRight` in CaseStudyCard |
| `24px` | Default UI controls, footer branding   | `List`, `X` in Nav; `Anchor` in Footer |
| `28px` | Primary brand mark                     | `Anchor` in Nav brand                 |
| `32px` | Feature/section icons                  | Service icons in `ServiceCard`        |
| `48px+`| Hero or splash illustrations           | Reserved for landing page hero areas  |

---

## Performance: Tree-Shaking

Because icons are imported from individual deep paths (`phosphor-svelte/lib/IconName`), Vite's tree-shaking ensures that **only the icons actually used** are included in the production bundle. Unused icons from the Phosphor library are eliminated at build time.

**Do:**
```ts
import Anchor from 'phosphor-svelte/lib/Anchor';
```

**Avoid:**
```ts
// This would import the entire icon library — do NOT do this
import { Anchor } from 'phosphor-svelte';
```

The deep-path import pattern keeps the icon payload minimal regardless of the total library size.
