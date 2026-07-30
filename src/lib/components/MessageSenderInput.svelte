<script lang="ts">
	import { AiOutlineSend } from 'svelte-icons-pack/ai';
	import { BsFileEarmarkPlusFill } from 'svelte-icons-pack/bs';

	import { Icon } from 'svelte-icons-pack';
	import DarkButton from './UI/DarkButton.svelte';
	import DarkInput from './UI/DarkInput.svelte';
	import { applyAction, enhance } from '$app/forms';

	interface Props {
		author: string;
		disabled: boolean;
		onsubmit: (user: { author: string; content: string }) => void;
		updateMessages: () => Promise<void>;
	}

	let { author, disabled, onsubmit, updateMessages }: Props = $props();
	let selectedFile = $state<string>();

	let textInput: HTMLInputElement;
	let fileInput: HTMLInputElement;

	$effect(() => {
		window.addEventListener('drop', (e) => {
			if ([...e!.dataTransfer!.items].some((item) => item.kind === 'file')) {
				e.preventDefault();
                // console.log(fileInput.files)
                fileInput.files = e!.dataTransfer!.files
                console.log(fileInput.files)
                selectedFile = fileInput.files[0].name
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
	{#if selectedFile}
		<div class="bg-dm-dark-primary p-5 text-dm-light-primary">
			{selectedFile}
		</div>
	{/if}

	<form
		method="POST"
		action="?/sendMessage"
		use:enhance={({ formData }) => {
			const content = formData.get('content') as string;
			textInput.value = '';
			fileInput.value = '';
			selectedFile = '';
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
		<DarkInput
			disabled
			notRounded
			class="w-25"
			value={author}
			onchange={(e) => (author = e.currentTarget.value)}
			type="text"
			name="author"
			placeholder="autor"
		/>
		<label
			for="file-upload"
			class="flex cursor-pointer items-center border-r border-l p-2 bg-dm-light-primary"
		>
			<Icon src={BsFileEarmarkPlusFill} />
		</label>
		<input
			bind:this={fileInput}
			onchange={(e) => (selectedFile = e.currentTarget.value)}
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
			class="w-full p-2 focus:outline-0 bg-dm-light-primary"
		/>
		<DarkButton notRounded class="flex w-20 items-center text-[20px]">
			<Icon src={AiOutlineSend} className="ml-auto mr-auto" />
		</DarkButton>
	</form>
</div>
