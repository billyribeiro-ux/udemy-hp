<script lang="ts">
	import type { SEOMetadata } from '$lib/types';

	interface Props {
		metadata: SEOMetadata;
	}

	let { metadata }: Props = $props();

	let jsonLdScript = $derived(
		metadata.schema ? JSON.stringify(metadata.schema) : null
	);
</script>

<svelte:head>
	<title>{metadata.title}</title>
	<meta name="description" content={metadata.description} />

	{#if metadata.canonical}
		<link rel="canonical" href={metadata.canonical} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:type" content={metadata.ogType ?? 'website'} />

	{#if metadata.ogImage}
		<meta property="og:image" content={metadata.ogImage} />
	{/if}

	{#if metadata.canonical}
		<meta property="og:url" content={metadata.canonical} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content={metadata.twitterCard ?? 'summary_large_image'} />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />

	{#if metadata.ogImage}
		<meta name="twitter:image" content={metadata.ogImage} />
	{/if}

	<!-- JSON-LD Structured Data -->
	{#if jsonLdScript}
		{@html `<script type="application/ld+json">${jsonLdScript}</script>`}
	{/if}
</svelte:head>
