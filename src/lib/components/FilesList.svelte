<script lang="ts">
	import type { Message } from '$lib/server/discord-chat';
	import { AiFillEye } from 'svelte-icons-pack/ai';
	import ChatFile from './ChatFile.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { extensionImages, showableFileExtensions } from '$lib/constants';
	import UIWindow from './UI/UIWindow.svelte';


	interface Props {
		messages: Message[];
	}

	let { messages }: Props = $props();

	let codeURL = $state<string>('');
	let showWindow = $state(false);

	let filteredMessages = $derived(messages.filter((el) => el.attachments.length !== 0));

	const showCodeMirrorWindow = (url: string) => {
		codeURL = url;
		showWindow = !showWindow;
	};
</script>

<div class="hidden min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 md:flex bg-dm-dark-primary">
	{#each filteredMessages as message, index (index)}
		{@const instant = Temporal.Instant.from(message.timestamp)}
		{@const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())}
		{@const dd = String(zoned.day).padStart(2, '0')}
		{@const mm = String(zoned.month).padStart(2, '0')}
		{@const yy = String(zoned.year % 100).padStart(2, '0')}
		{@const hour = zoned.hour % 12 || 12}
		{@const minute = String(zoned.minute).padStart(2, '0')}
		{@const ampm = zoned.hour >= 12 ? 'pm' : 'am'}
		{@const formatted = `${dd}/${mm}/${yy} ${hour}:${minute}${ampm}`}
		<div
			class="flex min-w-10 flex-col gap-2 p-2 bg-dm-dark-secondary text-dm-light-primary"
		>
			<div class="flex items-center gap-2 border-b p-2 border-b-dm-light-primary">
				<a class="flex w-full items-center gap-5" href={message.attachments[0].url} rel="external">
					<img
						src={extensionImages.find((ex) => message.attachments[0].url.includes(ex.name))
							?.imageUrl}
						class="w-10"
						alt=""
					/>
					<h2 class="max-w-40 wrap-break-word">{message.attachments[0].filename}</h2>
				</a>
				{#if showableFileExtensions.some((f) => message.attachments[0].url.includes(f))}
					<button
						onclick={() => showCodeMirrorWindow(message.attachments[0].url)}
						class="dark ml-auto cursor-pointer rounded-full border p-1 text-[20px] bg-dm-light-primary text-dm-dark-primary"
					>
						<Icon src={AiFillEye} color="var(--color-dm-dark-primary)" size={20} />
					</button>
				{/if}
			</div>
			<div class="text-[10px]">{formatted}</div>
		</div>
	{/each}

	{#if showWindow}
		<UIWindow title="Archivo" onclose={() => (showWindow = false)}>
			<ChatFile url={codeURL} />
		</UIWindow>
	{/if}
</div>
