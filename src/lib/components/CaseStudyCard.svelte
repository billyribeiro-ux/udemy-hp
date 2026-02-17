<script lang="ts">
	import type { CaseStudy } from '$lib/types';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	interface Props {
		caseStudy: CaseStudy;
	}

	let { caseStudy }: Props = $props();
</script>

<article class="case-study-card">
	<div class="case-study-card__tags" aria-label="Tags">
		{#each caseStudy.tags as tag}
			<span class="case-study-card__tag">{tag}</span>
		{/each}
	</div>
	<h3 class="case-study-card__title">{caseStudy.title}</h3>
	<p class="case-study-card__client">{caseStudy.client}</p>
	<p class="case-study-card__description">{caseStudy.description}</p>
	<div class="case-study-card__metrics" role="list" aria-label="Key metrics">
		{#each caseStudy.metrics as metric}
			<div class="case-study-card__metric" role="listitem">
				<span class="case-study-card__metric-value">{metric.value}</span>
				<span class="case-study-card__metric-label">{metric.label}</span>
			</div>
		{/each}
	</div>
	<a href="/case-studies/{caseStudy.slug}" class="case-study-card__link" aria-label="Read case study: {caseStudy.title}">
		View Case Study
		<ArrowRight size={16} weight="bold" />
	</a>
</article>

<style>
	.case-study-card {
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

	.case-study-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
		border-color: var(--color-primary-100);
	}

	.case-study-card__tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.case-study-card__tag {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
	}

	.case-study-card__title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-1);
	}

	.case-study-card__client {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.case-study-card__description {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-6);
	}

	.case-study-card__metrics {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-4);
		padding: var(--space-4);
		background-color: var(--color-bg-alt);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
		margin-top: auto;
	}

	.case-study-card__metric {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.case-study-card__metric-value {
		font-size: var(--text-xl);
		font-weight: 800;
		color: var(--color-primary);
		line-height: 1.2;
	}

	.case-study-card__metric-label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		margin-top: var(--space-1);
	}

	.case-study-card__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
		transition: gap var(--transition-fast);
	}

	.case-study-card__link:hover {
		gap: var(--space-3);
		color: var(--color-primary-dark);
	}
</style>
