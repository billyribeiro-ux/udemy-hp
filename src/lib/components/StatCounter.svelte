<script lang="ts">
	interface Props {
		value: string;
		label: string;
		class?: string;
	}

	let {
		value,
		label,
		class: className = ''
	}: Props = $props();
</script>

<div class="stat {className}">
	<span class="stat__value" data-value={value}>{value}</span>
	<span class="stat__label">{label}</span>
</div>

<style>
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-4);
	}

	.stat__value {
		font-family: var(--font-heading);
		font-size: var(--text-4xl);
		font-weight: 800;
		color: var(--color-primary);
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin-bottom: var(--space-2);
	}

	.stat__label {
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
</style>
