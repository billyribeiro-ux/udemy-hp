# SvelteKit Core Concepts

> A comprehensive guide to SvelteKit — the full-stack framework for Svelte applications — with examples from the ShipForge project.

---

## Table of Contents

1. [What is SvelteKit?](#what-is-sveltekit)
2. [File-Based Routing](#file-based-routing)
3. [Route Parameters and Dynamic Routes](#route-parameters-and-dynamic-routes)
4. [Layouts and Layout Hierarchy](#layouts-and-layout-hierarchy)
5. [Loading Data](#loading-data)
6. [Form Actions](#form-actions)
7. [Error Handling](#error-handling)
8. [Static Prerendering](#static-prerendering)
9. [Adapters](#adapters)
10. [Environment Variables](#environment-variables)
11. [Modules and Aliases](#modules-and-aliases)
12. [Preloading and Prefetching](#preloading-and-prefetching)

---

## What is SvelteKit?

**Svelte** is a component framework (a library for building UI components). **SvelteKit** is the **full-stack application framework** built on top of Svelte. The relationship is analogous to:

- React (library) → Next.js (framework)
- Vue (library) → Nuxt (framework)
- Svelte (library) → SvelteKit (framework)

### What SvelteKit Provides Beyond Svelte

| Feature | Svelte alone | SvelteKit |
|---|---|---|
| Component authoring | Yes | Yes |
| File-based routing | No | Yes |
| Server-side rendering (SSR) | No | Yes |
| Static site generation (SSG) | No | Yes |
| API routes / server endpoints | No | Yes |
| Form handling (progressive enhancement) | No | Yes |
| Data loading (server & client) | No | Yes |
| Build & deployment tooling | No | Yes (via adapters) |

SvelteKit uses **Vite** as its build tool and dev server, giving you fast hot module replacement (HMR), optimized production builds, and a plugin ecosystem.

### ShipForge as a SvelteKit Project

The ShipForge project is a SvelteKit application configured for **static prerendering**. Every page is pre-built to HTML at build time, resulting in a fast, SEO-friendly static site. The project structure follows SvelteKit conventions:

```
src/
├── routes/           # File-based routing
│   ├── +page.svelte  # Home page
│   ├── +layout.svelte
│   ├── +layout.ts
│   ├── about/
│   ├── blog/
│   ├── services/
│   ├── case-studies/
│   ├── contact/
│   ├── lead-magnet/
│   ├── privacy/
│   ├── terms/
│   └── disclaimer/
├── lib/              # Shared code ($lib alias)
│   ├── components/
│   ├── data/
│   ├── types/
│   └── utils/
└── app.css           # Global styles
```

---

## File-Based Routing

SvelteKit uses the filesystem to define routes. Every directory inside `src/routes/` can become a URL path, and special filenames determine what happens at each route.

### Core Route Files

| File | Purpose |
|---|---|
| `+page.svelte` | The page component (what the user sees) |
| `+page.ts` | Universal load function (runs on server and client) |
| `+page.server.ts` | Server-only load function and form actions |
| `+layout.svelte` | Layout wrapper (persists across child routes) |
| `+layout.ts` | Layout load function |
| `+layout.server.ts` | Server-only layout load function |
| `+error.svelte` | Error page for this route segment |
| `+server.ts` | API endpoint (GET, POST, PUT, DELETE handlers) |

### How Paths Map to Files

```
src/routes/+page.svelte               → /
src/routes/about/+page.svelte         → /about
src/routes/blog/+page.svelte          → /blog
src/routes/services/+page.svelte      → /services
src/routes/contact/+page.svelte       → /contact
src/routes/lead-magnet/+page.svelte   → /lead-magnet
```

### A Minimal Page

```svelte
<!-- src/routes/about/+page.svelte -->
<script lang="ts">
	import { SectionHeader } from '$lib/components';
</script>

<section class="about-page">
	<SectionHeader
		eyebrow="About Us"
		title="Building the Web, One Ship at a Time"
		subtitle="ShipForge is a fullstack development and SEO agency."
	/>
</section>
```

No router configuration, no route registration. Drop the file in the right directory and SvelteKit handles the rest.

---

## Route Parameters and Dynamic Routes

Dynamic segments in URLs are defined by wrapping a directory name in square brackets.

### Basic Dynamic Route

```
src/routes/blog/[slug]/+page.svelte   → /blog/sveltekit-seo-guide
                                       → /blog/typescript-tips
                                       → /blog/anything-here
```

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
	let { data } = $props();
</script>

<article>
	<h1>{data.post.title}</h1>
	<p>{data.post.excerpt}</p>
</article>
```

```typescript
// src/routes/blog/[slug]/+page.ts
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { blogPosts } from '$lib/data/blog-posts';

export const load: PageLoad = ({ params }) => {
	const post = blogPosts.find(p => p.slug === params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return { post };
};
```

### Multiple Parameters

```
src/routes/blog/[category]/[slug]/+page.svelte
→ /blog/engineering/sveltekit-tips
→ params = { category: 'engineering', slug: 'sveltekit-tips' }
```

### Rest Parameters

Capture multiple path segments with `[...rest]`:

```
src/routes/docs/[...path]/+page.svelte
→ /docs/getting-started           → params.path = 'getting-started'
→ /docs/api/components/button     → params.path = 'api/components/button'
```

### Optional Parameters

Wrap in double brackets for optional segments:

```
src/routes/blog/[[lang]]/+page.svelte
→ /blog          → params.lang = undefined
→ /blog/en       → params.lang = 'en'
→ /blog/fr       → params.lang = 'fr'
```

### Parameter Matchers

Constrain parameters with custom matchers:

```typescript
// src/params/slug.ts
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return /^[a-z0-9-]+$/.test(param);
};
```

```
src/routes/blog/[slug=slug]/+page.svelte
→ Only matches if the param passes the "slug" matcher
```

---

## Layouts and Layout Hierarchy

Layouts wrap pages with shared UI (navigation, footers, sidebars). They persist across page navigations, so shared elements are not re-rendered.

### Root Layout

The ShipForge root layout wraps every page with navigation and a footer:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import { Nav, Footer } from '$lib/components';

	let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<Nav />

<main id="main-content">
	{@render children()}
</main>

<Footer />
```

**Key points:**
- `children` is a snippet containing the current page (or nested layout).
- `{@render children()}` renders the page content inside the layout.
- Global CSS is imported here so it applies everywhere.

### Nested Layouts

Layouts cascade. A layout in a subdirectory wraps pages within that directory:

```
src/routes/
├── +layout.svelte          ← Root layout (Nav + Footer)
├── +page.svelte            ← Home page (wrapped by root layout)
├── blog/
│   ├── +layout.svelte      ← Blog layout (sidebar + root layout)
│   ├── +page.svelte        ← Blog index (wrapped by blog layout)
│   └── [slug]/
│       └── +page.svelte    ← Blog post (wrapped by blog layout)
```

```svelte
<!-- src/routes/blog/+layout.svelte -->
<script>
	let { children } = $props();
</script>

<div class="blog-layout">
	<aside class="blog-sidebar">
		<nav>
			<a href="/blog">All Posts</a>
			<a href="/blog?category=engineering">Engineering</a>
			<a href="/blog?category=seo">SEO</a>
		</nav>
	</aside>
	<div class="blog-content">
		{@render children()}
	</div>
</div>
```

### Layout Groups

Use parentheses `(groupName)` to create a layout group — a shared layout without affecting the URL:

```
src/routes/
├── (marketing)/
│   ├── +layout.svelte      ← Marketing layout
│   ├── about/+page.svelte  ← /about (not /(marketing)/about)
│   └── pricing/+page.svelte
├── (app)/
│   ├── +layout.svelte      ← App layout (different from marketing)
│   ├── dashboard/+page.svelte
│   └── settings/+page.svelte
```

### Breaking Out of Layouts

Use `+page@.svelte` to reset to a specific layout level:

```
+page@.svelte        ← Resets to root layout
+page@(app).svelte   ← Resets to the (app) group layout
```

---

## Loading Data

SvelteKit provides a structured way to load data for pages and layouts via `load` functions.

### Universal Load (`+page.ts`)

Runs on both server (during SSR) and client (during navigation). Use for data that does not require server secrets.

```typescript
// src/routes/+layout.ts (from ShipForge)
export const prerender = true;

export function load() {
	return {
		siteTitle: 'ShipForge',
		siteDescription: 'Fullstack Development & SEO Agency'
	};
}
```

```typescript
// src/routes/services/+page.ts
import type { PageLoad } from './$types';
import { services } from '$lib/data/services';

export const load: PageLoad = () => {
	return { services };
};
```

### Server Load (`+page.server.ts`)

Runs **only on the server**. Use for database queries, API calls with secrets, or any server-only logic.

```typescript
// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const projects = await db.getProjects(user.id);

	return { projects };
};
```

### Accessing Load Data in Components

Data returned from `load` is available via the `data` prop:

```svelte
<!-- src/routes/services/+page.svelte -->
<script lang="ts">
	import { ServiceCard } from '$lib/components';

	let { data } = $props();
</script>

<section>
	{#each data.services as service}
		<ServiceCard {service} />
	{/each}
</section>
```

### Layout Data Inheritance

Child pages inherit data from parent layouts. If `+layout.ts` returns `{ siteTitle }`, every child page can access it:

```svelte
<script lang="ts">
	// data includes both page data AND parent layout data
	let { data } = $props();
	// data.siteTitle is from +layout.ts
	// data.services is from this page's +page.ts
</script>
```

### Load Function Inputs

Load functions receive a context object with useful properties:

```typescript
export const load: PageLoad = ({ params, url, data, fetch }) => {
	// params  — route parameters ({ slug: 'my-post' })
	// url     — the full URL object (url.searchParams, etc.)
	// data    — data from the server load function (if using both)
	// fetch   — enhanced fetch (handles cookies, relative URLs)
};
```

---

## Form Actions

Form actions handle HTML form submissions server-side via `+page.server.ts`. They enable **progressive enhancement** — forms work without JavaScript.

### Defining Actions

```typescript
// src/routes/contact/+page.server.ts
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const message = formData.get('message') as string;

		// Validation
		if (!name || !email || !message) {
			return fail(400, {
				error: 'All fields are required.',
				name,
				email,
				message
			});
		}

		// Process the form (send email, save to DB, etc.)
		await sendContactEmail({ name, email, message });

		return { success: true };
	}
};
```

### Using Forms in Components

```svelte
<!-- src/routes/contact/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

{#if form?.success}
	<p class="success">Message sent! We'll get back to you soon.</p>
{/if}

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form method="POST" use:enhance>
	<label>
		Name
		<input name="name" value={form?.name ?? ''} required />
	</label>
	<label>
		Email
		<input name="email" type="email" value={form?.email ?? ''} required />
	</label>
	<label>
		Message
		<textarea name="message" required>{form?.message ?? ''}</textarea>
	</label>
	<button type="submit">Send Message</button>
</form>
```

### Named Actions

Define multiple actions on a single page:

```typescript
export const actions: Actions = {
	subscribe: async ({ request }) => {
		// handle newsletter subscription
	},
	unsubscribe: async ({ request }) => {
		// handle unsubscribe
	}
};
```

```svelte
<form method="POST" action="?/subscribe" use:enhance>
	<input name="email" type="email" required />
	<button type="submit">Subscribe</button>
</form>

<form method="POST" action="?/unsubscribe" use:enhance>
	<input name="email" type="email" required />
	<button type="submit">Unsubscribe</button>
</form>
```

### Progressive Enhancement with `use:enhance`

The `use:enhance` action (imported from `$app/forms`) upgrades a standard HTML form to use fetch instead of a full page navigation. Without JavaScript, the form still works via the traditional POST-redirect flow.

```svelte
<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="POST" use:enhance>
	<!-- works with AND without JavaScript -->
</form>
```

You can also customize the behavior:

```svelte
<form
	method="POST"
	use:enhance={({ formData, cancel }) => {
		// Runs before submission
		const email = formData.get('email');
		if (!email) {
			cancel(); // prevent submission
			return;
		}

		return async ({ result, update }) => {
			// Runs after submission
			if (result.type === 'success') {
				showToast('Submitted!');
			}
			await update(); // apply default behavior
		};
	}}
>
```

---

## Error Handling

SvelteKit provides structured error handling at every level of the route hierarchy.

### Throwing Errors in Load Functions

```typescript
import { error } from '@sveltejs/kit';

export const load: PageLoad = ({ params }) => {
	const post = findPost(params.slug);

	if (!post) {
		throw error(404, {
			message: 'Post not found'
		});
	}

	return { post };
};
```

### `+error.svelte` — Custom Error Pages

Place a `+error.svelte` file in any route directory to customize the error UI for that segment:

```svelte
<!-- src/routes/+error.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<h1>{$page.status}</h1>
	<p>{$page.error?.message ?? 'Something went wrong'}</p>
	<a href="/">Go back home</a>
</div>

<style>
	.error-page {
		text-align: center;
		padding: var(--space-16) var(--space-4);
	}
</style>
```

### Error Hierarchy

SvelteKit walks up the route tree to find the nearest `+error.svelte`:

```
src/routes/
├── +error.svelte              ← Catches errors from all routes
├── blog/
│   ├── +error.svelte          ← Catches errors from /blog/*
│   ├── +page.svelte
│   └── [slug]/
│       ├── +page.svelte       ← If this throws a 404...
│       └── +error.svelte      ← ...this catches it first
```

### Expected vs. Unexpected Errors

- **Expected errors** (thrown with `error()`) display your custom error page with the provided message.
- **Unexpected errors** (unhandled exceptions) are caught by SvelteKit, logged server-side, and shown as a generic "Internal Error" to avoid leaking sensitive information.

### `handleError` Hook

Customize how unexpected errors are processed in `src/hooks.server.ts`:

```typescript
// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event }) => {
	console.error('Unhandled error:', error);

	return {
		message: 'An unexpected error occurred. Please try again later.'
	};
};
```

---

## Static Prerendering

SvelteKit can prerender pages to static HTML at build time. This is how ShipForge is built — every page is prerendered, resulting in fast load times and easy deployment.

### Enabling Prerendering

```typescript
// src/routes/+layout.ts (from ShipForge)
export const prerender = true;
```

Setting `prerender = true` in the root layout prerenders **all** pages in the application.

### Per-Page Prerendering

You can also enable/disable prerendering on individual pages:

```typescript
// src/routes/about/+page.ts
export const prerender = true;  // This page will be prerendered

// src/routes/dashboard/+page.ts
export const prerender = false; // This page requires SSR (dynamic data)
```

### What Prerendering Does

At **build time**, SvelteKit:

1. Visits each prerenderable route.
2. Runs its `load` functions.
3. Renders the page to static HTML.
4. Outputs `.html` files ready for static hosting.

The result is a `/build` directory with plain HTML, CSS, and JS files — no Node.js server needed.

### Server-Side Rendering Mode

For pages that cannot be prerendered (they need fresh data on each request), you can control SSR:

```typescript
// Enable SSR (default)
export const ssr = true;

// Disable SSR (client-side only rendering)
export const ssr = false;

// Client-side rendering mode
export const csr = true;  // default
export const csr = false; // disable client-side JS (HTML only)
```

---

## Adapters

Adapters tell SvelteKit how to package your app for deployment. They transform the build output for specific hosting platforms.

### `adapter-auto`

Automatically detects the deployment platform and uses the appropriate adapter. Works out of the box with Vercel, Netlify, Cloudflare Pages, and Azure Static Web Apps.

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		adapter: adapter()
	}
};
```

### `adapter-static`

Generates a fully static site. All pages must be prerenderable. This is ideal for ShipForge-style projects.

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		})
	}
};
```

Requirements for `adapter-static`:
- Every page must have `export const prerender = true` (or set it in the root layout).
- No server-only features (form actions, server load functions that run at request time).

### `adapter-node`

Creates a standalone Node.js server. Use this when you need SSR, form actions, or API routes.

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true,
			envPrefix: 'APP_'
		})
	}
};
```

Run the output with:

```bash
node build/index.js
```

### Other Adapters

| Adapter | Platform |
|---|---|
| `@sveltejs/adapter-vercel` | Vercel (serverless + edge) |
| `@sveltejs/adapter-netlify` | Netlify (serverless functions) |
| `@sveltejs/adapter-cloudflare` | Cloudflare Pages / Workers |
| `svelte-adapter-bun` | Bun runtime |

---

## Environment Variables

SvelteKit provides type-safe access to environment variables through built-in modules.

### `$env/static/public` — Public, Build-Time Variables

Variables prefixed with `PUBLIC_` are embedded at build time and available in both server and client code.

```typescript
// .env
PUBLIC_SITE_NAME=ShipForge
PUBLIC_API_URL=https://api.shipforge.dev
```

```svelte
<script lang="ts">
	import { PUBLIC_SITE_NAME, PUBLIC_API_URL } from '$env/static/public';
</script>

<footer>
	<p>&copy; 2026 {PUBLIC_SITE_NAME}</p>
</footer>
```

### `$env/static/private` — Secret, Build-Time Variables

Available **only in server-side code** (`+page.server.ts`, `+server.ts`, `hooks.server.ts`). Importing these in client code will cause a build error.

```typescript
// .env
DATABASE_URL=postgresql://localhost:5432/shipforge
API_SECRET=sk_live_xxxxx
```

```typescript
// src/routes/api/contact/+server.ts
import { DATABASE_URL, API_SECRET } from '$env/static/private';
```

### `$env/dynamic/public` and `$env/dynamic/private`

For environment variables that should be read at **runtime** (not embedded at build time):

```typescript
import { env } from '$env/dynamic/private';

const dbUrl = env.DATABASE_URL; // read at request time, not build time
```

### `.env` File Conventions

```
.env                  ← Always loaded
.env.local            ← Always loaded, gitignored
.env.development      ← Loaded in dev mode
.env.production       ← Loaded in production builds
```

---

## Modules and Aliases

SvelteKit provides built-in path aliases and module conventions for organizing shared code.

### `$lib` — The Library Alias

The `$lib` alias points to `src/lib/`. Use it for shared components, utilities, types, and data.

```typescript
// Instead of fragile relative imports:
import { Button } from '../../../lib/components/Button.svelte';

// Use the $lib alias:
import { Button } from '$lib/components';
import type { Service } from '$lib/types';
import { services } from '$lib/data/services';
import { fadeIn } from '$lib/utils/animations';
```

ShipForge's `$lib` structure:

```
src/lib/
├── components/       # Reusable UI components
│   ├── Button.svelte
│   ├── Card.svelte
│   ├── Nav.svelte
│   ├── Footer.svelte
│   ├── ServiceCard.svelte
│   ├── BlogCard.svelte
│   ├── CaseStudyCard.svelte
│   ├── SectionHeader.svelte
│   ├── StatCounter.svelte
│   ├── SEOHead.svelte
│   └── index.ts      # Barrel export
├── data/             # Static data files
│   ├── services.ts
│   ├── blog-posts.ts
│   ├── case-studies.ts
│   └── navigation.ts
├── types/            # TypeScript type definitions
│   └── index.ts
└── utils/            # Utility functions
    ├── animations.ts
    ├── gsap.ts
    └── seo.ts
```

### Barrel Exports

The `index.ts` file in `components/` re-exports all components for clean imports:

```typescript
// src/lib/components/index.ts
export { default as Button } from './Button.svelte';
export { default as Card } from './Card.svelte';
export { default as Nav } from './Nav.svelte';
export { default as Footer } from './Footer.svelte';
// ...
```

```svelte
<!-- Clean single import -->
<script lang="ts">
	import { Button, Card, SectionHeader } from '$lib/components';
</script>
```

### `$app` Modules

SvelteKit provides built-in `$app` modules:

| Module | Purpose |
|---|---|
| `$app/navigation` | `goto()`, `invalidate()`, `beforeNavigate()`, `afterNavigate()` |
| `$app/stores` | `page`, `navigating`, `updated` stores |
| `$app/forms` | `enhance` action for progressive form enhancement |
| `$app/environment` | `browser`, `dev`, `building` boolean flags |
| `$app/paths` | `base`, `assets` path prefixes |

```svelte
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Programmatic navigation
	function handleLogin() {
		goto('/dashboard');
	}

	// Check current path
	let isActive = $derived($page.url.pathname === '/about');

	// Client-side only code
	if (browser) {
		console.log('Running in the browser');
	}
</script>
```

### Custom Aliases

You can add custom path aliases in `svelte.config.js`:

```javascript
export default {
	kit: {
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$styles: 'src/styles'
		}
	}
};
```

---

## Preloading and Prefetching

SvelteKit can preload page data before the user navigates, making transitions feel instant.

### `data-sveltekit-preload-data`

Preloads data (runs the `load` function) when the user hovers over or touches a link:

```svelte
<!-- Preload on hover (default for internal links) -->
<a href="/about" data-sveltekit-preload-data="hover">About</a>

<!-- Preload when the link enters the viewport -->
<a href="/services" data-sveltekit-preload-data="tap">Services</a>
```

You can set this globally on a parent element:

```svelte
<!-- src/routes/+layout.svelte -->
<div data-sveltekit-preload-data="hover">
	{@render children()}
</div>
```

### `data-sveltekit-preload-code`

Preloads the JavaScript code for a route (but not its data):

```svelte
<a href="/blog" data-sveltekit-preload-code="hover">Blog</a>

<!-- Eagerly preload code when the page loads -->
<a href="/blog" data-sveltekit-preload-code="eager">Blog</a>
```

### Programmatic Preloading

```typescript
import { preloadData, preloadCode } from '$app/navigation';

// Preload both code and data for a route
await preloadData('/about');

// Preload only the code
await preloadCode('/about');
```

### `data-sveltekit-reload`

Force a full-page reload instead of client-side navigation:

```svelte
<a href="/external-page" data-sveltekit-reload>Full Reload</a>
```

### `data-sveltekit-noscroll`

Prevent SvelteKit from scrolling to the top after navigation:

```svelte
<a href="/blog?page=2" data-sveltekit-noscroll>Page 2</a>
```

---

## Summary: How It All Fits Together

A typical SvelteKit request lifecycle:

```
1. User requests /services
2. SvelteKit matches src/routes/services/+page.svelte
3. Runs +layout.ts load() → returns { siteTitle, siteDescription }
4. Runs +page.ts load()   → returns { services }
5. Renders +layout.svelte with children = +page.svelte
6. Page receives merged data = { siteTitle, siteDescription, services }
7. Sends HTML to browser (SSR) or navigates client-side (SPA)
```

For a prerendered site like ShipForge, this all happens at **build time**, and the output is static HTML files served from a CDN.

---

*This guide references the ShipForge project structure. Explore the `src/routes/` and `src/lib/` directories to see these patterns in action.*
