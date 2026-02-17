/**
 * GSAP animation utilities for ShipForge
 * Provides reusable, lifecycle-safe animation functions
 * with reduced-motion support built in.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { browser } from '$app/environment';

if (browser) {
	gsap.registerPlugin(ScrollTrigger);
}

/** Check if the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
	if (!browser) return true;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Fade in from below with ScrollTrigger */
export function fadeInUp(
	node: HTMLElement,
	options: { delay?: number; duration?: number; y?: number } = {}
) {
	if (prefersReducedMotion()) {
		gsap.set(node, { opacity: 1, y: 0 });
		return { kill: () => {} };
	}

	const { delay = 0, duration = 0.8, y = 40 } = options;

	gsap.set(node, { opacity: 0, y });

	const tween = gsap.to(node, {
		opacity: 1,
		y: 0,
		duration,
		delay,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: node,
			start: 'top 85%',
			once: true
		}
	});

	return {
		kill: () => {
			tween.kill();
			ScrollTrigger.getAll()
				.filter((st) => st.trigger === node)
				.forEach((st) => st.kill());
		}
	};
}

/** Stagger children elements in */
export function staggerIn(
	parent: HTMLElement,
	childSelector: string,
	options: { stagger?: number; duration?: number; y?: number } = {}
) {
	if (prefersReducedMotion()) {
		gsap.set(parent.querySelectorAll(childSelector), { opacity: 1, y: 0 });
		return { kill: () => {} };
	}

	const { stagger = 0.1, duration = 0.6, y = 30 } = options;
	const children = parent.querySelectorAll(childSelector);

	gsap.set(children, { opacity: 0, y });

	const tween = gsap.to(children, {
		opacity: 1,
		y: 0,
		duration,
		stagger,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: parent,
			start: 'top 80%',
			once: true
		}
	});

	return {
		kill: () => {
			tween.kill();
			ScrollTrigger.getAll()
				.filter((st) => st.trigger === parent)
				.forEach((st) => st.kill());
		}
	};
}

/** Hero reveal timeline */
export function heroReveal(container: HTMLElement) {
	if (prefersReducedMotion()) {
		gsap.set(container.querySelectorAll('[data-animate]'), { opacity: 1, y: 0, scale: 1 });
		return { kill: () => {} };
	}

	const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

	const headline = container.querySelector('[data-animate="headline"]');
	const subtitle = container.querySelector('[data-animate="subtitle"]');
	const cta = container.querySelector('[data-animate="cta"]');
	const badge = container.querySelector('[data-animate="badge"]');

	if (headline) tl.fromTo(headline, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9 });
	if (subtitle)
		tl.fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');
	if (cta)
		tl.fromTo(cta, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 }, '-=0.3');
	if (badge)
		tl.fromTo(badge, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.2');

	return {
		kill: () => tl.kill()
	};
}

/** Counter animation for stats */
export function animateCounter(
	node: HTMLElement,
	target: number,
	options: { duration?: number; suffix?: string; prefix?: string } = {}
) {
	if (prefersReducedMotion()) {
		node.textContent = `${options.prefix ?? ''}${target}${options.suffix ?? ''}`;
		return { kill: () => {} };
	}

	const { duration = 2, suffix = '', prefix = '' } = options;
	const counter = { value: 0 };

	const tween = gsap.to(counter, {
		value: target,
		duration,
		ease: 'power2.out',
		scrollTrigger: {
			trigger: node,
			start: 'top 85%',
			once: true
		},
		onUpdate: () => {
			node.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
		}
	});

	return {
		kill: () => {
			tween.kill();
			ScrollTrigger.getAll()
				.filter((st) => st.trigger === node)
				.forEach((st) => st.kill());
		}
	};
}

/** Cleanup all ScrollTriggers — call on component destroy */
export function cleanupScrollTriggers() {
	ScrollTrigger.getAll().forEach((st) => st.kill());
}
