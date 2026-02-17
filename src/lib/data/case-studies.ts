import type { CaseStudy } from '$lib/types';

export const caseStudies: CaseStudy[] = [
	{
		title: 'E-Commerce Platform Rebuild',
		client: 'NovaMart',
		description:
			'Migrated a legacy PHP storefront to SvelteKit with a headless CMS, achieving a 3x improvement in page speed and a 45% increase in conversion rate.',
		tags: ['SvelteKit', 'E-Commerce', 'Performance'],
		metrics: [
			{ label: 'Page Speed Improvement', value: '3x' },
			{ label: 'Conversion Increase', value: '45%' },
			{ label: 'Lighthouse Score', value: '98' },
			{ label: 'Load Time', value: '0.8s' }
		],
		image: '/case-studies/novamart.jpg',
		slug: 'novamart-ecommerce'
	},
	{
		title: 'SaaS Dashboard Redesign',
		client: 'DataPulse',
		description:
			'Designed and built a real-time analytics dashboard with TypeScript, reducing customer churn by 30% through improved UX.',
		tags: ['TypeScript', 'Dashboard', 'Real-time'],
		metrics: [
			{ label: 'Churn Reduction', value: '30%' },
			{ label: 'User Satisfaction', value: '94%' },
			{ label: 'Dev Velocity', value: '2x' },
			{ label: 'Bug Reports', value: '-60%' }
		],
		image: '/case-studies/datapulse.jpg',
		slug: 'datapulse-dashboard'
	},
	{
		title: 'SEO Turnaround for Legal Firm',
		client: 'Sterling & Associates',
		description:
			'Implemented technical SEO strategy that took organic traffic from 2K to 25K monthly visitors in 6 months, generating 150+ qualified leads per month.',
		tags: ['SEO', 'Content Strategy', 'Lead Generation'],
		metrics: [
			{ label: 'Organic Traffic', value: '12x' },
			{ label: 'Monthly Leads', value: '150+' },
			{ label: 'Domain Authority', value: '+22' },
			{ label: 'Keyword Rankings', value: '340+' }
		],
		image: '/case-studies/sterling.jpg',
		slug: 'sterling-seo'
	},
	{
		title: 'Startup MVP to Scale',
		client: 'FlowState',
		description:
			'Built an MVP in 8 weeks that secured $2M seed funding, then scaled the architecture to handle 50K concurrent users.',
		tags: ['MVP', 'Scaling', 'SvelteKit'],
		metrics: [
			{ label: 'Time to MVP', value: '8 weeks' },
			{ label: 'Funding Raised', value: '$2M' },
			{ label: 'Concurrent Users', value: '50K' },
			{ label: 'Uptime', value: '99.99%' }
		],
		image: '/case-studies/flowstate.jpg',
		slug: 'flowstate-mvp'
	}
];
