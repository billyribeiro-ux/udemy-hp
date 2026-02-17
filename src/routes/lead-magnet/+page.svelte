<script lang="ts">
	import { goto } from '$app/navigation';
	import { SEOHead, Button } from '$lib/components';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import BookOpen from 'phosphor-svelte/lib/BookOpen';
	import Rocket from 'phosphor-svelte/lib/Rocket';
	import MagnifyingGlass from 'phosphor-svelte/lib/MagnifyingGlass';
	import Lightning from 'phosphor-svelte/lib/Lightning';
	import Globe from 'phosphor-svelte/lib/Globe';
	import Shield from 'phosphor-svelte/lib/Shield';
	import SpinnerGap from 'phosphor-svelte/lib/SpinnerGap';
	import type { LeadMagnetFormData } from '$lib/types';

	let formData: LeadMagnetFormData = $state({
		name: '',
		email: ''
	});

	let errors: Partial<Record<keyof LeadMagnetFormData, string>> = $state({});
	let submitting = $state(false);
	let submitted = $state(false);

	const benefits = [
		{ icon: MagnifyingGlass, text: 'On-page & technical SEO fundamentals for developers' },
		{ icon: Rocket, text: 'Performance optimization tactics that boost rankings' },
		{ icon: Lightning, text: 'Core Web Vitals — what they are and how to ace them' },
		{ icon: Globe, text: 'How to structure SvelteKit apps for maximum crawlability' },
		{ icon: Shield, text: 'Common SEO mistakes fullstack engineers make' },
		{ icon: BookOpen, text: 'A real-world checklist you can use on every project' }
	];

	function validate(): boolean {
		const newErrors: Partial<Record<keyof LeadMagnetFormData, string>> = {};

		if (!formData.name.trim() || formData.name.trim().length < 2) {
			newErrors.name = 'Please enter your name (at least 2 characters).';
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required.';
		} else if (!emailPattern.test(formData.email.trim())) {
			newErrors.email = 'Please enter a valid email address.';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!validate()) return;

		submitting = true;

		setTimeout(() => {
			submitting = false;
			submitted = true;
			goto('/lead-magnet/thank-you');
		}, 1500);
	}
</script>

<SEOHead
	metadata={{
		title: 'Free Guide: The Fullstack SEO Playbook | ShipForge',
		description:
			'Download the free Fullstack SEO Playbook. Learn how to build websites that rank on Google and convert visitors into customers.'
	}}
/>

<!-- Hero -->
<section class="hero section">
	<div class="container">
		<div class="hero__grid">
			<!-- Left column: copy + form -->
			<div class="hero__content">
				<span class="hero__eyebrow">Free Download</span>
				<h1 class="hero__heading">The Fullstack SEO Playbook</h1>
				<p class="hero__subtitle">
					A free guide to building websites that rank and convert.
				</p>

				<ul class="benefits">
					{#each benefits as benefit}
						<li class="benefits__item">
							<span class="benefits__icon">
								<benefit.icon size={20} weight="bold" />
							</span>
							<span>{benefit.text}</span>
						</li>
					{/each}
				</ul>

				<!-- Form -->
				<form class="lead-form" onsubmit={handleSubmit} novalidate>
					<div class="form-field">
						<label for="lead-name" class="form-label">First Name</label>
						<input
							id="lead-name"
							type="text"
							class="form-input"
							class:form-input--error={errors.name}
							placeholder="Jane"
							bind:value={formData.name}
							disabled={submitting}
						/>
						{#if errors.name}
							<p class="form-error">{errors.name}</p>
						{/if}
					</div>

					<div class="form-field">
						<label for="lead-email" class="form-label">Email Address</label>
						<input
							id="lead-email"
							type="email"
							class="form-input"
							class:form-input--error={errors.email}
							placeholder="jane@example.com"
							bind:value={formData.email}
							disabled={submitting}
						/>
						{#if errors.email}
							<p class="form-error">{errors.email}</p>
						{/if}
					</div>

					<Button type="submit" variant="primary" size="lg" disabled={submitting} class="lead-form__btn">
						{#if submitting}
							<SpinnerGap size={20} class="spin" />
							Sending...
						{:else}
							Download Free Guide
						{/if}
					</Button>

					<p class="form-disclaimer">No spam, ever. Unsubscribe anytime.</p>
				</form>
			</div>

			<!-- Right column: decorative mockup -->
			<div class="hero__visual">
				<div class="mockup">
					<div class="mockup__header">
						<BookOpen size={32} weight="duotone" />
						<span class="mockup__badge">FREE</span>
					</div>
					<h3 class="mockup__title">The Fullstack SEO Playbook</h3>
					<p class="mockup__author">by ShipForge</p>
					<div class="mockup__divider"></div>
					<ul class="mockup__chapters">
						<li>01 — Technical Foundations</li>
						<li>02 — Core Web Vitals</li>
						<li>03 — Content Architecture</li>
						<li>04 — Structured Data</li>
						<li>05 — Performance Budgets</li>
						<li>06 — Launch Checklist</li>
					</ul>
				</div>
			</div>
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
		min-height: 100vh;
		display: flex;
		align-items: center;
	}

	.hero__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-12);
		align-items: center;
	}

	@media (min-width: 1024px) {
		.hero__grid {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-16);
		}
	}

	.hero__eyebrow {
		display: inline-block;
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-primary);
		margin-bottom: var(--space-3);
	}

	.hero__heading {
		margin-bottom: var(--space-4);
	}

	.hero__subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-8);
	}

	/* Benefits list */
	.benefits {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-10);
	}

	.benefits__item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		font-size: var(--text-base);
		color: var(--color-text);
		line-height: 1.5;
	}

	.benefits__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 1.75rem;
		height: 1.75rem;
		color: var(--color-primary);
		background-color: var(--color-primary-100);
		border-radius: var(--radius-full);
		margin-top: 1px;
	}

	/* Form */
	.lead-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 28rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-base);
		color: var(--color-text);
		background-color: var(--color-white);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		transition:
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
	}

	.form-input::placeholder {
		color: var(--color-text-muted);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-100);
	}

	.form-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-input--error {
		border-color: var(--color-error);
	}

	.form-input--error:focus {
		border-color: var(--color-error);
		box-shadow: 0 0 0 3px rgb(239 68 68 / 0.15);
	}

	.form-error {
		font-size: var(--text-sm);
		color: var(--color-error);
		margin-top: var(--space-1);
	}

	.lead-form :global(.lead-form__btn) {
		width: 100%;
		margin-top: var(--space-2);
	}

	.form-disclaimer {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-align: center;
	}

	/* Decorative mockup card */
	.hero__visual {
		display: flex;
		justify-content: center;
	}

	.mockup {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: var(--space-8) var(--space-6);
		max-width: 22rem;
		width: 100%;
		box-shadow: var(--shadow-xl);
		position: relative;
	}

	.mockup__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-6);
		color: var(--color-primary);
	}

	.mockup__badge {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-white);
		background-color: var(--color-success);
		padding: var(--space-1) var(--space-3);
		border-radius: var(--radius-full);
	}

	.mockup__title {
		font-size: var(--text-xl);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-1);
	}

	.mockup__author {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.mockup__divider {
		height: 1px;
		background-color: var(--color-border);
		margin: var(--space-6) 0;
	}

	.mockup__chapters {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.mockup__chapters li {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-family: var(--font-mono);
		padding: var(--space-2) var(--space-3);
		background-color: var(--color-gray-50);
		border-radius: var(--radius-sm);
	}

	/* Spinner animation */
	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
