<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import NiumiPanelInfo from '$lib/components/NiumiPanelInfo.svelte';
	import LightButton from '$lib/components/UI/LightButton.svelte';
	import LightLink from '$lib/components/UI/LightLink.svelte';
	import { UserService } from '$lib/db/UserService.js';
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { BiAt } from 'svelte-icons-pack/bi';

	let { data, form } = $props();

	onMount(() => {
		(async () => {
			if (data.user) {
				await goto(resolve('/'));
			}
		})();
	});

	async function loginAndRefresh(
		e: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		e.preventDefault();
		const userService = new UserService(data.supabase);
		const formData = new FormData(e.currentTarget);
		const identificator = formData.get('identificator') as string;
		const password = formData.get('password') as string;
		form = await userService.login(identificator, password);
		if (!form?.error) {
			await invalidateAll();
			await goto(resolve('/chat'));
		}
		// await invalidateAll()
	}
</script>

<div class="text-darkmode-light-primary flex h-screen w-screen">
	<NiumiPanelInfo user={data.user?.name} userAvatarURL={data.user?.avatar_url} />
	<div
		class="mt-auto mb-auto flex h-full flex-1 flex-col items-center gap-5 bg-[url(https://i.imgur.com/3N0gyAY.png)] bg-cover"
	>
		<div class="mt-auto mb-auto flex flex-col gap-5">
			<h1 class="mx-auto text-4xl font-bold text-dm-light-primary">Iniciar sesión</h1>
			<form onsubmit={loginAndRefresh} class="flex flex-col gap-9 rounded bg-dm-dark-primary p-5">
				<div class="flex flex-col gap-2">
					<div class="flex flex-col gap-2">
						<label for="identificator" class="text-dm-light-primary">Identificador</label>
						<div class="flex gap-2">
							<Icon className="h-full" size={20} color="var(--color-dm-light-primary)" src={BiAt} />
							<input
								spellcheck="false"
								type="text"
								name="identificator"
								class="w-full min-w-55 rounded bg-dm-light-primary p-1 focus:outline-0"
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password" class="text-dm-light-primary">Contraseña</label>
					<input
						spellcheck="false"
						type="password"
						name="password"
						class="rounded bg-dm-light-primary p-1 focus:outline-0"
					/>
				</div>
				<div class="flex">
					<LightLink href={resolve('/register')}>Registrarme</LightLink>
					<LightButton class="ml-auto">Enviar</LightButton>
				</div>
			</form>
			{#if form?.error}
				<div class="flex items-center justify-center bg-red-500 p-2">
					<p class="font-bold text-white">{form.error.message}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
