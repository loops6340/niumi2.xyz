<script lang="ts">
	import { Icon } from "svelte-icons-pack";
	import { AiFillCloseSquare } from "svelte-icons-pack/ai";
	import { scale } from "svelte/transition";

	let { onclose, children, title } = $props();
</script>

<div
	transition:scale={{duration: 200}}
	class="fixed top-1/2 left-1/2 flex translate-x-[-50%] translate-y-[-50%] flex-col border border-dm-light-primary shadow bg-dm-dark-primary text-dm-light-primary"
>
	<div class="flex p-2">
		<h1>{title}</h1>
		<button class="ml-auto" onclick={onclose}>
            <Icon size={25} src={AiFillCloseSquare} className="text-dm-light-primary"/>
        </button>
	</div>
	{@render children()}
</div>
