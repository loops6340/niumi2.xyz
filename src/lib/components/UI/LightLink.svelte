<script lang="ts">
	import type { Booleanish, HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		notRounded?: Booleanish;
	}

	let props: Props = $props();
</script>

<a
	{...props}
	class={`
                border z-2 text-darkmode-light-primary dark:bg-dm-light-primary dark:text-dm-dark-primary p-2 transition-[0.2s] dark:hover:bg-dm-dark-primary dark:hover:text-dm-light-primary cursor-pointer ${props.notRounded ? '' : 'rounded'} ${props.class}`}
>
	{@render props.children?.()}
	</a>
