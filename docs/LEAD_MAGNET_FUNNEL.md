# Lead Magnet Funnel Documentation

> Complete specification for building, launching, and optimizing a lead magnet funnel — from the offer page through email delivery and conversion tracking.

---

## Table of Contents

1. [Funnel Overview](#1-funnel-overview)
2. [Offer Page Structure](#2-offer-page-structure)
3. [Form Implementation](#3-form-implementation)
4. [Success Flow](#4-success-flow)
5. [Thank-You Page Strategy](#5-thank-you-page-strategy)
6. [Email Integration Readiness](#6-email-integration-readiness)
7. [Conversion Tracking Plan](#7-conversion-tracking-plan)
8. [A/B Testing Opportunities](#8-ab-testing-opportunities)
9. [QA Checklist](#9-qa-checklist)
10. [Common Failures](#10-common-failures)

---

## 1. Funnel Overview

### What Is a Lead Magnet Funnel?

A lead magnet funnel is a sequence of pages and automated actions designed to exchange a valuable free resource for a visitor's contact information. The contact information then enters a nurturing sequence that builds trust and moves the prospect toward a paid engagement.

### The Full Funnel Path

```
Traffic Source
  |
  v
Offer Page (landing page with form)
  |
  v
Form Submission (data captured, sent to email platform)
  |
  v
Thank-You Page (confirmation + next step)
  |
  v
Email Delivery (lead magnet + welcome sequence)
  |
  v
Nurture Sequence (3-5 emails over 2 weeks)
  |
  v
Sales Conversation (book a call, request proposal)
```

### Traffic Sources

| Source              | Type     | Notes                                        |
| ------------------- | -------- | -------------------------------------------- |
| Blog posts          | Organic  | Inline CTAs and end-of-post offers           |
| Service pages       | Organic  | Related resource offers in sidebars or footers|
| Social media        | Organic  | Posts linking directly to the offer page      |
| Google Ads          | Paid     | Targeted landing page with no navigation      |
| LinkedIn Ads        | Paid     | Professional audience, B2B focus              |
| Email signature     | Direct   | Link in team email signatures                 |
| Partner referrals   | Referral | Co-branded or guest content                   |

### Key Metrics

| Metric                        | Target         | Definition                                  |
| ----------------------------- | -------------- | ------------------------------------------- |
| Offer page conversion rate    | 25-40%         | Submissions / unique page visitors           |
| Email open rate (delivery)    | 70%+           | Opens of the delivery email                  |
| Email click rate (delivery)   | 40%+           | Clicks on the download link                  |
| Nurture sequence open rate    | 30-50%         | Average across the full sequence             |
| Lead-to-call rate             | 5-15%          | Leads who book a discovery call              |
| Cost per lead (paid traffic)  | Under $15      | Ad spend / leads generated                   |

---

## 2. Offer Page Structure

The offer page is a focused landing page with one goal: get the visitor to submit the form.

### Page Layout

```
+---------------------------------------------+
|  HERO SECTION                               |
|  +------------------+  +-----------------+  |
|  |  Headline         |  |  Form           |  |
|  |  Subheadline      |  |  (Name, Email)  |  |
|  |  Bullet points    |  |  CTA Button     |  |
|  |  Trust element    |  |  Privacy note   |  |
|  +------------------+  +-----------------+  |
+---------------------------------------------+
|  WHAT'S INSIDE SECTION                      |
|  4-6 specific items the resource contains   |
+---------------------------------------------+
|  SOCIAL PROOF SECTION                       |
|  Testimonial or download count              |
+---------------------------------------------+
|  FAQ SECTION (2-3 questions)                |
|  "Is this really free?" "Who is this for?" |
+---------------------------------------------+
|  FINAL CTA SECTION                          |
|  Restated headline + form or scroll-to-form |
+---------------------------------------------+
```

### Copy Specifications

#### Headline
State the resource and its primary benefit.

> "The 47-Point SEO Checklist That Drives Real Results"

#### Subheadline
Add specificity and reduce friction.

> "The exact checklist our team uses with every client. Download it free — no signup required beyond your email."

#### Bullet Points (What's Inside)
4-6 bullets, each starting with a benefit or deliverable:

- The 10 technical fixes that move rankings the fastest
- A content audit template you can use immediately
- Core Web Vitals benchmarks with pass/fail thresholds
- Our recommended tool stack (most are free)
- A prioritized 30-day action plan

#### Trust Elements
- "Downloaded by 1,200+ business owners"
- "Used by our team on 50+ client projects"
- A short testimonial: "This checklist found 12 issues on our site we didn't know about." — Client Name

### Design Rules

1. **No main site navigation.** The offer page is a dead end by design. The only action is submit or leave.
2. **Form visible above the fold** on desktop. On mobile, it can be immediately below the hero copy.
3. **One color for the CTA button.** It should be the most visually prominent element.
4. **Minimal imagery.** A mockup of the resource (PDF cover, checklist preview) is fine. Avoid stock photos.
5. **Fast loading.** This page must have an LCP under 2 seconds. Strip unnecessary scripts and assets.

### SvelteKit Implementation

```ts
// src/routes/resources/seo-checklist/+page.ts
export const prerender = true;
```

```svelte
<!-- src/routes/resources/seo-checklist/+page.svelte -->
<script lang="ts">
  import SeoHead from '$lib/components/SeoHead.svelte';
  import LeadForm from '$lib/components/LeadForm.svelte';
</script>

<SeoHead
  title="Free SEO Checklist — 47 Actionable Items"
  description="Download the SEO checklist our team uses with every client. 47 items covering technical SEO, content, and performance."
  canonical="https://example.com/resources/seo-checklist"
  ogImage="https://example.com/images/og-seo-checklist.jpg"
/>

<main class="offer-page">
  <section class="hero">
    <div class="hero-copy">
      <h1>The 47-Point SEO Checklist That Drives Real Results</h1>
      <p class="subheadline">
        The exact checklist our team uses with every client. Free, no strings attached.
      </p>
      <ul class="benefits">
        <li>10 technical fixes that move rankings fastest</li>
        <li>Content audit template you can use today</li>
        <li>Core Web Vitals benchmarks and thresholds</li>
        <li>Recommended tools (most are free)</li>
        <li>Prioritized 30-day action plan</li>
      </ul>
      <p class="trust">Downloaded by 1,200+ business owners</p>
    </div>
    <div class="hero-form">
      <LeadForm
        resource="seo-checklist"
        ctaText="Download the Free Checklist"
      />
    </div>
  </section>

  <!-- Additional sections: What's Inside, Social Proof, FAQ, Final CTA -->
</main>
```

---

## 3. Form Implementation

### Form Fields

Keep the form as short as possible. Every additional field reduces conversion rate.

| Field        | Required | Type    | Notes                              |
| ------------ | -------- | ------- | ---------------------------------- |
| First Name   | Yes      | text    | Personalization in emails          |
| Email        | Yes      | email   | Primary contact and delivery method|
| Company      | No       | text    | Helps with lead qualification      |

For most lead magnets, **Name + Email is sufficient.** Only add Company if lead qualification is critical.

### Form Component

```svelte
<!-- src/lib/components/LeadForm.svelte -->
<script lang="ts">
  interface Props {
    resource: string;
    ctaText?: string;
  }

  let { resource, ctaText = 'Download Now' }: Props = $props();

  let firstName = $state('');
  let email = $state('');
  let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    status = 'submitting';
    errorMessage = '';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, resource })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? 'Something went wrong');
      }

      status = 'success';

      // Track conversion
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
          event_category: 'lead_magnet',
          event_label: resource
        });
      }

      // Redirect to thank-you page
      window.location.href = `/resources/${resource}/thank-you`;
    } catch (err) {
      status = 'error';
      errorMessage =
        err instanceof Error ? err.message : 'Please try again.';
    }
  }
</script>

<form onsubmit={handleSubmit} class="lead-form" novalidate>
  <div class="field">
    <label for="firstName">First Name</label>
    <input
      id="firstName"
      type="text"
      bind:value={firstName}
      required
      autocomplete="given-name"
      placeholder="Jane"
    />
  </div>

  <div class="field">
    <label for="email">Email Address</label>
    <input
      id="email"
      type="email"
      bind:value={email}
      required
      autocomplete="email"
      placeholder="jane@example.com"
    />
  </div>

  <button type="submit" disabled={status === 'submitting'}>
    {#if status === 'submitting'}
      Sending...
    {:else}
      {ctaText}
    {/if}
  </button>

  {#if status === 'error'}
    <p class="error" role="alert">{errorMessage}</p>
  {/if}

  <p class="privacy">
    We respect your privacy. No spam, ever. <a href="/privacy">Privacy Policy</a>
  </p>
</form>
```

### Server-Side API Endpoint

```ts
// src/routes/api/leads/+server.ts
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const { firstName, email, resource } = body;

  // Validation
  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    throw error(400, { message: 'First name is required.' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw error(400, { message: 'A valid email address is required.' });
  }

  if (!resource || typeof resource !== 'string') {
    throw error(400, { message: 'Resource identifier is required.' });
  }

  // Honeypot / bot detection (if a hidden field is filled, reject)
  // Rate limiting (by IP, max 5 submissions per hour)

  try {
    // 1. Store lead in database
    await storeLead({
      firstName: firstName.trim(),
      email: email.trim().toLowerCase(),
      resource,
      source: 'lead_magnet',
      createdAt: new Date().toISOString()
    });

    // 2. Send to email marketing platform (e.g., ConvertKit, Mailchimp, Resend)
    await addToEmailList({
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      tags: [`lead-magnet-${resource}`]
    });

    // 3. Trigger delivery email
    await sendDeliveryEmail({
      to: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      resource
    });

    return json({ success: true });
  } catch (err) {
    console.error('Lead capture failed:', err);
    throw error(500, { message: 'We could not process your request. Please try again.' });
  }
};
```

### Form Security

1. **Server-side validation.** Never trust client-side validation alone.
2. **Honeypot field.** Add a hidden field that bots will fill but humans will not.
3. **Rate limiting.** Max 5 submissions per IP per hour.
4. **CSRF protection.** SvelteKit handles this if you use form actions or validate the origin header.
5. **Input sanitization.** Strip HTML tags and limit field lengths.
6. **Email verification format.** Check for valid email format server-side.

### Honeypot Implementation

```svelte
<!-- Hidden field in the form — invisible to real users -->
<div style="position: absolute; left: -9999px;" aria-hidden="true">
  <label for="website">Website</label>
  <input id="website" type="text" name="website" tabindex="-1" autocomplete="off" />
</div>
```

On the server, reject any submission where the `website` field has a value.

---

## 4. Success Flow

### What Happens After Submission

The success flow must be seamless. Any friction here damages trust at the worst possible moment — right when the visitor has committed.

### Step-by-Step Flow

```
1. User clicks "Download" button
   -> Button shows "Sending..." state (disable to prevent double-submit)

2. Client sends POST to /api/leads
   -> Server validates data
   -> Server stores lead in database
   -> Server sends data to email marketing platform
   -> Server triggers delivery email
   -> Server returns 200 OK

3. Client receives success response
   -> Track conversion event (GA4, Meta Pixel, etc.)
   -> Redirect to thank-you page: /resources/{resource}/thank-you

4. Thank-you page loads
   -> Confirm the resource is on its way
   -> Present the next step (see Section 5)

5. Delivery email arrives (within 60 seconds)
   -> Contains download link
   -> Welcomes the subscriber
   -> Sets expectations for future emails
```

### Error Handling

| Error Type              | User-Facing Message                                   | Recovery Action                     |
| ----------------------- | ----------------------------------------------------- | ----------------------------------- |
| Validation error        | "Please enter a valid email address."                 | Highlight the field, let them retry |
| Network error           | "We couldn't reach our server. Please try again."     | Show retry button                   |
| Server error (500)      | "Something went wrong on our end. Please try again."  | Show retry button + support email   |
| Duplicate submission    | Treat as success (silently)                           | Redirect to thank-you page          |
| Rate limit exceeded     | "Too many requests. Please wait a moment."            | Disable form temporarily            |

### Duplicate Handling

If a user submits the same email twice:
- Do NOT show an error. This creates a poor experience.
- Update their record in the database (upsert).
- Do NOT add them to the email list again (most platforms handle this).
- DO resend the delivery email so they get the resource.
- Redirect to the thank-you page as normal.

---

## 5. Thank-You Page Strategy

The thank-you page is one of the most underutilized assets in a funnel. The visitor just took action — they are engaged and primed for a next step.

### Thank-You Page Goals

1. **Confirm the action.** "Your checklist is on its way."
2. **Set expectations.** "Check your inbox (and spam folder) in the next 60 seconds."
3. **Present the next step.** This is where you advance the relationship.
4. **Track the conversion.** The thank-you page URL is the conversion trigger.

### Page Structure

```
+---------------------------------------------+
|  CONFIRMATION                               |
|  "Your SEO Checklist Is On Its Way"         |
|  "Check your inbox for an email from us."   |
+---------------------------------------------+
|  NEXT STEP OFFER                            |
|  "While you wait — here's what to do next"  |
|                                             |
|  Option A: Book a free strategy call        |
|  Option B: Read our most popular blog post  |
|  Option C: Watch a 3-minute explainer video |
+---------------------------------------------+
|  SOCIAL SHARING (optional)                  |
|  "Know someone who'd find this useful?"     |
|  Share buttons for Twitter/LinkedIn         |
+---------------------------------------------+
```

### SvelteKit Implementation

```ts
// src/routes/resources/seo-checklist/thank-you/+page.ts
export const prerender = true;
```

```svelte
<!-- src/routes/resources/seo-checklist/thank-you/+page.svelte -->
<script lang="ts">
  import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead
  title="Check Your Inbox — SEO Checklist"
  description="Your SEO checklist is on its way. Check your inbox."
  canonical="https://example.com/resources/seo-checklist/thank-you"
  noindex={true}
/>

<main class="thank-you-page">
  <section class="confirmation">
    <h1>Your SEO Checklist Is On Its Way</h1>
    <p>
      Check your inbox for an email from <strong>hello@example.com</strong>.
      If you don't see it within 2 minutes, check your spam or promotions folder.
    </p>
  </section>

  <section class="next-step">
    <h2>While You Wait — Take the Next Step</h2>
    <p>
      The checklist will show you what to fix. If you want help fixing it,
      we offer a free 15-minute strategy call to walk through your results.
    </p>
    <a href="/contact?ref=seo-checklist" class="cta-button">
      Book a Free Strategy Call
    </a>
  </section>

  <section class="social-share">
    <p>Know someone who would find this useful?</p>
    <div class="share-buttons">
      <a
        href="https://twitter.com/intent/tweet?text=Just%20downloaded%20this%20free%20SEO%20checklist%20-%2047%20actionable%20items.&url=https://example.com/resources/seo-checklist"
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on Twitter
      </a>
      <a
        href="https://www.linkedin.com/sharing/share-offsite/?url=https://example.com/resources/seo-checklist"
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on LinkedIn
      </a>
    </div>
  </section>
</main>
```

### Critical: noindex the Thank-You Page

The thank-you page must have `<meta name="robots" content="noindex" />`. It should not appear in search results, and it serves as the conversion tracking trigger URL.

### Next Step Strategies (Ranked by Effectiveness)

1. **Book a call.** Highest value. Position it as a natural next step: "Let us walk you through the checklist results."
2. **Watch a video.** Medium commitment. A 3-5 minute video builds familiarity and trust.
3. **Read a related blog post.** Low commitment. Keeps them on your site and builds authority.
4. **Follow on social media.** Lowest commitment. Maintains a touchpoint.

---

## 6. Email Integration Readiness

### Email Platform Requirements

The funnel needs an email marketing platform that supports:

- **API-based subscriber management** (add contacts, apply tags)
- **Automated sequences** (triggered by tag or list membership)
- **Transactional email** or integration with a transactional service (for delivery)
- **Segmentation by tags** (so different lead magnets trigger different sequences)

### Recommended Platforms

| Platform        | Best For                    | API Quality | Price Range     |
| --------------- | --------------------------- | ----------- | --------------- |
| ConvertKit      | Creators, small businesses  | Excellent   | Free - $59/mo   |
| Resend          | Transactional + marketing   | Excellent   | Free - $20/mo   |
| Mailchimp       | General purpose              | Good        | Free - $45/mo   |
| Postmark        | Transactional delivery       | Excellent   | $15/mo          |
| SendGrid        | High volume                  | Good        | Free - $20/mo   |

### Integration Architecture

```
Form Submission
  |
  +-->  Database (store lead record)
  |
  +-->  Email Platform API
  |       +-- Add subscriber to list
  |       +-- Apply tag: "lead-magnet-{resource}"
  |       +-- Trigger automation: "deliver-{resource}"
  |
  +-->  Analytics (conversion event)
```

### Email Sequence

#### Email 1: Delivery (Immediate)

- **Subject:** "Your SEO Checklist is here"
- **Body:**
  - Greeting with first name
  - Download link (prominent button)
  - Brief note: "Here's what I recommend you do first..."
  - Expectation setting: "Over the next week, I'll send you a few emails with tips on how to use this checklist effectively."

#### Email 2: Quick Win (Day 2)

- **Subject:** "Start here — the fastest SEO win on the checklist"
- **Body:** Pick one item from the checklist and explain how to implement it. Link to a blog post for the full walkthrough.

#### Email 3: Deeper Value (Day 4)

- **Subject:** "The #1 mistake I see on most websites"
- **Body:** Share an insight or lesson learned from client work. Relate it to the checklist. Include a case study link.

#### Email 4: Social Proof (Day 7)

- **Subject:** "How [Client Name] used this checklist to 3x their traffic"
- **Body:** Brief case study summary with results. Link to the full case study page.

#### Email 5: Offer (Day 10)

- **Subject:** "Want help implementing the checklist?"
- **Body:** Direct offer for a free strategy call. Frame it as a natural next step. Include a calendar booking link.

### Tag Strategy

| Tag                          | Applied When                     | Triggers                              |
| ---------------------------- | -------------------------------- | ------------------------------------- |
| `lead-magnet-seo-checklist`  | Form submitted                   | Delivery sequence                     |
| `opened-delivery-email`      | Delivery email opened            | None (tracking only)                  |
| `clicked-download`           | Download link clicked            | None (tracking only)                  |
| `booked-call`                | Calendar link clicked            | Remove from nurture, add to sales     |
| `engaged-subscriber`         | Opened 3+ emails                 | Priority follow-up                    |

---

## 7. Conversion Tracking Plan

### Events to Track

| Event Name          | Trigger Point                    | Platform        | Parameters                        |
| ------------------- | -------------------------------- | --------------- | --------------------------------- |
| `page_view`         | Offer page loads                 | GA4             | `page_path`, `page_title`         |
| `form_start`        | First field interaction          | GA4             | `resource`                        |
| `generate_lead`     | Successful form submission       | GA4, Meta, LinkedIn | `resource`, `method: lead_form` |
| `page_view`         | Thank-you page loads             | GA4             | `page_path` (conversion trigger)  |
| `email_delivered`   | Delivery email sent              | Email platform  | `resource`                        |
| `email_opened`      | Delivery email opened            | Email platform  | `resource`                        |
| `download_clicked`  | Download link clicked in email   | Email platform  | `resource`                        |
| `call_booked`       | Calendar link clicked            | GA4, CRM        | `resource`, `source: lead_magnet` |

### GA4 Configuration

```ts
// Track form submission as a conversion
function trackLeadConversion(resource: string) {
  if (typeof gtag === 'function') {
    gtag('event', 'generate_lead', {
      event_category: 'lead_magnet',
      event_label: resource,
      value: 10, // estimated lead value in dollars
      currency: 'USD'
    });
  }
}
```

In GA4, mark `generate_lead` as a conversion event in the admin panel.

### Thank-You Page as Conversion Trigger

For platforms that use URL-based conversion tracking (Google Ads, Meta Pixel):

- **Google Ads:** Set the conversion URL to `/resources/*/thank-you`.
- **Meta Pixel:** Fire a `Lead` standard event on the thank-you page.

```svelte
<!-- On the thank-you page -->
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(() => {
    // Meta Pixel
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: 'seo-checklist' });
    }

    // LinkedIn Insight Tag
    if (typeof lintrk === 'function') {
      lintrk('track', { conversion_id: 12345 });
    }
  });
</script>
```

### UTM Parameter Strategy

Track traffic sources with consistent UTM parameters:

```
https://example.com/resources/seo-checklist
  ?utm_source=linkedin
  &utm_medium=paid
  &utm_campaign=seo-checklist-q1-2026
  &utm_content=carousel-ad-v1
```

| Parameter      | Convention                           | Example                     |
| -------------- | ------------------------------------ | --------------------------- |
| `utm_source`   | Platform name                        | `google`, `linkedin`, `blog`|
| `utm_medium`   | Traffic type                         | `paid`, `organic`, `email`  |
| `utm_campaign` | Resource + time period               | `seo-checklist-q1-2026`     |
| `utm_content`  | Ad/content variant                   | `carousel-ad-v1`, `sidebar` |

### Funnel Reporting Dashboard

Build a simple dashboard (or spreadsheet) tracking these numbers weekly:

| Metric                      | Week 1 | Week 2 | Week 3 | Week 4 | Total |
| --------------------------- | ------ | ------ | ------ | ------ | ----- |
| Offer page visits           |        |        |        |        |       |
| Form submissions            |        |        |        |        |       |
| Conversion rate             |        |        |        |        |       |
| Delivery email opens        |        |        |        |        |       |
| Download clicks             |        |        |        |        |       |
| Calls booked                |        |        |        |        |       |
| Cost per lead (if paid)     |        |        |        |        |       |

---

## 8. A/B Testing Opportunities

A/B testing should be systematic. Test one variable at a time, run each test for at least 2 weeks or 200 conversions (whichever comes first), and document results.

### High-Impact Tests (Start Here)

#### Test 1: Headline

**Variable:** Offer page headline.

| Variant A (Control)                              | Variant B                                        |
| ------------------------------------------------ | ------------------------------------------------ |
| The 47-Point SEO Checklist That Drives Results   | Free: The SEO Checklist Used by 50+ Agencies     |

**Hypothesis:** Social proof in the headline increases trust and conversion.

**Metric:** Offer page conversion rate.

#### Test 2: CTA Button Text

**Variable:** Submit button copy.

| Variant A (Control)     | Variant B                 | Variant C                  |
| ----------------------- | ------------------------- | -------------------------- |
| Download Now            | Get My Free Checklist     | Send Me the Checklist      |

**Hypothesis:** First-person CTAs ("My") outperform generic CTAs.

**Metric:** Form submission rate.

#### Test 3: Form Length

**Variable:** Number of form fields.

| Variant A (Control)       | Variant B                  |
| ------------------------- | -------------------------- |
| Name + Email (2 fields)   | Email only (1 field)       |

**Hypothesis:** Removing the name field increases conversion rate.

**Metric:** Offer page conversion rate. Secondary: email personalization impact on open rates.

### Medium-Impact Tests

#### Test 4: Social Proof Type

**Variable:** Trust element on the offer page.

| Variant A                         | Variant B                         |
| --------------------------------- | --------------------------------- |
| "Downloaded by 1,200+ owners"     | Client testimonial quote          |

#### Test 5: Thank-You Page Next Step

**Variable:** The primary CTA on the thank-you page.

| Variant A                           | Variant B                          |
| ----------------------------------- | ---------------------------------- |
| Book a strategy call                | Watch a 3-minute video             |

**Metric:** Click-through rate on the thank-you page. Secondary: call booking rate.

#### Test 6: Email Subject Line (Delivery)

**Variable:** Delivery email subject.

| Variant A                            | Variant B                            |
| ------------------------------------ | ------------------------------------ |
| "Your SEO Checklist is here"         | "Here's your checklist, {firstName}" |

**Metric:** Email open rate.

### Low-Impact Tests (Optimize Later)

- Button color
- Image vs no image on the offer page
- Bullet point order
- Privacy text wording
- Form field placeholder text

### Testing Implementation

For server-side A/B testing in SvelteKit:

```ts
// src/routes/resources/seo-checklist/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  // Assign variant on first visit, persist in cookie
  let variant = cookies.get('ab_headline');

  if (!variant) {
    variant = Math.random() < 0.5 ? 'A' : 'B';
    cookies.set('ab_headline', variant, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    });
  }

  return { variant };
};
```

```svelte
<!-- Use the variant in the page -->
<script lang="ts">
  let { data } = $props();
</script>

{#if data.variant === 'A'}
  <h1>The 47-Point SEO Checklist That Drives Results</h1>
{:else}
  <h1>Free: The SEO Checklist Used by 50+ Agencies</h1>
{/if}
```

Track the variant in analytics events so you can segment results:

```ts
gtag('event', 'generate_lead', {
  event_category: 'lead_magnet',
  event_label: 'seo-checklist',
  dimension1: `headline_variant_${variant}`
});
```

---

## 9. QA Checklist

Run through this checklist before launching the funnel and after every significant change.

### Offer Page

- [ ] Page loads in under 2 seconds on mobile (test with PageSpeed Insights)
- [ ] Headline, subheadline, and bullets are visible above the fold on desktop
- [ ] Form is visible above the fold on desktop; accessible without scrolling on mobile
- [ ] All form fields have proper labels and are accessible via keyboard
- [ ] Form validation works (try submitting empty, invalid email, very long input)
- [ ] CTA button has a clear disabled/loading state during submission
- [ ] Error messages are clear and display near the relevant field
- [ ] Page has correct meta tags (title, description, OG image)
- [ ] Page is `noindex` if it is a paid traffic landing page; `index` if organic
- [ ] No broken images or missing assets
- [ ] Page looks correct on: iPhone SE, iPhone 14, iPad, 1024px laptop, 1440px desktop
- [ ] No horizontal scroll on any viewport
- [ ] No console errors in the browser
- [ ] Privacy policy link works

### Form Submission

- [ ] Successful submission redirects to the thank-you page
- [ ] Lead is stored in the database with correct data
- [ ] Lead is added to the email platform with correct tags
- [ ] Delivery email is triggered and arrives within 60 seconds
- [ ] Download link in the email works and opens the correct file
- [ ] Duplicate email submissions do not cause errors
- [ ] Honeypot field rejects bot submissions silently
- [ ] Rate limiting works (submit 6+ times rapidly from the same IP)
- [ ] Server returns proper error codes (400 for validation, 500 for server issues)

### Thank-You Page

- [ ] Page has `noindex` meta tag
- [ ] Confirmation message is clear
- [ ] Next step CTA is visible and functional
- [ ] Conversion tracking fires (check GA4 real-time, Meta Pixel helper, etc.)
- [ ] Page cannot be accessed directly without context (or handles it gracefully)
- [ ] Social share links work and use correct pre-filled text

### Email Delivery

- [ ] Delivery email arrives within 60 seconds of form submission
- [ ] Email renders correctly in Gmail, Outlook, Apple Mail, and Yahoo
- [ ] Download link works and points to the correct file
- [ ] Email is not flagged as spam (check with mail-tester.com)
- [ ] Unsubscribe link works
- [ ] "From" name and address are correct
- [ ] Reply-to address is monitored

### Email Sequence

- [ ] Each email in the nurture sequence sends at the correct interval
- [ ] Personalization (first name) works correctly
- [ ] Links in each email are correct and tracked
- [ ] Subscribers who book a call are removed from the nurture sequence
- [ ] Unsubscribes are honored across the entire sequence

### Analytics

- [ ] GA4 page_view events fire on offer page and thank-you page
- [ ] generate_lead conversion event fires on successful submission
- [ ] Meta Pixel Lead event fires on the thank-you page (if using Meta ads)
- [ ] UTM parameters are preserved through the funnel
- [ ] Conversion is attributed correctly in GA4 and ad platforms

---

## 10. Common Failures

### Failure 1: Email Goes to Spam

**Symptoms:** Low open rates on the delivery email. Users report not receiving it.

**Root Causes:**
- Sending domain is not authenticated (missing SPF, DKIM, DMARC records)
- Email content triggers spam filters (too many images, suspicious links)
- Sending from a new domain with no reputation

**Fixes:**
- Set up SPF, DKIM, and DMARC for your sending domain
- Use a reputable email service provider
- Warm up the sending domain by sending low volumes first
- Test with mail-tester.com before launch
- Add "Check your spam folder" text on the thank-you page

### Failure 2: Form Submits but No Redirect

**Symptoms:** The user clicks submit, the button shows "Sending..." forever, or the page does nothing.

**Root Causes:**
- JavaScript error preventing the redirect
- API returns an error that is not caught properly
- Network timeout on slow connections
- CORS issue if the API is on a different domain

**Fixes:**
- Add proper error handling and timeout logic
- Show a fallback success message if the redirect fails
- Test on slow network conditions (Chrome DevTools throttling)
- Ensure the API endpoint and the page are on the same origin

### Failure 3: Low Conversion Rate (Under 15%)

**Symptoms:** Plenty of traffic, but few form submissions.

**Root Causes:**
- Headline does not communicate clear value
- Form asks for too much information
- No trust elements (social proof, testimonials)
- Page is too slow (visitors leave before it loads)
- CTA is below the fold on mobile
- Mismatch between traffic source messaging and landing page copy

**Fixes:**
- Test new headlines (see A/B Test 1)
- Reduce form to Name + Email (or Email only)
- Add download count or testimonial
- Optimize page speed to under 2 seconds LCP
- Move the form or a "scroll to form" button above the fold on mobile
- Ensure ad copy matches the offer page headline

### Failure 4: High Unsubscribe Rate on Nurture Sequence

**Symptoms:** More than 2% unsubscribe per email in the sequence.

**Root Causes:**
- Emails are too frequent
- Content is too salesy, not enough value
- Expectations were not set on the thank-you page or delivery email
- Wrong audience (traffic source mismatch)

**Fixes:**
- Space emails further apart (2-3 days between each)
- Lead with value in every email; save the pitch for email 4 or 5
- Set expectations clearly: "You'll receive 5 emails over the next 2 weeks"
- Review traffic sources for quality

### Failure 5: Thank-You Page Appears in Search Results

**Symptoms:** The thank-you page URL shows up in Google Search results.

**Root Causes:**
- Missing `noindex` meta tag
- Thank-you page is linked from other indexed pages

**Fixes:**
- Add `<meta name="robots" content="noindex, nofollow" />`
- Remove any internal links pointing to the thank-you page
- Use Search Console URL Inspection to request removal if already indexed

### Failure 6: Duplicate Leads Flooding the Database

**Symptoms:** Same email appears multiple times in the database.

**Root Causes:**
- No upsert logic on the server
- User refreshes the thank-you page (triggering resubmission)
- No deduplication in the email platform integration

**Fixes:**
- Use upsert (INSERT ON CONFLICT UPDATE) in the database
- Use POST-redirect-GET pattern (redirect after form submission)
- Check for existing subscriber before adding to the email platform

### Failure 7: Conversion Tracking Not Firing

**Symptoms:** GA4 shows no conversion events. Ad platforms report zero leads.

**Root Causes:**
- Tracking script blocked by ad blockers
- Script loaded asynchronously and not ready when the event fires
- Wrong event name or parameters
- Consent management tool blocking the script

**Fixes:**
- Use server-side conversion tracking as a fallback (GA4 Measurement Protocol)
- Fire events on the thank-you page load (more reliable than on form submit)
- Verify events in GA4 DebugView before going live
- Test with ad blockers both enabled and disabled

### Failure 8: Bot Submissions

**Symptoms:** Hundreds of fake leads with gibberish names or emails.

**Root Causes:**
- No bot protection on the form
- No server-side validation
- Publicly accessible API endpoint with no rate limiting

**Fixes:**
- Implement honeypot field (see Section 3)
- Add rate limiting (5 submissions per IP per hour)
- Use Cloudflare Turnstile or hCaptcha for high-traffic pages
- Validate email format server-side (reject disposable email domains if appropriate)
- Monitor submission patterns and block suspicious IPs

---

## Appendix: Funnel Launch Timeline

| Day        | Task                                                          |
| ---------- | ------------------------------------------------------------- |
| Day 1-2    | Write and design the offer page                               |
| Day 3      | Build the form and API endpoint                               |
| Day 4      | Set up email platform integration and delivery email          |
| Day 5      | Build the thank-you page                                      |
| Day 6      | Write the nurture email sequence (5 emails)                   |
| Day 7      | Set up conversion tracking (GA4, Meta Pixel, etc.)            |
| Day 8      | Full QA pass (use the checklist in Section 9)                 |
| Day 9      | Fix issues found in QA                                        |
| Day 10     | Soft launch (internal team + small audience)                  |
| Day 11-12  | Monitor metrics, fix any issues                               |
| Day 13     | Full launch to all traffic sources                            |
| Day 14+    | Begin A/B testing (one test at a time)                        |

---

*Last updated: 2026-02-17*
