/**
 * SEO utility functions for ShipForge
 * Generates structured data, Open Graph, and meta tags
 */
import type { SEOMetadata } from '$lib/types';

const SITE_NAME = 'ShipForge';
const SITE_URL = 'https://shipforge.dev';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function buildPageTitle(title: string): string {
	return `${title} | ${SITE_NAME}`;
}

export function buildOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: SITE_NAME,
		url: SITE_URL,
		logo: `${SITE_URL}/logo.svg`,
		description: 'Fullstack App/Web Development + SEO Agency',
		sameAs: ['https://twitter.com/shipforge', 'https://github.com/shipforge'],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'sales',
			email: 'hello@shipforge.dev'
		}
	};
}

export function buildWebPageSchema(meta: SEOMetadata) {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: meta.title,
		description: meta.description,
		url: meta.canonical ?? SITE_URL,
		isPartOf: {
			'@type': 'WebSite',
			name: SITE_NAME,
			url: SITE_URL
		}
	};
}

export function buildServiceSchema(name: string, description: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name,
		description,
		provider: buildOrganizationSchema()
	};
}

export function buildBlogPostSchema(post: {
	title: string;
	description: string;
	date: string;
	url: string;
}) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		url: post.url,
		publisher: buildOrganizationSchema()
	};
}

export function getDefaultMeta(): SEOMetadata {
	return {
		title: 'ShipForge — Fullstack Development & SEO Agency',
		description:
			'We build high-performance web applications and optimize them for search engines. SvelteKit experts delivering measurable results.',
		ogImage: DEFAULT_OG_IMAGE,
		ogType: 'website',
		twitterCard: 'summary_large_image'
	};
}
