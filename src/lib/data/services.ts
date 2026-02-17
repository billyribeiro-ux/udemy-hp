import type { Service } from '$lib/types';

export const services: Service[] = [
	{
		title: 'Fullstack Web Development',
		description:
			'Custom web applications built with modern frameworks like SvelteKit. Fast, accessible, and built to scale.',
		icon: 'code',
		features: [
			'SvelteKit & Next.js applications',
			'TypeScript-first architecture',
			'API design & integration',
			'Database design & optimization',
			'Real-time features & WebSockets',
			'Progressive Web Apps (PWA)'
		],
		slug: 'fullstack-development'
	},
	{
		title: 'Technical SEO',
		description:
			'Data-driven SEO strategies that increase organic traffic and improve search rankings through technical excellence.',
		icon: 'magnifying-glass',
		features: [
			'Technical site audits',
			'Core Web Vitals optimization',
			'Schema markup implementation',
			'Internal linking architecture',
			'Page speed optimization',
			'Mobile-first indexing compliance'
		],
		slug: 'technical-seo'
	},
	{
		title: 'UI/UX Design',
		description:
			'Conversion-focused design that combines beautiful aesthetics with measurable business results.',
		icon: 'palette',
		features: [
			'Responsive design systems',
			'Interaction design & animation',
			'Accessibility-first approach',
			'User research & testing',
			'Design tokens & component libraries',
			'Figma-to-code pipelines'
		],
		slug: 'ui-ux-design'
	},
	{
		title: 'Performance Optimization',
		description:
			'Speed is revenue. We optimize every layer of your stack for sub-second load times and perfect Lighthouse scores.',
		icon: 'lightning',
		features: [
			'Lighthouse score optimization',
			'Bundle size reduction',
			'Image & asset optimization',
			'Server-side rendering strategies',
			'CDN & caching architecture',
			'Monitoring & alerting setup'
		],
		slug: 'performance-optimization'
	}
];
