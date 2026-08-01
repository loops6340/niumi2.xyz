<script lang="ts">
	import { refreshAll, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import NavBar from '$lib/components/NavBar.svelte';
	import LightButton from '$lib/components/UI/LightButton.svelte';
	import { Icon } from 'svelte-icons-pack';
	import { RiSystemUpload2Fill } from 'svelte-icons-pack/ri';
	let { data, form } = $props();
	let fileInput: HTMLInputElement;
	let avatar = $derived(data.user?.avatarURL);

	const logout = async () => {
		await fetch('/api/logout');
		await refreshAll()
		goto(resolve("/"))
	};
</script>

<div class="flex h-screen w-screen flex-col">
	<NavBar route="Perfil" user={data.user?.name} userAvatarURL={data.user?.avatarURL} />

	<div
		class="mt-auto mb-auto flex h-full flex-1 flex-col items-center gap-5 bg-[url(https://i.imgur.com/3N0gyAY.png)] bg-cover"
	>
		<form method="POST" action="?/edit"  enctype="multipart/form-data" class="my-auto flex flex-col items-center gap-8 rounded bg-dm-dark-primary p-7">
			<div class="flex gap-8">
				<div class="flex flex-col gap-5">
					<div class="flex flex-col gap-3">
						<label for="name" class="text-dm-light-primary">Nombre</label>
						<div class="w-full min-w-55 rounded bg-dm-light-primary p-1 focus:outline-0">
							<h2>{data.user?.name}</h2>
						</div>
					</div>
					<div class="flex flex-col gap-3">
						<label for="name" class="text-dm-light-primary">Nose ke poner aki</label>
						<div class="w-full min-w-55 rounded bg-dm-light-primary p-1 focus:outline-0">
							<h2>ola</h2>
						</div>
					</div>
				</div>
				<div class="flex h-full flex-col">
					<input
						bind:this={fileInput}
						onchange={() => {
							avatar = URL.createObjectURL(fileInput.files![0]!);
							console.log('seleksionado');
						}}
						type="file"
						hidden
						name="avatar"
                        
                        required
						id=""
					/>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						onclick={() => {
							fileInput.click();
						}}
						class="relative my-auto h-35 w-35 rounded-full bg-dm-light-primary cursor-pointer"
					>
						{#if avatar}
							<span class="absolute bg-dm-light-primary flex items-center w-full h-full rounded-full opacity-0 hover:opacity-100 hover:z-5 transition">
								<Icon size={40} src={RiSystemUpload2Fill} className="mx-auto"/>
							</span>
							<img class="h-35 w-35 rounded-full object-cover" src={avatar} alt="" />
						{:else}
							<span class="absolute bg-dm-light-primary flex items-center w-full h-full rounded-full transition">
								<Icon size={40} src={RiSystemUpload2Fill} className="mx-auto"/>
							</span>
						{/if}
					</div>
				</div>
			</div>
			<div class="flex w-full">
				<LightButton onclick={() => logout()}>Cerrar sesión</LightButton>
				<LightButton class="mt-auto ml-auto">Guardar</LightButton>
			</div>
			{#if form?.invalid || form?.error}
				<div class="flex items-center justify-center bg-red-500 p-2 w-full">
					<p class="font-bold text-white">{form.message}</p>
				</div>
			{/if}
		</form>
	</div>
</div>
