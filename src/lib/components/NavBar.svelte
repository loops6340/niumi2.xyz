<script lang="ts">
	// import { refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	interface Props {
		route: string;
		user?: string;
		userAvatarURL: string;
	}
	let { route, user, userAvatarURL }: Props = $props();

	// const logout = async () => {
	// 	await fetch('/api/logout');
	// 	await refreshAll()
	// };
</script>

<nav class="flex w-full items-center p-2 px-5 dark:bg-dm-dark-primary dark:text-dm-light-primary">
	<div class="flex w-full items-center pt-1">
		<a href={resolve('/')}>
			<h1 class="text-3xl font-bold">Ñumi.xyz <span class="text-xl">/{route}</span></h1>
		</a>
			{#if user}
				<div class="ml-auto flex items-center">
					<!-- <button class="ml-auto cursor-pointer" onclick={() => logout()}>Cerrar sesión</button> -->
					<a href={resolve('/profile')} class="flex gap-2 font-bold text-white text-xl p-1 px-2 ml-auto">
						<h2>{user}</h2>
						<div class="w-7 h-7 bg-dm-light-primary rounded-full">
							{#if userAvatarURL}
								<img class="w-7 h-7 rounded-full object-cover" src={userAvatarURL} alt="">
							{/if}
						</div>
					</a>
				</div>
			{:else}
				<a href={resolve('/login')} class="ml-auto"> Iniciar sesión </a>
			{/if}
	</div>
</nav>
