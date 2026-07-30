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

	const noMessageRegex = /^\{([^}]+)\}/;

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
	class="flex min-h-0 flex-1 flex-col-reverse items-start gap-2 overflow-auto pt-2 pb-2"
>
	<div class="absolute right-3 bottom-18 flex flex-col gap-2 md:right-90 xxl:right-110 2xl:right-120 fhd:right-150">
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
		{#if message.content || message.attachments[0]?.url}
			<div class="flex max-w-full items-start gap-2 pl-2">
				{#if message.content.match(noMessageRegex) && users.find((u) => u.name === message.content.match(noMessageRegex)?.[1])?.avatarURL}
					<img
						class="h-12.5 w-12.5 rounded-full border border-dm-dark-primary object-cover"
						src={users.find((u) => u.name === message.content.match(noMessageRegex)?.[1].trim())!
							.avatarURL!}
						alt=""
					/>
				{:else}
					<div
						class="h-12.5 w-12.5 min-w-12.5 rounded-full border border-dm-dark-primary bg-fuchsia-200"
					></div>
				{/if}

				<div
					class="flex flex-col rounded border border-black p-2 dark:bg-dm-dark-primary dark:text-dm-light-primary"
				>
					<div class="font-bold md:max-w-200">
						{#if message.content.match(noMessageRegex)}
							{message.content.match(noMessageRegex)![1]}
						{:else}
							{message.content.match(regex) ? message.content.match(regex)![1] : 'Anónimo'}
						{/if}
					</div>
					<!-- Esto es un desastre -->
					<div class="flex items-center gap-2 md:max-w-200">
						{#if message.attachments[0]}
							<div>
								{message.content.match(regex)
									? message.content.match(regex)![2]
									: message.content.match(noMessageRegex)
										? ''
										: message.content}
							</div>
						{:else}
							{message.content.match(regex)?.[2] || message.content}
						{/if}

						{#if message.content.match(regex) || !message.content.startsWith("{")}
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
