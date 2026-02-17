# ShipForge — Learning Roadmap: Zero to Hero

A structured learning path taking you from absolute beginner to advanced ShipForge contributor. Each level builds on the previous one, so work through them in order. Budget roughly 12 weeks if you are starting from scratch.

---

## Level 1: Absolute Basics (Week 1–2)

### Learning Objectives

- Understand how web pages are structured, styled, and made interactive.
- Be comfortable navigating the terminal and tracking changes with Git.
- Have a working Node.js development environment.

### Key Concepts

#### HTML Fundamentals

- Semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`).
- Forms and inputs (`<form>`, `<input>`, `<label>`, `<textarea>`, `<button>`).
- Attributes, accessibility basics (`alt`, `aria-label`).

#### CSS Basics

- The box model (`margin`, `border`, `padding`, `content`).
- Flexbox layout (`display: flex`, `justify-content`, `align-items`, `gap`).
- Grid layout (`display: grid`, `grid-template-columns`, `fr` units).
- Media queries (`@media (min-width: …)`).
- Units (`rem`, `em`, `%`, `vw`, `vh`).

#### JavaScript Essentials

- Variables (`let`, `const`), data types, template literals.
- Functions (declarations, arrow functions, parameters, return values).
- Arrays (`map`, `filter`, `forEach`, `find`).
- Objects (properties, destructuring, spread).
- DOM manipulation (`querySelector`, `addEventListener`, `textContent`).

#### Command Line Basics

- Opening a terminal, navigating directories (`cd`, `ls`, `pwd`).
- Creating and removing files and folders (`mkdir`, `touch`, `rm`).
- Running scripts (`node`, `pnpm`).

#### Git Basics

- `git init` — initialize a repository.
- `git add` — stage changes.
- `git commit -m "message"` — save a snapshot.
- `git push` — upload to a remote.
- `git log`, `git status`, `git diff` — inspect history.

#### Node.js and pnpm Setup

- Install Node.js (LTS) via `nvm` or the official installer.
- Install pnpm globally (`corepack enable && corepack prepare pnpm@latest --activate`).
- Understand `package.json`, `node_modules`, and lock files.

### Recommended Practice Exercises

1. Build a personal profile page with semantic HTML and a contact form.
2. Style the page with Flexbox and Grid; make it responsive with media queries.
3. Add a JavaScript toggle (e.g., dark-mode switch using `classList.toggle`).
4. Initialize a Git repo, make five meaningful commits, push to GitHub.

### ShipForge Code References

- `src/app.html` — base HTML document structure.
- `src/app.css` — global CSS custom properties and resets.

### Self-Assessment Questions

1. Can you explain the difference between `<div>` and `<section>`?
2. What does `box-sizing: border-box` do and why is it useful?
3. How does `const` differ from `let`?
4. What does `git add .` do before a commit?

### You're Ready for the Next Level When…

- You can build a multi-section responsive web page from scratch.
- You can initialize a Git repo, commit changes, and push to GitHub without looking up every command.
- You can write a small JS script that manipulates the DOM in response to user events.

---

## Level 2: Svelte Foundations (Week 3–4)

### Learning Objectives

- Understand the Svelte component model and how it differs from traditional frameworks.
- Use Svelte 5 runes for reactivity.
- Build and compose reusable components.

### Key Concepts

#### Svelte Component Model

- Single-file components (`.svelte` files containing script, markup, style).
- Compilation: Svelte compiles components at build time — no virtual DOM.
- Reactive by default: assignments trigger UI updates.

#### Svelte 5 Runes

- `$state(initialValue)` — declare reactive state.
- `$derived(expression)` — compute values that auto-update.
- `$effect(() => { … })` — run side effects when dependencies change.
- `$props()` — declare component props with destructuring.

#### Template Syntax

- `{#each items as item (item.id)}` — render lists.
- `{#if condition}` / `{:else if}` / `{:else}` — conditional rendering.
- `{@render children()}` — render snippet/slot content.
- `{@html rawHtml}` — render raw HTML (use sparingly).

#### Event Handling and Binding

- `onclick={handler}` — attach event handlers.
- `bind:value={variable}` — two-way binding on inputs.
- Event modifiers and custom events.

#### Scoped Styles

- Styles in a `<style>` block are scoped to the component by default.
- `:global()` selector for escaping scope when necessary.

#### Component Composition

- Passing props down, emitting events up.
- Snippets and `{@render}` for flexible content projection.
- Logical grouping of components in feature folders.

### Recommended Practice Exercises

1. Build a counter component using `$state` and `$derived`.
2. Create a to-do list with `{#each}`, `{#if}`, and `$state`.
3. Build a reusable `<Card>` component that accepts props and renders children via `{@render}`.
4. Style each component with scoped CSS; experiment with `:global()`.

### ShipForge Code References

- `src/lib/components/Button.svelte` — prop-driven component with scoped styles.
- `src/lib/components/Card.svelte` — component composition with snippets.
- `src/lib/components/SectionHeader.svelte` — props and conditional rendering.

### Self-Assessment Questions

1. What is the difference between `$state` and `$derived`?
2. Why does Svelte not need a virtual DOM?
3. How do scoped styles prevent class-name collisions?
4. When would you use `{@render children()}` instead of passing a prop?

### You're Ready for the Next Level When…

- You can build a multi-component Svelte app with reactive state and derived values.
- You understand how props flow between parent and child components.
- You can explain what happens at compile time vs. run time in Svelte.

---

## Level 3: SvelteKit Core (Week 5–6)

### Learning Objectives

- Understand SvelteKit's file-based routing and data-loading model.
- Create layouts, nested layouts, and data-driven pages.
- Use `$lib` aliases and configure your project.

### Key Concepts

#### File-Based Routing

- `src/routes/+page.svelte` — a page component.
- `src/routes/about/+page.svelte` — maps to `/about`.
- Dynamic params: `src/routes/blog/[slug]/+page.svelte`.

#### Layouts and Nested Layouts

- `+layout.svelte` wraps child pages.
- Nested layouts inherit from parent layouts.
- `{@render children()}` renders the child route.

#### Data Loading (`+page.ts`)

- `load` function runs before the page renders.
- Returns data as a plain object; available via `$props()` in the page.
- Universal load functions (`+page.ts`) run on both server and client.

#### Static Prerendering

- `export const prerender = true` in `+page.ts` or `+layout.ts`.
- Generates static HTML at build time for fast delivery.

#### `$lib` Imports and Aliases

- `$lib` maps to `src/lib` by default.
- Clean imports: `import Button from '$lib/components/Button.svelte'`.

#### Environment Setup

- `svelte.config.js` — adapter, aliases, preprocess.
- `vite.config.ts` — dev server, plugins.
- `.env` files and `$env/static/private` / `$env/static/public`.

### Recommended Practice Exercises

1. Create a SvelteKit project with three routes: Home, About, Contact.
2. Add a shared layout with a navigation bar and footer.
3. Create a blog route with dynamic `[slug]` pages and a `load` function.
4. Enable prerendering on all pages and verify the static output.

### ShipForge Code References

- `src/routes/+layout.svelte` — root layout with Nav and Footer.
- `src/routes/+page.svelte` — home page.
- `src/routes/services/+page.svelte` — services page with data loading.
- `svelte.config.js` — project configuration.

### Self-Assessment Questions

1. How does SvelteKit determine the URL for a given `+page.svelte` file?
2. What is the purpose of a `load` function in `+page.ts`?
3. How does a layout wrap its child pages?
4. What does `prerender = true` do and when would you use it?

### You're Ready for the Next Level When…

- You can scaffold a SvelteKit project with multiple routes, layouts, and data loading.
- You understand when data runs on the server vs. the client.
- You can configure aliases and prerendering in `svelte.config.js`.

---

## Level 4: TypeScript Integration (Week 7)

### Learning Objectives

- Add type safety to your Svelte and SvelteKit code.
- Define interfaces, type exports, and strict-mode practices.

### Key Concepts

#### TypeScript Basics

- Type annotations: `let name: string = 'ShipForge'`.
- Interfaces: `interface Service { title: string; description: string; }`.
- Union types, optional properties, generics.
- `type` vs. `interface` — when to use each.

#### Typing Svelte Components

- `<script lang="ts">` enables TypeScript in components.
- Typed props: `let { title, description }: { title: string; description: string } = $props()`.
- Typed state: `let count = $state<number>(0)`.

#### Interfaces and Type Exports

- Centralize types in `src/lib/types.ts` (or `src/lib/types/index.ts`).
- Export and import across the project: `import type { Service } from '$lib/types'`.
- Use `import type` for type-only imports to avoid runtime overhead.

#### Strict Mode Practices

- Enable `"strict": true` in `tsconfig.json`.
- Avoid `any`; prefer `unknown` when the type is truly uncertain.
- Use exhaustive checks with `never` in switch statements.

### Recommended Practice Exercises

1. Convert an existing Svelte component to TypeScript.
2. Create a `types.ts` file with interfaces for your project's data models.
3. Type all props, state, and function parameters in a component.
4. Enable strict mode and fix all resulting errors.

### ShipForge Code References

- `src/lib/types.ts` — centralized type definitions.
- `src/lib/data/services.ts` — typed data arrays.
- `src/lib/components/Button.svelte` — typed props.
- `tsconfig.json` — TypeScript configuration.

### Self-Assessment Questions

1. What is the difference between `type` and `interface`?
2. Why should you use `import type` instead of `import` for types?
3. What does `strict: true` enable in TypeScript?
4. How do you type `$props()` in a Svelte 5 component?

### You're Ready for the Next Level When…

- Every component in your project uses `<script lang="ts">`.
- You have a centralized types file and all data structures are typed.
- You get zero TypeScript errors with strict mode enabled.

---

## Level 5: Styling Mastery (Week 8)

### Learning Objectives

- Build a design-token system with CSS Custom Properties.
- Implement mobile-first responsive design with fluid typography.
- Create reusable layout primitives and component styling patterns.

### Key Concepts

#### CSS Custom Properties Design Tokens

- Define tokens in `:root`: `--color-primary: #2563eb;`.
- Semantic naming: `--color-text`, `--space-lg`, `--font-heading`.
- Theme switching by overriding tokens on a class or media query.

#### Mobile-First Responsive Design

- Write base styles for mobile; add complexity with `min-width` queries.
- Breakpoint tokens: `--bp-sm: 640px`, `--bp-md: 768px`, `--bp-lg: 1024px`.
- Container queries for component-level responsiveness.

#### Fluid Typography with `clamp()`

- `font-size: clamp(1rem, 0.5rem + 2vw, 2rem)` — scales between min and max.
- Apply to headings, body text, and spacing for smooth scaling.
- Remove the need for most typography-related breakpoints.

#### Layout Primitives

- Stack (vertical spacing), Cluster (horizontal wrapping), Sidebar, Grid.
- Compose primitives to build complex layouts with minimal CSS.
- Use `gap` instead of margins for spacing between children.

#### Component Styling Patterns

- BEM-like naming within scoped styles for clarity.
- Variant classes: `.button--primary`, `.button--ghost`.
- CSS custom properties as a component API: `--button-bg`.

### Recommended Practice Exercises

1. Create a `tokens.css` file with color, spacing, typography, and breakpoint tokens.
2. Build a page using only layout primitives (Stack, Grid, Cluster).
3. Implement fluid typography on all headings using `clamp()`.
4. Create a component that accepts visual variants via CSS custom properties.

### ShipForge Code References

- `src/app.css` — design tokens and global styles.
- `src/lib/components/Button.svelte` — variant styling with custom properties.
- `src/routes/+layout.svelte` — layout composition.

### Self-Assessment Questions

1. Why are CSS Custom Properties preferable to Sass variables for theming?
2. What does mobile-first mean in practice?
3. How does `clamp()` eliminate the need for some media queries?
4. What is a layout primitive and why is it useful?

### You're Ready for the Next Level When…

- Your project has a consistent design-token system in `app.css`.
- Every page is fully responsive without any horizontal overflow.
- Typography scales smoothly from mobile to large desktop.

---

## Level 6: Animation (Week 9)

### Learning Objectives

- Integrate GSAP with Svelte using the action pattern.
- Build scroll-triggered animations with performance and accessibility in mind.

### Key Concepts

#### GSAP Fundamentals

- `gsap.to(target, { … })` — animate to a state.
- `gsap.from(target, { … })` — animate from a state.
- `gsap.timeline()` — sequence multiple animations.
- Easing functions: `power2.out`, `back.out(1.7)`, `elastic.out`.

#### ScrollTrigger

- `ScrollTrigger.create({ trigger, start, end, onEnter, … })`.
- `scrub` for scroll-linked animations.
- `batch` for staggered reveals on multiple elements.

#### Svelte Action Pattern for Animations

- Create a Svelte action: `export function animateOnScroll(node: HTMLElement, params) { … }`.
- Use `use:animateOnScroll` on elements in templates.
- Clean up GSAP instances in the action's `destroy` callback.

#### Reduced Motion Handling

- Detect with `window.matchMedia('(prefers-reduced-motion: reduce)')`.
- Skip or simplify animations when the user prefers reduced motion.
- Always provide a non-animated fallback.

#### Performance Optimization

- Animate `transform` and `opacity` only (GPU-composited properties).
- Use `will-change` sparingly.
- Avoid animating `layout`-triggering properties (`width`, `height`, `top`, `left`).
- `gsap.ticker` and `requestAnimationFrame` considerations.

### Recommended Practice Exercises

1. Create a fade-in-up animation with `gsap.from`.
2. Build a Svelte action that triggers animation on scroll.
3. Add staggered reveals to a grid of cards.
4. Implement a `prefers-reduced-motion` check that disables animations.

### ShipForge Code References

- `src/lib/actions/animate.ts` — Svelte action wrapping GSAP.
- `src/lib/components/AnimatedSection.svelte` — scroll-triggered section.
- `src/routes/+page.svelte` — home page with orchestrated animations.

### Self-Assessment Questions

1. Why should you prefer `transform` and `opacity` for animations?
2. How does a Svelte action differ from an `$effect`?
3. What does `ScrollTrigger` do that a simple `gsap.from` does not?
4. How do you handle users who prefer reduced motion?

### You're Ready for the Next Level When…

- Your site has smooth, performant scroll-triggered animations.
- Animations degrade gracefully when reduced motion is preferred.
- All GSAP instances are properly cleaned up to prevent memory leaks.

---

## Level 7: SEO & Performance (Week 10)

### Learning Objectives

- Implement technical SEO best practices.
- Optimize Core Web Vitals.
- Ensure full accessibility compliance.

### Key Concepts

#### Technical SEO Fundamentals

- Semantic HTML structure (one `<h1>` per page, logical heading hierarchy).
- Clean URL structure and internal linking.
- Sitemap generation and `robots.txt`.
- Canonical URLs to avoid duplicate content.

#### Meta Tags and Structured Data

- `<title>` and `<meta name="description">` for every page.
- Open Graph tags (`og:title`, `og:description`, `og:image`).
- Twitter card tags.
- JSON-LD structured data (`Organization`, `WebPage`, `BreadcrumbList`).

#### Core Web Vitals

- **LCP** (Largest Contentful Paint) — optimize images, preload critical assets.
- **INP** (Interaction to Next Paint) — minimize main-thread blocking.
- **CLS** (Cumulative Layout Shift) — set explicit dimensions, avoid layout thrash.

#### Performance Optimization

- Image optimization (WebP/AVIF, `srcset`, lazy loading).
- Code splitting (SvelteKit handles this automatically per route).
- Font loading strategy (`font-display: swap`, preloading).
- Caching headers and CDN configuration.

#### Accessibility Deep Dive

- WCAG 2.1 AA compliance checklist.
- Keyboard navigation (focus management, skip links, tab order).
- Screen reader testing (ARIA landmarks, live regions).
- Color contrast ratios (minimum 4.5:1 for normal text).

### Recommended Practice Exercises

1. Add a `<svelte:head>` block with full meta tags to every page.
2. Add JSON-LD structured data to the home page.
3. Run Lighthouse and achieve 90+ on all four categories.
4. Navigate your entire site using only the keyboard; fix any issues.

### ShipForge Code References

- `src/lib/components/SEO.svelte` — reusable SEO meta component.
- `src/routes/+page.svelte` — structured data example.
- `static/robots.txt` — robots configuration.
- `static/sitemap.xml` — sitemap.

### Self-Assessment Questions

1. What are the three Core Web Vitals and what does each measure?
2. Why is semantic HTML important for SEO?
3. What is JSON-LD and where does it go in the document?
4. How do you test keyboard accessibility?

### You're Ready for the Next Level When…

- Every page has unique, descriptive meta tags and structured data.
- Lighthouse scores are 90+ across Performance, Accessibility, Best Practices, and SEO.
- You can navigate the entire site with a keyboard and screen reader.

---

## Level 8: Production Engineering (Week 11–12)

### Learning Objectives

- Build, test, deploy, and monitor a production SvelteKit application.
- Establish a professional development workflow.

### Key Concepts

#### Build and Deployment

- `pnpm build` — produce a production build.
- Adapter selection (`adapter-static`, `adapter-node`, `adapter-vercel`).
- Environment variables and secrets management.
- Preview with `pnpm preview` before deploying.

#### Testing Strategy

- Unit tests with Vitest for utilities and logic.
- Component tests with `@testing-library/svelte`.
- End-to-end tests with Playwright.
- Visual regression tests (optional, using tools like Percy).

#### Error Handling

- SvelteKit `+error.svelte` pages for route-level errors.
- `handleError` hook in `hooks.server.ts`.
- Graceful degradation for failed data loads.
- User-friendly error messages.

#### Git Workflow

- Feature branches: `feature/add-contact-form`.
- Pull requests with descriptive titles and bodies.
- Code review checklist.
- Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`).

#### CI/CD Basics

- GitHub Actions workflow for lint, type-check, test, build.
- Automated deployment on merge to `main`.
- Branch protection rules.
- Status checks before merge.

#### Monitoring

- Error tracking (e.g., Sentry).
- Analytics (privacy-respecting options like Plausible, Fathom).
- Uptime monitoring.
- Performance budgets and alerts.

### Recommended Practice Exercises

1. Write unit tests for three utility functions using Vitest.
2. Write a Playwright test that navigates the site and checks key content.
3. Set up a GitHub Actions workflow that runs lint, type-check, and build.
4. Deploy the site to a hosting provider and verify the live build.

### ShipForge Code References

- `svelte.config.js` — adapter configuration.
- `vite.config.ts` — Vitest integration.
- `playwright.config.ts` — E2E test configuration.
- `.github/workflows/ci.yml` — CI pipeline (if present).

### Self-Assessment Questions

1. What is the difference between `adapter-static` and `adapter-node`?
2. When should you write a unit test vs. an E2E test?
3. What does a CI/CD pipeline automate?
4. How do you handle environment variables in a SvelteKit production build?

### You're Ready for the Next Level When…

- Your project builds cleanly with zero warnings.
- You have tests covering critical paths and they all pass.
- The site is deployed and accessible on a public URL.
- You have a CI pipeline that catches regressions before they reach production.

---

## What's Next?

Congratulations — you have completed the ShipForge Zero to Hero roadmap. From here, consider:

- **Contributing to open source** — Svelte and SvelteKit have welcoming communities.
- **Building your own project** — Apply everything you have learned to a personal or freelance project.
- **Exploring advanced topics** — Server-side rendering, edge functions, database integration, authentication.
- **Teaching others** — The best way to solidify knowledge is to explain it.

Keep building. Keep shipping.
