<script lang="ts">
	import { SEOHead } from '$components';
</script>

<SEOHead
	metadata={{
		title: 'Terms of Service | ShipForge',
		description:
			'Read the Terms of Service for ShipForge. Understand your rights, responsibilities, and our service agreement.'
	}}
/>

<div class="section">
	<div class="container container--narrow">
		<header class="legal-header">
			<h1>Terms of Service</h1>
			<p class="legal-updated">Last updated: February 17, 2026</p>
		</header>

		<div class="legal-content">
			<section class="legal-section">
				<h2>Agreement to Terms</h2>
				<p>
					By accessing or using ShipForge's website and services, you agree to be bound by these
					Terms of Service. If you do not agree to these terms, please do not use our services. We
					reserve the right to update these terms at any time, and your continued use of our
					services constitutes acceptance of any changes.
				</p>
			</section>

			<section class="legal-section">
				<h2>Services Description</h2>
				<p>
					ShipForge provides web development, design, and related digital services. Our offerings
					include custom website development, web application development, UI/UX design, and
					ongoing support and maintenance. The specific scope of services for each project is
					defined in individual project agreements between ShipForge and the client.
				</p>
			</section>

			<section class="legal-section">
				<h2>Client Responsibilities</h2>
				<p>As a client of ShipForge, you agree to:</p>
				<ul>
					<li>
						Provide accurate and complete information necessary for the delivery of our services.
					</li>
					<li>
						Respond to requests for feedback, approvals, and content in a timely manner to avoid
						project delays.
					</li>
					<li>
						Ensure that all materials, content, and assets you provide do not infringe on any
						third-party intellectual property rights.
					</li>
					<li>
						Use the delivered services and products only for lawful purposes and in compliance with
						all applicable laws and regulations.
					</li>
				</ul>
			</section>

			<section class="legal-section">
				<h2>Payment Terms</h2>
				<p>
					Payment terms are outlined in individual project agreements. Unless otherwise specified,
					payments are due within 14 days of invoice date. Late payments may incur additional
					charges as specified in the project agreement. We reserve the right to suspend work on a
					project if payments are overdue.
				</p>
			</section>

			<section class="legal-section">
				<h2>Intellectual Property</h2>
				<p>
					Upon full payment, clients receive ownership of the final deliverables as specified in
					the project agreement. ShipForge retains the right to use project work in portfolios and
					case studies unless otherwise agreed in writing. All pre-existing intellectual property,
					tools, frameworks, and reusable code libraries remain the property of ShipForge.
				</p>
			</section>

			<section class="legal-section">
				<h2>Limitation of Liability</h2>
				<p>
					To the maximum extent permitted by law, ShipForge shall not be liable for any indirect,
					incidental, special, consequential, or punitive damages arising from or related to the
					use of our services. Our total liability shall not exceed the amount paid by the client
					for the specific services giving rise to the claim.
				</p>
				<p>
					ShipForge is not responsible for any damages resulting from third-party services,
					hosting providers, or external integrations used in connection with our deliverables.
				</p>
			</section>

			<section class="legal-section">
				<h2>Termination</h2>
				<p>
					Either party may terminate a project agreement with written notice as specified in the
					individual agreement. Upon termination, the client is responsible for payment for all
					work completed up to the termination date. ShipForge will provide all completed
					deliverables upon receipt of outstanding payments.
				</p>
			</section>

			<section class="legal-section">
				<h2>Governing Law</h2>
				<p>
					These Terms of Service are governed by and construed in accordance with applicable laws.
					Any disputes arising from these terms shall be resolved through good-faith negotiation
					first, and if necessary, through binding arbitration or in the courts of the applicable
					jurisdiction.
				</p>
			</section>

			<section class="legal-section">
				<h2>Contact</h2>
				<p>
					If you have any questions about these Terms of Service, please contact us at
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
