<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Message } from '$lib/server/discord-chat';
	interface Props {
		lastMessage: Message;
	}
	let { lastMessage }: Props = $props();

	let channels = $derived([{ name: 'Jeneral', lastMessage: lastMessage }]);
</script>

<div class="flex min-w-70 w-70 flex-col bg-dm-dark-primary">
	<nav class="flex w-full items-center bg-dm-dark-primary p-2 px-5 text-dm-light-primary">
		<div class="flex w-full items-center pt-1">
			<a href={resolve('/')}>
				<h1 class="text-3xl font-bold">Ñumi.xyz <span class="text-xl">/Chat</span></h1>
			</a>
		</div>
	</nav>
	<div class="flex flex-col p-5">
		{#each channels as channel, index (index)}
			<div class="flex items-center gap-3 rounded bg-dm-dark-secondary p-2 cursor-pointer">
				<div class="h-10 min-h-10 w-10 min-w-10 rounded-full bg-dm-light-primary"></div>
				<div class="flex flex-col">
					<div class="font-bold text-dm-light-primary">{channel.name}</div>
					<p class="text-dm-light-primary text-ellipsis text-nowrap overflow-hidden w-40">
						{channel.lastMessage?.content.replace('{', '').replace('}', '')}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
