<script lang="ts">
	import { SEOHead, Button } from '$lib/components';
	import EnvelopeSimple from 'phosphor-svelte/lib/EnvelopeSimple';
	import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
	import Clock from 'phosphor-svelte/lib/Clock';
	import LinkedinLogo from 'phosphor-svelte/lib/LinkedinLogo';
	import TwitterLogo from 'phosphor-svelte/lib/TwitterLogo';
	import GithubLogo from 'phosphor-svelte/lib/GithubLogo';
	import SpinnerGap from 'phosphor-svelte/lib/SpinnerGap';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import type { ContactFormData } from '$lib/types';

	const serviceOptions = [
		'Fullstack Development',
		'Technical SEO',
		'UI/UX Design',
		'Performance Optimization',
		'Not Sure Yet'
	];

	const socialLinks = [
		{ icon: GithubLogo, label: 'GitHub', href: 'https://github.com/shipforge' },
		{ icon: LinkedinLogo, label: 'LinkedIn', href: 'https://linkedin.com/company/shipforge' },
		{ icon: TwitterLogo, label: 'Twitter', href: 'https://twitter.com/shipforge' }
	];

	let formData: ContactFormData = $state({
		name: '',
		email: '',
		company: '',
		service: '',
		message: ''
	});

	let errors: Partial<Record<keyof ContactFormData, string>> = $state({});
	let submitting = $state(false);
	let submitted = $state(false);

	function validate(): boolean {
		const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

		if (!formData.name.trim() || formData.name.trim().length < 2) {
			newErrors.name = 'Please enter your name (at least 2 characters).';
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required.';
		} else if (!emailPattern.test(formData.email.trim())) {
			newErrors.email = 'Please enter a valid email address.';
		}

		if (!formData.service) {
			newErrors.service = 'Please select a service.';
		}

		if (!formData.message.trim() || formData.message.trim().length < 10) {
			newErrors.message = 'Please enter a message (at least 10 characters).';
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
		}, 1500);
	}
</script>

<SEOHead
	metadata={{
		title: 'Contact | ShipForge',
		description:
			'Get in touch with ShipForge. Tell us about your project and we will get back to you within 24 hours.'
	}}
/>

<!-- Hero -->
<section class="hero section">
	<div class="container">
		<div class="hero__content">
			<span class="hero__eyebrow">Get In Touch</span>
			<h1 class="hero__heading">Let's Build Something Great</h1>
			<p class="hero__subtitle">
				Have a project in mind? Fill out the form and we'll get back to you within one business day.
			</p>
		</div>
	</div>
</section>

<!-- Contact form + info -->
<section class="contact section section--alt">
	<div class="container">
		<div class="contact__grid">
			<!-- Left: form -->
			<div class="contact__form-wrapper">
				{#if submitted}
					<div class="success-card">
						<div class="success-card__icon">
							<CheckCircle size={56} weight="fill" />
						</div>
						<h3 class="success-card__heading">Message Sent!</h3>
						<p class="success-card__text">
							Thanks for reaching out, <strong>{formData.name}</strong>. We'll review your
							message and get back to you within 24 hours.
						</p>
						<Button href="/" variant="outline" size="md">Back to Home</Button>
					</div>
				{:else}
					<form class="contact-form" onsubmit={handleSubmit} novalidate>
						<div class="form-row">
							<div class="form-field">
								<label for="contact-name" class="form-label">Name <span class="required">*</span></label>
								<input
									id="contact-name"
									type="text"
									class="form-input"
									class:form-input--error={errors.name}
									placeholder="Jane Doe"
									bind:value={formData.name}
									disabled={submitting}
								/>
								{#if errors.name}
									<p class="form-error">{errors.name}</p>
								{/if}
							</div>

							<div class="form-field">
								<label for="contact-email" class="form-label">Email <span class="required">*</span></label>
								<input
									id="contact-email"
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
						</div>

						<div class="form-row">
							<div class="form-field">
								<label for="contact-company" class="form-label">Company <span class="optional">(optional)</span></label>
								<input
									id="contact-company"
									type="text"
									class="form-input"
									placeholder="Acme Inc."
									bind:value={formData.company}
									disabled={submitting}
								/>
							</div>

							<div class="form-field">
								<label for="contact-service" class="form-label">Service <span class="required">*</span></label>
								<div class="select-wrapper">
									<select
										id="contact-service"
										class="form-input form-select"
										class:form-input--error={errors.service}
										bind:value={formData.service}
										disabled={submitting}
									>
										<option value="" disabled>Select a service...</option>
										{#each serviceOptions as option}
											<option value={option}>{option}</option>
										{/each}
									</select>
									<CaretDown size={18} class="select-icon" />
								</div>
								{#if errors.service}
									<p class="form-error">{errors.service}</p>
								{/if}
							</div>
						</div>

						<div class="form-field">
							<label for="contact-message" class="form-label">Message <span class="required">*</span></label>
							<textarea
								id="contact-message"
								class="form-input form-textarea"
								class:form-input--error={errors.message}
								rows="5"
								placeholder="Tell us about your project, goals, and timeline..."
								bind:value={formData.message}
								disabled={submitting}
							></textarea>
							{#if errors.message}
								<p class="form-error">{errors.message}</p>
							{/if}
						</div>

						<Button type="submit" variant="primary" size="lg" disabled={submitting} class="contact-form__btn">
							{#if submitting}
								<SpinnerGap size={20} class="spin" />
								Sending...
							{:else}
								Send Message
							{/if}
						</Button>
					</form>
				{/if}
			</div>

			<!-- Right: contact info -->
			<aside class="contact__info">
				<div class="info-card">
					<div class="info-card__icon">
						<EnvelopeSimple size={24} weight="duotone" />
					</div>
					<h4 class="info-card__title">Email Us</h4>
					<a href="mailto:hello@shipforge.dev" class="info-card__link">hello@shipforge.dev</a>
				</div>

				<div class="info-card">
					<div class="info-card__icon">
						<Clock size={24} weight="duotone" />
					</div>
					<h4 class="info-card__title">Response Time</h4>
					<p class="info-card__text">We typically reply within 24 hours on business days.</p>
				</div>

				<div class="social">
					<h4 class="social__title">Follow Us</h4>
					<div class="social__links">
						{#each socialLinks as link}
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="social__link"
								aria-label={link.label}
							>
								<link.icon size={22} weight="regular" />
							</a>
						{/each}
					</div>
				</div>
			</aside>
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

	/* Contact grid */
	.contact__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-12);
		align-items: start;
	}

	@media (min-width: 1024px) {
		.contact__grid {
			grid-template-columns: 1fr 22rem;
			gap: var(--space-16);
		}
	}

	/* Form */
	.contact-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		background-color: var(--color-white);
		padding: var(--space-8);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-5);
	}

	@media (min-width: 640px) {
		.form-row {
			grid-template-columns: 1fr 1fr;
		}
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

	.required {
		color: var(--color-error);
	}

	.optional {
		font-weight: 400;
		color: var(--color-text-muted);
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

	/* Select */
	.select-wrapper {
		position: relative;
	}

	.form-select {
		appearance: none;
		padding-right: var(--space-10);
		cursor: pointer;
	}

	.select-wrapper :global(.select-icon) {
		position: absolute;
		right: var(--space-3);
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-text-muted);
		pointer-events: none;
	}

	/* Textarea */
	.form-textarea {
		resize: vertical;
		min-height: 7rem;
	}

	.contact-form :global(.contact-form__btn) {
		width: 100%;
		margin-top: var(--space-2);
	}

	/* Success card */
	.success-card {
		text-align: center;
		background-color: var(--color-white);
		padding: var(--space-12) var(--space-8);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-sm);
	}

	.success-card__icon {
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

	.success-card__heading {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-4);
	}

	.success-card__text {
		font-size: var(--text-lg);
		color: var(--color-text-secondary);
		line-height: 1.7;
		max-width: 28rem;
		margin-inline: auto;
		margin-bottom: var(--space-8);
	}

	.success-card__text strong {
		color: var(--color-text);
	}

	/* Info sidebar */
	.contact__info {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.info-card {
		background-color: var(--color-white);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.info-card__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.info-card__title {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-2);
	}

	.info-card__link {
		font-size: var(--text-sm);
		color: var(--color-primary);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.info-card__link:hover {
		color: var(--color-primary-dark);
	}

	.info-card__text {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	/* Social */
	.social {
		background-color: var(--color-white);
		padding: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.social__title {
		font-size: var(--text-base);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-4);
	}

	.social__links {
		display: flex;
		gap: var(--space-3);
	}

	.social__link {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		color: var(--color-text-secondary);
		background-color: var(--color-gray-50);
		border-radius: var(--radius-md);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.social__link:hover {
		color: var(--color-primary);
		background-color: var(--color-primary-50);
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
