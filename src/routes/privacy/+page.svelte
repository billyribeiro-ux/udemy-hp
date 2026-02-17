<script lang="ts">
	import { SEOHead } from '$components';
</script>

<SEOHead
	metadata={{
		title: 'Privacy Policy | ShipForge',
		description:
			'Learn how ShipForge collects, uses, and protects your personal information. Read our full privacy policy.'
	}}
/>

<div class="section">
	<div class="container container--narrow">
		<header class="legal-header">
			<h1>Privacy Policy</h1>
			<p class="legal-updated">Last updated: February 17, 2026</p>
		</header>

		<div class="legal-content">
			<section class="legal-section">
				<h2>Information We Collect</h2>
				<p>
					We collect information that you provide directly to us when using our services. This
					includes:
				</p>
				<ul>
					<li>
						<strong>Personal information</strong> such as your name and email address when you
						contact us, subscribe to our newsletter, or create an account.
					</li>
					<li>
						<strong>Usage data</strong> including pages visited, time spent on our site, browser
						type, device information, and referring URLs.
					</li>
					<li>
						<strong>Communication data</strong> such as messages you send through our contact forms
						or email correspondence.
					</li>
				</ul>
			</section>

			<section class="legal-section">
				<h2>How We Use Your Information</h2>
				<p>We use the information we collect for the following purposes:</p>
				<ul>
					<li>
						<strong>Service delivery:</strong> To provide, maintain, and improve our web development and
						design services.
					</li>
					<li>
						<strong>Communication:</strong> To respond to your inquiries, send project updates, and share
						relevant information about our services.
					</li>
					<li>
						<strong>Improvement:</strong> To analyze usage patterns and improve our website, services,
						and overall user experience.
					</li>
				</ul>
			</section>

			<section class="legal-section">
				<h2>Data Protection</h2>
				<p>
					We take the security of your personal data seriously and implement appropriate technical
					and organizational measures to protect it, including:
				</p>
				<ul>
					<li>
						<strong>Encryption:</strong> All data transmitted between your browser and our servers is
						encrypted using industry-standard TLS/SSL protocols.
					</li>
					<li>
						<strong>Secure storage:</strong> Personal data is stored on secure servers with restricted
						access controls. We regularly review and update our security practices.
					</li>
				</ul>
			</section>

			<section class="legal-section">
				<h2>Cookies</h2>
				<p>
					Our website uses cookies to enhance your browsing experience. We use the following types
					of cookies:
				</p>
				<ul>
					<li>
						<strong>Analytics cookies:</strong> These help us understand how visitors interact with our
						website by collecting anonymous usage data. This information is used to improve our site.
					</li>
					<li>
						<strong>Functional cookies:</strong> These are necessary for the website to function properly,
						such as remembering your preferences and maintaining your session.
					</li>
				</ul>
				<p>
					You can control cookie settings through your browser. Disabling certain cookies may affect
					website functionality.
				</p>
			</section>

			<section class="legal-section">
				<h2>Third-Party Services</h2>
				<p>
					We may use third-party analytics providers to help us understand how our website is used.
					These providers may collect information about your visits to our site using cookies and
					similar technologies. Third-party services we use include web analytics platforms that
					process data in accordance with their own privacy policies.
				</p>
				<p>
					We do not sell, trade, or otherwise transfer your personal information to outside parties
					beyond what is described in this policy.
				</p>
			</section>

			<section class="legal-section">
				<h2>Your Rights</h2>
				<p>
					You have the following rights regarding your personal data:
				</p>
				<ul>
					<li>
						<strong>Access:</strong> You have the right to request a copy of the personal data we hold
						about you.
					</li>
					<li>
						<strong>Deletion:</strong> You may request that we delete your personal data. We will comply
						with such requests unless we are required to retain the data by law.
					</li>
					<li>
						<strong>Portability:</strong> You have the right to receive your personal data in a structured,
						commonly used, and machine-readable format.
					</li>
				</ul>
				<p>
					To exercise any of these rights, please contact us using the details below.
				</p>
			</section>

			<section class="legal-section">
				<h2>Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy or our data practices, please contact
					us at
					<a href="mailto:hello@shipforge.dev">hello@shipforge.dev</a>.
				</p>
			</section>
		</div>
	</div>
</div>

<style>
	.legal-header {
		margin-bottom: var(--space-12);
		padding-bottom: var(--space-8);
		border-bottom: 1px solid var(--color-border);
	}

	.legal-header h1 {
		margin-bottom: var(--space-3);
	}

	.legal-updated {
		color: var(--color-text-secondary);
		font-size: var(--text-sm);
	}

	.legal-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-12);
	}

	.legal-section h2 {
		font-size: var(--text-2xl);
		margin-bottom: var(--space-4);
		color: var(--color-text);
	}

	.legal-section p {
		color: var(--color-text-secondary);
		margin-bottom: var(--space-4);
		line-height: 1.8;
	}

	.legal-section p:last-child {
		margin-bottom: 0;
	}

	.legal-section ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding-left: var(--space-6);
		list-style: disc;
	}

	.legal-section li {
		color: var(--color-text-secondary);
		line-height: 1.8;
	}

	.legal-section a {
		color: var(--color-primary);
		text-decoration: underline;
		transition: color var(--transition-fast);
	}

	.legal-section a:hover {
		color: var(--color-primary-dark);
	}
</style>
