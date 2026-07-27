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
                border-0 dark:text-dm-light-primary ${props.notRounded ? '' : 'rounded'} cursor-pointer p-2 transition-[0.2s] dark:bg-background dark:hover:bg-dm-light-primary dark:hover:text-dm-dark-primary ${props.class}`}
>
	{@render props.children?.()}
</button>
