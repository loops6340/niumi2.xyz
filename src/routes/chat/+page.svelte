<script lang="ts">
	import FilesList from '$lib/components/FilesList.svelte';
	import MessageSenderInput from '$lib/components/MessageSenderInput.svelte';
	import MessagesList from '$lib/components/MessagesList.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import SendCodeForm from '$lib/components/SendCodeForm.svelte';
	import type { Message } from '$lib/server/discord-chat';
	import axios from 'axios';

	let messages = $state<Message[]>([]);
	let author = $state<string>('Anónimo');
	let lastMessageId = $state<string>('');
	let isMessagesLoading = $state(false);

	let { data, form } = $props();

	$effect(() => {
		updateMessages();

		if (data.user) {
			author = data.user.name;
		}
	});

	async function updateMessages() {
		try {
			const data = await axios('/api/discord-chat');
			const result = await data.data;
			messages = result;
			if (messages) {
				const lastMessage = messages.at(-1)!;
				lastMessageId = lastMessage.id;
			}
		} catch {
			alert("Hubo un error, el máximo de tamaño de archivo subido es de 4.5 mb :'v");
		}
	}

	async function updateToPreviousMessages() {
		try {
			const data = await fetch(`/api/discord-chat?before=${lastMessageId}`);
			messages = await data.json();
			lastMessageId = messages[49].id;
		} catch {
			alert("Hubo un error, el máximo de tamaño de archivo subido es de 4.5 mb :'v");
		}
	}

	function changeMessagesLoadingState() {
		isMessagesLoading = !isMessagesLoading;
	}

	function createMessage(user: { author: string; content: string }) {
		return {
			author: {
				username: '',
				id: '',
				avatar: '',
				discriminator: '',
				public_flags: 0,
				flags: 0,
				banner: null,
				accent_color: null,
				global_name: null,
				avatar_decoration_data: null,
				collectibles: null,
				display_name_styles: null,
				banner_color: null,
				clan: null,
				primary_guild: null
			},
			content: `{${user.author}}: ${user.content}`,
			type: 0,
			mentions: [],
			mention_roles: [],
			attachments: [],
			embeds: [],
			timestamp: '',
			edited_timestamp: null,
			flags: 0,
			components: [],
			id: '',
			channel_id: '',
			pinned: false,
			mention_everyone: false,
			tts: false,
			pending: true
		};
	}
</script>

<div class="flex h-screen max-h-screen flex-col">
	<NavBar route="Chat" user={data.user?.name} userAvatarURL={data.user?.avatarURL} />
	<div class="flex min-h-0 flex-1">
		<SendCodeForm disabled={false} />
		<div
			class="relative flex w-full flex-1 flex-col border-l border-black bg-zinc-50 bg-[url(https://i.imgur.com/6qWFlY0.png)] bg-cover md:w-[calc(100%-300px)]"
		>
			<div class="flex min-h-0 flex-1">
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
							{updateMessages}
							users={data.users || []}
							{updateToPreviousMessages}
							messages={messages!}
							{changeMessagesLoadingState}
						/>
					{/if}
					{#if form?.invalid}
						<div class="flex items-center justify-center bg-red-500 p-2">
							<p class="font-bold text-white">{form.message}</p>
						</div>
					{/if}
					<MessageSenderInput
						{author}
						{updateMessages}
						disabled={false}
						onsubmit={(u) => {
							messages.reverse().push(createMessage(u));
							messages.reverse();
						}}
					/>
				</div>
				<FilesList messages={messages!} />
			</div>
		</div>
	</div>
</div>
