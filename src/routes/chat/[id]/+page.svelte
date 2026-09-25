<script lang="ts">
	// import FilesList from '$lib/components/FilesList.svelte';
	import MessageSenderInput from '$lib/components/MessageSenderInput.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';


	import ChatInfoPanel from '$lib/components/ChatInfoPanel.svelte';
	import { messages, MessagesStore } from '$lib/stores/chat.store.js';
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

	let { data, form, params }: Props = $props();
	// const noMessageRegex = /^\{([^}]+)\}/;
	// const regex = /^\{([^}]+)\}:(.+)$/;
	

	// let loadedMessages = $state(false)

	$effect(() => {
		console.log("cargade ", params.id)
		init()
		// .then(() => loadedMessages = true)
	});

	// onMount(() => {
	// 	if ($messages) {
	// 		// const lastMessage = $messages.at(-1)!;
	// 		// lastMessageId = lastMessage.id;
	// 	}
	// 	const socket = new ChatSocket(data.supabase)
		
	// 	const messageConnection = socket.on<Message>("message", async ({ data: message }) => {
	// 		const messagesStore = new MessagesStore(Number(params.id))
	// 		console.log($messages)
	// 		if (!loadedMessages) return;
	// 		if (!$messages.some(msg => msg.id === message.id)) {
	// 			messagesStore.unshift({ 
	// 				id: message.id, 
	// 				content: message.content, 
	// 				created_at: message.created_at, 
	// 				user: data.user,
	// 				attachments: [],
	// 				pending: false,
	// 				chat_id: Number(params.id)
	// 			})
    //   			console.log('Database change received!')
	// 		}
	// 	})


	// 	const attachmentsConnection = socket.on<DBAttachment>("attachmentAdded", async ({ data: attachment }) => {
	// 		if (!loadedMessages) return;
	// 		if ($messages.some(msg => msg.id === attachment.message_id)) {
	// 			const messagesStore = new MessagesStore(Number(params.id))
	// 			const messageFullData = await new ChatService(data.supabase, 1).getMessage(attachment.message_id)
	// 			console.log(messageFullData.error, messageFullData.data)
	// 			messagesStore.set($messages.findIndex(msg => msg.id == attachment.message_id), { 
	// 				attachments: [messageFullData.data!.attachments[0]]
	// 			})
    //   			console.log('Database attachment change received!')
	// 		}
	// 	})

	// 	return () => {
	// 		messageConnection.unsubscribe()
	// 		attachmentsConnection.unsubscribe()
	// 	}
	// })

	async function init() {
		const messagesStore = new MessagesStore(params.id)
		await messagesStore.load(data.supabase)
		console.log("todos los mensajes cargan de nuevo")
	}
	
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
					{#if form?.error}
						<div class="flex items-center justify-center bg-red-500 p-2">
							<p class="font-bold text-white">{form.description}</p>
						</div>
					{/if}
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
