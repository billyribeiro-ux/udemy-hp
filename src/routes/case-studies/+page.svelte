<script lang="ts">
	import { SEOHead, SectionHeader, CaseStudyCard, Button } from '$lib/components';
	import { caseStudies } from '$lib/data/case-studies';
</script>

<SEOHead
	metadata={{
		title: 'Case Studies | ShipForge',
		description:
			'Explore real-world results from ShipForge projects. See how we helped clients achieve faster load times, higher conversions, and significant traffic growth.'
	}}
/>

<!-- Hero Banner -->
<section class="hero section">
	<div class="container">
		<div class="hero__content">
			<span class="hero__eyebrow">Our Work</span>
			<h1 class="hero__heading">Results That Speak for Themselves</h1>
			<p class="hero__subtitle">
				We measure success by the impact we create. Explore how we have helped startups and
				established businesses ship faster, rank higher, and convert more.
			</p>
		</div>
	</div>
</section>

<!-- Case Studies Grid -->
<section class="section section--alt">
	<div class="container">
		<SectionHeader
			eyebrow="Portfolio"
			title="Featured Projects"
			subtitle="A selection of projects that showcase our approach to fullstack development and technical SEO."
		/>
		<div class="grid grid--2">
			{#each caseStudies as caseStudy (caseStudy.slug)}
				<CaseStudyCard {caseStudy} />
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="cta section section--dark">
	<div class="container">
		<div class="cta__content">
			<h2 class="cta__heading">Let's Create Your Success Story</h2>
			<p class="cta__subtitle">
				Every great project starts with a conversation. Tell us about your goals and we will
				show you how we can help.
			</p>
			<Button href="/contact" variant="primary" size="lg">Start a Project</Button>
		</div>
	</div>
</section>

<style>
	/* Hero */
	.hero {
		background: linear-gradient(
			135deg,
			var(--color-primary-50) 0%,
			var(--color-white) 50%,
			var(--color-primary-50) 100%
		);
		text-align: center;
	}

	.hero__content {
		max-width: 48rem;
		margin-inline: auto;
	}

	.hero__eyebrow {
		display: inline-block;
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin-bottom: var(--space-4);
	}

	.hero__heading {
		margin-bottom: var(--space-6);
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.7;
		max-width: 40rem;
		margin-inline: auto;
	}

	/* CTA */
	.cta__content {
		text-align: center;
		max-width: 36rem;
		margin-inline: auto;
	}

	.cta__heading {
		color: var(--color-text-inverse);
		margin-bottom: var(--space-4);
	}

	.cta__subtitle {
		font-size: var(--text-lg);
		color: var(--color-gray-300);
		line-height: 1.7;
		margin-bottom: var(--space-8);
	}
</style>
