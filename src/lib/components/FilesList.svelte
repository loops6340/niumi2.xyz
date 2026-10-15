<script lang="ts">
	import { AiFillEye, AiOutlineArrowLeft } from 'svelte-icons-pack/ai';
	import ChatFile from './ChatFile.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { extensionImages, showableFileExtensions } from '$lib/constants';
	import UIWindow from './UI/UIWindow.svelte';
	import {
		UIWindowHierarchy,
		UIWindowHierarchyStore,
		type MessageState
	} from '$lib/stores/chat.store';

	interface Props {
		messages: MessageState[];
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

<div
	class={`flex h-full min-h-0 flex-1 flex-col gap-2 overflow-auto bg-dm-dark-primary p-2 md:max-w-[400px] ${UIWindowHierarchyStore.getVisibilityClasses('chatRightPanel', $UIWindowHierarchy)}`}
>
	<div class="flex w-full gap-3 bg-dm-dark-primary p-3">
		<button onclick={() => UIWindowHierarchyStore.setShowPreviousPanel("chatRightPanel")}
			><Icon src={AiOutlineArrowLeft} color="var(--color-dm-light-primary)" /></button
		>
		<h1 class="text-dm-light-primary text-xl">Archivos</h1>
	</div>

	{#each filteredMessages as message, index (index)}
		{@const instant = Temporal.Instant.from(message.created_at)}
		{@const zoned = instant.toZonedDateTimeISO(Temporal.Now.timeZoneId())}
		{@const dd = String(zoned.day).padStart(2, '0')}
		{@const mm = String(zoned.month).padStart(2, '0')}
		{@const yy = String(zoned.year % 100).padStart(2, '0')}
		{@const hour = zoned.hour % 12 || 12}
		{@const minute = String(zoned.minute).padStart(2, '0')}
		{@const ampm = zoned.hour >= 12 ? 'pm' : 'am'}
		{@const formatted = `${dd}/${mm}/${yy} ${hour}:${minute}${ampm}`}
		<div
			class="flex h-full w-full min-w-10 flex-col gap-2 bg-dm-dark-secondary p-2 text-dm-light-primary"
		>
			<div class="flex items-center gap-2 border-b border-b-dm-light-primary p-2">
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
						class="dark ml-auto cursor-pointer rounded-full border bg-dm-light-primary p-1 text-[20px] text-dm-dark-primary"
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
