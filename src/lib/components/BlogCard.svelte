<script lang="ts">
	import type { BlogPost } from '$lib/types';
	import Clock from 'phosphor-svelte/lib/Clock';
	import CalendarBlank from 'phosphor-svelte/lib/CalendarBlank';
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';

	interface Props {
		post: BlogPost;
	}

	let { post }: Props = $props();

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<article class="blog-card">
	<div class="blog-card__meta">
		<time class="blog-card__date" datetime={post.date}>
			<CalendarBlank size={14} weight="regular" />
			{formatDate(post.date)}
		</time>
		<span class="blog-card__category">{post.category}</span>
	</div>
	<h3 class="blog-card__title">
		<a href="/blog/{post.slug}">{post.title}</a>
	</h3>
	<p class="blog-card__excerpt">{post.excerpt}</p>
	<div class="blog-card__footer">
		<span class="blog-card__read-time">
			<Clock size={14} weight="regular" />
			{post.readTime}
		</span>
		<a href="/blog/{post.slug}" class="blog-card__link" aria-label="Read article: {post.title}">
			Read More
			<ArrowRight size={14} weight="bold" />
		</a>
	</div>
</article>

<style>
	.blog-card {
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		transition:
			box-shadow var(--transition-base),
			transform var(--transition-base),
			border-color var(--transition-base);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.blog-card:hover {
		box-shadow: var(--shadow-lg);
		transform: translateY(-2px);
		border-color: var(--color-primary-100);
	}

	.blog-card__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.blog-card__date {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.blog-card__category {
		display: inline-block;
		font-size: var(--text-xs);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-primary);
		background-color: var(--color-primary-50);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.blog-card__title {
		font-size: var(--text-lg);
		font-weight: 700;
		line-height: 1.3;
		margin-bottom: var(--space-3);
	}

	.blog-card__title a {
		color: var(--color-text);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.blog-card__title a:hover {
		color: var(--color-primary);
	}

	.blog-card__excerpt {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.7;
		margin-bottom: var(--space-6);
		flex-grow: 1;
	}

	.blog-card__footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: auto;
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.blog-card__read-time {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.blog-card__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-primary);
		transition: gap var(--transition-fast);
	}

	.blog-card__link:hover {
		gap: var(--space-2);
		color: var(--color-primary-dark);
	}
</style>
