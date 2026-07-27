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
                border z-2 text-darkmode-light-primary dark:bg-dm-light-primary dark:text-dm-dark-primary p-2 transition-[0.2s] dark:hover:bg-dm-dark-primary dark:hover:text-dm-light-primary cursor-pointer ${props.notRounded ? '' : 'rounded'} ${props.class}`}
>
	{@render props.children?.()}
</button>
