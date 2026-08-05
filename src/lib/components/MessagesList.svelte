<script lang="ts">
	import { BsCheckAll, BsChevronDoubleDown, BsChevronUp } from 'svelte-icons-pack/bs';
	import { Icon } from 'svelte-icons-pack';
	import DarkButton from './UI/DarkButton.svelte';
	import type { Message } from '$lib/server/discord-chat';
	import ChatFile from './ChatFile.svelte';
	import { extensionImages, showableFileExtensions } from '$lib/constants';
	import { fade } from 'svelte/transition';
	import { OiStopwatch16 } from 'svelte-icons-pack/oi';

	interface Props {
		messages: Message[];
		users: { name: string; avatarURL: string }[];
		updateToPreviousMessages: () => Promise<void>;
		updateMessages: () => Promise<void>;
		changeMessagesLoadingState: () => void;
	}

	const regex = /^\{([^}]+)\}:(.+)$/;

	let {
		messages,
		updateMessages,
		updateToPreviousMessages,
		users,
		changeMessagesLoadingState
	}: Props = $props();

</script>

<div
	transition:fade
	class="flex min-h-0 min-w-0 flex-1 flex-col-reverse items-start gap-1 overflow-auto pt-2 pb-2"
>
	<div
		class="absolute right-3 bottom-18 flex flex-col gap-2 md:right-90 xxl:right-110 2xl:right-120 fhd:right-150"
	>
		<DarkButton
			class="z-5"
			onclick={async () => {
				changeMessagesLoadingState();
				await updateToPreviousMessages();
				changeMessagesLoadingState();
			}}
		>
			<Icon src={BsChevronUp} />
		</DarkButton>

		<DarkButton
			onclick={async () => {
				changeMessagesLoadingState();
				await updateMessages();
				changeMessagesLoadingState();
			}}
			class="z-50"
		>
			<Icon src={BsChevronDoubleDown} />
		</DarkButton>
	</div>
	{#each messages as message, index (index)}
		{@const date = Temporal.Instant.from(message.timestamp)
			.toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone)}
		{#if message.content || message.attachments[0]?.url}
			{console.log(message.content, message.author?.username)}

			<div class="flex gap-1 hover:[&>span]:opacity-50">
				{#if index !== messages.length - 1}
					{#if message.author.username == undefined || message.author.username !== messages[index + 1].author.username || (new Date(message.timestamp).getTime() - 1000 * 60 * 4 > new Date(messages[index + 1].timestamp).getTime())}
						{#if users.find((u) => u.name === message.author.username)?.avatarURL}
							<img
								class="h-12.5 w-12.5 rounded-full border border-dm-dark-primary object-cover"
								src={users.find((u) => u.name === message.author.username)!.avatarURL || ''}
								alt=""
							/>
						{:else}
							<div
								class=" h-12.5 w-12.5 rounded-full border border-dm-dark-primary bg-dm-light-primary object-cover"
							></div>
						{/if}
					{:else}
						<span class="w-12.5 rounded border bg-dm-dark-primary opacity-0 font-normal text-dm-light-primary text-[10px] flex items-center transition">
							<span class="mx-auto">
								{date.hour}:{date.minute}{date.hour > 11 ? 'pm' : 'am'}
							</span>
						</span>
					{/if}
				{/if}

				<div
					class="flex flex-col rounded border border-black bg-dm-dark-primary p-2 text-dm-light-primary"
				>
					<div class="font-bold md:max-w-200">
						{#if index !== messages.length - 1}
						{#if message.author.username == undefined || message.author.username !== messages[index + 1].author.username || (new Date(message.timestamp).getTime() - 1000 * 60 * 4 > new Date(messages[index + 1].timestamp).getTime())}

								{message.author.username || 'Anónimo'}
								<span class="text-[10px] font-normal">
									{date.hour}:{date.minute}{date.hour > 11 ? 'pm' : 'am'}
								</span>
							{/if}
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
					{#if message.attachments[0]}
						{#if showableFileExtensions.some((type) => message.attachments[0].url.includes(type))}
							<ChatFile url={message.attachments[0].url} />
						{:else}
							{@const url = message.attachments[0].url}
							<div class="flex flex-col rounded bg-background p-2">
								<a
									href={url}
									rel="external"
									class="text-darkmode-light-primary flex items-center gap-2"
								>
									<img
										src={extensionImages.find((ex) => url.includes(ex.name))?.imageUrl}
										class="w-10"
										alt=""
									/>
									<div class="text-dm-light-primary">{message.attachments[0].filename}</div>
								</a>
							</div>
						{/if}

						{#if !message.content.match(regex)}
							<Icon className="mt-2 ml-auto" src={BsCheckAll} />
						{/if}
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>
