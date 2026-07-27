<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';
	import { aura } from '@uiw/codemirror-theme-aura';

	interface Props {
		readOnly: boolean;
		value: string;
	}

	let { readOnly, value }: Props = $props();
</script>

<CodeMirror
	class="max-w-75 md:max-w-200"
	styles={{
		'&': {
			width: '100%',
			maxWidth: '100%',
			maxHeight: '340px'
		}
	}}
	readonly={readOnly}
	{value}
	theme={aura}
	extensions={[javascript({ jsx: true })]}
/>
