<script lang="ts">
	import ChatFile from '$lib/components/ChatFile.svelte';
	import { extensionImages, showableFileExtensions } from '$lib/constants';
	import type { MessageState } from '$lib/stores/chat.store';
	import { Icon } from 'svelte-icons-pack';
	import { BsCheckAll } from 'svelte-icons-pack/bs';
	import { OiStopwatch16 } from 'svelte-icons-pack/oi';

	const { message, lastMessage }: { message: MessageState; lastMessage?: MessageState } = $props();

	const date = $derived(
		Temporal.Instant.from(message.created_at).toZonedDateTimeISO(
			Intl.DateTimeFormat().resolvedOptions().timeZone
		)
	);

	const isAnon = $derived(message.author.name === undefined);
	const hasDifferentAthorThanThePreviousMessage = $derived(
		message.author.name !== lastMessage?.author.name
	);
	const fourMinutesBeforeThisMessage = $derived(
		new Date(message.created_at).getTime() - 1000 * 60 * 4
	);
	const lastMessageTime = $derived(lastMessage ? new Date(lastMessage!.created_at).getTime() : 0);
</script>

<div class="flex gap-1 hover:[&>span]:opacity-50">
	{#if isAnon || hasDifferentAthorThanThePreviousMessage || fourMinutesBeforeThisMessage > lastMessageTime}
		{#if message.author.avatar_url}
			<img
				class="h-12.5 w-12.5 rounded-full border border-dm-dark-primary object-cover"
				src={message.author.avatar_url}
				alt=""
			/>
		{:else}
			<div
				class=" h-12.5 w-12.5 rounded-full border border-dm-dark-primary bg-dm-light-primary object-cover"
			></div>
		{/if}
	{:else}
		<span
			class="flex w-12.5 items-center rounded border bg-dm-dark-primary text-[10px] font-normal text-dm-light-primary opacity-0 transition"
		>
			<span class="mx-auto">
				{('0' + date.hour).slice(0, 2)}:{('0' + date.minute).slice(0, 2)}{date.hour > 11 ? 'pm' : 'am'}
			</span>
		</span>
	{/if}

	<div
		class="flex flex-col rounded border border-black bg-dm-dark-primary p-2 text-dm-light-primary"
	>
		<div class="font-bold md:max-w-200">
			{#if hasDifferentAthorThanThePreviousMessage || fourMinutesBeforeThisMessage > lastMessageTime}
				{message.author.name || 'Anónimo'}
				<span class="text-[10px] font-normal">
					{date.hour}:{date.minute}{date.hour > 11 ? 'pm' : 'am'}
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2 md:max-w-200">
			<div>
				{message.content}
			</div>

			{#if message.content}
				{#if message.pending}
					<Icon size={13} src={OiStopwatch16} />
				{:else}
					<Icon src={BsCheckAll} />
				{/if}
			{/if}
		</div>
		{#if message.attachments.length > 0}
			{#if message.attachments[0].url === '...'}
				<div class="text-dm-light-primary">...</div>
                <Icon className="ml-auto" src={OiStopwatch16} />
            {:else if showableFileExtensions.some((type) => message.attachments?.[0].url.includes(type))}
				<ChatFile url={message.attachments[0].url} />
                <Icon className="ml-auto" size={13} src={BsCheckAll} />
			{:else}
				{@const url = message.attachments[0].url}
				<div class="flex flex-col rounded bg-background p-2">
					<a href={url} rel="external" class="text-darkmode-light-primary flex items-center gap-2">
						<img
							src={extensionImages.find((ex) => url.includes(ex.name))?.imageUrl}
							class="w-10"
							alt=""
						/>
						<div class="text-dm-light-primary">{message.attachments[0].filename}</div>
					</a>
				</div>
                <Icon className="ml-auto" size={13} src={BsCheckAll} />
			{/if}
		{/if}
	</div>
</div>
