<script>
	import NavBar from "$lib/components/NavBar.svelte";
	import LightButton from "$lib/components/UI/LightButton.svelte";
    let {data, form} = $props()
</script>

<div class="text-darkmode-light-primary flex h-screen w-screen flex-col">
	<NavBar route="Login" user={data.user?.name} />

	<div
		class="mt-auto mb-auto flex h-full flex-1 flex-col items-center gap-5 bg-[url(https://i.imgur.com/3N0gyAY.png)] bg-cover"
	>
		<div class="mt-auto mb-auto flex flex-col gap-5">
			<h1 class="mx-auto text-4xl font-bold text-dm-light-primary">Registrarse</h1>
			<form method="POST" action="?/register" class="rounded flex flex-col gap-9 bg-dm-dark-primary p-5">
				<div class="flex flex-col gap-2">
					<label for="name" class="text-dm-light-primary">Nombre</label>
					<input spellcheck="false" type="text" name="name" class="w-full min-w-55 rounded p-1 bg-dm-light-primary focus:outline-0"/>
				</div>
				<div class="flex flex-col gap-2">
					<label for="password" class="text-dm-light-primary">Contraseña</label>
					<input spellcheck="false" type="password" name="password"  class="rounded p-1 bg-dm-light-primary focus:outline-0"/>
				</div>
				<div class="flex"> 
                    <LightButton class="ml-auto w-full">
                        Enviar
                    </LightButton>       
				</div>
			</form>
            {#if form?.invalid}
				<div class="flex items-center justify-center bg-red-500 p-2">
					<p class="font-bold text-white">{form.message}</p>
				</div>
			{/if}
		</div>
	</div>
</div>