# Svelte 5 Foundations — From Zero to Productive

> A beginner-friendly guide covering Svelte 5 fundamentals, with examples drawn from the ShipForge codebase.

---

## Table of Contents

1. [What is Svelte?](#what-is-svelte)
2. [Component Anatomy](#component-anatomy)
3. [Svelte 5 Runes](#svelte-5-runes)
4. [Reactivity Model](#reactivity-model)
5. [Template Syntax](#template-syntax)
6. [Event Handling](#event-handling)
7. [Component Composition with Children Snippets](#component-composition-with-children-snippets)
8. [Two-Way Binding with bind:](#two-way-binding)
9. [Lifecycle in Svelte 5](#lifecycle-in-svelte-5)
10. [Scoped Styles](#scoped-styles)

---

## What is Svelte?

Svelte is a **compiler-based** UI framework. Unlike React and Vue, which ship a runtime library to the browser and do work (diffing, reconciliation) at runtime, Svelte shifts that work to **build time**. When you compile a Svelte project, the output is highly optimized vanilla JavaScript that directly manipulates the DOM.

### How Svelte Differs from React and Vue

| Aspect | React | Vue | Svelte |
|---|---|---|---|
| **Architecture** | Virtual DOM + runtime | Virtual DOM + runtime | Compiler — no virtual DOM |
| **Reactivity** | `useState`, manual hook calls | Proxy-based refs/reactive | Runes (`$state`, `$derived`) — compiler-driven |
| **Bundle size** | ~40 KB min (React + ReactDOM) | ~33 KB min | Near-zero framework overhead |
| **Styling** | CSS-in-JS or external | Scoped `<style>` or CSS modules | Built-in scoped `<style>` blocks |
| **Learning curve** | JSX, hooks rules, effect cleanup | Template directives, composition API | Minimal API surface, HTML-first |

**Key takeaway:** Svelte components look like enhanced HTML files. There is no JSX, no `createElement`, no `h()` function. You write HTML, add reactive JavaScript in a `<script>` block, and scope styles in a `<style>` block. The compiler does the rest.

---

## Component Anatomy

Every Svelte component is a single `.svelte` file with up to three sections: **script**, **template** (markup), and **style**.

```svelte
<!-- src/lib/components/StatCounter.svelte (from ShipForge) -->

<script lang="ts">
	// 1. SCRIPT — JavaScript/TypeScript logic
	interface Props {
		value: string;
		label: string;
		class?: string;
	}

	let {
		value,
		label,
		class: className = ''
	}: Props = $props();
</script>

<!-- 2. TEMPLATE — HTML markup with reactive expressions -->
<div class="stat {className}">
	<span class="stat__value" data-value={value}>{value}</span>
	<span class="stat__label">{label}</span>
</div>

<!-- 3. STYLE — scoped CSS (only applies to this component) -->
<style>
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat__value {
		font-size: var(--text-4xl);
		font-weight: 800;
		color: var(--color-primary);
	}

	.stat__label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}
</style>
```

### Rules

- The `<script>` block runs **once** when the component is created.
- The template is **reactive** — it re-renders automatically when state changes.
- The `<style>` block is **scoped** by default (styles never leak to other components).
- You can use `lang="ts"` on the script tag to enable TypeScript.

---

## Svelte 5 Runes

Svelte 5 introduced **runes** — special compiler-recognized functions prefixed with `$`. They replace the old `let` reactivity, `$:` statements, and `export let` props from Svelte 4.

### `$state` — Reactive State

`$state` declares reactive variables. When the value changes, anything that reads it re-renders automatically.

```svelte
<script lang="ts">
	let count = $state(0);
	let name = $state('ShipForge');
	let items = $state<string[]>([]);
</script>

<button onclick={() => count++}>
	Clicked {count} times
</button>
```

**Deep reactivity:** `$state` makes objects and arrays deeply reactive. Mutating a nested property or pushing to an array triggers updates.

```svelte
<script lang="ts">
	let form = $state({
		name: '',
		email: '',
		message: ''
	});

	// This mutation is automatically tracked:
	form.name = 'Alice';
</script>
```

### `$derived` — Computed Values

`$derived` creates a value that automatically recomputes when its dependencies change. It replaces the old `$: derived = ...` syntax.

```svelte
<script lang="ts">
	let price = $state(100);
	let quantity = $state(2);

	let total = $derived(price * quantity);
	let formatted = $derived(`$${total.toFixed(2)}`);
</script>

<p>Total: {formatted}</p>
```

**Real ShipForge example** — the `ServiceCard` component uses `$derived` to look up an icon:

```svelte
<script lang="ts">
	import type { Service } from '$lib/types';
	import Code from 'phosphor-svelte/lib/Code';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';

	let { service }: Props = $props();

	const iconMap: Record<string, typeof Code> = {
		'code': Code,
		'magnifying-glass': MagnifyingGlass
	};

	// Recomputes whenever service.icon changes
	let IconComponent = $derived(iconMap[service.icon]);
</script>
```

For more complex derived values that need multiple statements, use `$derived.by()`:

```svelte
<script lang="ts">
	let items = $state([10, 20, 30, 5, 15]);

	let stats = $derived.by(() => {
		const sorted = [...items].sort((a, b) => a - b);
		const sum = sorted.reduce((acc, val) => acc + val, 0);
		return {
			min: sorted[0],
			max: sorted[sorted.length - 1],
			average: sum / sorted.length
		};
	});
</script>
```

### `$effect` — Side Effects

`$effect` runs code whenever its reactive dependencies change. It runs after the DOM has updated and automatically tracks which reactive values you read inside it.

```svelte
<script lang="ts">
	let count = $state(0);

	$effect(() => {
		console.log(`Count is now: ${count}`);
		// This runs on mount AND whenever count changes
	});
</script>
```

**Cleanup:** Return a function from `$effect` to run cleanup before the effect re-runs or the component is destroyed.

```svelte
<script lang="ts">
	let visible = $state(true);

	$effect(() => {
		if (!visible) return;

		const timer = setInterval(() => console.log('tick'), 1000);

		return () => {
			clearInterval(timer); // cleanup
		};
	});
</script>
```

### `$props` — Component Props

`$props` replaces the old `export let` syntax for receiving data from parent components. You destructure it to declare all props at once.

```svelte
<script lang="ts">
	// ShipForge SectionHeader component
	interface Props {
		eyebrow?: string;
		title: string;
		subtitle?: string;
		align?: 'center' | 'left';
	}

	let {
		eyebrow,
		title,
		subtitle,
		align = 'center'  // default value
	}: Props = $props();
</script>

<header class="section-header section-header--{align}">
	{#if eyebrow}
		<span class="section-header__eyebrow">{eyebrow}</span>
	{/if}
	<h2>{title}</h2>
	{#if subtitle}
		<p>{subtitle}</p>
	{/if}
</header>
```

**Rest props** for passing through extra attributes:

```svelte
<script lang="ts">
	let { href, children, ...restProps }: Props = $props();
</script>

<a {href} {...restProps}>
	{@render children()}
</a>
```

---

## Reactivity Model

Svelte 5's reactivity model is built on **signals** (via runes), but you rarely need to think in those terms. Here is the mental model:

1. **`$state` creates a reactive source.** The compiler wraps it in a signal under the hood.
2. **The template reads reactive sources.** Svelte tracks which parts of the DOM depend on which state.
3. **When state changes, only the affected DOM nodes update.** No virtual DOM diffing.
4. **`$derived` creates a computed signal.** It re-evaluates only when its inputs change.
5. **`$effect` creates a side-effect subscription.** It re-runs when the reactive values it reads change.

```
$state(value) ──> template reads it ──> DOM updates on change
       │
       ├──> $derived(expression) ──> template reads derived ──> DOM updates
       │
       └──> $effect(() => { ... }) ──> runs side-effect on change
```

**Important:** Reactivity only works with runes. A plain `let x = 5` is not reactive — the template will not update if you reassign `x`. Always use `$state` for values that should trigger re-renders.

---

## Template Syntax

Svelte templates use a clean, HTML-first syntax with special blocks for control flow and rendering.

### Expressions: `{expression}`

Any JavaScript expression inside curly braces is rendered as text or used as an attribute value.

```svelte
<h1>{title}</h1>
<img src={imagePath} alt={imageAlt} />
<div class="card card--{variant}"></div>
```

### Conditional Rendering: `{#if}`

```svelte
{#if eyebrow}
	<span class="eyebrow">{eyebrow}</span>
{/if}

{#if status === 'loading'}
	<p>Loading...</p>
{:else if status === 'error'}
	<p>Something went wrong.</p>
{:else}
	<p>Data loaded!</p>
{/if}
```

### Lists: `{#each}`

```svelte
<!-- From ShipForge ServiceCard -->
<ul>
	{#each service.features as feature}
		<li>{feature}</li>
	{/each}
</ul>

<!-- With index -->
{#each items as item, index}
	<p>{index + 1}. {item.name}</p>
{/each}

<!-- With key for efficient updates -->
{#each posts as post (post.slug)}
	<BlogCard {post} />
{/each}
```

### Render Tags: `{@render}`

`{@render}` invokes a **snippet** (a reusable template block). It replaces the old `<slot>` syntax from Svelte 4.

```svelte
<!-- Rendering children (the most common use) -->
{@render children()}

<!-- Rendering a named snippet prop -->
{#if icon}
	<div class="card__icon">
		{@render icon()}
	</div>
{/if}
```

### Raw HTML: `{@html}`

Renders a string as raw HTML. Use with caution (XSS risk if the string comes from user input).

```svelte
{@html post.contentHtml}
```

---

## Event Handling

Svelte 5 uses **standard HTML event attributes** for event handling. There is no special `on:click` directive — you use the native `onclick` attribute with a handler function.

```svelte
<script lang="ts">
	let count = $state(0);

	function handleClick() {
		count++;
	}
</script>

<!-- Named handler -->
<button onclick={handleClick}>
	Count: {count}
</button>

<!-- Inline handler -->
<button onclick={() => count++}>
	Increment
</button>
```

### Form Submission

```svelte
<script lang="ts">
	let name = $state('');
	let email = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		console.log({ name, email });
	}
</script>

<form onsubmit={handleSubmit}>
	<input type="text" bind:value={name} />
	<input type="email" bind:value={email} />
	<button type="submit">Submit</button>
</form>
```

### Event Types

All standard DOM events work as attributes: `onclick`, `oninput`, `onchange`, `onkeydown`, `onmouseover`, `onfocus`, `onblur`, `onsubmit`, etc.

```svelte
<input
	oninput={(e) => search = e.currentTarget.value}
	onkeydown={(e) => { if (e.key === 'Enter') handleSearch(); }}
/>
```

---

## Component Composition with Children Snippets

In Svelte 5, components receive their children as a **snippet** via `$props()`. This replaces the old `<slot>` mechanism.

### Basic Children

```svelte
<!-- Button.svelte (from ShipForge) -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
	}

	let { variant = 'primary', children, onclick }: Props = $props();
</script>

<button class="btn btn--{variant}" {onclick}>
	{@render children()}
</button>
```

**Using the Button:**

```svelte
<Button variant="primary" onclick={handleSave}>
	Save Changes
</Button>

<Button variant="outline">
	<Icon name="download" /> Download PDF
</Button>
```

### Named Snippets (Multiple Content Areas)

The ShipForge `Card` component accepts both `children` and an optional `icon` snippet:

```svelte
<!-- Card.svelte (from ShipForge) -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		icon?: Snippet;
		padding?: 'sm' | 'md' | 'lg';
	}

	let { children, icon, padding = 'md' }: Props = $props();
</script>

<div class="card card--pad-{padding}">
	{#if icon}
		<div class="card__icon">
			{@render icon()}
		</div>
	{/if}
	<div class="card__body">
		{@render children()}
	</div>
</div>
```

**Using the Card with a named snippet:**

```svelte
<Card padding="lg">
	{#snippet icon()}
		<RocketIcon size={32} />
	{/snippet}

	<h3>Launch Ready</h3>
	<p>Your project is ready to deploy.</p>
</Card>
```

### Snippets with Parameters

Snippets can accept parameters, enabling render-prop-like patterns:

```svelte
<!-- DataList.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props<T> {
		items: T[];
		renderItem: Snippet<[T, number]>;
	}

	let { items, renderItem }: Props<any> = $props();
</script>

{#each items as item, index}
	{@render renderItem(item, index)}
{/each}
```

---

## Two-Way Binding

The `bind:` directive creates a two-way data binding between a form element and a reactive variable.

### Input Binding

```svelte
<script lang="ts">
	let name = $state('');
	let agreed = $state(false);
	let color = $state('#ff3e00');
</script>

<input type="text" bind:value={name} />
<input type="checkbox" bind:checked={agreed} />
<input type="color" bind:value={color} />

<p>Hello, {name}!</p>
```

### Select Binding

```svelte
<script lang="ts">
	let selected = $state('fullstack-development');
</script>

<select bind:value={selected}>
	<option value="fullstack-development">Fullstack Development</option>
	<option value="technical-seo">Technical SEO</option>
	<option value="ui-ux-design">UI/UX Design</option>
</select>
```

### Textarea Binding

```svelte
<script lang="ts">
	let message = $state('');
</script>

<textarea bind:value={message} rows="4"></textarea>
<p>Character count: {message.length}</p>
```

### Group Binding (Radio and Checkbox Groups)

```svelte
<script lang="ts">
	let plan = $state('starter');
	let features = $state<string[]>([]);
</script>

<!-- Radio group: bind:group gives you a single value -->
<label><input type="radio" bind:group={plan} value="starter" /> Starter</label>
<label><input type="radio" bind:group={plan} value="pro" /> Pro</label>
<label><input type="radio" bind:group={plan} value="enterprise" /> Enterprise</label>

<!-- Checkbox group: bind:group gives you an array -->
<label><input type="checkbox" bind:group={features} value="seo" /> SEO</label>
<label><input type="checkbox" bind:group={features} value="analytics" /> Analytics</label>
```

### Element Binding

You can bind a DOM element reference using `bind:this`:

```svelte
<script lang="ts">
	let canvas: HTMLCanvasElement;

	$effect(() => {
		const ctx = canvas.getContext('2d');
		// draw on canvas...
	});
</script>

<canvas bind:this={canvas} width={400} height={300}></canvas>
```

---

## Lifecycle in Svelte 5

Svelte 5 unifies lifecycle management through `$effect`. The traditional lifecycle functions (`onMount`, `onDestroy`) still work, but `$effect` is the idiomatic Svelte 5 approach.

### Mount Logic (replaces `onMount`)

```svelte
<script lang="ts">
	let el: HTMLDivElement;

	$effect(() => {
		// This runs after the component mounts and the DOM is ready.
		// Access DOM elements, start animations, fetch data, etc.
		console.log('Component mounted, element:', el);

		return () => {
			// This runs when the component is destroyed (cleanup).
			console.log('Component destroyed');
		};
	});
</script>

<div bind:this={el}>Hello</div>
```

### Run Only Once on Mount

If you want code to run exactly once (not re-run on state changes), use `untrack` or reference no reactive values:

```svelte
<script lang="ts">
	import { untrack } from 'svelte';

	$effect(() => {
		// Runs once on mount because there are no reactive dependencies
		const controller = new AbortController();

		fetch('/api/data', { signal: controller.signal })
			.then(r => r.json())
			.then(data => { /* handle data */ });

		return () => controller.abort();
	});
</script>
```

### Pre-update Logic with `$effect.pre`

`$effect.pre` runs before the DOM updates, useful for measuring DOM state before a change:

```svelte
<script lang="ts">
	let messages = $state<string[]>([]);
	let container: HTMLDivElement;

	$effect.pre(() => {
		// Read scroll position before DOM updates
		if (container) {
			const isAtBottom =
				container.scrollTop + container.clientHeight >= container.scrollHeight - 10;
			if (isAtBottom) {
				// Will auto-scroll after update
				requestAnimationFrame(() => {
					container.scrollTop = container.scrollHeight;
				});
			}
		}
	});
</script>
```

---

## Scoped Styles

Styles in a Svelte component's `<style>` block are **scoped** to that component by default. The compiler adds unique class attributes to elements to ensure styles do not leak.

```svelte
<!-- These styles ONLY affect elements in this component -->
<style>
	h1 {
		color: var(--color-primary);
		font-size: var(--text-4xl);
	}

	.card {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}
</style>
```

### Global Styles

To write a style that escapes scoping, use `:global()`:

```svelte
<style>
	/* Only applies within this component */
	.wrapper {
		padding: var(--space-4);
	}

	/* Applies globally — use sparingly */
	:global(body) {
		margin: 0;
	}

	/* Target a child component's element */
	.wrapper :global(.child-class) {
		color: red;
	}
</style>
```

### CSS Custom Properties (Design Tokens)

ShipForge uses CSS custom properties extensively. This is a best practice — define tokens globally in `app.css` and reference them in component styles:

```svelte
<style>
	.service-card {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		transition:
			box-shadow var(--transition-base),
			transform var(--transition-base);
	}

	.service-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}
</style>
```

### Passing CSS Properties to Components

You can pass CSS custom properties to a component for theming:

```svelte
<!-- Parent -->
<Card --card-bg="salmon" --card-padding="2rem">
	<p>Custom themed card</p>
</Card>

<!-- Card.svelte -->
<div class="card">
	{@render children()}
</div>

<style>
	.card {
		background: var(--card-bg, white);
		padding: var(--card-padding, 1rem);
	}
</style>
```

---

## Quick Reference

| Concept | Svelte 4 | Svelte 5 |
|---|---|---|
| Reactive variable | `let count = 0` | `let count = $state(0)` |
| Computed value | `$: double = count * 2` | `let double = $derived(count * 2)` |
| Side effect | `$: { console.log(count) }` | `$effect(() => { console.log(count) })` |
| Props | `export let title` | `let { title } = $props()` |
| Slots | `<slot />` | `{@render children()}` |
| Named slots | `<slot name="icon" />` | `{@render icon?.()}` |
| Events | `on:click={handler}` | `onclick={handler}` |
| Event dispatch | `createEventDispatcher()` | Callback props |

---

*This guide uses examples from the ShipForge codebase (`src/lib/components/`). Explore those components to see these patterns in production context.*
