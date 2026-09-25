<script lang="ts">
	// import FilesList from '$lib/components/FilesList.svelte';
	import NiumiPanelInfo from '$lib/components/NiumiPanelInfo.svelte';
	import ChatLeftPanel from '$lib/components/ChatLeftPanel.svelte';
	import ChatSocket from '$lib/db/ChatSocket.js';
	import { ChatsStore, messages, MessagesStore } from '$lib/stores/chat.store.js';
	import { onMount, type Snippet } from 'svelte';
	import type { DBAttachment } from '$lib/db/db-raw-types.js';
	import type { PageProps } from '../$types';
	import ChatService from '$lib/db/ChatService';
	import { UserService } from '$lib/db/UserService';
	// let author = $state<string>('Anónimo');
	// let lastMessageId = $state<string>('');
	interface Props extends PageProps {
		params: {
			id: string;
		},
        children: Snippet<[]>
	}

	let { data, params, children }: Props = $props();
	// const noMessageRegex = /^\{([^}]+)\}/;
	// const regex = /^\{([^}]+)\}:(.+)$/;
	

	let loadedMessages = $state(false)

	onMount(() => {
		init().then(() => loadedMessages = true)
	});

	onMount(() => {
		if ($messages) {
			// const lastMessage = $messages.at(-1)!;
			// lastMessageId = lastMessage.id;
		}
		const socket = new ChatSocket(data.supabase)
		
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const messageConnection = socket.on<any>("message", async ({ data: message }) => {
			const messagesStore = new MessagesStore(params.id)
			console.log($messages, "SOCKET HABILITADO :D")
			if (!loadedMessages) return;


			
			if (!$messages.some(msg => msg.id === message.id)) {

				let author;
				if (message.author_id == data.user.id) {
					author = data.user;
				} else {
					const userService = new UserService(data.supabase)
					console.log(message.author_id)
					const { data: userData } = await userService.getUser(message.author_id)
					author = userData
					console.log(author)
				}

				messagesStore.unshift({ 
					id: message.id, 
					content: message.content, 
					created_at: message.created_at, 
					author,
					attachments: [],
					pending: false,
					chat_id: params.id
				})
      			console.log('Database change received!')
			}
		})


		const attachmentsConnection = socket.on<DBAttachment>("attachmentAdded", async ({ data: attachment }) => {
			if (!loadedMessages) return;
			if ($messages.some(msg => msg.id === attachment.message_id)) {
				const messagesStore = new MessagesStore(params.id)
				const messageFullData = await new ChatService(data.supabase, "0926ff19-a56c-4033-8ba9-7665a037069d").getMessage(attachment.message_id)
				console.log(messageFullData.error, messageFullData.data)
				messagesStore.set($messages.findIndex(msg => msg.id == attachment.message_id), { 
					attachments: [messageFullData.data!.attachments[0]]
				})
      			console.log('Database attachment change received!')
			}
		})



		const joinedChatConnection = socket.on<DBAttachment>('joinedChat', async () => {
			if (!loadedMessages) return;
			const chatsStore = new ChatsStore()			
			await chatsStore.load(data.supabase)
		})

		return () => {
			messageConnection.unsubscribe()
			attachmentsConnection.unsubscribe()
			joinedChatConnection.unsubscribe()
		}
	})

	async function init() {
        const chatsStore = new ChatsStore()
        await chatsStore.load(data.supabase)
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

<div class="flex h-screen max-h-screen w-screen max-w-screen flex-col">
	<!-- <NavBar route="Chat" user={data.user?.name} userAvatarURL={data.user?.avatarURL} /> -->
	<div class="flex min-h-0 flex-1">
		<NiumiPanelInfo user={data.user?.name} userAvatarURL={data.user?.avatar_url} />
		<ChatLeftPanel userId={data.user?.id} supabase={data.supabase} />
		<!-- <SendCodeForm disabled={false} /> -->
        {@render children()}
	</div>
</div>
