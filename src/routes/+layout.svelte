<script>
	import '../app.css';
	import { Nav, Footer } from '$lib/components';

	let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<Nav />

<main id="main-content">
	{@render children()}
</main>

<Footer />
