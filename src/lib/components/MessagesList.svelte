<script lang="ts">
	// import { BsCheckAll, BsChevronDoubleDown, BsChevronUp } from 'svelte-icons-pack/bs';
	// import DarkButton from './UI/DarkButton.svelte';
	import { fade } from 'svelte/transition';
	import type { MessageState } from '$lib/stores/chat.store';
	import Message from './UI/chat/Message.svelte';

	interface Props {
		messages: MessageState[];
	}
	let {
		messages
		// updateMessages,
		// updateToPreviousMessages,
		// users,
		// changeMessagesLoadingState
	}: Props = $props();
</script>

<div
	transition:fade
	class="flex min-h-0 min-w-0 flex-1 flex-col-reverse items-start gap-1 overflow-auto pt-2 pb-2"
>
	<div
		class="absolute right-3 bottom-18 flex flex-col gap-2 md:right-90 xxl:right-110 2xl:right-120 fhd:right-150"
	>
		<!-- <DarkButton
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
		</DarkButton> -->
	</div>
	{#each messages as message, index (index)}

		{#if message.content || message.attachments[0]?.url}
			<Message message={message} lastMessage={messages[index + 1]}/>
		{/if}
	{/each}
</div>
