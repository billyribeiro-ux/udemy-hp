# TypeScript for Svelte Engineers

> A practical guide to TypeScript in Svelte 5 and SvelteKit projects, with examples from the ShipForge codebase.

---

## Table of Contents

1. [Why TypeScript in Svelte Projects](#why-typescript-in-svelte-projects)
2. [Setting Up TypeScript](#setting-up-typescript)
3. [Basic Types](#basic-types)
4. [Interfaces and Type Aliases](#interfaces-and-type-aliases)
5. [Typing Component Props with $props()](#typing-component-props)
6. [Typing State with $state](#typing-state)
7. [Typing Events](#typing-events)
8. [Generics Basics](#generics-basics)
9. [Import Types Pattern](#import-types-pattern)
10. [Union Types and Discriminated Unions](#union-types-and-discriminated-unions)
11. [Utility Types](#utility-types)
12. [Typing Data Files and Function Returns](#typing-data-files-and-function-returns)
13. [ShipForge Type Examples](#shipforge-type-examples)

---

## Why TypeScript in Svelte Projects

TypeScript adds **static type checking** to JavaScript. In a Svelte project, this means:

- **Catch bugs at build time** — misspelled prop names, wrong argument types, and missing fields are caught before the code reaches users.
- **Self-documenting code** — interfaces describe the shape of your data, so you (and your team) always know what a component expects.
- **Editor intelligence** — autocompletion, inline documentation, and refactoring tools work significantly better with type information.
- **Safer refactoring** — rename a property and TypeScript tells you every file that needs updating.
- **Better component contracts** — props interfaces make it clear what a component accepts and what is optional.

SvelteKit projects created with `npx sv create` include TypeScript support out of the box. The ShipForge project uses TypeScript throughout.

---

## Setting Up TypeScript

### Enabling TypeScript in SvelteKit

SvelteKit projects include TypeScript by default. The key configuration files are:

**`tsconfig.json`** (project root):

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```

The `extends` line pulls in SvelteKit's auto-generated config (which includes path aliases like `$lib`).

### Using TypeScript in Svelte Components

Add `lang="ts"` to the `<script>` tag:

```svelte
<script lang="ts">
	// TypeScript code here
	let count: number = $state(0);
	let name: string = $state('ShipForge');
</script>
```

Without `lang="ts"`, the script block is plain JavaScript. You can mix TypeScript and JavaScript files in the same project.

### TypeScript in `.ts` Files

Regular `.ts` files (data files, utilities, types) work exactly as you would expect:

```typescript
// src/lib/data/services.ts
import type { Service } from '$lib/types';

export const services: Service[] = [
	{
		title: 'Fullstack Web Development',
		description: 'Custom web applications...',
		icon: 'code',
		features: ['SvelteKit & Next.js', 'TypeScript-first'],
		slug: 'fullstack-development'
	}
];
```

---

## Basic Types

TypeScript provides types for all JavaScript values. Here are the ones you will use most in Svelte projects.

### Primitive Types

```typescript
let siteName: string = 'ShipForge';
let projectCount: number = 42;
let isPublished: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;
```

### Arrays

```typescript
let tags: string[] = ['svelte', 'typescript', 'seo'];
let scores: number[] = [98, 85, 92];
let flags: boolean[] = [true, false, true];

// Alternative syntax (generic form)
let items: Array<string> = ['item1', 'item2'];
```

### Objects

```typescript
// Inline object type
let config: { host: string; port: number; debug: boolean } = {
	host: 'localhost',
	port: 3000,
	debug: true
};

// Typically you'd use an interface instead (see next section)
```

### Tuples

```typescript
// Fixed-length array with specific types at each position
let pair: [string, number] = ['price', 99];
let rgb: [number, number, number] = [255, 128, 0];
```

### Special Types

```typescript
// any — disables type checking (avoid when possible)
let data: any = fetchSomething();

// unknown — type-safe alternative to any (must narrow before use)
let input: unknown = getInput();
if (typeof input === 'string') {
	console.log(input.toUpperCase()); // OK after narrowing
}

// void — for functions that return nothing
function logMessage(msg: string): void {
	console.log(msg);
}

// never — for functions that never return (throw or infinite loop)
function fail(message: string): never {
	throw new Error(message);
}
```

---

## Interfaces and Type Aliases

### Interfaces

Interfaces define the **shape** of an object. They are the primary way to describe data structures in TypeScript.

```typescript
interface BlogPost {
	title: string;
	excerpt: string;
	date: string;
	category: string;
	slug: string;
	readTime: string;
}
```

### Optional Properties

Use `?` for properties that may or may not exist:

```typescript
interface SEOMetadata {
	title: string;
	description: string;
	canonical?: string;      // optional
	ogImage?: string;        // optional
	ogType?: string;         // optional
	twitterCard?: string;    // optional
	schema?: Record<string, unknown>;  // optional
}
```

### Type Aliases

`type` creates a named alias for any type. It can do everything an interface can, plus more:

```typescript
// Simple alias
type Slug = string;
type ID = number;

// Union type (cannot be done with interface)
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

// Object shape (similar to interface)
type Metric = {
	label: string;
	value: string;
};

// Function type
type ClickHandler = (event: MouseEvent) => void;
```

### When to Use Interface vs Type

| Use `interface` when... | Use `type` when... |
|---|---|
| Defining object shapes | Defining union types (`'a' \| 'b'`) |
| Defining component Props | Creating type aliases (`type ID = string`) |
| Extending other interfaces | Combining types with `&` (intersection) |
| Working with class contracts | Typing function signatures |

In practice, both work for object shapes. The ShipForge project uses `interface` for data models and component props.

---

## Typing Component Props

Svelte 5 uses `$props()` for component props. TypeScript integration is straightforward — define an interface and destructure `$props()` with that type.

### Basic Typed Props

```svelte
<!-- src/lib/components/SectionHeader.svelte (from ShipForge) -->
<script lang="ts">
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
		align = 'center'
	}: Props = $props();
</script>
```

### Props with Snippets

When a component accepts children or named content areas, use the `Snippet` type:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		icon?: Snippet;
		padding?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let {
		children,
		icon,
		padding = 'md',
		class: className = ''
	}: Props = $props();
</script>
```

### Props with Complex Types

```svelte
<!-- src/lib/components/ServiceCard.svelte (from ShipForge) -->
<script lang="ts">
	import type { Service } from '$lib/types';

	interface Props {
		service: Service;
	}

	let { service }: Props = $props();
</script>
```

### Rest Props

Use `...restProps` to pass through additional HTML attributes:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		children: Snippet;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		[key: string]: unknown;  // allow any other HTML attributes
	}

	let {
		variant = 'primary',
		size = 'md',
		href,
		type = 'button',
		disabled = false,
		children,
		onclick,
		class: className = '',
		...restProps
	}: Props = $props();
</script>
```

### The `class` Prop Pattern

Since `class` is a reserved word in JavaScript, the ShipForge components use the alias pattern:

```svelte
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class="component {className}">
	<!-- ... -->
</div>
```

---

## Typing State

### Basic `$state` Typing

TypeScript infers the type from the initial value:

```svelte
<script lang="ts">
	let count = $state(0);           // inferred as number
	let name = $state('ShipForge');   // inferred as string
	let visible = $state(true);       // inferred as boolean
</script>
```

### Explicit `$state<Type>()` Annotation

When the initial value does not fully represent the type (e.g., it could be `null` later, or you want a specific union type), provide an explicit type parameter:

```svelte
<script lang="ts">
	import type { BlogPost } from '$lib/types';

	// Could be null before data loads
	let selectedPost = $state<BlogPost | null>(null);

	// Array that starts empty — inferred as never[] without annotation
	let items = $state<string[]>([]);

	// Union type
	let status = $state<'idle' | 'loading' | 'error' | 'success'>('idle');

	// Complex object
	let formData = $state<{
		name: string;
		email: string;
		message: string;
	}>({
		name: '',
		email: '',
		message: ''
	});
</script>
```

### Typing `$derived`

`$derived` infers its type from the expression:

```svelte
<script lang="ts">
	let price = $state(100);
	let quantity = $state(2);

	let total = $derived(price * quantity);           // number
	let formatted = $derived(`$${total.toFixed(2)}`); // string
	let isExpensive = $derived(total > 500);          // boolean
</script>
```

For `$derived.by()` with complex return types:

```svelte
<script lang="ts">
	import type { Service } from '$lib/types';

	let services = $state<Service[]>([]);
	let searchQuery = $state('');

	let filtered = $derived.by((): Service[] => {
		if (!searchQuery) return services;
		return services.filter(s =>
			s.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
	});
</script>
```

---

## Typing Events

### Event Handler Types

Svelte 5 uses native DOM event attributes, so you use standard DOM event types:

```svelte
<script lang="ts">
	function handleClick(event: MouseEvent) {
		console.log(event.clientX, event.clientY);
	}

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		console.log(target.value);
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			// handle enter
		}
	}
</script>

<button onclick={handleClick}>Click me</button>
<input oninput={handleInput} />
<form onsubmit={handleSubmit}>...</form>
<input onkeydown={handleKeyDown} />
```

### Common DOM Event Types

| Event Type | Used With |
|---|---|
| `MouseEvent` | `onclick`, `onmouseenter`, `onmouseleave`, `oncontextmenu` |
| `KeyboardEvent` | `onkeydown`, `onkeyup`, `onkeypress` |
| `FocusEvent` | `onfocus`, `onblur` |
| `InputEvent` | `oninput` |
| `Event` | `onchange`, generic events |
| `SubmitEvent` | `onsubmit` |
| `DragEvent` | `ondrag`, `ondrop`, `ondragover` |
| `TouchEvent` | `ontouchstart`, `ontouchend`, `ontouchmove` |
| `WheelEvent` | `onwheel` |
| `ClipboardEvent` | `oncopy`, `onpaste`, `oncut` |

### Callback Props (Component Events)

In Svelte 5, components use **callback props** instead of event dispatching:

```svelte
<!-- SearchInput.svelte -->
<script lang="ts">
	interface Props {
		value: string;
		onchange: (newValue: string) => void;
		onsearch?: (query: string) => void;
	}

	let { value, onchange, onsearch }: Props = $props();

	function handleInput(e: Event) {
		const newValue = (e.currentTarget as HTMLInputElement).value;
		onchange(newValue);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			onsearch?.(value);
		}
	}
</script>

<input
	{value}
	oninput={handleInput}
	onkeydown={handleKeyDown}
	type="search"
/>
```

**Using it:**

```svelte
<SearchInput
	value={query}
	onchange={(v) => query = v}
	onsearch={(q) => performSearch(q)}
/>
```

---

## Generics Basics

Generics let you write reusable code that works with multiple types while maintaining type safety.

### Generic Functions

```typescript
// A function that works with any type
function first<T>(items: T[]): T | undefined {
	return items[0];
}

const firstService = first(services);  // Service | undefined
const firstTag = first(['svelte', 'ts']); // string | undefined
```

### Generic Interfaces

```typescript
// API response wrapper
interface ApiResponse<T> {
	data: T;
	status: number;
	message: string;
}

// Usage
type ServicesResponse = ApiResponse<Service[]>;
type PostResponse = ApiResponse<BlogPost>;
```

### Generic Components

Svelte 5 supports generic components via the `generics` attribute:

```svelte
<!-- DataList.svelte -->
<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props {
		items: T[];
		renderItem: Snippet<[T]>;
		emptyMessage?: string;
	}

	let { items, renderItem, emptyMessage = 'No items' }: Props = $props();
</script>

{#if items.length === 0}
	<p>{emptyMessage}</p>
{:else}
	{#each items as item}
		{@render renderItem(item)}
	{/each}
{/if}
```

**Using the generic component:**

```svelte
<script lang="ts">
	import type { Service } from '$lib/types';
	import DataList from './DataList.svelte';

	let services: Service[] = $state([]);
</script>

<DataList items={services}>
	{#snippet renderItem(service)}
		<p>{service.title}</p>  <!-- fully typed! -->
	{/snippet}
</DataList>
```

### Generic Constraints

Restrict generics to certain shapes:

```typescript
// T must have a 'slug' property
function findBySlug<T extends { slug: string }>(items: T[], slug: string): T | undefined {
	return items.find(item => item.slug === slug);
}

// Works with Service, BlogPost, CaseStudy — anything with a slug
const service = findBySlug(services, 'technical-seo');
const post = findBySlug(blogPosts, 'sveltekit-tips');
```

---

## Import Types Pattern

### `import type` Syntax

Use `import type` when you only need the type at compile time (not at runtime). This helps tree-shaking and makes intentions clear:

```typescript
// Good — type-only import (removed during compilation)
import type { Service, BlogPost, CaseStudy } from '$lib/types';
import type { PageLoad } from './$types';
import type { Snippet } from 'svelte';

// Also valid — inline type import
import { type Service, services } from '$lib/data/services';
```

### When to Use `import type`

```typescript
// USE import type when:
import type { Service } from '$lib/types';           // Only used as a type annotation
import type { PageLoad } from './$types';              // Only used for typing load function
import type { Snippet } from 'svelte';                 // Only used in Props interface

// USE regular import when:
import { error, fail } from '@sveltejs/kit';           // Used as runtime values
import { goto } from '$app/navigation';                 // Called as a function
import { services } from '$lib/data/services';          // Used as actual data
```

### `$types` — SvelteKit Generated Types

SvelteKit auto-generates types for each route. Use them to type load functions and form actions:

```typescript
// These types are generated based on your route structure
import type { PageLoad } from './$types';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import type { LayoutLoad } from './$types';

export const load: PageLoad = ({ params, url }) => {
	// params is typed based on your route's dynamic segments
	// For /blog/[slug], params = { slug: string }
	return { slug: params.slug };
};
```

---

## Union Types and Discriminated Unions

### Union Types

A union type allows a value to be one of several types:

```typescript
// String literal unions — great for component variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type Alignment = 'center' | 'left';

// Value unions
type StringOrNumber = string | number;
type MaybeNull<T> = T | null;

// Usage in ShipForge components
interface Props {
	variant?: ButtonVariant;  // only accepts valid variants
	size?: Size;              // 'sm', 'md', or 'lg'
	align?: Alignment;        // 'center' or 'left'
}
```

### Discriminated Unions

A discriminated union uses a shared property (the "discriminant") to distinguish between variants. This is extremely powerful for modeling states.

```typescript
// Model loading states
type AsyncState<T> =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'error'; error: string }
	| { status: 'success'; data: T };

// TypeScript narrows the type based on the discriminant
function handleState(state: AsyncState<Service[]>) {
	switch (state.status) {
		case 'idle':
			// state is { status: 'idle' }
			break;
		case 'loading':
			// state is { status: 'loading' }
			break;
		case 'error':
			// state is { status: 'error'; error: string }
			console.error(state.error);
			break;
		case 'success':
			// state is { status: 'success'; data: Service[] }
			console.log(state.data.length);
			break;
	}
}
```

### Discriminated Unions in Svelte Templates

```svelte
<script lang="ts">
	type FetchState =
		| { status: 'loading' }
		| { status: 'error'; message: string }
		| { status: 'success'; posts: BlogPost[] };

	let state = $state<FetchState>({ status: 'loading' });
</script>

{#if state.status === 'loading'}
	<p>Loading posts...</p>
{:else if state.status === 'error'}
	<p class="error">{state.message}</p>
{:else}
	{#each state.posts as post}
		<BlogCard {post} />
	{/each}
{/if}
```

---

## Utility Types

TypeScript provides built-in utility types that transform existing types. These are essential for everyday development.

### `Partial<T>` — Make All Properties Optional

```typescript
interface ContactFormData {
	name: string;
	email: string;
	company: string;
	service: string;
	message: string;
}

// All properties become optional — useful for form updates
type PartialContact = Partial<ContactFormData>;

// Equivalent to:
// { name?: string; email?: string; company?: string; ... }

function updateForm(current: ContactFormData, updates: Partial<ContactFormData>) {
	return { ...current, ...updates };
}
```

### `Pick<T, Keys>` — Select Specific Properties

```typescript
// Only pick the fields you need
type ContactPreview = Pick<ContactFormData, 'name' | 'email'>;
// { name: string; email: string }

type PostSummary = Pick<BlogPost, 'title' | 'slug' | 'date'>;
// { title: string; slug: string; date: string }
```

### `Omit<T, Keys>` — Remove Specific Properties

```typescript
// Everything except 'slug'
type ServiceInput = Omit<Service, 'slug'>;
// { title: string; description: string; icon: string; features: string[] }

// Remove internal fields for API response
type PublicCaseStudy = Omit<CaseStudy, 'slug' | 'image'>;
```

### `Record<Keys, Value>` — Object with Specific Key-Value Types

```typescript
// Map icon names to components
const iconMap: Record<string, typeof Code> = {
	'code': Code,
	'magnifying-glass': MagnifyingGlass,
	'palette': Palette,
	'lightning': Lightning
};

// Map service slugs to colors
const colorMap: Record<string, string> = {
	'fullstack-development': '#3b82f6',
	'technical-seo': '#10b981',
	'ui-ux-design': '#8b5cf6',
	'performance-optimization': '#f59e0b'
};

// Flexible schema objects (from ShipForge's SEOMetadata)
interface SEOMetadata {
	schema?: Record<string, unknown>;
}
```

### `Required<T>` — Make All Properties Required

```typescript
type RequiredSEO = Required<SEOMetadata>;
// All optional properties (canonical, ogImage, etc.) become required
```

### `Readonly<T>` — Make All Properties Readonly

```typescript
type FrozenService = Readonly<Service>;
// Cannot reassign any properties

const service: FrozenService = services[0];
// service.title = 'New Title';  // Error! Cannot assign to 'title'
```

### `NonNullable<T>` — Remove null and undefined

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string
```

### `ReturnType<T>` — Extract Return Type of a Function

```typescript
function createService(title: string): Service {
	return { title, description: '', icon: '', features: [], slug: '' };
}

type ServiceResult = ReturnType<typeof createService>;  // Service
```

### `Parameters<T>` — Extract Parameter Types

```typescript
type CreateServiceParams = Parameters<typeof createService>;  // [string]
```

---

## Typing Data Files and Function Returns

### Typed Data Arrays

The ShipForge project types its data files with explicit type annotations:

```typescript
// src/lib/data/services.ts
import type { Service } from '$lib/types';

export const services: Service[] = [
	{
		title: 'Fullstack Web Development',
		description: 'Custom web applications built with modern frameworks...',
		icon: 'code',
		features: [
			'SvelteKit & Next.js applications',
			'TypeScript-first architecture'
		],
		slug: 'fullstack-development'
	}
	// TypeScript validates every object matches the Service interface
];
```

Without the `: Service[]` annotation, TypeScript would infer a very specific type from the literal values. The explicit annotation ensures:

1. Every object has all required `Service` properties.
2. No extra/misspelled properties sneak in.
3. The array is typed as `Service[]` everywhere it is used.

### Typed Load Functions

```typescript
// src/routes/services/+page.ts
import type { PageLoad } from './$types';
import { services } from '$lib/data/services';

export const load: PageLoad = () => {
	return {
		services,
		pageTitle: 'Our Services'
	};
};
// Return type is inferred: { services: Service[]; pageTitle: string }
```

### Typed Utility Functions

```typescript
// src/lib/utils/seo.ts
import type { SEOMetadata } from '$lib/types';

export function createSEO(overrides: Partial<SEOMetadata>): SEOMetadata {
	return {
		title: 'ShipForge',
		description: 'Fullstack Development & SEO Agency',
		ogType: 'website',
		twitterCard: 'summary_large_image',
		...overrides
	};
}
```

### Typing `fetch` Responses

```typescript
interface ApiResponse<T> {
	data: T;
	total: number;
}

async function fetchPosts(): Promise<BlogPost[]> {
	const response = await fetch('/api/posts');
	const json: ApiResponse<BlogPost[]> = await response.json();
	return json.data;
}
```

### Typing Helper Functions with Explicit Returns

```typescript
// From ShipForge BlogCard
function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

// Filter function with typed return
function getPublishedPosts(posts: BlogPost[]): BlogPost[] {
	return posts.filter(post => new Date(post.date) <= new Date());
}

// Find function with possible undefined
function findServiceBySlug(slug: string): Service | undefined {
	return services.find(s => s.slug === slug);
}
```

---

## ShipForge Type Examples

The ShipForge project defines its types in `src/lib/types/index.ts`. Here is the complete type system with explanations.

### Domain Types

```typescript
// src/lib/types/index.ts

/** A service offering — displayed on the Services page */
export interface Service {
	title: string;
	description: string;
	icon: string;          // key into the icon map
	features: string[];    // list of bullet points
	slug: string;          // URL-safe identifier
}

/** A case study — displayed on the Case Studies page */
export interface CaseStudy {
	title: string;
	client: string;
	description: string;
	tags: string[];                              // technology tags
	metrics: { label: string; value: string }[]; // results (e.g., "Load Time", "0.8s")
	image: string;
	slug: string;
}

/** A team member — displayed on the About page */
export interface TeamMember {
	name: string;
	role: string;
	bio: string;
	image: string;
}

/** A blog post — displayed on the Blog page */
export interface BlogPost {
	title: string;
	excerpt: string;
	date: string;          // ISO date string
	category: string;
	slug: string;
	readTime: string;      // e.g., "5 min read"
}
```

### Form Data Types

```typescript
/** Contact form submission */
export interface ContactFormData {
	name: string;
	email: string;
	company: string;
	service: string;       // selected service slug
	message: string;
}

/** Lead magnet download form */
export interface LeadMagnetFormData {
	name: string;
	email: string;
}
```

### Navigation and SEO Types

```typescript
/** A navigation link */
export interface NavLink {
	label: string;
	href: string;
}

/** SEO metadata for a page */
export interface SEOMetadata {
	title: string;
	description: string;
	canonical?: string;
	ogImage?: string;
	ogType?: string;
	twitterCard?: string;
	schema?: Record<string, unknown>;
}
```

### How These Types Flow Through the Application

```
src/lib/types/index.ts          Define the interfaces
        ↓
src/lib/data/services.ts        Type the data arrays (Service[])
        ↓
src/routes/services/+page.ts    Return typed data from load()
        ↓
src/routes/services/+page.svelte    Receive via $props() as data
        ↓
src/lib/components/ServiceCard.svelte   Receive Service as prop
```

This creates a **type-safe pipeline** from data definition to UI rendering. If you add a new field to the `Service` interface, TypeScript will tell you every data file that needs updating and every component that can now use the new field.

### Extending ShipForge Types

When you need to add new domain types, follow the established patterns:

```typescript
// Add to src/lib/types/index.ts

/** A testimonial from a client */
export interface Testimonial {
	quote: string;
	author: string;
	company: string;
	role: string;
	avatar?: string;
	rating: 1 | 2 | 3 | 4 | 5;  // constrained to valid ratings
}

/** A FAQ item */
export interface FAQ {
	question: string;
	answer: string;
	category: Pick<Service, 'slug'>['slug'];  // ties to a service
}
```

Then create the data file:

```typescript
// src/lib/data/testimonials.ts
import type { Testimonial } from '$lib/types';

export const testimonials: Testimonial[] = [
	{
		quote: 'ShipForge transformed our web presence.',
		author: 'Jane Doe',
		company: 'Acme Corp',
		role: 'CTO',
		rating: 5
	}
];
```

---

## Quick Reference: Common Type Patterns in Svelte 5

| Pattern | Example |
|---|---|
| Typed props | `let { title }: Props = $props()` |
| Typed state | `let items = $state<string[]>([])` |
| Nullable state | `let selected = $state<Service \| null>(null)` |
| Derived type | `let total = $derived(price * qty)` (inferred) |
| Event handler | `function handle(e: MouseEvent) {}` |
| Snippet prop | `children: Snippet` |
| Snippet with args | `renderItem: Snippet<[Service]>` |
| Import type | `import type { Service } from '$lib/types'` |
| Load function | `export const load: PageLoad = () => {}` |
| Rest props | `let { href, ...rest }: Props = $props()` |
| Class prop | `let { class: className = '' }: Props = $props()` |

---

*All examples reference the ShipForge codebase. See `src/lib/types/index.ts` for the full type definitions and `src/lib/components/` for typed component implementations.*
