# Deployment Runbook — udemy-hp

> Last updated: 2026-02-17

---

## Table of Contents

1. [Pre-Deployment Checklist](#1-pre-deployment-checklist)
2. [Build Verification](#2-build-verification)
3. [Adapter Configuration](#3-adapter-configuration)
4. [Environment Variables](#4-environment-variables)
5. [Static Assets](#5-static-assets)
6. [DNS & Domain Configuration](#6-dns--domain-configuration)
7. [SSL/TLS](#7-ssltls)
8. [Deployment Commands](#8-deployment-commands)
9. [Post-Deployment Verification](#9-post-deployment-verification)
10. [Rollback Procedure](#10-rollback-procedure)
11. [Monitoring](#11-monitoring)
12. [Incident Response](#12-incident-response)

---

## 1. Pre-Deployment Checklist

Complete every item before proceeding to deploy.

### Code Quality

- [ ] All changes merged to the release branch
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm check` (svelte-check) passes with zero errors
- [ ] No `console.log` or `console.debug` in production code
- [ ] No `TODO`/`FIXME` comments for this release

### Testing

- [ ] `pnpm test:unit -- --run` — all unit and component tests pass
- [ ] `pnpm test:e2e` — all E2E tests pass
- [ ] Manual QA at 375px, 768px, 1280px viewports
- [ ] Cross-browser verified (Chrome, Firefox, Safari)
- [ ] Lighthouse Performance >= 90 on key pages

### Content

- [ ] All placeholder content replaced
- [ ] Legal pages reviewed (privacy, terms, disclaimer)
- [ ] Contact form endpoint configured and tested
- [ ] Lead magnet form verified end-to-end
- [ ] All images optimized (WebP/AVIF, compressed)
- [ ] Favicon renders in all browsers

### SEO

- [ ] Unique `<title>` and `<meta description>` on every page
- [ ] Open Graph meta tags present and valid
- [ ] `robots.txt` is correct (`static/robots.txt`)
- [ ] Sitemap generated or will be generated at build
- [ ] Canonical URLs set correctly

### Security

- [ ] No secrets or API keys in source code
- [ ] `.env` files excluded from version control (verified in `.gitignore`)
- [ ] Dependencies audited: `pnpm audit`
- [ ] CSP headers planned (if applicable)

---

## 2. Build Verification

### Run a Production Build Locally

```bash
# Clean previous build artifacts
rm -rf .svelte-kit build .vercel .netlify

# Build
pnpm build

# Preview the production build
pnpm preview
```

### Verify Build Output

```bash
# Check the build completed without errors
# Look for any warnings in the terminal output, especially:
#   - Prerender 404 warnings
#   - Missing module warnings
#   - Large chunk warnings (> 500KB)
```

### Test the Preview Server

Open `http://localhost:4173` and verify:

- [ ] Homepage loads correctly
- [ ] All routes are accessible
- [ ] Navigation works (client-side routing)
- [ ] Forms function correctly
- [ ] Images and fonts load
- [ ] GSAP animations play
- [ ] No console errors

### Bundle Size Check

```bash
# Analyze bundle (if vite-bundle-visualizer is installed)
npx vite-bundle-visualizer

# Or check the build output directory size
du -sh build/
```

Target: Total JS bundle < 200KB gzipped.

---

## 3. Adapter Configuration

The project currently uses `@sveltejs/adapter-auto`. For production, switch to a specific adapter.

### Option A: Vercel (Recommended for dynamic features)

```bash
pnpm add -D @sveltejs/adapter-vercel
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';

const config = {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
      regions: ['iad1'], // US East (adjust as needed)
      split: false
    })
  }
};
```

### Option B: Netlify

```bash
pnpm add -D @sveltejs/adapter-netlify
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-netlify';

const config = {
  kit: {
    adapter: adapter({
      edge: false,
      split: false
    })
  }
};
```

### Option C: Static (for fully static sites)

```bash
pnpm add -D @sveltejs/adapter-static
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: true,
      strict: true
    })
  }
};
```

Add to `src/routes/+layout.ts`:
```ts
export const prerender = true;
```

### Option D: Node (self-hosted)

```bash
pnpm add -D @sveltejs/adapter-node
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

const config = {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true
    })
  }
};
```

---

## 4. Environment Variables

### Required Variables

| Variable              | Description                          | Required | Example                          |
| --------------------- | ------------------------------------ | -------- | -------------------------------- |
| `PUBLIC_SITE_URL`     | Production site URL                  | Yes      | `https://example.com`            |
| `PUBLIC_GA_ID`        | Google Analytics measurement ID      | No       | `G-XXXXXXXXXX`                   |
| `CONTACT_FORM_API`    | Contact form submission endpoint     | Yes*     | `https://api.example.com/contact`|
| `LEAD_MAGNET_API`     | Lead magnet form endpoint            | Yes*     | `https://api.example.com/lead`   |

*If forms submit to external APIs.

### Setting Variables

**Vercel:**
```bash
vercel env add PUBLIC_SITE_URL production
# Enter value when prompted
```

Or via Vercel Dashboard: Project Settings > Environment Variables.

**Netlify:**
```bash
netlify env:set PUBLIC_SITE_URL "https://example.com"
```

Or via Netlify Dashboard: Site Settings > Environment Variables.

**Node/Docker:**
Create a `.env` file on the server (never commit this):
```env
PUBLIC_SITE_URL=https://example.com
CONTACT_FORM_API=https://api.example.com/contact
```

### Accessing in Code

```js
// Public variables (available on client and server)
import { env } from '$env/dynamic/public';
const siteUrl = env.PUBLIC_SITE_URL;

// Private variables (server-only)
import { env } from '$env/dynamic/private';
const apiKey = env.SECRET_API_KEY;
```

### Verification

```bash
# List all env vars in Vercel
vercel env ls

# List all env vars in Netlify
netlify env:list
```

---

## 5. Static Assets

### Asset Locations

| Asset Type       | Location                    | URL Path          |
| ---------------- | --------------------------- | ----------------- |
| Favicon          | `static/favicon.svg`        | `/favicon.svg`    |
| Robots.txt       | `static/robots.txt`         | `/robots.txt`     |
| Fonts            | `static/fonts/`             | `/fonts/`         |
| OG Images        | `static/og/`                | `/og/`            |
| Other images     | `src/lib/assets/`           | Hashed by Vite    |

### Pre-Deployment Asset Checklist

- [ ] `static/favicon.svg` present and correct
- [ ] `static/robots.txt` present with correct rules:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://example.com/sitemap.xml
  ```
- [ ] OG images are 1200x630px, < 1MB
- [ ] All images in `src/lib/assets/` are optimized
- [ ] No large unoptimized files (check with `du -sh static/*`)

### Cache Headers

For Vercel, add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/_app/immutable/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

For Netlify, add to `netlify.toml`:
```toml
[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_app/immutable/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 6. DNS & Domain Configuration

### Vercel

1. Add the domain in Vercel Dashboard: Project Settings > Domains
2. Update DNS records at your registrar:

```
Type  Name    Value
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com
```

3. Wait for DNS propagation (up to 48 hours, usually minutes)

### Netlify

1. Add the domain in Netlify Dashboard: Domain Settings > Custom Domains
2. Update DNS records:

```
Type  Name    Value
A     @       75.2.60.5
CNAME www     your-site.netlify.app
```

Or use Netlify DNS for automatic configuration.

### Verification

```bash
# Check DNS propagation
dig example.com +short
dig www.example.com +short

# Check from multiple locations
nslookup example.com 8.8.8.8
nslookup example.com 1.1.1.1
```

---

## 7. SSL/TLS

### Automatic SSL (Vercel/Netlify)

Both Vercel and Netlify provide automatic SSL via Let's Encrypt. No manual configuration required.

**Verify after deployment:**
```bash
# Check SSL certificate
curl -vI https://example.com 2>&1 | grep -E "SSL|subject|expire"

# Check for mixed content
# Open browser DevTools > Console and look for mixed content warnings
```

### Self-Hosted (Node Adapter)

Use a reverse proxy (nginx, Caddy) for SSL termination:

**Caddy (automatic SSL):**
```
example.com {
  reverse_proxy localhost:3000
}
```

**nginx + certbot:**
```bash
sudo certbot --nginx -d example.com -d www.example.com
```

### SSL Checklist

- [ ] HTTPS works on `https://example.com`
- [ ] HTTPS works on `https://www.example.com`
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to non-www (or vice versa)
- [ ] SSL certificate is valid (check expiration)
- [ ] No mixed content warnings in browser console

---

## 8. Deployment Commands

### Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --prod --env PUBLIC_SITE_URL=https://example.com
```

**CI/CD (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test:unit -- --run
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Netlify

```bash
# Install Netlify CLI
pnpm add -g netlify-cli

# Login
netlify login

# Link to existing site
netlify link

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Static Hosting (S3, Cloudflare Pages, etc.)

```bash
# Build with static adapter
pnpm build

# Upload the build/ directory to your hosting provider
# Example: AWS S3
aws s3 sync build/ s3://your-bucket-name --delete

# Example: Cloudflare Pages (via wrangler)
npx wrangler pages deploy build/
```

### Node (Self-Hosted)

```bash
# Build
pnpm build

# The output is in build/
# Copy to server
rsync -avz build/ user@server:/opt/udemy-hp/

# On the server
cd /opt/udemy-hp
node build/index.js
# Or use PM2
pm2 start build/index.js --name udemy-hp
```

---

## 9. Post-Deployment Verification

Run through this checklist immediately after deploying.

### Smoke Tests (< 5 minutes)

- [ ] Homepage loads at `https://example.com`
- [ ] All navigation links work
- [ ] Contact page loads and form renders
- [ ] Lead magnet page loads
- [ ] Legal pages load (privacy, terms, disclaimer)
- [ ] No console errors in browser DevTools
- [ ] Favicon appears in browser tab

### Functional Tests (< 15 minutes)

- [ ] Contact form submits successfully
- [ ] Lead magnet form submits and redirects to thank-you
- [ ] GSAP animations play on scroll
- [ ] Mobile navigation toggle works
- [ ] All images load correctly
- [ ] Fonts render correctly

### Performance Check

```bash
# Run Lighthouse from CLI
npx lighthouse https://example.com --output=json --output-path=./post-deploy-lighthouse.json

# Quick check
npx lighthouse https://example.com --only-categories=performance --quiet
```

- [ ] Lighthouse Performance >= 90
- [ ] No large uncompressed resources
- [ ] TTFB < 600ms

### SEO Verification

```bash
# Check robots.txt
curl https://example.com/robots.txt

# Check sitemap
curl https://example.com/sitemap.xml

# Check Open Graph (use social sharing debuggers)
# Facebook: https://developers.facebook.com/tools/debug/
# Twitter: https://cards-dev.twitter.com/validator
# LinkedIn: https://www.linkedin.com/post-inspector/
```

- [ ] `robots.txt` accessible and correct
- [ ] Sitemap accessible and lists all pages
- [ ] OG tags render correctly in social preview tools

### Monitoring Activation

- [ ] Uptime monitoring configured and verified
- [ ] Error tracking capturing events (if set up)
- [ ] Analytics receiving data

---

## 10. Rollback Procedure

### Vercel

```bash
# List recent deployments
vercel ls

# Promote a previous deployment to production
vercel promote <deployment-url>

# Example
vercel promote udemy-hp-abc123.vercel.app
```

Or via Dashboard: Deployments > Find the last working deployment > "..." menu > Promote to Production.

### Netlify

```bash
# List deploys
netlify deploys

# Roll back via Dashboard:
# Deploys > Find the last working deploy > "Publish deploy"
```

### Node (Self-Hosted)

```bash
# If using PM2
pm2 stop udemy-hp

# Restore previous build from backup
cp -r /opt/udemy-hp-backup/ /opt/udemy-hp/

# Restart
pm2 start udemy-hp
```

### Git-Based Rollback

```bash
# Find the last known good commit
git log --oneline -10

# Create a revert commit
git revert HEAD

# Or revert to a specific commit (creates new commit)
git revert <bad-commit-hash>

# Push and redeploy
git push origin main
```

**IMPORTANT:** Never force-push to main/production branches. Always create revert commits.

### Rollback Decision Matrix

| Severity | Action                              | Timeline        |
| -------- | ----------------------------------- | --------------- |
| Critical | Immediate rollback via platform     | < 5 minutes     |
| High     | Revert commit + redeploy            | < 15 minutes    |
| Medium   | Hotfix on new branch + deploy       | < 1 hour        |
| Low      | Fix in next scheduled release       | Next sprint     |

---

## 11. Monitoring

### Uptime Monitoring

Set up with a service like UptimeRobot, Pingdom, or Better Uptime:

| Check     | URL                          | Interval | Alert         |
| --------- | ---------------------------- | -------- | ------------- |
| Homepage  | `https://example.com`        | 1 min    | Email + Slack |
| API       | `https://example.com/api/health` | 5 min | Email + Slack |
| SSL       | `https://example.com`        | 1 day    | Email         |

### Error Tracking

Consider adding Sentry for runtime error tracking:

```bash
pnpm add @sentry/sveltekit
```

```js
// src/hooks.client.ts
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://your-dsn@sentry.io/project-id',
  tracesSampleRate: 0.1
});

export const handleError = Sentry.handleErrorWithSentry();
```

### Performance Monitoring

- Schedule weekly Lighthouse CI runs
- Track Core Web Vitals via Google Search Console
- Set up Real User Monitoring (RUM) if traffic warrants it

### Log Monitoring (Node Adapter)

```bash
# View PM2 logs
pm2 logs udemy-hp

# Stream logs
pm2 logs udemy-hp --lines 100

# Save log rotation config
pm2 install pm2-logrotate
```

---

## 12. Incident Response

### Severity Levels

| Level    | Definition                                           | Response Time |
| -------- | ---------------------------------------------------- | ------------- |
| SEV 1    | Site completely down, all users affected              | < 15 minutes  |
| SEV 2    | Major feature broken (forms, navigation), many users  | < 30 minutes  |
| SEV 3    | Minor feature broken, workaround exists              | < 4 hours     |
| SEV 4    | Cosmetic issue, low impact                           | Next business day |

### SEV 1: Site Down

1. **Verify:** Check from multiple locations (use uptime monitor, personal device, VPN)
2. **Identify:** Check deployment platform status page (Vercel Status, Netlify Status)
3. **Rollback:** If caused by a recent deployment, rollback immediately (see Section 10)
4. **DNS:** If DNS issue, check registrar and platform DNS settings
5. **Communicate:** Notify stakeholders
6. **Document:** Create incident report after resolution

### SEV 2: Major Feature Broken

1. **Verify:** Reproduce the issue
2. **Assess:** Determine if rollback is faster than hotfix
3. **Act:** Rollback or deploy hotfix
4. **Test:** Verify fix in production
5. **Document:** Update this runbook if a new failure mode was discovered

### Incident Report Template

```markdown
## Incident Report

**Date:** YYYY-MM-DD
**Duration:** HH:MM - HH:MM (X minutes)
**Severity:** SEV X
**Impact:** Description of user impact

### Timeline
- HH:MM — Issue detected by [monitoring/user report]
- HH:MM — Investigation started
- HH:MM — Root cause identified
- HH:MM — Fix deployed / rollback executed
- HH:MM — Verified resolved

### Root Cause
Description of what went wrong.

### Resolution
What was done to fix it.

### Action Items
- [ ] Action item 1 (owner, due date)
- [ ] Action item 2 (owner, due date)
```

---

## Quick Reference

### Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Static (build only)
pnpm build
```

### Emergency Rollback

```bash
# Vercel: promote previous deployment
vercel ls && vercel promote <previous-deployment-url>

# Git: revert last commit
git revert HEAD && git push origin main
```

### Health Checks

```bash
# Quick smoke test
curl -s -o /dev/null -w "%{http_code}" https://example.com

# Check all pages
for path in / /about /services /blog /case-studies /contact /lead-magnet /privacy /terms /disclaimer; do
  echo "$path: $(curl -s -o /dev/null -w '%{http_code}' https://example.com$path)"
done
```
