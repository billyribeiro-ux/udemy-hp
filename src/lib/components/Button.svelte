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

{#if href && !disabled}
	<a
		{href}
		class="btn btn--{variant} btn--{size} {className}"
		{...restProps}
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		class="btn btn--{variant} btn--{size} {className}"
		{onclick}
		{...restProps}
	>
		{@render children()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		font-family: var(--font-sans);
		font-weight: 600;
		line-height: 1;
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast),
			transform var(--transition-fast);
		text-decoration: none;
		white-space: nowrap;
	}

	.btn:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}

	.btn:active:not(:disabled) {
		transform: translateY(1px);
	}

	/* Sizes */
	.btn--sm {
		font-size: var(--text-sm);
		padding: var(--space-2) var(--space-4);
	}

	.btn--md {
		font-size: var(--text-base);
		padding: var(--space-3) var(--space-6);
	}

	.btn--lg {
		font-size: var(--text-lg);
		padding: var(--space-4) var(--space-8);
	}

	/* Primary */
	.btn--primary {
		background-color: var(--color-primary);
		color: var(--color-white);
		border-color: var(--color-primary);
	}

	.btn--primary:hover:not(:disabled) {
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
		box-shadow: var(--shadow-md);
	}

	/* Secondary */
	.btn--secondary {
		background-color: var(--color-secondary);
		color: var(--color-white);
		border-color: var(--color-secondary);
	}

	.btn--secondary:hover:not(:disabled) {
		background-color: var(--color-secondary-dark);
		border-color: var(--color-secondary-dark);
		box-shadow: var(--shadow-md);
	}

	/* Outline */
	.btn--outline {
		background-color: transparent;
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.btn--outline:hover:not(:disabled) {
		background-color: var(--color-primary);
		color: var(--color-white);
		box-shadow: var(--shadow-md);
	}

	/* Ghost */
	.btn--ghost {
		background-color: transparent;
		color: var(--color-primary);
		border-color: transparent;
	}

	.btn--ghost:hover:not(:disabled) {
		background-color: var(--color-primary-50);
	}

	/* Disabled */
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
