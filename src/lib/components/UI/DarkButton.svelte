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
    	border-0 text-dm-light-primary ${props.notRounded ? '' : 'rounded'} cursor-pointer p-2 transition-[0.2s]bg-background hover:bg-dm-light-primary hover:text-dm-dark-primary ${props.class}`}
>
	{@render props.children?.()}
</button>
