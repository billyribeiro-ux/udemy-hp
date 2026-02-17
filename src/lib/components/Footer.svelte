<script lang="ts">
	import { mainNav, footerNav } from '$lib/data/navigation';
	import Anchor from 'phosphor-svelte/lib/Anchor';
</script>

<footer class="footer">
	<div class="footer__container">
		<div class="footer__grid">
			<!-- Brand column -->
			<div class="footer__brand-col">
				<a href="/" class="footer__brand" aria-label="ShipForge home">
					<Anchor size={24} weight="bold" />
					<span class="footer__brand-text">ShipForge</span>
				</a>
				<p class="footer__description">
					Fullstack development and SEO agency helping businesses build fast, accessible, and search-optimized web applications.
				</p>
			</div>

			<!-- Quick links -->
			<div class="footer__links-col">
				<h4 class="footer__heading">Navigation</h4>
				<ul class="footer__links" role="list">
					{#each mainNav as link}
						<li>
							<a href={link.href} class="footer__link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Legal links -->
			<div class="footer__links-col">
				<h4 class="footer__heading">Legal</h4>
				<ul class="footer__links" role="list">
					{#each footerNav as link}
						<li>
							<a href={link.href} class="footer__link">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="footer__bottom">
			<p class="footer__copyright">
				&copy; {new Date().getFullYear()} ShipForge. All rights reserved.
			</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: var(--color-gray-900);
		color: var(--color-gray-300);
		padding-top: var(--space-16);
	}

	.footer__container {
		max-width: var(--container-xl);
		margin-inline: auto;
		padding-inline: var(--container-padding);
	}

	.footer__grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-10);
		padding-bottom: var(--space-12);
	}

	@media (min-width: 768px) {
		.footer__grid {
			grid-template-columns: 2fr 1fr 1fr;
			gap: var(--space-12);
		}
	}

	.footer__brand {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-white);
		text-decoration: none;
		margin-bottom: var(--space-4);
	}

	.footer__brand-text {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	.footer__description {
		font-size: var(--text-sm);
		color: var(--color-gray-400);
		line-height: 1.7;
		max-width: 28rem;
	}

	.footer__heading {
		font-family: var(--font-heading);
		font-size: var(--text-sm);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-white);
		margin-bottom: var(--space-4);
	}

	.footer__links {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		list-style: none;
	}

	.footer__link {
		font-size: var(--text-sm);
		color: var(--color-gray-400);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.footer__link:hover {
		color: var(--color-white);
	}

	.footer__bottom {
		border-top: 1px solid var(--color-gray-700);
		padding-block: var(--space-6);
		text-align: center;
	}

	.footer__copyright {
		font-size: var(--text-xs);
		color: var(--color-gray-500);
	}
</style>
