<script lang="ts">
	import { SEOHead, SectionHeader, ServiceCard, StatCounter, CaseStudyCard, Button } from '$lib/components';
	import { services } from '$lib/data/services';
	import { caseStudies } from '$lib/data/case-studies';
	import { getDefaultMeta, buildOrganizationSchema } from '$lib/utils/seo';
	import type { SEOMetadata } from '$lib/types';

	const seoMetadata: SEOMetadata = {
		...getDefaultMeta(),
		canonical: 'https://shipforge.dev',
		schema: buildOrganizationSchema()
	};

	const featuredCaseStudies = caseStudies.slice(0, 2);

	const stats = [
		{ value: '150+', label: 'Projects Delivered' },
		{ value: '98', label: 'Average Lighthouse Score' },
		{ value: '12x', label: 'Average Traffic Growth' },
		{ value: '4.9', label: 'Client Satisfaction' }
	] as const;
</script>

<SEOHead metadata={seoMetadata} />

<!-- Hero Section -->
<section class="hero section--dark" aria-labelledby="hero-heading">
	<div class="container hero__inner">
		<h1 id="hero-heading" class="hero__title" data-animate="fade-up">
			Build Faster. Rank Higher. Convert More.
		</h1>
		<p class="hero__subtitle" data-animate="fade-up" data-animate-delay="100">
			ShipForge is a fullstack development and SEO agency that builds
			high-performance web applications engineered to dominate search rankings
			and turn visitors into customers.
		</p>
		<div class="hero__actions" data-animate="fade-up" data-animate-delay="200">
			<Button variant="primary" size="lg" href="/contact">Start Your Project</Button>
			<Button variant="outline" size="lg" href="/case-studies" class="hero__btn-secondary">View Our Work</Button>
		</div>
	</div>
</section>

<!-- Services Preview Section -->
<section class="section" aria-labelledby="services-heading">
	<div class="container">
		<SectionHeader
			eyebrow="What We Do"
			title="Engineering Meets Strategy"
			subtitle="We combine deep technical expertise with data-driven marketing strategy to build web experiences that perform on every level."
		/>
		<div class="grid grid--4" data-animate="stagger-up">
			{#each services as service (service.slug)}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="section section--dark stats-section" aria-label="Company statistics">
	<div class="container">
		<div class="stats-grid" data-animate="stagger-up">
			{#each stats as stat (stat.label)}
				<StatCounter value={stat.value} label={stat.label} class="stats-grid__item" />
			{/each}
		</div>
	</div>
</section>

<!-- Case Studies Preview Section -->
<section class="section section--alt" aria-labelledby="case-studies-heading">
	<div class="container">
		<SectionHeader
			eyebrow="Our Work"
			title="Results That Speak for Themselves"
			subtitle="Every project is a partnership. Here are some of the outcomes we have delivered for our clients."
		/>
		<div class="grid grid--2" data-animate="stagger-up">
			{#each featuredCaseStudies as caseStudy (caseStudy.slug)}
				<CaseStudyCard {caseStudy} />
			{/each}
		</div>
		<div class="case-studies__action">
			<Button variant="outline" size="lg" href="/case-studies">View All Case Studies</Button>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section cta-section" aria-labelledby="cta-heading">
	<div class="container cta-section__inner">
		<h2 id="cta-heading" class="cta-section__title" data-animate="fade-up">Ready to Ship?</h2>
		<p class="cta-section__text" data-animate="fade-up" data-animate-delay="100">
			Whether you need a blazing-fast web app, a technical SEO overhaul, or a
			full digital transformation, we are ready to make it happen. Let us
			show you what ShipForge can do for your business.
		</p>
		<div data-animate="fade-up" data-animate-delay="200">
			<Button variant="primary" size="lg" href="/contact">Get a Free Consultation</Button>
		</div>
	</div>
</section>

<style>
	/* ============================================
	   Hero Section
	   ============================================ */
	.hero {
		display: flex;
		align-items: center;
		min-height: 85vh;
		background-color: var(--color-bg-dark);
		position: relative;
		overflow: hidden;
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse at 30% 20%,
			rgba(79, 70, 229, 0.15) 0%,
			transparent 60%
		),
		radial-gradient(
			ellipse at 70% 80%,
			rgba(6, 182, 212, 0.1) 0%,
			transparent 50%
		);
		pointer-events: none;
	}

	.hero__inner {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-block: var(--space-16);
		max-width: var(--container-lg);
		margin-inline: auto;
	}

	.hero__title {
		color: var(--color-white);
		margin-bottom: var(--space-6);
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		color: var(--color-gray-300);
		line-height: 1.7;
		max-width: 42rem;
		margin-bottom: var(--space-10);
	}

	.hero__actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		width: 100%;
		align-items: center;
	}

	@media (min-width: 640px) {
		.hero__actions {
			flex-direction: row;
			justify-content: center;
			width: auto;
		}
	}

	/* Override outline button color for dark backgrounds */
	.hero__actions :global(.hero__btn-secondary) {
		color: var(--color-white);
		border-color: var(--color-white);
	}

	.hero__actions :global(.hero__btn-secondary:hover) {
		background-color: var(--color-white);
		color: var(--color-gray-900);
	}

	/* ============================================
	   Stats Section
	   ============================================ */
	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(4, 1fr);
			gap: var(--space-8);
		}
	}

	.stats-grid :global(.stats-grid__item) {
		padding: var(--space-6);
	}

	/* Override StatCounter colors for dark background */
	.stats-section :global(.stat__value) {
		color: var(--color-white);
	}

	.stats-section :global(.stat__label) {
		color: var(--color-gray-400);
	}

	/* ============================================
	   Case Studies Preview
	   ============================================ */
	.case-studies__action {
		display: flex;
		justify-content: center;
		margin-top: var(--space-12);
	}

	/* ============================================
	   CTA Section
	   ============================================ */
	.cta-section {
		background: linear-gradient(
			135deg,
			var(--color-primary-dark) 0%,
			var(--color-primary) 50%,
			var(--color-secondary-dark) 100%
		);
	}

	.cta-section__inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		max-width: var(--container-md);
		margin-inline: auto;
	}

	.cta-section__title {
		color: var(--color-white);
		margin-bottom: var(--space-6);
	}

	.cta-section__text {
		font-size: var(--text-lg);
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.7;
		max-width: 38rem;
		margin-bottom: var(--space-10);
	}

	/* Make the primary button stand out on the gradient background */
	.cta-section :global(.btn--primary) {
		background-color: var(--color-white);
		color: var(--color-primary-dark);
		border-color: var(--color-white);
	}

	.cta-section :global(.btn--primary:hover) {
		background-color: var(--color-gray-100);
		border-color: var(--color-gray-100);
		box-shadow: var(--shadow-lg);
	}
</style>
