<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ChatsService } from '$lib/db/ChatService';
	import { chats } from "$lib/stores/chat.store";
	import type { SupabaseClient } from '@supabase/supabase-js';
	import DarkInput from './UI/DarkInput.svelte';
	import LightButton from './UI/LightButton.svelte';
	import { UserService } from '$lib/db/UserService';
	import type { MouseEventHandler } from 'svelte/elements';
	let typing = $state(false);
	let searchValue = $state("")

	const { supabase, userId }: { supabase: SupabaseClient, userId: string } = $props()

	const createDMChannel: MouseEventHandler<HTMLButtonElement> = async (event) => {

		const chatsService = new ChatsService(supabase)
		const userService = new UserService(supabase)

		const {data: user2, error} = await userService.getUserByName(searchValue);
		if (error) {
			console.log(error)
		}
		if (!user2) {
			alert("Este usuario no existe :d")
			return
		}

		let { data: DMChat } = await chatsService.getDMChat(user2.id)
		console.log(event)

		searchValue = ''

		if (!DMChat) {
			const { id } = await chatsService.createDMChat(userId, user2.id);
			console.log(id)
			DMChat = { id }
			// const chatsStore = new ChatsStore()
			// await chatsStore.load(supabase)
		}
		goto(resolve(`/chat/${DMChat.id}`))			
	}

</script>




<div class="flex min-w-70 w-70 flex-col bg-dm-dark-primary">
	<nav class="flex w-full items-center bg-dm-dark-primary p-2 px-5 text-dm-light-primary">
		<div class="flex w-full items-center pt-1">
			<a href={resolve('/')}>
				<h1 class="text-3xl font-bold">Ñumi.xyz <span class="text-xl">/Chat</span></h1>
			</a>
		</div>
	</nav>
	<div class="flex flex-col gap-3 p-3">
		<DarkInput notRounded={false} value={searchValue} class="text-[18px]" type="text" placeholder="buscar / iniciar conversación" oninput={(e) => {
				searchValue = e.currentTarget.value.toLowerCase()
				typing = true
			}
		} />
		{#if typing} 
			<LightButton onclick={createDMChannel}>Escribir a @{searchValue !== "" ? searchValue : "..."}</LightButton>
		{/if}

		{#each $chats.filter(chat => chat.name.toLowerCase().startsWith(searchValue)) as chat, index(index)}
			{@const date = chat.last_message ? Temporal.Instant.from(chat.last_message?.created_at).toZonedDateTimeISO(
			Intl.DateTimeFormat().resolvedOptions().timeZone
			) : undefined}
			<button class="flex items-start gap-3 rounded hover:bg-dm-dark-secondary p-2 cursor-pointer" onclick={() => goto(resolve(`/chat/${chat.id}`))}>
				<div class="h-10 min-h-10 w-10 min-w-10 rounded-full bg-dm-light-primary">
					{#if chat.photo_url}
						<img src={chat.photo_url} class="h-10 w-10 object-cover rounded-full"  alt="">
					{/if}
				</div>
				<div class="flex flex-col text-start">
					<div class="font-bold text-dm-light-primary">{chat.name}</div>
					<p class="text-dm-light-primary text-ellipsis text-nowrap overflow-hidden w-34">
						{#if chat.last_message}
							{chat.last_message.author.name}: {chat.last_message.content}
						{/if}
					</p>
				</div>
				<div class="flex gap-1 flex-col">
					<div class="mb-auto text-dm-light-primary text-[12px]">
						{#if date}
							{('0' + date.hour).slice(0, 2)}:{('0' + date.minute).slice(0, 2)}{date.hour > 11 ? 'pm' : 'am'}
						{/if}
					</div>
					{#if chat.unreaded_messages > 0}
						<div class="rounded-full bg-dm-light-primary text-dm-dark-primary w-5 h-5 ml-auto">{chat.unreaded_messages}</div>
					{/if}
				</div>
			</button>
		{/each}

	</div>
</div>
