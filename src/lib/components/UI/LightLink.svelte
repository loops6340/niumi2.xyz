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
                border z-2 text-darkmode-light-primary bg-dm-light-primary text-dm-dark-primary p-2 transition-[0.2s] hover:bg-dm-dark-primary hover:text-dm-light-primary cursor-pointer ${props.notRounded ? '' : 'rounded'} ${props.class}`}
>
	{@render props.children?.()}
	</a>
