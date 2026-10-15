<script lang="ts">
	import { chats, UIWindowHierarchyStore } from "$lib/stores/chat.store";
	import { Icon } from "svelte-icons-pack";
	import { AiOutlineArrowLeft } from "svelte-icons-pack/ai";
	import { OiFileSubmodule24 } from "svelte-icons-pack/oi";

	interface Props {
		chatId: string;
        toggleFilesPanelVisibility: () => void
	}

    let { chatId, toggleFilesPanelVisibility }: Props = $props()
    let selectedChat = $derived($chats.find(chat => chat.id === chatId))
</script>

<div class="flex gap-3 bg-dm-dark-primary p-3 w-full">
    <button onclick={() => UIWindowHierarchyStore.setShowPreviousPanel('chatSection')}><Icon src={AiOutlineArrowLeft} color="var(--color-dm-light-primary)"/></button>
    <div class="w-10 h-10 rounded-full bg-dm-light-primary">
        {#if selectedChat?.photo_url}
            <img src={selectedChat.photo_url} class="rounded-full w-10 h-10 object-cover" alt="">
        {/if}
    </div>
    <div class="font-bold text-dm-light-primary">{selectedChat?.name}</div>
    <button onclick={toggleFilesPanelVisibility} class="ml-auto flex items-center rounded bg-dm-light-primary p-1 text-2xl">
		<Icon src={OiFileSubmodule24} color="var(--color-dm-dark-secondary)" />
	</button>
</div>
