/**
 * Svelte use: actions for GSAP animations
 * Usage: <div use:fadeInUp> or <div use:fadeInUp={{ delay: 0.2 }}>
 */
import { fadeInUp as fadeInUpUtil, staggerIn as staggerInUtil, heroReveal as heroRevealUtil, animateCounter as animateCounterUtil } from './gsap';
import { browser } from '$app/environment';

interface FadeInUpOptions {
	delay?: number;
	duration?: number;
	y?: number;
}

export function fadeInUp(node: HTMLElement, options: FadeInUpOptions = {}) {
	if (!browser) return { destroy: () => {} };
	const anim = fadeInUpUtil(node, options);
	return { destroy: () => anim.kill() };
}

interface StaggerOptions {
	selector?: string;
	stagger?: number;
	duration?: number;
	y?: number;
}

export function staggerChildren(node: HTMLElement, options: StaggerOptions = {}) {
	if (!browser) return { destroy: () => {} };
	const { selector = ':scope > *', ...rest } = options;
	const anim = staggerInUtil(node, selector, rest);
	return { destroy: () => anim.kill() };
}

export function heroAnimation(node: HTMLElement) {
	if (!browser) return { destroy: () => {} };
	const anim = heroRevealUtil(node);
	return { destroy: () => anim.kill() };
}

interface CounterOptions {
	target: number;
	duration?: number;
	suffix?: string;
	prefix?: string;
}

export function counter(node: HTMLElement, options: CounterOptions) {
	if (!browser) return { destroy: () => {} };
	const { target, ...rest } = options;
	const anim = animateCounterUtil(node, target, rest);
	return { destroy: () => anim.kill() };
}
