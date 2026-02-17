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

<div class="card card--pad-{padding} {className}">
	{#if icon}
		<div class="card__icon">
			{@render icon()}
		</div>
	{/if}
	<div class="card__body">
		{@render children()}
	</div>
</div>

<style>
	.card {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition:
			box-shadow var(--transition-base),
			transform var(--transition-base);
	}

	.card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.card--pad-sm {
		padding: var(--space-4);
	}

	.card--pad-md {
		padding: var(--space-6);
	}

	.card--pad-lg {
		padding: var(--space-8);
	}

	.card__icon {
		margin-bottom: var(--space-4);
		color: var(--color-primary);
	}

	.card__body {
		width: 100%;
	}
</style>
