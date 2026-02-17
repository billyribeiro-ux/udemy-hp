import type { NavLink } from '$lib/types';

export const mainNav: NavLink[] = [
	{ label: 'Services', href: '/services' },
	{ label: 'Case Studies', href: '/case-studies' },
	{ label: 'About', href: '/about' },
	{ label: 'Blog', href: '/blog' },
	{ label: 'Contact', href: '/contact' }
];

export const footerNav: NavLink[] = [
	{ label: 'Privacy Policy', href: '/privacy' },
	{ label: 'Terms of Service', href: '/terms' },
	{ label: 'Disclaimer', href: '/disclaimer' }
];
