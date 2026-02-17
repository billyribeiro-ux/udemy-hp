# SEO 2026 Playbook — SvelteKit Edition

> A comprehensive, implementation-ready SEO guide for building high-ranking SvelteKit sites in 2026.

---

## Table of Contents

1. [Technical SEO for SvelteKit](#1-technical-seo-for-sveltekit)
2. [Core Web Vitals](#2-core-web-vitals)
3. [SSR vs Prerendering for SEO](#3-ssr-vs-prerendering-for-seo)
4. [Meta Tag Architecture](#4-meta-tag-architecture)
5. [Schema.org Structured Data](#5-schemaorg-structured-data)
6. [Internal Linking Strategy](#6-internal-linking-strategy)
7. [URL Structure](#7-url-structure)
8. [Image SEO](#8-image-seo)
9. [Mobile-First Indexing](#9-mobile-first-indexing)
10. [Page Speed Optimization](#10-page-speed-optimization)
11. [robots.txt and Sitemap](#11-robotstxt-and-sitemap)
12. [Content Strategy](#12-content-strategy)
13. [Monitoring and Tools](#13-monitoring-and-tools)

---

## 1. Technical SEO for SvelteKit

### Why SvelteKit Is SEO-Friendly

SvelteKit provides server-side rendering (SSR) out of the box, which means search engine crawlers receive fully rendered HTML on the initial request. Unlike client-side-only frameworks, SvelteKit pages are indexable without requiring JavaScript execution by the crawler.

### Crawlability Fundamentals

- **Every indexable page must return full HTML from the server.** SvelteKit's default SSR mode handles this automatically.
- **Avoid client-only data fetching for above-the-fold content.** Use `+page.server.ts` or `+page.ts` with `load` functions so content is rendered server-side.
- **Ensure clean HTTP status codes.** Return proper `404` for missing pages and `301`/`308` for permanent redirects.

### SvelteKit Routing and SEO

```ts
// src/routes/services/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const service = await getService(params.slug);

  if (!service) {
    throw error(404, 'Service not found');
  }

  return {
    service,
    meta: {
      title: `${service.name} | Our Services`,
      description: service.excerpt,
      canonical: `https://example.com/services/${params.slug}`
    }
  };
};
```

### Redirect Handling

```ts
// src/routes/old-page/+page.server.ts
import { redirect } from '@sveltejs/kit';

export const load = () => {
  throw redirect(301, '/new-page');
};
```

### Custom Error Pages

```svelte
<!-- src/routes/+error.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Page Not Found</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main>
  <h1>{$page.status}</h1>
  <p>{$page.error?.message ?? 'Something went wrong.'}</p>
  <a href="/">Return to homepage</a>
</main>
```

### Trailing Slashes

Consistency matters. Pick one approach and stick with it.

```ts
// svelte.config.js
const config = {
  kit: {
    trailingSlash: 'never' // or 'always' — just be consistent
  }
};
```

---

## 2. Core Web Vitals

Google uses three Core Web Vitals as ranking signals. As of 2026, these remain critical.

### Largest Contentful Paint (LCP)

**Target:** under 2.5 seconds.

LCP measures how quickly the largest visible element (typically a hero image or heading block) renders.

**Optimization strategies:**

- Preload hero images with `<link rel="preload">`.
- Use SSR so the largest text block is in the initial HTML.
- Minimize render-blocking CSS and JS.
- Use `fetchpriority="high"` on hero images.

```svelte
<svelte:head>
  <link
    rel="preload"
    as="image"
    href="/images/hero.webp"
    fetchpriority="high"
  />
</svelte:head>

<img
  src="/images/hero.webp"
  alt="Hero banner describing our core service"
  width="1200"
  height="630"
  fetchpriority="high"
  decoding="async"
/>
```

### Interaction to Next Paint (INP)

**Target:** under 200 milliseconds.

INP replaced FID in 2024. It measures responsiveness across all interactions, not just the first one.

**Optimization strategies:**

- Break up long tasks. Avoid blocking the main thread for more than 50ms.
- Use `requestAnimationFrame` or `setTimeout` to defer non-critical UI updates.
- Minimize reactive computations in Svelte components that trigger on every keystroke.
- Avoid synchronous layout thrashing (reading then writing DOM properties in a loop).

```ts
// Debounce search input to avoid blocking INP
function debounce(fn: Function, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
```

### Cumulative Layout Shift (CLS)

**Target:** under 0.1.

CLS measures visual stability. Elements that jump around after the page loads hurt this score.

**Optimization strategies:**

- Always set explicit `width` and `height` on images and videos.
- Reserve space for dynamic content (ads, embeds, lazy-loaded sections).
- Use CSS `aspect-ratio` for responsive media.
- Avoid injecting content above existing content after load.
- Use `font-display: swap` with proper font size fallbacks.

```css
/* Prevent layout shift from web fonts */
@font-face {
  font-family: 'Brand';
  src: url('/fonts/brand.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 20%;
}

/* Reserve space for images */
img {
  max-width: 100%;
  height: auto;
  aspect-ratio: attr(width) / attr(height);
}
```

---

## 3. SSR vs Prerendering for SEO

SvelteKit offers both SSR (server-side rendering at request time) and prerendering (static HTML generated at build time). Both produce crawler-friendly HTML.

### When to Use Prerendering

Prerendering is ideal for pages whose content does not change per request:

- Marketing/landing pages
- Blog posts
- Documentation
- About, contact, legal pages

```ts
// src/routes/about/+page.ts
export const prerender = true;
```

**SEO advantage:** Prerendered pages are served instantly from a CDN. Faster TTFB means better LCP.

### When to Use SSR

SSR is required when the page content depends on the request (user session, query parameters, real-time data):

- Personalized dashboards
- Search results pages
- Pages with real-time inventory or pricing

```ts
// src/routes/search/+page.server.ts
export const prerender = false; // default, but explicit is good

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  const results = await search(query);
  return { results, query };
};
```

### Hybrid Approach

Use prerendering for the majority of the site and SSR only where truly needed. SvelteKit handles this per-route.

```ts
// src/routes/+layout.ts
export const prerender = true; // default: prerender everything

// Then override in specific routes:
// src/routes/dashboard/+page.ts
export const prerender = false;
```

### SEO Comparison Table

| Factor           | Prerendering         | SSR                  |
| ---------------- | -------------------- | -------------------- |
| TTFB             | Excellent (CDN)      | Good (server)        |
| Content freshness| Build-time           | Request-time         |
| Crawlability     | Excellent            | Excellent            |
| Scalability      | Excellent            | Depends on infra     |
| Dynamic content  | Not supported        | Fully supported      |

---

## 4. Meta Tag Architecture

### The SEO Head Component

Create a reusable component for consistent meta tags across all pages.

```svelte
<!-- src/lib/components/SeoHead.svelte -->
<script lang="ts">
  interface Props {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string;
    ogType?: string;
    noindex?: boolean;
    jsonLd?: Record<string, any>;
  }

  let {
    title,
    description,
    canonical,
    ogImage = 'https://example.com/og-default.jpg',
    ogType = 'website',
    noindex = false,
    jsonLd
  }: Props = $props();

  const siteName = 'Your Brand';
  const fullTitle = `${title} | ${siteName}`;
</script>

<svelte:head>
  <!-- Primary -->
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />

  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  {/if}

  <!-- Open Graph -->
  <meta property="og:type" content={ogType} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content={siteName} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- JSON-LD Structured Data -->
  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
  {/if}
</svelte:head>
```

### Using the SEO Head Component

```svelte
<!-- src/routes/services/web-design/+page.svelte -->
<script lang="ts">
  import SeoHead from '$lib/components/SeoHead.svelte';

  let { data } = $props();
</script>

<SeoHead
  title="Web Design Services"
  description="Custom web design that converts visitors into customers. Responsive, fast, and built for growth."
  canonical="https://example.com/services/web-design"
  ogImage="https://example.com/images/og-web-design.jpg"
  ogType="website"
  jsonLd={{
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Web Design',
    provider: {
      '@type': 'Organization',
      name: 'Your Brand'
    },
    description: 'Custom web design that converts visitors into customers.'
  }}
/>
```

### Essential Meta Tags Checklist

| Tag                          | Required | Purpose                        |
| ---------------------------- | -------- | ------------------------------ |
| `<title>`                    | Yes      | Page title in SERPs            |
| `meta description`          | Yes      | Snippet text in SERPs          |
| `link canonical`            | Yes      | Prevents duplicate content     |
| `meta robots`               | Yes      | Crawl/index directives         |
| `og:title`                  | Yes      | Social sharing title           |
| `og:description`            | Yes      | Social sharing description     |
| `og:image`                  | Yes      | Social sharing image           |
| `og:url`                    | Yes      | Canonical URL for social       |
| `twitter:card`              | Yes      | Twitter card type              |
| `meta viewport`             | Yes      | Mobile rendering (in app.html) |
| `link hreflang`             | If i18n  | Language targeting             |

---

## 5. Schema.org Structured Data

Structured data helps search engines understand your content and enables rich results (stars, FAQs, breadcrumbs, etc.).

### Organization Schema (site-wide)

```ts
// src/lib/seo/schemas.ts
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Brand',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    sameAs: [
      'https://twitter.com/yourbrand',
      'https://linkedin.com/company/yourbrand',
      'https://github.com/yourbrand'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-000-0000',
      contactType: 'customer service',
      availableLanguage: 'English'
    }
  };
}
```

### Local Business Schema

```ts
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Your Brand',
    image: 'https://example.com/office.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'Your City',
      addressRegion: 'ST',
      postalCode: '12345',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.7128,
      longitude: -74.006
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    telephone: '+1-555-000-0000',
    url: 'https://example.com',
    priceRange: '$$'
  };
}
```

### FAQ Schema

```ts
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
```

### Breadcrumb Schema

```ts
export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
```

### Article Schema (for blog posts)

```ts
export function articleSchema(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.authorName
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Brand',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    }
  };
}
```

### Service Schema

```ts
export function serviceSchema(service: {
  name: string;
  description: string;
  url: string;
  image?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    image: service.image,
    provider: {
      '@type': 'Organization',
      name: 'Your Brand',
      url: 'https://example.com'
    },
    areaServed: service.areaServed ?? 'Worldwide'
  };
}
```

### Testing Structured Data

- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema Markup Validator:** https://validator.schema.org/
- Validate after every deployment by spot-checking key pages.

---

## 6. Internal Linking Strategy

Internal links distribute page authority and help crawlers discover content.

### Principles

1. **Every page should be reachable within 3 clicks from the homepage.**
2. **Use descriptive anchor text.** "Learn more about our web design services" is better than "click here."
3. **Link contextually from content**, not just from navigation.
4. **Create topic clusters:** a pillar page links to related subpages, and each subpage links back.

### Breadcrumb Navigation Component

```svelte
<!-- src/lib/components/Breadcrumbs.svelte -->
<script lang="ts">
  import { breadcrumbSchema } from '$lib/seo/schemas';

  interface Crumb {
    label: string;
    href: string;
  }

  interface Props {
    crumbs: Crumb[];
  }

  let { crumbs }: Props = $props();

  const schemaItems = crumbs.map((c) => ({ name: c.label, url: c.href }));
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema(schemaItems))}</script>`}
</svelte:head>

<nav aria-label="Breadcrumb">
  <ol>
    {#each crumbs as crumb, i}
      <li>
        {#if i < crumbs.length - 1}
          <a href={crumb.href}>{crumb.label}</a>
          <span aria-hidden="true">/</span>
        {:else}
          <span aria-current="page">{crumb.label}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
```

### Related Content Links

At the bottom of every service page or blog post, include related links:

```svelte
<section>
  <h2>Related Services</h2>
  <ul>
    {#each relatedServices as service}
      <li>
        <a href="/services/{service.slug}">{service.name}</a>
        <p>{service.excerpt}</p>
      </li>
    {/each}
  </ul>
</section>
```

### Sitemap-Driven Link Audit

Regularly compare your sitemap entries against actual internal links. Pages listed in the sitemap but not linked from any other page are "orphaned" and will struggle to rank.

---

## 7. URL Structure

### Best Practices

- **Lowercase only.** `/services/web-design` not `/Services/Web-Design`.
- **Hyphens, not underscores.** `/case-studies` not `/case_studies`.
- **Short and descriptive.** `/blog/sveltekit-seo-guide` not `/blog/2026/02/17/the-ultimate-guide-to-seo-with-sveltekit`.
- **No file extensions.** `/about` not `/about.html`.
- **Consistent trailing slashes.** Configure once in `svelte.config.js`.
- **No special characters or encoded spaces.**

### Recommended URL Hierarchy

```
/                           -> Homepage
/services                   -> Services overview
/services/web-design        -> Individual service
/case-studies               -> Case studies listing
/case-studies/acme-redesign -> Individual case study
/blog                       -> Blog listing
/blog/sveltekit-seo-guide   -> Individual blog post
/about                      -> About page
/contact                    -> Contact page
/resources                  -> Resources / lead magnets
/resources/seo-checklist    -> Individual resource
```

### Handling URL Changes (Redirects)

Never change a URL without setting up a `301` redirect from the old URL to the new one. Lost backlinks and 404 errors hurt rankings.

```ts
// src/hooks.server.ts
const redirects: Record<string, string> = {
  '/old-services': '/services',
  '/team': '/about',
  '/portfolio': '/case-studies'
};

export const handle = async ({ event, resolve }) => {
  const redirect = redirects[event.url.pathname];
  if (redirect) {
    return new Response(null, {
      status: 301,
      headers: { Location: redirect }
    });
  }
  return resolve(event);
};
```

---

## 8. Image SEO

### Image Optimization Pipeline

1. **Format:** Use WebP or AVIF. Fall back to JPEG for older browsers.
2. **Sizing:** Serve images at the exact size needed, not larger.
3. **Compression:** Target 80-85% quality for WebP.
4. **Lazy loading:** Use `loading="lazy"` for below-the-fold images.
5. **Eager loading:** Use `loading="eager"` and `fetchpriority="high"` for hero/LCP images.

### Responsive Images

```svelte
<picture>
  <source
    srcset="/images/hero-400.avif 400w, /images/hero-800.avif 800w, /images/hero-1200.avif 1200w"
    type="image/avif"
  />
  <source
    srcset="/images/hero-400.webp 400w, /images/hero-800.webp 800w, /images/hero-1200.webp 1200w"
    type="image/webp"
  />
  <img
    src="/images/hero-800.jpg"
    alt="Descriptive alt text explaining the image content"
    width="1200"
    height="630"
    loading="eager"
    fetchpriority="high"
    decoding="async"
    sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px"
  />
</picture>
```

### Alt Text Best Practices

- **Be descriptive and specific.** "Team meeting in a modern office with whiteboards" not "photo."
- **Include keywords naturally, but do not stuff.**
- **Leave alt empty (`alt=""`) for purely decorative images.** Screen readers will skip them.
- **Keep alt text under 125 characters.**

### Image File Naming

Use descriptive, hyphenated filenames:
- `sveltekit-seo-architecture-diagram.webp` (good)
- `IMG_20260217_001.jpg` (bad)

---

## 9. Mobile-First Indexing

Google indexes the mobile version of your site first. The desktop version is secondary.

### Requirements

- **Responsive design is mandatory.** Use CSS media queries or container queries.
- **Same content on mobile and desktop.** Do not hide content on mobile that exists on desktop.
- **Tap targets must be at least 48x48px** with adequate spacing.
- **Font size minimum: 16px** for body text to avoid forced zoom.
- **No horizontal scrolling.** Test at 320px width minimum.
- **Viewport meta tag is required:**

```html
<!-- src/app.html -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Testing

- Chrome DevTools device mode
- Google Mobile-Friendly Test
- Real device testing (iOS Safari, Android Chrome)

---

## 10. Page Speed Optimization

### SvelteKit-Specific Optimizations

#### Code Splitting (Automatic)

SvelteKit automatically code-splits per route. Each page only loads the JavaScript it needs.

#### Preloading

SvelteKit preloads linked pages on hover by default with `data-sveltekit-preload-data`:

```svelte
<!-- Preloads on hover (default) -->
<a href="/services">Services</a>

<!-- Preloads on viewport entry (for key navigation) -->
<a href="/services" data-sveltekit-preload-data="tap">Services</a>
```

#### Asset Optimization

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2022'
  }
});
```

#### Font Loading

```html
<!-- src/app.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preload"
  as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
/>
```

Self-hosting fonts is preferred for performance:

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

#### Caching Headers

```ts
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  // Cache static assets aggressively
  if (event.url.pathname.startsWith('/images/') ||
      event.url.pathname.startsWith('/fonts/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }

  return response;
};
```

### Performance Budget

| Metric               | Target          |
| -------------------- | --------------- |
| Total page weight    | Under 500 KB    |
| JavaScript bundle    | Under 150 KB    |
| CSS bundle           | Under 50 KB     |
| Hero image           | Under 200 KB    |
| Time to First Byte   | Under 200 ms    |
| LCP                  | Under 2.5 s     |
| INP                  | Under 200 ms    |
| CLS                  | Under 0.1       |

---

## 11. robots.txt and Sitemap

### robots.txt

```
# /static/robots.txt

User-agent: *
Allow: /

# Block admin/internal routes
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# Sitemap location
Sitemap: https://example.com/sitemap.xml
```

Place this file in `static/robots.txt` so SvelteKit serves it at the root.

### Dynamic XML Sitemap

```ts
// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const staticPages = [
    '',
    '/services',
    '/services/web-design',
    '/services/seo',
    '/services/branding',
    '/about',
    '/contact',
    '/blog',
    '/case-studies',
    '/resources'
  ];

  // Fetch dynamic pages
  const blogPosts = await getBlogPosts();
  const caseStudies = await getCaseStudies();

  const pages = [
    ...staticPages.map((path) => ({
      url: `https://example.com${path}`,
      lastmod: '2026-02-17',
      changefreq: 'monthly',
      priority: path === '' ? '1.0' : '0.8'
    })),
    ...blogPosts.map((post) => ({
      url: `https://example.com/blog/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: 'yearly',
      priority: '0.6'
    })),
    ...caseStudies.map((study) => ({
      url: `https://example.com/case-studies/${study.slug}`,
      lastmod: study.updatedAt,
      changefreq: 'yearly',
      priority: '0.7'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
```

### Sitemap Index (for large sites)

If your site has more than 50,000 URLs, split into multiple sitemaps and use a sitemap index:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2026-02-17</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
    <lastmod>2026-02-17</lastmod>
  </sitemap>
</sitemapindex>
```

---

## 12. Content Strategy

### Keyword Research Process

1. **Seed keywords:** Start with the core services you offer.
2. **Expand:** Use tools like Ahrefs, Semrush, or Google Keyword Planner.
3. **Classify intent:** Informational, navigational, commercial, transactional.
4. **Map to pages:** Each target keyword (or cluster) maps to exactly one page.

### Content Types and Their SEO Role

| Content Type      | SEO Role                              | Update Frequency |
| ----------------- | ------------------------------------- | ---------------- |
| Service pages     | Target commercial keywords            | Quarterly        |
| Blog posts        | Target informational long-tail        | Weekly/biweekly  |
| Case studies      | Build authority and trust signals     | Monthly          |
| Resource pages    | Earn backlinks, generate leads        | As created       |
| FAQ sections      | Target question-based queries         | Quarterly        |
| Landing pages     | Target high-intent conversion terms   | Per campaign     |

### Content Depth Guidelines

- **Service pages:** 800-1500 words. Cover what, why, how, who it is for, process, and FAQs.
- **Blog posts:** 1500-3000 words for pillar content. 800-1200 words for supporting posts.
- **Case studies:** 600-1200 words. Focus on challenge, solution, results with real numbers.

### Topic Cluster Model

```
Pillar Page: /services/seo
  |-- /blog/technical-seo-checklist
  |-- /blog/keyword-research-guide
  |-- /blog/link-building-strategies
  |-- /blog/local-seo-tips
  |-- /case-studies/seo-results-acme
  |-- /resources/seo-audit-template
```

Each supporting page links back to the pillar page. The pillar page links to each supporting page.

### Content Freshness

- Audit existing content quarterly.
- Update statistics, examples, and dates.
- Add new sections as the topic evolves.
- Update `dateModified` in structured data and sitemaps.

---

## 13. Monitoring and Tools

### Essential Tools

| Tool                           | Purpose                                    |
| ------------------------------ | ------------------------------------------ |
| Google Search Console          | Index coverage, search performance, errors |
| Google Analytics 4             | Traffic, engagement, conversions           |
| Google PageSpeed Insights      | Core Web Vitals, performance audit         |
| Chrome DevTools Lighthouse     | Local performance/SEO audits               |
| Ahrefs / Semrush               | Keyword tracking, backlink monitoring      |
| Screaming Frog                 | Technical crawl audits                     |
| Schema Markup Validator        | Structured data validation                 |
| web.dev Measure                | CWV and best practices scoring             |

### Monthly SEO Audit Checklist

- [ ] Check Google Search Console for crawl errors and index coverage.
- [ ] Review Core Web Vitals in Search Console (field data).
- [ ] Run Lighthouse on the top 5 landing pages.
- [ ] Verify all pages in the sitemap return 200 status codes.
- [ ] Check for broken internal and external links.
- [ ] Review keyword rankings for target terms.
- [ ] Audit new content for proper meta tags and structured data.
- [ ] Test mobile rendering on real devices.
- [ ] Review page speed for any regressions.
- [ ] Check robots.txt is accessible and correct.

### Setting Up Analytics in SvelteKit

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  // Track page views on navigation
  $effect(() => {
    if (browser && typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_path: $page.url.pathname,
        page_title: document.title
      });
    }
  });
</script>
```

### Automated Monitoring

Set up alerts for:

- **Indexing drops:** If indexed page count drops by more than 10%, investigate immediately.
- **CWV regressions:** If any metric crosses the "needs improvement" threshold.
- **404 spikes:** New broken links appearing in Search Console.
- **Ranking drops:** Significant position changes for target keywords.

---

## Quick Reference: SEO Launch Checklist

Before launching any new page or site update:

- [ ] Title tag is unique, under 60 characters, includes target keyword
- [ ] Meta description is compelling, under 155 characters, includes target keyword
- [ ] Canonical URL is set and correct
- [ ] H1 is unique and matches the page topic
- [ ] Images have descriptive alt text, width/height attributes, and are optimized
- [ ] Internal links use descriptive anchor text
- [ ] Structured data is valid (test with Google's tool)
- [ ] Page is included in the sitemap
- [ ] Page loads in under 3 seconds on mobile
- [ ] No console errors or broken resources
- [ ] Mobile layout is correct at 320px, 375px, 768px, and 1024px
- [ ] robots meta tag is set to `index, follow` (unless intentionally noindexed)
- [ ] Open Graph image is set and displays correctly when shared

---

*Last updated: 2026-02-17*
