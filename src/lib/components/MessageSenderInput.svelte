<script lang="ts">
	import { AiOutlineSend } from 'svelte-icons-pack/ai';
	import { BsFileEarmarkCodeFill, BsFileEarmarkPlusFill } from 'svelte-icons-pack/bs';

	import { Icon } from 'svelte-icons-pack';
	import DarkButton from './UI/DarkButton.svelte';
	import { applyAction, enhance } from '$app/forms';
	import LightButton from './UI/LightButton.svelte';
	import UIWindow from './UI/UIWindow.svelte';

	interface Props {
		author: string;
		disabled: boolean;
		onsubmit: (user: { author: string; content: string }) => void;
		updateMessages: () => Promise<void>;
	}

	let { author, disabled, onsubmit, updateMessages }: Props = $props();
	let selectedFileName = $state<string>('');

	let showCodeForm = $state<boolean>(false);
	let textInput: HTMLInputElement;
	let fileInput: HTMLInputElement;

	$effect(() => {
		window.addEventListener('drop', (e) => {
			if ([...e!.dataTransfer!.items].some((item) => item.kind === 'file')) {
				e.preventDefault();
				// console.log(fileInput.files)
				fileInput.files = e!.dataTransfer!.files;
				console.log(fileInput.files);
				selectedFileName = fileInput.files[0].name;
			}
		});

		window.addEventListener('dragover', (e) => {
			const fileItems = [...e!.dataTransfer!.items].filter((item) => item.kind === 'file');
			if (fileItems.length > 0) {
				e.preventDefault();
			}
		});
	});
</script>

<div class="mt-auto">
	{#if selectedFileName}
		<div class="bg-dm-dark-primary p-5 text-dm-light-primary">
			{selectedFileName}
		</div>
	{/if}

	{#if showCodeForm}
		<UIWindow title="Codigo" onclose={() => (showCodeForm = false)}>
			<div class="hidden w-75 bg-background text-dm-light-primary md:block">
				<div
					class="text-darkmode-light-primary m-2 mt-0 pt-0 hidden flex-col gap-2 bg-dm-dark-secondary p-2 md:flex"
				>
					<form
						onsubmit={(e) => {
							e.preventDefault();
							selectedFileName = e.currentTarget.filename.value;
							console.log(e.currentTarget.filename.value, e.currentTarget.content.files);
							const dataTransfer = new DataTransfer();
							const codeFile = new File([e.currentTarget.content.value], selectedFileName, { type: 'text/plain' });
							
							dataTransfer.items.add(codeFile);

							fileInput.files = dataTransfer.files;
							showCodeForm = false
						}}
						class="flex flex-col gap-2"
					>
						<input
							required
							type="text"
							name="filename"
							class="border bg-dm-light-primary p-2 text-dm-dark-primary focus:outline-0"
							placeholder="nombre del archivo"
						/>
						<textarea
							spellCheck={false}
							{disabled}
							required
							name="content"
							id="contenido"
							class="h-82 w-full border border-dm-light-primary bg-dm-dark-secondary p-2 focus:outline-0"
							placeholder="escribir codigo"></textarea>
						<LightButton>Guardar</LightButton>
					</form>
				</div>
			</div>
		</UIWindow>

	{/if}
	<form
		method="POST"
		action="?/sendMessage"
		use:enhance={({ formData }) => {
			const content = formData.get('content') as string;
			textInput.value = '';
			fileInput.value = '';
			selectedFileName = '';
			onsubmit({ author, content });
			return async ({ result }) => {
				await updateMessages();
				applyAction(result);
				textInput.focus();
			};
		}}
		enctype="multipart/form-data"
		class="flex border border-l-0 border-black bg-white"
	>
		<!-- <DarkInput
			disabled
			notRounded
			class="w-25"
			value={author}
			onchange={(e) => (author = e.currentTarget.value)}
			type="text"
			name="author"
			placeholder="autor"
		/> -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<label
			onclick={() => (showCodeForm = !showCodeForm)}
			class="flex cursor-pointer items-center bg-dm-dark-primary p-2 text-dm-light-primary"
		>
			<Icon src={BsFileEarmarkCodeFill} />
		</label>
		<label
			for="file-upload"
			class="flex cursor-pointer items-center bg-dm-dark-primary p-2 text-dm-light-primary"
		>
			<Icon src={BsFileEarmarkPlusFill} />
		</label>
		<input
			bind:this={fileInput}
			spellcheck="false"
			onchange={(e) => (selectedFileName = e.currentTarget.value)}
			id="file-upload"
			type="file"
			class="hidden"
			name="file"
		/>
		<input
			bind:this={textInput}
			spellCheck={false}
			placeholder="Arrastra algún archivo"
			{disabled}
			type="text"
			name="content"
			class="w-full bg-dm-dark-primary p-2 text-dm-light-primary focus:outline-0"
		/>
		<DarkButton notRounded class="flex w-20 items-center text-[20px]">
			<Icon src={AiOutlineSend} className="ml-auto mr-auto" />
		</DarkButton>
	</form>
</div>
