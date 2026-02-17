<script lang="ts">
	import { SEOHead, SectionHeader, Button, BlogCard } from '$lib/components';
	import { blogPosts } from '$lib/data/blog-posts';

	const seoMetadata = {
		title: 'Blog | ShipForge',
		description:
			'Engineering and SEO insights from the ShipForge team. Practical guides on SvelteKit, web performance, Core Web Vitals, and growth strategy.'
	};

	const categories = ['All', 'Engineering', 'SEO', 'Strategy'] as const;

	let activeCategory: string = $state('All');

	let filteredPosts = $derived(
		activeCategory === 'All'
			? blogPosts
			: blogPosts.filter((post) => post.category === activeCategory)
	);
</script>

<SEOHead metadata={seoMetadata} />

<!-- Hero Section -->
<section class="section hero">
	<div class="container hero__inner">
		<span class="hero__eyebrow">Insights</span>
		<h1 class="hero__heading">Engineering & SEO Insights</h1>
		<p class="hero__subtitle">
			Practical knowledge from the trenches. We share what we learn about building
			high-performance web applications, technical SEO, and growth strategy.
		</p>
	</div>
</section>

<!-- Blog Posts Section -->
<section class="section">
	<div class="container">
		<!-- Category Filter -->
		<div class="filter" role="group" aria-label="Filter posts by category">
			{#each categories as category}
				<button
					class="filter__btn"
					class:filter__btn--active={activeCategory === category}
					onclick={() => (activeCategory = category)}
					aria-pressed={activeCategory === category}
				>
					{category}
				</button>
			{/each}
		</div>

		<!-- Blog Grid -->
		{#if filteredPosts.length > 0}
			<div class="blog-grid">
				{#each filteredPosts as post (post.slug)}
					<BlogCard {post} />
				{/each}
			</div>
		{:else}
			<div class="empty-state">
				<p class="empty-state__text">
					No posts found in the "{activeCategory}" category yet. Check back soon or explore
					other categories.
				</p>
				<Button variant="outline" size="sm" onclick={() => (activeCategory = 'All')}>
					View All Posts
				</Button>
			</div>
		{/if}
	</div>
</section>

<!-- CTA Section -->
<section class="section section--dark">
	<div class="container cta">
		<h2 class="cta__heading">Want insights delivered?</h2>
		<p class="cta__subtitle">
			Download our free guide packed with actionable strategies for web performance and
			technical SEO — the same playbook we use with our clients.
		</p>
		<Button variant="primary" size="lg" href="/lead-magnet">Download Free Guide</Button>
	</div>
</section>

<style>
	/* Hero */
	.hero {
		text-align: center;
		background-color: var(--color-bg-dark);
		color: var(--color-text-inverse);
	}

	.hero__inner {
		max-width: var(--container-md);
		margin-inline: auto;
	}

	.hero__eyebrow {
		display: inline-block;
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-secondary);
		margin-bottom: var(--space-4);
	}

	.hero__heading {
		color: var(--color-white);
		margin-bottom: var(--space-6);
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		color: var(--color-gray-300);
		line-height: 1.7;
		max-width: 40rem;
		margin-inline: auto;
	}

	/* Category Filter */
	.filter {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		justify-content: center;
		margin-bottom: var(--space-12);
	}

	.filter__btn {
		font-size: var(--text-sm);
		font-weight: 600;
		padding: var(--space-2) var(--space-5);
		border-radius: var(--radius-full);
		border: 2px solid var(--color-border);
		background-color: var(--color-white);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition:
			background-color var(--transition-fast),
			color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.filter__btn:hover {
		border-color: var(--color-primary-light);
		color: var(--color-primary);
	}

	.filter__btn--active {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-white);
	}

	.filter__btn--active:hover {
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
		color: var(--color-white);
	}

	/* Blog Grid */
	.blog-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 640px) {
		.blog-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: var(--space-16) var(--space-4);
		background-color: var(--color-bg-alt);
		border-radius: var(--radius-lg);
		border: 1px dashed var(--color-border);
	}

	.empty-state__text {
		font-size: var(--text-base);
		color: var(--color-text-muted);
		margin-bottom: var(--space-6);
		max-width: 30rem;
		margin-inline: auto;
		line-height: 1.7;
	}

	/* CTA */
	.cta {
		text-align: center;
		max-width: var(--container-md);
		margin-inline: auto;
	}

	.cta__heading {
		color: var(--color-white);
		margin-bottom: var(--space-4);
	}

	.cta__subtitle {
		font-size: var(--text-lg);
		color: var(--color-gray-300);
		margin-bottom: var(--space-8);
		line-height: 1.7;
	}
</style>
