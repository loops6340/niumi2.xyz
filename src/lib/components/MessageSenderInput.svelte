<script lang="ts">
	import { AiOutlineSend } from 'svelte-icons-pack/ai';
	import { BsFileEarmarkCodeFill, BsFileEarmarkPlusFill } from 'svelte-icons-pack/bs';

	import { Icon } from 'svelte-icons-pack';
	import DarkButton from './UI/DarkButton.svelte';
	import LightButton from './UI/LightButton.svelte';
	import UIWindow from './UI/UIWindow.svelte';
	import { ChatsStore, ChatStore, messages, MessagesStore } from '$lib/stores/chat.store';
	import type { User } from '$lib/db/types';
	import ChatService from '$lib/db/ChatService';
	import type { SupabaseClient } from '@supabase/supabase-js';

	interface Props {
		disabled: boolean;
		user: User;
		chatId: string;
		supabase: SupabaseClient;
	}

	let { disabled, user, chatId, supabase }: Props = $props();
	let selectedFileName = $state<string>('');

	let showCodeForm = $state<boolean>(false);
	let textInput: HTMLInputElement;
	let fileInput: HTMLInputElement;

	$effect(() => {
		window.addEventListener('drop', (e) => {
			if ([...e!.dataTransfer!.items].some((item) => item.kind === 'file')) {
				e.preventDefault();
				fileInput.files = e!.dataTransfer!.files;
				selectedFileName = fileInput.files[0].name;
			}
		});

		window.addEventListener('dragover', (e) => {
			const fileItems = [...e!.dataTransfer!.items].filter((item) => item.kind === 'file');
			if (fileItems.length > 0) {
				e.preventDefault();
			}
		});
	});

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();

		const formData = new FormData(event.currentTarget, event.submitter);
		const file = formData.get('file') as File;
		const content = formData.get('content') as string;
		textInput.value = '';
		fileInput.value = '';
		selectedFileName = '';

		const id = crypto.randomUUID();

		formData.set('id', id);

		const messagesStore = new MessagesStore();
		const now =
			Temporal.Now.plainDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone).toString() +
			'+00:00';

		messagesStore.unshift({
			content,
			id,
			created_at: now,
			author: {
				id: user.id,
				name: user.name,
				avatar_url: user.avatar_url,
				created_at: user.created_at
			},
			attachments: file.size > 0 ? [{ id: 0, filename: file.name, url: '...' }] : [],
			pending: true,
			chat_id: chatId
		});

		const chatService = new ChatService(supabase, chatId);

		console.log('chat_id', chatId);

		const message = await chatService.sendMessage({
			id,
			authorId: user.id,
			content,
			attachments: file instanceof File && file.size > 0 ? [file] : undefined
		});

		console.log(message.data, message.error);

		const json = await message.data;

		await chatService.update({
			lastMessageId: json.id,
			lastMessageTimestamp: json.created_at
		});

		const chatStore = new ChatStore(chatId);
		console.log("olaaa" , json)
		chatStore.changeLastMessage(json);
		const chatsStore = new ChatsStore();
		chatsStore.order();

		messagesStore.set(
			$messages.findIndex((msg) => msg.id === id),
			{
				id: json.id,
				created_at: now,
				content,
				author: user,
				attachments:
					file.size > 0
						? [
								{
									filename: file.name,
									url: json.attachments[0].url,
									id: json.attachments[0].id
								}
							]
						: [],
				pending: false,
				chat_id: chatId
			}
		);

		// onsubmitresult(content, id, json.id, json.fileData);

		textInput.focus();
	}
</script>

<div class="mt-auto">
	{#if selectedFileName}
		<div class="bg-dm-dark-primary p-5 text-dm-light-primary">
			{selectedFileName}
		</div>
	{/if}

	{#if showCodeForm}
		<UIWindow title="Codigo" onclose={() => (showCodeForm = false)}>
			<div class="hidden w-75 bg-background text-dm-light-primary md:block">
				<div
					class="text-darkmode-light-primary m-2 mt-0 hidden flex-col gap-2 bg-dm-dark-secondary p-2 pt-0 md:flex"
				>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							selectedFileName = e.currentTarget.filename.value;
							const dataTransfer = new DataTransfer();
							const codeFile = new File([e.currentTarget.content.value], selectedFileName, {
								type: 'text/plain'
							});

							dataTransfer.items.add(codeFile);

							fileInput.files = dataTransfer.files;
							showCodeForm = false;
						}}
						class="flex flex-col gap-2"
					>
						<input
							required
							type="text"
							name="filename"
							class="border bg-dm-light-primary p-2 text-dm-dark-primary focus:outline-0"
							placeholder="nombre del archivo"
						/>
						<textarea
							spellCheck={false}
							{disabled}
							required
							name="content"
							id="contenido"
							class="h-82 w-full border border-dm-light-primary bg-dm-dark-secondary p-2 focus:outline-0"
							placeholder="escribir codigo"></textarea>
						<LightButton>Guardar</LightButton>
					</form>
				</div>
			</div>
		</UIWindow>
	{/if}
	<form
		method="POST"
		action="?/sendMessage"
		onsubmit={handleSubmit}
		enctype="multipart/form-data"
		class="flex border border-l-0 border-black bg-white"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<label
			onclick={() => (showCodeForm = !showCodeForm)}
			class="flex cursor-pointer items-center bg-dm-dark-primary p-2 text-dm-light-primary"
		>
			<Icon src={BsFileEarmarkCodeFill} />
		</label>
		<label
			for="file-upload"
			class="flex cursor-pointer items-center bg-dm-dark-primary p-2 text-dm-light-primary"
		>
			<Icon src={BsFileEarmarkPlusFill} />
		</label>
		<input
			bind:this={fileInput}
			spellcheck="false"
			onchange={(e) => (selectedFileName = e.currentTarget.value)}
			id="file-upload"
			type="file"
			class="hidden"
			name="file"
		/>
		<input
			bind:this={textInput}
			spellCheck={false}
			placeholder={disabled
				? 'No puedes enviar mensajes sin haber iniciado sesión'
				: 'Arrastra algún archivo'}
			{disabled}
			type="text"
			name="content"
			class="w-full bg-dm-dark-primary p-2 text-dm-light-primary focus:outline-0"
		/>
		<DarkButton notRounded class="flex w-20 items-center text-[20px]">
			<Icon src={AiOutlineSend} className="ml-auto mr-auto" />
		</DarkButton>
	</form>
</div>
