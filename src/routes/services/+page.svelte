<script lang="ts">
	import { SEOHead, SectionHeader, ServiceCard, Button } from '$lib/components';
	import { services } from '$lib/data/services';
</script>

<SEOHead
	metadata={{
		title: 'Services | ShipForge',
		description:
			'Fullstack web development, technical SEO, UI/UX design, and performance optimization services. ShipForge builds fast, accessible web applications that drive results.'
	}}
/>

<!-- Hero Banner -->
<section class="hero section">
	<div class="container">
		<div class="hero__content">
			<span class="hero__eyebrow">Our Services</span>
			<h1 class="hero__heading">Fullstack Engineering + Technical SEO</h1>
			<p class="hero__subtitle">
				We combine modern web development with data-driven SEO to build applications that are
				fast, accessible, and impossible to ignore in search results.
			</p>
		</div>
	</div>
</section>

<!-- Services Grid -->
<section class="section section--alt">
	<div class="container">
		<SectionHeader
			eyebrow="What We Do"
			title="End-to-End Digital Solutions"
			subtitle="From initial concept to production deployment, we handle every layer of your web stack."
		/>
		<div class="grid grid--2">
			{#each services as service (service.slug)}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>

<!-- Process Section -->
<section class="section">
	<div class="container">
		<SectionHeader
			eyebrow="Our Process"
			title="How We Work"
			subtitle="A proven four-step process that turns your vision into a high-performing digital product."
		/>
		<div class="grid grid--4 process-grid">
			{#each [
				{
					step: 1,
					title: 'Discovery & Strategy',
					description:
						'We dig into your business goals, audience, and competitive landscape to define a clear roadmap.'
				},
				{
					step: 2,
					title: 'Design & Architecture',
					description:
						'We create wireframes, design systems, and technical architecture that set the foundation for success.'
				},
				{
					step: 3,
					title: 'Build & Iterate',
					description:
						'We develop in agile sprints with continuous feedback, shipping working software every week.'
				},
				{
					step: 4,
					title: 'Launch & Optimize',
					description:
						'We deploy, monitor, and continuously optimize for performance, SEO, and conversion.'
				}
			] as processStep (processStep.step)}
				<div class="process-step">
					<span class="process-step__number">{String(processStep.step).padStart(2, '0')}</span>
					<h3 class="process-step__title">{processStep.title}</h3>
					<p class="process-step__description">{processStep.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="cta section section--dark">
	<div class="container">
		<div class="cta__content">
			<h2 class="cta__heading">Ready to Build?</h2>
			<p class="cta__subtitle">
				Let's discuss your project and find the right solution for your business.
			</p>
			<Button href="/contact" variant="primary" size="lg">Get in Touch</Button>
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

	/* Process Steps */
	.process-step {
		text-align: center;
		padding: var(--space-6);
	}

	.process-step__number {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 800;
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-4);
	}

	.process-step__title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-3);
	}

	.process-step__description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.7;
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
