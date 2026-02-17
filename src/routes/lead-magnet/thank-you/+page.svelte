<script lang="ts">
	import { SEOHead, Button } from '$lib/components';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import Briefcase from 'phosphor-svelte/lib/Briefcase';
	import Article from 'phosphor-svelte/lib/Article';
	import Rocket from 'phosphor-svelte/lib/Rocket';
	import House from 'phosphor-svelte/lib/House';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	const nextSteps = [
		{
			icon: Briefcase,
			title: 'Browse Case Studies',
			description: 'See how we helped real clients boost traffic and conversions.',
			href: '/case-studies'
		},
		{
			icon: Article,
			title: 'Read the Blog',
			description: 'Deep dives on SEO, performance, and modern web development.',
			href: '/blog'
		},
		{
			icon: Rocket,
			title: 'Start a Project',
			description: 'Ready to build? Let us know about your goals and timeline.',
			href: '/contact'
		}
	];
</script>

<SEOHead
	metadata={{
		title: 'Thank You | ShipForge',
		description: 'Your free guide is on its way. Check your inbox for The Fullstack SEO Playbook.'
	}}
/>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="thank-you section">
	<div class="container">
		<!-- Success message -->
		<div class="success">
			<div class="success__icon">
				<CheckCircle size={64} weight="fill" />
			</div>
			<h1 class="success__heading">Thank You!</h1>
			<p class="success__message">
				Your copy of <strong>The Fullstack SEO Playbook</strong> is on its way. Check your email
				inbox (and your spam folder, just in case) for the download link.
			</p>
		</div>

		<!-- What's Next -->
		<div class="next-steps">
			<h2 class="next-steps__heading">What's Next?</h2>
			<div class="next-steps__grid">
				{#each nextSteps as step}
					<a href={step.href} class="step-card">
						<div class="step-card__icon">
							<step.icon size={28} weight="duotone" />
						</div>
						<h3 class="step-card__title">{step.title}</h3>
						<p class="step-card__description">{step.description}</p>
						<span class="step-card__link">
							Learn more <ArrowRight size={16} weight="bold" />
						</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Back to home -->
		<div class="home-link">
			<Button href="/" variant="ghost" size="md">
				<House size={18} weight="bold" />
				Back to Home
			</Button>
		</div>
	</div>
</section>

<style>
	.thank-you {
		min-height: 100vh;
		display: flex;
		align-items: center;
		background: linear-gradient(
			180deg,
			var(--color-primary-50) 0%,
			var(--color-white) 40%
		);
	}

	/* Success block */
	.success {
		text-align: center;
		max-width: 36rem;
		margin-inline: auto;
		margin-bottom: var(--space-16);
	}

	.success__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 5rem;
		height: 5rem;
		color: var(--color-success);
		background-color: rgb(16 185 129 / 0.1);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-6);
	}

	.success__heading {
		margin-bottom: var(--space-4);
	}

	.success__message {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.7;
	}

	.success__message strong {
		color: var(--color-text);
	}

	/* Next steps */
	.next-steps {
		max-width: 56rem;
		margin-inline: auto;
		margin-bottom: var(--space-12);
	}

	.next-steps__heading {
		text-align: center;
		margin-bottom: var(--space-8);
		font-size: var(--text-2xl);
	}

	.next-steps__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-6);
	}

	@media (min-width: 768px) {
		.next-steps__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.step-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-6);
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition:
			box-shadow var(--transition-base),
			transform var(--transition-base);
		text-decoration: none;
		color: inherit;
	}

	.step-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
	}

	.step-card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.step-card__title {
		font-size: var(--text-lg);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-2);
	}

	.step-card__description {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.7;
		flex-grow: 1;
		margin-bottom: var(--space-4);
	}

	.step-card__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
		transition: gap var(--transition-fast);
	}

	.step-card:hover .step-card__link {
		gap: var(--space-3);
	}

	/* Home link */
	.home-link {
		text-align: center;
	}
</style>
