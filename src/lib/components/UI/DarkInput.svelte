<script lang="ts">
	import type { Booleanish, HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		notRounded: Booleanish;
	}

	let props: Props = $props();
</script>

<input
    {...props}
    class={`
    text-dm-light-primary border-0 focus:outline-0 ${props.notRounded ? "" : "rounded"} bg-background p-2 transition-[0.2s] hover:bg-dm-light-primary hover:text-dm-dark-primary cursor-pointer ${props.class}`}
>