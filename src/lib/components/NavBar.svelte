<script lang="ts">
	import { refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	interface Props {
		route: string;
		user?: string;
	}
	let { route, user }: Props = $props();

	const logout = async () => {
		await fetch('/api/logout');
		await refreshAll()
	};
</script>

<nav class="flex w-full items-center p-2 px-5 dark:bg-dm-dark-primary dark:text-dm-light-primary">
	<div class="flex w-full items-center pt-1">
		<a href={resolve('/')}>
			<h1 class="text-3xl font-bold">Ñumi.xyz <span class="text-xl">/{route}</span></h1>
		</a>
			{#if user}
				<div class="ml-auto flex gap-3">
					<button class="ml-auto cursor-pointer" onclick={() => logout()}>Cerrar sesión</button>
					<a href={resolve('/')} class="bg-dm-light-primary text-dm-dark-primary p-1 px-2 ml-auto">
						{user}
					</a>
				</div>
			{:else}
				<a href={resolve('/login')} class="ml-auto"> Iniciar sesión </a>
			{/if}
	</div>
</nav>
