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

<header class="section-header section-header--{align}">
	{#if eyebrow}
		<span class="section-header__eyebrow">{eyebrow}</span>
	{/if}
	<h2 class="section-header__title">{title}</h2>
	{#if subtitle}
		<p class="section-header__subtitle">{subtitle}</p>
	{/if}
</header>

<style>
	.section-header {
		margin-bottom: var(--space-12);
		max-width: 48rem;
	}

	.section-header--center {
		text-align: center;
		margin-inline: auto;
	}

	.section-header--left {
		text-align: left;
	}

	.section-header__eyebrow {
		display: inline-block;
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin-bottom: var(--space-3);
	}

	.section-header__title {
		color: var(--color-text);
		margin-bottom: var(--space-4);
	}

	.section-header__subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.7;
	}
</style>
