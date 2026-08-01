<script lang="ts">
	import type { Booleanish, HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		notRounded?: Booleanish;
	}

	let props: Props = $props();
</script>

<button
	{...props}
	class={`
    	border-0 text-dm-light-primary ${props.notRounded ? '' : 'rounded'} cursor-pointer p-2 transition-[0.2s]bg-background bg-dm-dark-primary hover:bg-dm-light-primary transition hover:text-dm-dark-primary ${props.class}`}
>
	{@render props.children?.()}
</button>
