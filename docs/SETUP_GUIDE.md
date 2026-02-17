# ShipForge — Setup Guide

A beginner-friendly guide to getting the ShipForge project running on your local machine.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Clone the Repository](#step-1-clone-the-repository)
3. [Step 2: Install Dependencies](#step-2-install-dependencies)
4. [Step 3: Start Development Server](#step-3-start-development-server)
5. [Step 4: Verify the Build](#step-4-verify-the-build)
6. [Step 5: Run Checks](#step-5-run-checks)
7. [Project Structure Walkthrough](#project-structure-walkthrough)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed:

| Tool       | Minimum Version | How to Check        | Install Guide                            |
| ---------- | --------------- | ------------------- | ---------------------------------------- |
| **Node.js** | 18+            | `node --version`    | [nodejs.org](https://nodejs.org/)        |
| **pnpm**   | 8+              | `pnpm --version`    | `npm install -g pnpm` or [pnpm.io](https://pnpm.io/installation) |
| **Git**    | 2.x+            | `git --version`     | [git-scm.com](https://git-scm.com/)     |

**Recommended editor**: [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) — syntax highlighting, IntelliSense, and diagnostics for `.svelte` files
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — automatic code formatting
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — linting integration

---

## Step 1: Clone the Repository

```bash
git clone <repo-url>
cd udemy-hp
```

Replace `<repo-url>` with the actual repository URL (e.g., `https://github.com/your-org/udemy-hp.git`).

---

## Step 2: Install Dependencies

```bash
pnpm install
```

This installs all dependencies defined in `package.json`, including:
- **SvelteKit 2** and **Svelte 5** — the framework and compiler
- **GSAP** — animation library (runtime dependency)
- **Phosphor Svelte** — icon library (runtime dependency)
- **TypeScript**, **ESLint**, **Prettier** — development tooling
- **Vitest** and **Playwright** — testing frameworks
- **mdsvex** — Markdown preprocessor for Svelte

After installation, `svelte-kit sync` runs automatically (via the `prepare` script) to generate TypeScript definitions for SvelteKit's internal modules like `$app/environment` and `$app/stores`.

---

## Step 3: Start Development Server

```bash
pnpm dev
```

This starts the Vite development server with hot module replacement (HMR). Open your browser and visit:

**http://localhost:5173**

You should see the ShipForge home page. Any changes you make to `.svelte`, `.ts`, or `.css` files will instantly reflect in the browser without a full page reload.

To expose the dev server on your local network (useful for testing on mobile devices):

```bash
pnpm dev --host
```

---

## Step 4: Verify the Build

Run a production build to make sure everything compiles correctly:

```bash
pnpm build
```

This command:
1. Runs `svelte-kit sync` to regenerate type definitions
2. Compiles all Svelte components and TypeScript
3. Prerenders every route to static HTML
4. Outputs the result to the build directory

To preview the production build locally:

```bash
pnpm preview
```

This serves the built output at **http://localhost:4173**. Use this to verify that the production version works correctly before deploying.

---

## Step 5: Run Checks

### Type Checking

```bash
pnpm check
```

Runs `svelte-kit sync` followed by `svelte-check`, which performs TypeScript type checking across all `.svelte` and `.ts` files. Fix any errors before committing.

For continuous type checking during development:

```bash
pnpm check:watch
```

### Linting

```bash
pnpm lint
```

Runs Prettier in check mode and ESLint. This verifies code formatting and catches code quality issues without modifying files.

### Code Formatting

```bash
pnpm format
```

Runs Prettier with `--write` to automatically format all files in the project. Run this before committing to ensure consistent code style.

### Testing

```bash
# Run unit tests
pnpm test:unit

# Run end-to-end tests (requires Playwright browsers)
pnpm test:e2e

# Run all tests
pnpm test
```

---

## Project Structure Walkthrough

### `src/app.html` — The HTML Shell

This is the outermost HTML document. SvelteKit injects the page head (`%sveltekit.head%`) and body (`%sveltekit.body%`) at build time. It includes:
- Font preloading for Inter and JetBrains Mono via Google Fonts
- A brand-colored theme-color meta tag (`#4f46e5`)
- An SVG favicon

### `src/app.css` — The Design System

The global stylesheet contains:
- **CSS custom properties** (design tokens) for colors, typography, spacing, borders, shadows, transitions, and z-index
- **CSS reset** — normalizes browser defaults
- **Typography rules** — heading scales and body text
- **Layout primitives** — `.container`, `.section`, `.grid` utility classes
- **Accessibility** — skip link, focus styles, reduced motion support, screen-reader-only class

### `src/routes/` — Pages (File-Based Routing)

Every folder under `src/routes/` corresponds to a URL path. Each folder contains a `+page.svelte` file that defines the page content.

| File Path                                 | URL                       | Description              |
| ----------------------------------------- | ------------------------- | ------------------------ |
| `routes/+layout.svelte`                   | (all pages)               | Root layout with Nav + Footer |
| `routes/+page.svelte`                     | `/`                       | Home page                |
| `routes/services/+page.svelte`            | `/services`               | Services listing         |
| `routes/case-studies/+page.svelte`        | `/case-studies`           | Case studies listing     |
| `routes/about/+page.svelte`              | `/about`                  | About page               |
| `routes/blog/+page.svelte`               | `/blog`                   | Blog listing             |
| `routes/contact/+page.svelte`            | `/contact`                | Contact form             |
| `routes/lead-magnet/+page.svelte`        | `/lead-magnet`            | Lead magnet landing      |
| `routes/lead-magnet/thank-you/+page.svelte` | `/lead-magnet/thank-you` | Thank-you confirmation |
| `routes/login/+page.svelte`              | `/login`                  | Login page               |
| `routes/privacy/+page.svelte`            | `/privacy`                | Privacy policy           |
| `routes/terms/+page.svelte`              | `/terms`                  | Terms of service         |
| `routes/disclaimer/+page.svelte`         | `/disclaimer`             | Disclaimer               |

The **root layout** (`+layout.svelte`) wraps every page with the `<Nav />` component at the top, a `<main>` element for content, and the `<Footer />` at the bottom. It also includes an accessible skip-to-content link.

### `src/lib/components/` — Reusable Components

All shared UI components live here and are exported via `index.ts` for convenient imports. See the [Architecture Guide](./ARCHITECTURE.md#component-architecture) for a full reference of each component's props and purpose.

### `src/lib/data/` — Static Content Data

Content that would typically come from a CMS is stored as typed TypeScript arrays:
- `services.ts` — 4 service offerings with titles, descriptions, features, and icons
- `case-studies.ts` — 4 client case studies with metrics and tags
- `blog-posts.ts` — 6 blog post entries with dates, categories, and read times
- `navigation.ts` — main navigation links and footer legal links

### `src/lib/types/` — TypeScript Interfaces

All domain types are centralized in `types/index.ts`:
- `Service`, `CaseStudy`, `BlogPost` — content data shapes
- `TeamMember` — about page team data
- `ContactFormData`, `LeadMagnetFormData` — form field shapes
- `NavLink` — navigation link shape
- `SEOMetadata` — SEO meta tag configuration

### `src/lib/utils/` — Utility Functions

- `gsap.ts` — GSAP animation primitives with ScrollTrigger and reduced-motion support
- `animations.ts` — Svelte `use:` actions that wrap the GSAP primitives for declarative use in templates
- `seo.ts` — Schema.org structured data builders and meta tag helpers

### `src/lib/assets/` — Bundled Assets

Images and other assets that are imported in components (processed by Vite at build time, with hashing for cache busting).

### `static/` — Static Files

Files served directly at the root URL without processing:
- `robots.txt` — search engine crawling directives
- `favicon.svg` — browser tab icon

---

## Common Tasks

### How to Add a New Page

1. Create a new directory under `src/routes/` with the desired URL path:

   ```bash
   mkdir src/routes/pricing
   ```

2. Create a `+page.svelte` file inside the new directory:

   ```svelte
   <script lang="ts">
     import { SEOHead, SectionHeader } from '$lib/components';
   </script>

   <SEOHead
     metadata={{
       title: 'Pricing | ShipForge',
       description: 'Transparent pricing for ShipForge development and SEO services.'
     }}
   />

   <section class="section">
     <div class="container">
       <SectionHeader
         eyebrow="Pricing"
         title="Simple, Transparent Pricing"
         subtitle="No hidden fees. Choose the plan that fits your needs."
       />
       <!-- Page content here -->
     </div>
   </section>
   ```

3. The page is now accessible at `/pricing`. SvelteKit automatically picks it up — no router configuration needed.

### How to Add a New Component

1. Create a new `.svelte` file in `src/lib/components/`:

   ```bash
   touch src/lib/components/Testimonial.svelte
   ```

2. Build the component using Svelte 5 syntax:

   ```svelte
   <script lang="ts">
     interface Props {
       quote: string;
       author: string;
       role: string;
     }

     let { quote, author, role }: Props = $props();
   </script>

   <blockquote class="testimonial">
     <p class="testimonial__quote">"{quote}"</p>
     <footer class="testimonial__author">
       <strong>{author}</strong>
       <span>{role}</span>
     </footer>
   </blockquote>

   <style>
     .testimonial {
       padding: var(--space-6);
       border-left: 4px solid var(--color-primary);
       background-color: var(--color-bg-alt);
       border-radius: var(--radius-lg);
     }

     .testimonial__quote {
       font-size: var(--text-lg);
       font-style: italic;
       color: var(--color-text);
       margin-bottom: var(--space-4);
     }

     .testimonial__author {
       display: flex;
       flex-direction: column;
       font-size: var(--text-sm);
       color: var(--color-text-secondary);
     }
   </style>
   ```

3. Export it from `src/lib/components/index.ts`:

   ```ts
   export { default as Testimonial } from './Testimonial.svelte';
   ```

4. Import and use it in any page:

   ```svelte
   <script>
     import { Testimonial } from '$lib/components';
   </script>

   <Testimonial
     quote="ShipForge transformed our web presence."
     author="Jane Doe"
     role="CEO, Acme Inc."
   />
   ```

### How to Modify the Navigation

Edit `src/lib/data/navigation.ts`:

```ts
// Add a new link to the main navigation
export const mainNav: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },  // ← add new entry
  { label: 'Contact', href: '/contact' }
];
```

Both the `Nav` and `Footer` components import from this file, so changes are reflected site-wide automatically.

### How to Update SEO Metadata

Each page manages its own SEO via the `<SEOHead>` component. To update a page's metadata, modify the `metadata` prop:

```svelte
<SEOHead
  metadata={{
    title: 'Your Page Title | ShipForge',
    description: 'A concise description of this page (under 160 characters).',
    canonical: 'https://shipforge.dev/your-page',
    ogImage: 'https://shipforge.dev/og-your-page.png',
    schema: buildWebPageSchema({
      title: 'Your Page Title',
      description: 'Description for schema',
      canonical: 'https://shipforge.dev/your-page'
    })
  }}
/>
```

Import the schema builder functions from `$lib/utils/seo` when you need structured data.

### How to Add a New Data Collection

1. Define the TypeScript interface in `src/lib/types/index.ts`:

   ```ts
   export interface Testimonial {
     quote: string;
     author: string;
     role: string;
     company: string;
   }
   ```

2. Create the data file in `src/lib/data/`:

   ```ts
   // src/lib/data/testimonials.ts
   import type { Testimonial } from '$lib/types';

   export const testimonials: Testimonial[] = [
     {
       quote: 'ShipForge transformed our web presence.',
       author: 'Jane Doe',
       role: 'CEO',
       company: 'Acme Inc.'
     }
   ];
   ```

3. Import and use it in the relevant page component.

---

## Troubleshooting

### `pnpm install` Fails

**Symptom**: Errors during dependency installation.

**Solutions**:
- Verify Node.js version: `node --version` (must be 18+)
- Clear pnpm cache and retry: `pnpm store prune && pnpm install`
- Delete `node_modules` and `pnpm-lock.yaml`, then reinstall: `rm -rf node_modules pnpm-lock.yaml && pnpm install`

### `pnpm dev` Port Already in Use

**Symptom**: `Error: listen EADDRINUSE :::5173`

**Solution**: Another process is using port 5173. Either stop that process or use a different port:

```bash
pnpm dev --port 3000
```

### TypeScript Errors in VS Code but Not in Build

**Symptom**: VS Code shows red squiggles but `pnpm build` succeeds.

**Solutions**:
- Run `pnpm prepare` to regenerate SvelteKit types
- In VS Code, open the command palette (Ctrl/Cmd + Shift + P) and run "Svelte: Restart Language Server"
- Make sure you are using the workspace TypeScript version, not the built-in VS Code one

### Svelte Component Not Found / Import Errors

**Symptom**: `Cannot find module '$lib/components'` or similar.

**Solutions**:
- Run `pnpm prepare` to sync SvelteKit type definitions
- Verify the component is exported in `src/lib/components/index.ts`
- Check that path aliases in `svelte.config.js` match your import paths

### Styles Not Applying

**Symptom**: CSS rules seem to be ignored.

**Things to check**:
- Svelte styles are **scoped by default**. A style in `ComponentA.svelte` will not affect elements in `ComponentB.svelte`. Use global utility classes from `app.css` or the `:global()` modifier for cross-component styles
- Use CSS custom properties (e.g., `var(--color-primary)`) rather than hardcoded values to stay consistent with the design system
- Check browser DevTools to see if your styles are being overridden by higher-specificity rules

### GSAP Animations Not Playing

**Symptom**: Elements remain invisible or do not animate.

**Things to check**:
- Verify you are using the `use:` action syntax (e.g., `use:fadeInUp`) rather than calling the function directly
- Check if `prefers-reduced-motion` is enabled in your OS settings — animations are intentionally skipped when this is active
- Ensure the element is within the viewport scroll path — ScrollTrigger requires elements to be scrolled into view to trigger

### Build Fails with Prerender Errors

**Symptom**: `Error: 500 /some-page` during `pnpm build`.

**Solutions**:
- Prerendering means every page is rendered at build time. If a page depends on browser APIs (`window`, `document`), those calls must be guarded with `import { browser } from '$app/environment'`
- Check for missing data — if a page references data that does not exist, the prerenderer will fail
- Look at the full error stack trace in the terminal for the specific cause

### Playwright Tests Fail to Start

**Symptom**: `browserType.launch: Executable doesn't exist` or similar.

**Solution**: Install Playwright browsers:

```bash
npx playwright install
```

### Font Loading Issues

**Symptom**: Text appears in a fallback font.

**Solution**: The project loads Inter and JetBrains Mono from Google Fonts in `app.html`. Verify you have internet access during development. The `font-display: swap` strategy in the Google Fonts URL ensures text is visible immediately with a fallback font while the custom font loads.
