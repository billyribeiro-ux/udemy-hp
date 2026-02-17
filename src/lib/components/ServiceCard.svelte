<script lang="ts">
	import type { Service } from '$lib/types';
	import Code from 'phosphor-svelte/lib/Code';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import Palette from 'phosphor-svelte/lib/Palette';
	import Lightning from 'phosphor-svelte/lib/Lightning';
	import Check from 'phosphor-svelte/lib/Check';

	interface Props {
		service: Service;
	}

	let { service }: Props = $props();

	const iconMap: Record<string, typeof Code> = {
		'code': Code,
		'magnifying-glass': MagnifyingGlass,
		'palette': Palette,
		'lightning': Lightning
	};

	let IconComponent = $derived(iconMap[service.icon]);
</script>

<article class="service-card">
	<div class="service-card__icon" aria-hidden="true">
		{#if IconComponent}
			<IconComponent size={32} weight="duotone" />
		{/if}
	</div>
	<h3 class="service-card__title">{service.title}</h3>
	<p class="service-card__description">{service.description}</p>
	<ul class="service-card__features" aria-label="Features of {service.title}">
		{#each service.features as feature}
			<li class="service-card__feature">
				<span class="service-card__check" aria-hidden="true">
					<Check size={16} weight="bold" />
				</span>
				{feature}
			</li>
		{/each}
	</ul>
</article>

<style>
	.service-card {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		transition:
			box-shadow var(--transition-base),
			transform var(--transition-base),
			border-color var(--transition-base);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.service-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
		border-color: var(--color-primary-100);
	}

	.service-card__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background-color: var(--color-primary-50);
		color: var(--color-primary);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.service-card__title {
		font-size: var(--text-xl);
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-3);
	}

	.service-card__description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-6);
	}

	.service-card__features {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: auto;
	}

	.service-card__feature {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
	}

	.service-card__check {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		color: var(--color-success);
	}
</style>
