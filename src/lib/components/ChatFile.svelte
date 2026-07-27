<script lang="ts">
	import axios from 'axios';
	import Code from './Code.svelte';
	import DarkButton from './UI/DarkButton.svelte';
	import { BsClipboard2 } from 'svelte-icons-pack/bs';
	import { Icon } from 'svelte-icons-pack';

	const types = {
		image: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
		langs: ['txt', 'psc', 'cpp']
	};

	interface Props {
		url: string;
	}

	let { url }: Props = $props();

	let data = $state('');

	const getFile = async () => {
		const res = await axios(url);
		return res.data;
	};

	$effect(() => {
		(async () => {
			data = await getFile();
		})();
	});

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(data);
	};
</script>

{#if types.image.some((e) => url.includes(e))}
	<img src={url} class="min-w-30 max-w-90" alt="" />
{:else}
	<div>
		<Code readOnly={true} value={data} />
		<DarkButton onclick={copyToClipboard} class="mt-2">
			<Icon src={BsClipboard2} />
		</DarkButton>
	</div>
{/if}
