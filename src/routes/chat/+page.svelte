<script lang="ts">
	// import FilesList from '$lib/components/FilesList.svelte';
	import MessageSenderInput from '$lib/components/MessageSenderInput.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';

	import NiumiPanelInfo from '$lib/components/NiumiPanelInfo.svelte';
	import ChatChannels from '$lib/components/ChatChannels.svelte';
	import ChatInfoPanel from '$lib/components/ChatInfoPanel.svelte';
	import ChatSocket from '$lib/db/ChatSocket.js';
	import ChatStore, { messages } from '$lib/stores/chat.store.js';
	import { onMount } from 'svelte';

	// let author = $state<string>('Anónimo');
	// let lastMessageId = $state<string>('');
	let isMessagesLoading = $state(false);

	let { data, form } = $props();
	// const noMessageRegex = /^\{([^}]+)\}/;
	// const regex = /^\{([^}]+)\}:(.+)$/;
	
	const chatStore = new ChatStore()	
	onMount(() => {
		chatStore.messages.load(data.supabase, 1)
		if ($messages) {
			// const lastMessage = $messages.at(-1)!;
			// lastMessageId = lastMessage.id;
		}

		const socket = new ChatSocket(data.supabase)
		
		const connection = socket.on("message", async ({ data: message }) => {
			if (!$messages.some(msg => msg.id === message.id)) {

				chatStore.messages.unshift({ 
					id: message.id, 
					content: message.content, 
					created_at: message.created_at, 
					user: {
						id: data.user.id,
						name: data.user.name,
						avatar_url: data.user.avatar_url,
						created_at: data.user.created_at
					},
					attachments: []
				})

      			console.log('Database change received!')
			}
		})

		return () => {
			connection.unsubscribe()
		}
	});

	// function parseMessages(messages: Message[]) {
	// 	return messages.map((message) => {
	// 		const isAnonymous = !message.content.startsWith('{') && !message.content.includes('}');

	// 		if (isAnonymous) {
	// 			message.author.username = undefined;

	// 			// messages[i].author.username = undefined;
	// 		} else {
	// 			const authorName =
	// 				message.content.match(regex)?.[1] || message.content.match(noMessageRegex)?.[1];
	// 			message.author.username = authorName;
	// 			message.content = message.content.slice(message.author!.username!.length + 4);
	// 		}
	// 		return message
	// 	});
	// }


	// async function updateToPreviousMessages() {
	// 	try {
	// 		const data = await fetch(`/api/discord-chat?before=${lastMessageId}`);

	// 		messages = parseMessages(await data.json());

	// 		lastMessageId = messages[49].id;
	// 	} catch {
	// 		alert("Hubo un error, el máximo de tamaño de archivo subido es de 4.5 mb :'v");
	// 	}
	// }

	// function changeMessagesLoadingState() {
	// 	isMessagesLoading = !isMessagesLoading;
	// }
</script>

<div class="flex h-screen max-h-screen w-screen max-w-screen flex-col">
	<!-- <NavBar route="Chat" user={data.user?.name} userAvatarURL={data.user?.avatarURL} /> -->
	<div class="flex min-h-0 flex-1">
		<NiumiPanelInfo user={data.user?.name} userAvatarURL={data.user?.avatar_url} />
		<ChatChannels lastMessage={$messages[0]} />
		<!-- <SendCodeForm disabled={false} /> -->
		<div
			class="relative flex w-full flex-1 flex-col border-l border-black bg-zinc-50 bg-[url(https://i.imgur.com/6qWFlY0.png)] bg-cover md:w-[calc(100%-400px)]"
		>
			<ChatInfoPanel />
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
							messages={$messages!}
							// {changeMessagesLoadingState}
						/>
					{/if}
					{#if form?.error}
						<div class="flex items-center justify-center bg-red-500 p-2">
							<p class="font-bold text-white">{form.description}</p>
						</div>
					{/if}
					<MessageSenderInput
						user={data.user}
						disabled={data.user ? false : true}
					/>
				</div>
				<!-- <FilesList messages={$messages!} /> -->
			</div>
		</div>
	</div>
</div>
