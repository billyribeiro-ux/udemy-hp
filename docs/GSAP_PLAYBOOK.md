# ShipForge — GSAP Animation Playbook

A comprehensive guide to the animation system powering ShipForge, built on GSAP with ScrollTrigger. All animation code lives in two files under `src/lib/utils/`.

---

## Table of Contents

1. [Setup](#setup)
2. [Architecture](#architecture)
3. [Utility Functions (gsap.ts)](#utility-functions-gsapts)
4. [Svelte Actions (animations.ts)](#svelte-actions-animationsts)
5. [Reduced Motion](#reduced-motion)
6. [Performance Guidelines](#performance-guidelines)
7. [Common Patterns](#common-patterns)

---

## Setup

### Dependencies

GSAP and the ScrollTrigger plugin are imported from the `gsap` package:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
```

### Plugin Registration

ScrollTrigger must be registered before use, but **only in the browser** (not during SSR):

```ts
import { browser } from '$app/environment';

if (browser) {
    gsap.registerPlugin(ScrollTrigger);
}
```

This guard prevents runtime errors during SvelteKit's server-side prerendering pass, where `window` and `document` do not exist.

### Reduced Motion Detection

A shared utility function checks the user's OS-level motion preference:

```ts
export function prefersReducedMotion(): boolean {
    if (!browser) return true;  // Treat SSR as reduced motion
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

Returning `true` on the server ensures no animation logic runs during prerendering.

---

## Architecture

### Two-Layer System

The animation system is split into two layers with clear responsibilities:

```
┌─────────────────────────────────────────────┐
│  Layer 2: animations.ts (Svelte Actions)    │
│  ┌────────────┐ ┌──────────────┐            │
│  │ use:fadeInUp│ │use:stagger   │  ...       │
│  │             │ │  Children    │            │
│  └──────┬──────┘ └──────┬───────┘            │
│         │               │                    │
│         ▼               ▼                    │
│  ┌─────────────────────────────────────────┐ │
│  │  Layer 1: gsap.ts (Animation Primitives)│ │
│  │  fadeInUp() | staggerIn() | heroReveal()│ │
│  │  animateCounter() | cleanupScrollTrig() │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Layer 1 — `gsap.ts` (Animation Primitives)**
Pure functions that create GSAP tweens and ScrollTrigger instances. Each function:
- Accepts an `HTMLElement` and an options object
- Checks for reduced motion and gracefully degrades
- Returns a `{ kill: () => void }` cleanup handle

**Layer 2 — `animations.ts` (Svelte Actions)**
Thin wrappers that adapt Layer 1 functions into the `use:` action interface. Each action:
- Checks `browser` for SSR safety
- Calls the corresponding Layer 1 function
- Returns `{ destroy: () => void }` for Svelte's lifecycle cleanup

### Lifecycle Safety

The action pattern guarantees animations are cleaned up when a component unmounts:

```
Component Mounts
  → use:fadeInUp action fires
    → fadeInUpUtil() creates GSAP tween + ScrollTrigger
    → Returns { kill } handle

Component Unmounts
  → action's destroy() fires
    → Calls kill() on the stored handle
      → GSAP tween is killed
      → Associated ScrollTrigger instances are killed
```

This prevents memory leaks and orphaned ScrollTrigger instances when navigating between routes.

---

## Utility Functions (gsap.ts)

### fadeInUp()

Fades an element in from below when it scrolls into view.

**Signature:**

```ts
function fadeInUp(
    node: HTMLElement,
    options?: { delay?: number; duration?: number; y?: number }
): { kill: () => void }
```

**Parameters:**

| Parameter  | Type     | Default | Description                          |
| ---------- | -------- | ------- | ------------------------------------ |
| `node`     | `HTMLElement` | —  | The element to animate               |
| `delay`    | `number` | `0`     | Delay before animation starts (sec)  |
| `duration` | `number` | `0.8`   | Animation duration (sec)             |
| `y`        | `number` | `40`    | Starting Y offset in pixels          |

**Behavior:**

1. Sets the element to `opacity: 0; y: 40` (invisible, shifted down).
2. Creates a `gsap.to()` tween that animates to `opacity: 1; y: 0`.
3. Uses `ease: 'power3.out'` for a natural deceleration curve.
4. ScrollTrigger fires when the element's **top crosses 85% of the viewport** (`start: 'top 85%'`).
5. Fires **once** — the element stays visible after the animation completes.

**Reduced motion behavior:** Immediately sets the element to its final state (`opacity: 1, y: 0`) with no animation.

---

### staggerIn()

Staggers the entrance of child elements within a parent container.

**Signature:**

```ts
function staggerIn(
    parent: HTMLElement,
    childSelector: string,
    options?: { stagger?: number; duration?: number; y?: number }
): { kill: () => void }
```

**Parameters:**

| Parameter       | Type     | Default | Description                              |
| --------------- | -------- | ------- | ---------------------------------------- |
| `parent`        | `HTMLElement` | —  | The container element                    |
| `childSelector` | `string` | —       | CSS selector for children to animate     |
| `stagger`       | `number` | `0.1`   | Delay between each child's start (sec)   |
| `duration`      | `number` | `0.6`   | Duration per child animation (sec)       |
| `y`             | `number` | `30`    | Starting Y offset in pixels              |

**Behavior:**

1. Queries all matching children inside the parent via `parent.querySelectorAll(childSelector)`.
2. Sets all children to `opacity: 0; y: 30`.
3. Creates a single `gsap.to()` tween with `stagger: 0.1` — each child begins animating 100ms after the previous one.
4. Uses `ease: 'power3.out'`.
5. ScrollTrigger fires on the **parent** element at `start: 'top 80%'`, once.

**Reduced motion behavior:** Immediately sets all children to their final state.

---

### heroReveal()

Orchestrates a multi-step timeline for hero section elements using `data-animate` attributes.

**Signature:**

```ts
function heroReveal(
    container: HTMLElement
): { kill: () => void }
```

**Parameters:**

| Parameter   | Type          | Description                     |
| ----------- | ------------- | ------------------------------- |
| `container` | `HTMLElement`  | The hero section container     |

**Timeline Architecture:**

The function builds a `gsap.timeline()` with `ease: 'power3.out'` as the default. It queries children by their `data-animate` attribute and adds each to the timeline with overlapping offsets:

```
Time (seconds)
0.0         0.4         0.6         0.8         1.3
│           │           │           │           │
├───────────┤           │           │           │
│ headline  │           │           │           │
│ y:50→0    │           │           │           │
│ opacity   │           │           │           │
│ dur: 0.9s ├───────────┤           │           │
│           │ subtitle  │           │           │
│           │ y:30→0    │           │           │
│           │ dur: 0.7s ├───────────┤           │
│           │           │ cta       │           │
│           │           │ y:20→0    │           │
│           │           │ scale:0.95│           │
│           │           │ dur: 0.5s ├───────────┤
│           │           │           │ badge     │
│           │           │           │ scale:0.8 │
│           │           │           │ dur: 0.5s │
```

**data-animate Attribute Convention:**

Mark hero elements with `data-animate` attributes in your markup:

```svelte
<section use:heroAnimation>
    <h1 data-animate="headline">Ship Faster</h1>
    <p data-animate="subtitle">Build products that matter</p>
    <div data-animate="cta">
        <Button>Get Started</Button>
    </div>
    <span data-animate="badge">Trusted by 100+ teams</span>
</section>
```

| Attribute Value | From State               | To State               | Duration | Overlap   |
| --------------- | ------------------------ | ---------------------- | -------- | --------- |
| `headline`      | `opacity:0, y:50`        | `opacity:1, y:0`       | 0.9s     | —         |
| `subtitle`      | `opacity:0, y:30`        | `opacity:1, y:0`       | 0.7s     | `-=0.5s`  |
| `cta`           | `opacity:0, y:20, scale:0.95` | `opacity:1, y:0, scale:1` | 0.5s | `-=0.3s`  |
| `badge`         | `opacity:0, scale:0.8`   | `opacity:1, scale:1`   | 0.5s     | `-=0.2s`  |

Each element is optional — if a `data-animate` attribute is not found, that step is skipped.

**Reduced motion behavior:** Immediately sets all `[data-animate]` elements to `opacity: 1, y: 0, scale: 1`.

---

### animateCounter()

Animates a number counting up from 0 to a target value, triggered on scroll.

**Signature:**

```ts
function animateCounter(
    node: HTMLElement,
    target: number,
    options?: { duration?: number; suffix?: string; prefix?: string }
): { kill: () => void }
```

**Parameters:**

| Parameter  | Type     | Default | Description                          |
| ---------- | -------- | ------- | ------------------------------------ |
| `node`     | `HTMLElement` | —  | The element to display the count     |
| `target`   | `number` | —       | The number to count up to            |
| `duration` | `number` | `2`     | Duration of the count animation (sec)|
| `suffix`   | `string` | `''`    | Text appended after the number (e.g., `'+'`, `'%'`) |
| `prefix`   | `string` | `''`    | Text prepended before the number (e.g., `'$'`) |

**Behavior:**

1. Creates an internal `{ value: 0 }` counter object.
2. Tweens `counter.value` from 0 to `target` using `ease: 'power2.out'`.
3. On each frame (`onUpdate`), writes `prefix + Math.round(counter.value) + suffix` to the element's `textContent`.
4. ScrollTrigger fires at `start: 'top 85%'`, once.

**Reduced motion behavior:** Immediately sets the node's text to the final formatted value.

---

### cleanupScrollTriggers()

Kills all active ScrollTrigger instances globally. Useful as a safety net on route-level cleanup.

**Signature:**

```ts
function cleanupScrollTriggers(): void
```

**Behavior:** Iterates `ScrollTrigger.getAll()` and calls `.kill()` on each instance.

**When to use:** Typically not needed if all animations use the Svelte action pattern (which handles cleanup automatically). Available as an escape hatch for edge cases or route-level `onDestroy` callbacks.

---

## Svelte Actions (animations.ts)

The action layer wraps each utility function into the Svelte `use:` directive interface. All actions check `browser` from `$app/environment` and return a no-op `{ destroy: () => {} }` on the server.

### use:fadeInUp

Fades an element in from below when scrolled into view.

```svelte
<!-- Basic usage (defaults: delay=0, duration=0.8, y=40) -->
<div use:fadeInUp>
    Content fades in from below
</div>

<!-- With options -->
<div use:fadeInUp={{ delay: 0.2, duration: 1, y: 60 }}>
    Slower, delayed, larger offset
</div>
```

**Action interface:**

```ts
interface FadeInUpOptions {
    delay?: number;
    duration?: number;
    y?: number;
}

function fadeInUp(node: HTMLElement, options?: FadeInUpOptions): { destroy: () => void }
```

---

### use:staggerChildren

Staggers child elements into view as the parent scrolls into the viewport.

```svelte
<!-- Default: selects direct children, stagger=0.1 -->
<div use:staggerChildren>
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>

<!-- With custom selector and timing -->
<div use:staggerChildren={{ selector: '.card', stagger: 0.15, duration: 0.8 }}>
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
</div>
```

**Action interface:**

```ts
interface StaggerOptions {
    selector?: string;   // Default: ':scope > *' (direct children)
    stagger?: number;    // Default: 0.1
    duration?: number;   // Default: 0.6
    y?: number;          // Default: 30
}

function staggerChildren(node: HTMLElement, options?: StaggerOptions): { destroy: () => void }
```

The `selector` defaults to `:scope > *`, which selects all direct children of the node. Override it to target a specific class (e.g., `'.card'`).

---

### use:heroAnimation

Applies the full hero reveal timeline to a container element.

```svelte
<section use:heroAnimation>
    <h1 data-animate="headline">Build. Ship. Scale.</h1>
    <p data-animate="subtitle">Full-stack development and SEO for ambitious teams.</p>
    <div data-animate="cta">
        <Button variant="primary" size="lg">Start Your Project</Button>
    </div>
    <span data-animate="badge">Trusted by 100+ companies</span>
</section>
```

**Action interface:**

```ts
function heroAnimation(node: HTMLElement): { destroy: () => void }
```

No options — the timeline configuration is encapsulated inside `heroReveal()`.

---

### use:counter

Animates a number counter on scroll.

```svelte
<span use:counter={{ target: 150, suffix: '+' }}>0</span>
<span use:counter={{ target: 99, suffix: '%' }}>0</span>
<span use:counter={{ target: 50, prefix: '$', suffix: 'M' }}>0</span>
```

**Action interface:**

```ts
interface CounterOptions {
    target: number;       // Required: the number to count to
    duration?: number;    // Default: 2
    suffix?: string;      // Default: ''
    prefix?: string;      // Default: ''
}

function counter(node: HTMLElement, options: CounterOptions): { destroy: () => void }
```

Note: `target` is **required** — the action will break without it.

---

## Reduced Motion

ShipForge implements reduced motion support at **two levels** that work together:

### Level 1: CSS (app.css)

```css
@media (prefers-reduced-motion: reduce) {
    html {
        scroll-behavior: auto;
    }

    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

This catches all CSS-based animations and transitions, effectively disabling them when the user has enabled "Reduce motion" in their OS settings.

### Level 2: JavaScript (gsap.ts)

```ts
export function prefersReducedMotion(): boolean {
    if (!browser) return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

Every animation function checks this at the start:

```ts
export function fadeInUp(node, options) {
    if (prefersReducedMotion()) {
        gsap.set(node, { opacity: 1, y: 0 });  // Jump to final state
        return { kill: () => {} };               // No-op cleanup
    }
    // ... normal animation code
}
```

### Graceful Degradation Pattern

When reduced motion is active:

| What Happens                                | Why                                              |
| ------------------------------------------- | ------------------------------------------------ |
| `gsap.set()` places elements at final state | Content is never invisible or offset              |
| No ScrollTrigger instances are created       | No unnecessary scroll event listeners             |
| A no-op `{ kill: () => {} }` is returned    | Cleanup code works without conditional checks     |
| Counter shows the final number immediately   | User sees the stat without waiting                |
| SSR is treated as reduced motion             | Prevents any animation code from running on server |

---

## Performance Guidelines

### Animate Only Transform and Opacity

All ShipForge animations exclusively use `transform` (translateY, scale) and `opacity`. These properties are composited by the GPU without triggering layout or paint:

```
✅ Good (compositor-only):       ❌ Avoid (triggers layout/paint):
  - opacity                        - width / height
  - transform: translateY()        - top / left / right / bottom
  - transform: scale()             - margin / padding
  - transform: rotate()            - border-width
                                   - font-size
```

### will-change Usage

GSAP automatically handles `will-change` optimization internally. Do **not** add `will-change` in your CSS for elements that GSAP will animate — GSAP promotes elements to their own compositor layer as needed during the tween and removes the promotion afterward.

If you need `will-change` for a non-GSAP CSS transition, apply it narrowly and temporarily:

```css
.element:hover {
    will-change: transform;
}
```

Never apply `will-change` to a large number of elements simultaneously — this consumes GPU memory.

### Mobile Considerations

- **ScrollTrigger fires once (`once: true`)**: This is the default for all ShipForge animations. The ScrollTrigger instance is automatically cleaned up after firing, reducing the number of active scroll listeners.
- **Stagger timing**: The default 100ms stagger (`stagger: 0.1`) is fast enough that users on slower devices see the full animation without significant delay.
- **No parallax or continuous scroll effects**: The project avoids scroll-linked animations that require per-frame calculations, which can cause jank on mobile GPUs.

### Low-Power Device Handling

The `prefers-reduced-motion` check serves as the primary safeguard for low-power devices. Users on devices that struggle with animations can enable the OS-level "Reduce motion" setting, which disables all GSAP animations via the `prefersReducedMotion()` check.

For additional optimization on mobile:
- Keep animation durations short (the defaults of 0.5s-0.9s are appropriate).
- Avoid animating more than 10-15 elements simultaneously.
- The `staggerIn()` function naturally throttles render load by spacing out element animations.

---

## Common Patterns

### Section Entrance Animation

The most frequently used pattern — fade sections in as the user scrolls:

```svelte
<script>
    import { fadeInUp } from '$utils/animations';
</script>

<section class="section">
    <div class="container">
        <div use:fadeInUp>
            <h2>Section Title</h2>
        </div>
        <div use:fadeInUp={{ delay: 0.15 }}>
            <p>Section description text.</p>
        </div>
    </div>
</section>
```

### Hero Reveal Timeline

A sequenced entrance for the hero section:

```svelte
<script>
    import { heroAnimation } from '$utils/animations';
</script>

<section class="section" use:heroAnimation>
    <div class="container">
        <h1 data-animate="headline">Ship Faster, Scale Smarter</h1>
        <p data-animate="subtitle">
            Full-stack development and SEO for ambitious teams.
        </p>
        <div data-animate="cta">
            <Button variant="primary" size="lg" href="/contact">
                Start Your Project
            </Button>
        </div>
        <span data-animate="badge">Trusted by 100+ companies</span>
    </div>
</section>
```

### Stat Counters on Scroll

Animated stats that count up when scrolled into view:

```svelte
<script>
    import { counter } from '$utils/animations';
</script>

<div class="grid grid--3">
    <div class="stat">
        <span class="stat__value" use:counter={{ target: 150, suffix: '+' }}>0</span>
        <span class="stat__label">Projects Delivered</span>
    </div>
    <div class="stat">
        <span class="stat__value" use:counter={{ target: 98, suffix: '%' }}>0</span>
        <span class="stat__label">Client Satisfaction</span>
    </div>
    <div class="stat">
        <span class="stat__value" use:counter={{ target: 50, prefix: '$', suffix: 'M' }}>0</span>
        <span class="stat__label">Revenue Generated</span>
    </div>
</div>
```

### CTA Attention Loop

For a call-to-action button that subtly pulses to draw attention (implemented in component-scoped CSS rather than GSAP for simplicity):

```svelte
<style>
    .cta-button {
        animation: pulse 3s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgb(79 70 229 / 0.4); }
        50%      { box-shadow: 0 0 0 12px rgb(79 70 229 / 0); }
    }
</style>
```

This uses CSS animations rather than GSAP because it is a continuous loop that does not depend on scroll position. The `prefers-reduced-motion` CSS rule in `app.css` automatically disables this for users who prefer reduced motion.

### Staggered Card Reveals

Cards that appear one after another as a group scrolls into view:

```svelte
<script>
    import { staggerChildren } from '$utils/animations';
</script>

<div class="grid grid--3" use:staggerChildren={{ selector: '.card', stagger: 0.12 }}>
    {#each services as service}
        <div class="card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
        </div>
    {/each}
</div>
```

### Combining Patterns

A full section combining multiple animation patterns:

```svelte
<script>
    import { fadeInUp, staggerChildren, counter } from '$utils/animations';
</script>

<section class="section">
    <div class="container">
        <!-- Section header fades in first -->
        <div use:fadeInUp>
            <SectionHeader
                eyebrow="Results"
                title="Numbers That Speak"
                subtitle="Our track record across dozens of projects."
            />
        </div>

        <!-- Stats count up independently -->
        <div class="grid grid--3" style="margin-top: var(--space-12);">
            <div use:fadeInUp={{ delay: 0.1 }}>
                <span use:counter={{ target: 150, suffix: '+' }}>0</span>
                <span>Projects</span>
            </div>
            <div use:fadeInUp={{ delay: 0.2 }}>
                <span use:counter={{ target: 98, suffix: '%' }}>0</span>
                <span>Satisfaction</span>
            </div>
            <div use:fadeInUp={{ delay: 0.3 }}>
                <span use:counter={{ target: 12 }}>0</span>
                <span>Team Members</span>
            </div>
        </div>

        <!-- Cards stagger in as a group -->
        <div
            class="grid grid--3"
            style="margin-top: var(--space-16);"
            use:staggerChildren={{ selector: '.card' }}
        >
            <div class="card">Card 1</div>
            <div class="card">Card 2</div>
            <div class="card">Card 3</div>
        </div>
    </div>
</section>
```

### Cleanup Best Practices

In most cases, the Svelte action `destroy` callback handles cleanup automatically. However, if you create animations outside of actions (e.g., in `onMount`), clean them up manually:

```svelte
<script>
    import { onMount, onDestroy } from 'svelte';
    import { fadeInUp as fadeInUpUtil } from '$utils/gsap';

    let sectionEl: HTMLElement;
    let animation: { kill: () => void };

    onMount(() => {
        animation = fadeInUpUtil(sectionEl);
    });

    onDestroy(() => {
        animation?.kill();
    });
</script>

<section bind:this={sectionEl}>
    ...
</section>
```

Prefer the `use:` action approach whenever possible — it is more declarative and less error-prone.
