<script lang="ts">
	import { chats } from "$lib/stores/chat.store";

	interface Props {
		chatId: string;
	}

    let { chatId }: Props = $props()
    let selectedChat = $derived($chats.find(chat => chat.id === chatId))
</script>

<div class="flex gap-3 bg-dm-dark-primary p-3 w-full">
    <div class="w-10 h-10 rounded-full bg-dm-light-primary">
        {#if selectedChat?.photo_url}
            <img src={selectedChat.photo_url} class="rounded-full w-10 h-10 object-cover" alt="">
        {/if}
    </div>
    <div class="font-bold text-dm-light-primary">{selectedChat?.name}</div>
</div>
