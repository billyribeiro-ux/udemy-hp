<script lang="ts">
	import { page } from '$app/stores';
	import { mainNav } from '$lib/data/navigation';
	import List from 'phosphor-svelte/lib/List';
	import X from 'phosphor-svelte/lib/X';
	import Anchor from 'phosphor-svelte/lib/Anchor';

	let mobileOpen = $state(false);

	function toggleMenu() {
		mobileOpen = !mobileOpen;
	}

	function closeMenu() {
		mobileOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && mobileOpen) {
			closeMenu();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<nav class="nav" aria-label="Main navigation">
	<div class="nav__container">
		<a href="/" class="nav__brand" aria-label="ShipForge home">
			<Anchor size={28} weight="bold" />
			<span class="nav__brand-text">ShipForge</span>
		</a>

		<!-- Desktop links -->
		<ul class="nav__links" role="list">
			{#each mainNav as link}
				<li>
					<a
						href={link.href}
						class="nav__link"
						class:nav__link--active={$page.url.pathname === link.href || $page.url.pathname.startsWith(link.href + '/')}
						aria-current={$page.url.pathname === link.href ? 'page' : undefined}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile hamburger -->
		<button
			class="nav__toggle"
			onclick={toggleMenu}
			aria-expanded={mobileOpen}
			aria-controls="mobile-menu"
			aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
		>
			{#if mobileOpen}
				<X size={24} weight="bold" />
			{:else}
				<List size={24} weight="bold" />
			{/if}
		</button>
	</div>

	<!-- Mobile slide-in panel -->
	{#if mobileOpen}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="nav__overlay" onclick={closeMenu} aria-hidden="true"></div>
	{/if}
	<div
		id="mobile-menu"
		class="nav__mobile"
		class:nav__mobile--open={mobileOpen}
		role="dialog"
		aria-label="Mobile navigation menu"
		aria-modal={mobileOpen ? 'true' : undefined}
	>
		<ul class="nav__mobile-links" role="list">
			{#each mainNav as link}
				<li>
					<a
						href={link.href}
						class="nav__mobile-link"
						class:nav__mobile-link--active={$page.url.pathname === link.href || $page.url.pathname.startsWith(link.href + '/')}
						aria-current={$page.url.pathname === link.href ? 'page' : undefined}
						onclick={closeMenu}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		border-bottom: 1px solid var(--color-border);
		backdrop-filter: blur(8px);
		background-color: rgba(255, 255, 255, 0.95);
	}

	.nav__container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		max-width: var(--container-xl);
		margin-inline: auto;
		padding-inline: var(--container-padding);
		height: 4rem;
	}

	.nav__brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-text);
		text-decoration: none;
		flex-shrink: 0;
	}

	.nav__brand-text {
		font-family: var(--font-heading);
		font-size: var(--text-xl);
		font-weight: 800;
		letter-spacing: -0.02em;
	}

	/* Desktop links */
	.nav__links {
		display: none;
		align-items: center;
		gap: var(--space-1);
		list-style: none;
	}

	@media (min-width: 768px) {
		.nav__links {
			display: flex;
		}
	}

	.nav__link {
		display: block;
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.nav__link:hover {
		color: var(--color-primary);
		background-color: var(--color-primary-50);
	}

	.nav__link--active {
		color: var(--color-primary);
		font-weight: 600;
	}

	/* Mobile toggle */
	.nav__toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		color: var(--color-text);
		border: none;
		background: none;
		cursor: pointer;
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast);
	}

	.nav__toggle:hover {
		background-color: var(--color-gray-100);
	}

	@media (min-width: 768px) {
		.nav__toggle {
			display: none;
		}
	}

	/* Mobile overlay */
	.nav__overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: var(--z-overlay);
	}

	/* Mobile slide-in panel */
	.nav__mobile {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(80vw, 20rem);
		background-color: var(--color-white);
		z-index: var(--z-modal);
		padding: var(--space-8) var(--space-6);
		transform: translateX(100%);
		transition: transform var(--transition-base);
		box-shadow: var(--shadow-xl);
	}

	.nav__mobile--open {
		transform: translateX(0);
	}

	@media (min-width: 768px) {
		.nav__mobile {
			display: none;
		}
	}

	.nav__mobile-links {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		list-style: none;
	}

	.nav__mobile-link {
		display: block;
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-lg);
		font-weight: 500;
		color: var(--color-text-secondary);
		text-decoration: none;
		border-radius: var(--radius-md);
		transition:
			color var(--transition-fast),
			background-color var(--transition-fast);
	}

	.nav__mobile-link:hover {
		color: var(--color-primary);
		background-color: var(--color-primary-50);
	}

	.nav__mobile-link--active {
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		font-weight: 600;
	}
</style>
