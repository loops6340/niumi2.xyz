<script>
	import { resolve } from '$app/paths';
	import NavBar from '../lib/components/NavBar.svelte';
  	import { Icon } from 'svelte-icons-pack';
  	import { AiFillGithub } from 'svelte-icons-pack/ai';
	import { IoChatbubblesOutline } from 'svelte-icons-pack/io'
	import { OiFileSubmodule24 } from 'svelte-icons-pack/oi'
	import { RiDocumentTodoFill } from 'svelte-icons-pack/ri'

	let {data} = $props()
</script>

<div class="flex flex-col text-darkmode-light-primary h-screen w-screen">
	<a
		href="https://github.com/loops6340/niumi.xyz"
		target="_blank"
		class="bg-dm-light-primary absolute bottom-3 left-3 rounded-full text-3xl"
	>
		<Icon src={AiFillGithub} />
	</a>

	<NavBar route="Kasita" user={data.user?.name} userAvatarURL={data.user?.avatarURL}/>

	<div
		class="flex mt-auto mb-auto h-full flex-1 flex-col items-center gap-5 bg-[url(https://i.imgur.com/3N0gyAY.png)] bg-cover"
	>
		<div class="mt-auto mb-auto flex flex-col gap-5">
			<h1 class="text-dm-light-primary mx-auto text-4xl font-bold">Ñumi.xyz</h1>
			<div class="flex flex-col gap-2">
				<a
					href={resolve('/chat')}
					class="hover:bg-dm-light-primary hover:text-dm-dark-primary text-dm-light-primary bg-dm-dark-secondary relative flex items-center gap-2 rounded p-2 transition"
				>
					<div class="asbolute bg-dm-light-primary left-1 flex items-center rounded p-1 text-2xl">
						<Icon src={IoChatbubblesOutline} color="var(--color-dm-dark-secondary)"/>
					</div>
					<h2 class="mr-20 ml-2">/Chat</h2>
				</a>
				<a
					data-sveltekit-preload-data="tap"
					href={resolve('/files')}
					class="hover:bg-dm-light-primary hover:text-dm-dark-primary text-dm-light-primary bg-dm-dark-secondary flex items-center gap-2 rounded p-2 transition"
				>
					<div class="bg-dm-light-primary flex items-center rounded p-1 text-2xl">
						<Icon src={OiFileSubmodule24} color="var(--color-dm-dark-secondary)"/>
					</div>
					<h2 class="mr-20 ml-2">/Archivos</h2>
				</a>
				<a
					href={resolve('/tasks')}
					class="hover:bg-dm-light-primary hover:text-dm-dark-primary text-dm-light-primary bg-dm-dark-secondary flex items-center gap-2 rounded p-2 transition"
				>
					<div class="bg-dm-light-primary flex items-center rounded p-1 text-2xl">
						<Icon src={RiDocumentTodoFill} color="var(--color-dm-dark-secondary)"/>
					</div>
					<h2 class="mr-20 ml-2">/Tareas</h2>
				</a>
			</div>
		</div>
	</div>
</div>
