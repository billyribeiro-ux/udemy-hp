<script lang="ts">
	import { SEOHead } from '$components';
</script>

<SEOHead
	metadata={{
		title: 'Disclaimer | ShipForge',
		description:
			'Read the ShipForge disclaimer regarding our website content, external links, and case study results.'
	}}
/>

<div class="section">
	<div class="container container--narrow">
		<header class="legal-header">
			<h1>Disclaimer</h1>
			<p class="legal-updated">Last updated: February 17, 2026</p>
		</header>

		<div class="legal-content">
			<section class="legal-section">
				<h2>General Information</h2>
				<p>
					The information provided on the ShipForge website is for general informational purposes
					only. While we strive to keep the content accurate and up to date, we make no
					representations or warranties of any kind, express or implied, about the completeness,
					accuracy, reliability, suitability, or availability of the information, products,
					services, or related graphics contained on this website.
				</p>
			</section>

			<section class="legal-section">
				<h2>No Guarantees</h2>
				<p>
					ShipForge does not guarantee specific outcomes or results from the use of our services.
					The success of any web development or design project depends on numerous factors,
					including but not limited to market conditions, client participation, content quality,
					and ongoing maintenance. Any projections, estimates, or forecasts discussed on this
					website are for illustrative purposes only.
				</p>
			</section>

			<section class="legal-section">
				<h2>External Links</h2>
				<p>
					Our website may contain links to external websites that are not owned or controlled by
					ShipForge. We have no control over the content, privacy policies, or practices of any
					third-party websites. We do not endorse or assume responsibility for the content or
					practices of any linked third-party sites. We encourage you to review the terms and
					privacy policies of any external website you visit.
				</p>
			</section>

			<section class="legal-section">
				<h2>Professional Advice</h2>
				<p>
					The content on this website does not constitute professional advice, whether legal,
					financial, technical, or otherwise. You should consult with appropriate qualified
					professionals before making any decisions based on the information provided on this
					website. ShipForge shall not be held liable for any actions taken based on the
					information presented here.
				</p>
			</section>

			<section class="legal-section">
				<h2>Case Study Results</h2>
				<p>
					Case studies and testimonials presented on our website reflect the experiences of
					specific clients under particular circumstances. Past results do not guarantee future
					performance. Individual results may vary depending on a wide range of factors, including
					project scope, industry, target audience, and market conditions.
				</p>
				<p>
					Metrics, statistics, and outcomes shared in our case studies are based on data available
					at the time of publication and may not reflect current conditions. We present these
					results in good faith to illustrate our capabilities, but they should not be interpreted
					as a promise or guarantee of similar outcomes for your project.
				</p>
			</section>

			<section class="legal-section">
				<h2>Contact</h2>
				<p>
					If you have any questions or concerns about this Disclaimer, please contact us at
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
