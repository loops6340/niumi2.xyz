<script lang="ts">
	// import FilesList from '$lib/components/FilesList.svelte';
	import MessageSenderInput from '$lib/components/MessageSenderInput.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';


	import ChatInfoPanel from '$lib/components/ChatInfoPanel.svelte';
	import { ChatStore, messages, MessagesStore } from '$lib/stores/chat.store.js';
	import type { PageProps } from '../$types';
	import FilesList from '$lib/components/FilesList.svelte';
	// let author = $state<string>('Anónimo');
	// let lastMessageId = $state<string>('');
	let isMessagesLoading = $state(false);

	interface Props extends PageProps {
		params: {
			id: string;
		}
	}

	let { data, params }: Props = $props();

	$effect(() => {
		console.log("cargade ", params.id)
		init()

		// .then(() => loadedMessages = true)
	});

	async function init() {
		const messagesStore = new MessagesStore()
		await messagesStore.load(data.supabase, params.id)
		console.log("todos los mensajes cargan de nuevo")
		const chatStore = new ChatStore(params.id)
		await chatStore.viewMessages(data.supabase)
		// const chatService = new ChatService(data.supabase, params.id)
		// await chatService.readMessages()
		// console.log("nya xd")
	}
</script>


		<div
			class="relative flex w-full flex-1 flex-col border-l border-black bg-zinc-50 bg-[url(https://i.imgur.com/6qWFlY0.png)] bg-cover md:w-[calc(100%-400px)]"
		>
			<ChatInfoPanel chatId={params.id} />
			<div class="flex min-h-0 min-w-0 flex-1">
				<div class="flex min-h-0 min-w-0 flex-2 flex-col">
					{#if isMessagesLoading}
						<div
							class="flex h-screen flex-col-reverse items-center justify-center gap-2 overflow-hidden pt-2 pb-2"
						>
							<div>Cargando...</div>
							<img
								src="https://media.tenor.com/v5aPfSD1VsgAAAAM/goddess-of-victory-nikke-doro-meme-run.gif"
								alt=""
							/>
						</div>
					{:else}
						<MessagesList
							// {updateMessages}
							// {updateToPreviousMessages}
							messages={$messages!.filter(message => message.chat_id === params.id)}
							// {changeMessagesLoadingState}
						/>
					{/if}
					<!-- {#if form?.error}
						<div class="flex items-center justify-center bg-red-500 p-2">
							<p class="font-bold text-white">{form.description}</p>
						</div>
					{/if} -->
					<MessageSenderInput
						supabase={data.supabase}
						chatId={params.id}
						user={data.user}
						disabled={data.user ? false : true}
					/>
				</div>
				<FilesList messages={$messages!.filter(message => message.chat_id === params.id)} />
			</div>
		</div>
