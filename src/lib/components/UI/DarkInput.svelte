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
    dark:text-dm-light-primary border-0 focus:outline-0 ${props.notRounded ? "" : "rounded"} dark:bg-background p-2 transition-[0.2s] dark:hover:bg-dm-light-primary dark:hover:text-dm-dark-primary cursor-pointer ${props.class}`}
>