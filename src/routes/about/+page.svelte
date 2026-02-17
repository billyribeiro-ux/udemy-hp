<script lang="ts">
	import { SEOHead, SectionHeader, Button, Card } from '$lib/components';
	import Lightbulb from 'phosphor-svelte/lib/Lightbulb';
	import ChartLineUp from 'phosphor-svelte/lib/ChartLineUp';
	import Eye from 'phosphor-svelte/lib/Eye';
	import Rocket from 'phosphor-svelte/lib/Rocket';
	import Lightning from 'phosphor-svelte/lib/Lightning';
	import Target from 'phosphor-svelte/lib/Target';

	const seoMetadata = {
		title: 'About | ShipForge',
		description:
			'ShipForge is a boutique engineering studio that ships high-performance web applications with measurable SEO results. Learn about our mission, values, and approach.'
	};

	const values = [
		{
			icon: Lightbulb,
			title: 'Technical Excellence',
			description:
				'We obsess over code quality. Every component is tested, every bundle is optimized, and every deployment is automated. Your codebase is an asset, not a liability.'
		},
		{
			icon: ChartLineUp,
			title: 'Measurable Results',
			description:
				'Every engagement has KPIs. We define success metrics upfront — Core Web Vitals, conversion rates, organic traffic — and hold ourselves accountable to hitting them.'
		},
		{
			icon: Eye,
			title: 'Transparent Process',
			description:
				'You see every commit, every decision, every trade-off. We work in the open with shared repos, weekly demos, and honest communication about what is working and what is not.'
		}
	];

	const coreValues = [
		{ label: 'Craft', icon: Lightbulb },
		{ label: 'Speed', icon: Lightning },
		{ label: 'Impact', icon: Target }
	];
</script>

<SEOHead metadata={seoMetadata} />

<!-- Hero Section -->
<section class="section hero">
	<div class="container hero__inner">
		<span class="hero__eyebrow">About ShipForge</span>
		<h1 class="hero__heading">Engineering Excellence, Delivered.</h1>
		<p class="hero__subtitle">
			We are a boutique engineering studio obsessed with building fast, accessible, and
			SEO-optimized web experiences that drive real business outcomes.
		</p>
	</div>
</section>

<!-- Story Section -->
<section class="section section--alt">
	<div class="container story">
		<div class="story__text">
			<h2 class="story__heading">Our Story</h2>
			<p class="story__paragraph">
				ShipForge was founded on a simple observation: too many businesses invest in web
				applications that look great but fail to perform. Slow load times, poor search
				visibility, and fragile codebases cost companies millions in lost revenue every year.
			</p>
			<p class="story__paragraph">
				We set out to change that. By combining deep technical expertise in modern frameworks
				like SvelteKit with a rigorous, data-driven approach to SEO and performance, we
				deliver web experiences that are not just beautiful — they are measurably better.
			</p>
			<p class="story__paragraph">
				Our approach is rooted in transparency and craft. We believe that great software is
				built through honest collaboration, tight feedback loops, and an unwavering commitment
				to quality. Every line of code we ship is intentional, tested, and optimized for the
				real world.
			</p>
		</div>
		<div class="story__card">
			<div class="story__card-inner">
				<h3 class="story__card-title">What Drives Us</h3>
				<div class="story__values-list">
					{#each coreValues as value}
						<div class="story__value-item">
							<div class="story__value-icon">
								<value.icon size={24} weight="bold" />
							</div>
							<span class="story__value-label">{value.label}</span>
						</div>
					{/each}
				</div>
				<div class="story__card-accent"></div>
			</div>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="section">
	<div class="container">
		<SectionHeader
			eyebrow="Our Values"
			title="Principles That Guide Every Project"
			subtitle="These are not just words on a wall. They are the standards we hold ourselves to on every engagement, every sprint, every line of code."
		/>
		<div class="values-grid">
			{#each values as value}
				<Card padding="lg">
					<div class="value-card__icon">
						<value.icon size={32} weight="duotone" />
					</div>
					<h3 class="value-card__title">{value.title}</h3>
					<p class="value-card__description">{value.description}</p>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="section section--alt">
	<div class="container team">
		<SectionHeader
			eyebrow="The People"
			title="Our Team"
			subtitle="ShipForge is a boutique studio by design. We keep our team small so every client gets senior-level attention from engineers who have shipped at scale."
		/>
		<div class="team__note">
			<p class="team__note-text">
				We are a tight-knit group of senior engineers, SEO strategists, and performance
				specialists. No juniors learning on your dime, no handoffs to offshore teams. When
				you work with ShipForge, you work directly with the people building your product.
			</p>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="section section--dark">
	<div class="container cta">
		<h2 class="cta__heading">Let's Build Together</h2>
		<p class="cta__subtitle">
			Ready to ship something exceptional? Let's talk about your next project.
		</p>
		<Button variant="primary" size="lg" href="/contact">Get in Touch</Button>
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

	/* Story */
	.story {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-12);
		align-items: start;
	}

	@media (min-width: 768px) {
		.story {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-16);
			align-items: center;
		}
	}

	.story__heading {
		margin-bottom: var(--space-6);
		color: var(--color-text);
	}

	.story__paragraph {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.8;
		margin-bottom: var(--space-4);
	}

	.story__paragraph:last-child {
		margin-bottom: 0;
	}

	.story__card {
		position: relative;
	}

	.story__card-inner {
		position: relative;
		background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		color: var(--color-white);
		overflow: hidden;
	}

	.story__card-title {
		font-size: var(--text-xl);
		font-weight: 700;
		margin-bottom: var(--space-8);
		color: var(--color-white);
	}

	.story__values-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.story__value-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.story__value-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.story__value-label {
		font-size: var(--text-lg);
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.story__card-accent {
		position: absolute;
		bottom: -2rem;
		right: -2rem;
		width: 8rem;
		height: 8rem;
		background-color: rgba(255, 255, 255, 0.08);
		border-radius: 50%;
	}

	/* Values Grid */
	.values-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
	}

	@media (min-width: 768px) {
		.values-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.values-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.value-card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3.5rem;
		height: 3.5rem;
		background-color: var(--color-primary-50);
		color: var(--color-primary);
		border-radius: var(--radius-lg);
		margin-bottom: var(--space-4);
	}

	.value-card__title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-3);
	}

	.value-card__description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.7;
	}

	/* Team */
	.team__note {
		max-width: 40rem;
		margin-inline: auto;
		text-align: center;
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-8);
	}

	.team__note-text {
		font-size: var(--text-base);
		color: var(--color-text-secondary);
		line-height: 1.8;
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
