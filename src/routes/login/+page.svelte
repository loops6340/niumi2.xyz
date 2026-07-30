<script>
	import { resolve } from '$app/paths';
	import NavBar from '$lib/components/NavBar.svelte';
	import LightButton from '$lib/components/UI/LightButton.svelte';
	import LightLink from '$lib/components/UI/LightLink.svelte';

	let { data, form } = $props();
</script>

<div class="text-darkmode-light-primary flex h-screen w-screen flex-col">
	<NavBar route="Login" user={data.user?.name} userAvatarURL={data.user?.avatarURL} />

	<div
		class="mt-auto mb-auto flex h-full flex-1 flex-col items-center gap-5 bg-[url(https://i.imgur.com/3N0gyAY.png)] bg-cover"
	>
		<div class="mt-auto mb-auto flex flex-col gap-5">
			<h1 class="mx-auto text-4xl font-bold text-dm-light-primary">Iniciar sesión</h1>
			<form
				method="POST"
				action="?/login"
				class="flex flex-col gap-9 rounded bg-dm-dark-primary p-5"
			>
				<div class="flex flex-col gap-2">
					<label for="name" class="text-dm-light-primary">Nombre</label>
					<input
						spellcheck="false"
						type="text"
						name="name"
						class="w-full min-w-55 rounded bg-dm-light-primary p-1 focus:outline-0"
					/>
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
					<p class="font-bold text-white">{form.message}</p>
				</div>
			{/if}
            {#if form?.invalid}
				<div class="flex items-center justify-center bg-red-500 p-2">
					<p class="font-bold text-white">{form.message}</p>
				</div>
			{/if}
		</div>
	</div>
</div>
