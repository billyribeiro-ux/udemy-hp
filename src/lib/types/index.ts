/** ShipForge domain types */

export interface Service {
	title: string;
	description: string;
	icon: string;
	features: string[];
	slug: string;
}

export interface CaseStudy {
	title: string;
	client: string;
	description: string;
	tags: string[];
	metrics: { label: string; value: string }[];
	image: string;
	slug: string;
}

export interface TeamMember {
	name: string;
	role: string;
	bio: string;
	image: string;
}

export interface BlogPost {
	title: string;
	excerpt: string;
	date: string;
	category: string;
	slug: string;
	readTime: string;
}

export interface ContactFormData {
	name: string;
	email: string;
	company: string;
	service: string;
	message: string;
}

export interface LeadMagnetFormData {
	name: string;
	email: string;
}

export interface NavLink {
	label: string;
	href: string;
}

export interface SEOMetadata {
	title: string;
	description: string;
	canonical?: string;
	ogImage?: string;
	ogType?: string;
	twitterCard?: string;
	schema?: Record<string, unknown>;
}
