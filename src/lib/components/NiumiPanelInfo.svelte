<script>
	import { resolve } from '$app/paths';
	import { Icon } from 'svelte-icons-pack';
	import { BiLogIn } from 'svelte-icons-pack/bi';
	import { IoChatbubblesOutline } from 'svelte-icons-pack/io';
	import { OiFileSubmodule24 } from 'svelte-icons-pack/oi';
	import { RiDocumentTodoFill } from 'svelte-icons-pack/ri';
	let { user, userAvatarURL } = $props();
</script>

<div class="flex h-screen flex-col gap-2 border-r border-dm-light-primary bg-dm-dark-primary p-3">
	<a href={resolve("/chat")} class="asbolute left-1 flex items-center rounded bg-dm-light-primary p-1 text-2xl">
		<Icon src={IoChatbubblesOutline} color="var(--color-dm-dark-secondary)" />
	</a>
	<a href={resolve("/files")} class="flex items-center rounded bg-dm-light-primary p-1 text-2xl">
		<Icon src={OiFileSubmodule24} color="var(--color-dm-dark-secondary)" />
	</a>
	<a href={resolve("/tasks")} class="flex items-center rounded bg-dm-light-primary p-1 text-2xl">
		<Icon src={RiDocumentTodoFill} color="var(--color-dm-dark-secondary)" />
	</a>
	<div class="mt-auto flex items-center rounded">
		{#if user}
			<div class="ml-auto flex mx-auto items-center">
				<!-- <button class="ml-auto cursor-pointer" onclick={() => logout()}>Cerrar sesión</button> -->
				<a
					href={resolve('/profile')}
					class="ml-auto flex gap-2 mx-auto text-xl font-bold text-white"
				>
					{#if userAvatarURL}
						<img class="h-7 w-7 rounded-full hover:border border-dm-light-primary object-cover transition" src={userAvatarURL} alt="" />
					{/if}
				</a>
			</div>
		{:else}
			<a href={resolve("/login")} class="flex items-center rounded bg-dm-light-primary p-1 text-2xl">
				<Icon src={BiLogIn} color="var(--color-dm-dark-secondary)" />
			</a>
		{/if}
	</div>
</div>
