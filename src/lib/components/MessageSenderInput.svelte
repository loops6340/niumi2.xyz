<script lang="ts">
	import { AiOutlineSend } from "svelte-icons-pack/ai";
    import { BsFileEarmarkPlusFill } from "svelte-icons-pack/bs";

    import { Icon } from 'svelte-icons-pack'
	import DarkButton from "./UI/DarkButton.svelte";
	import DarkInput from "./UI/DarkInput.svelte";

    interface Props {
        author: string;
        disabled: boolean;
    }

    let {author, disabled}: Props = $props();
    let selectedFile = $state<string>()
</script>
    
    
    <div class="mt-auto">
        {#if selectedFile}
            <div class="p-5 bg-dm-dark-primary text-dm-light-primary">
                {selectedFile}
            </div>
        {/if}

      <form method="POST" action="?/sendMessage" enctype="multipart/form-data" class="bg-white flex border border-black border-l-0">
        <DarkInput disabled notRounded class="w-25" value={author} onchange={(e) => (author = e.currentTarget.value)} type="text" name="author" placeholder="autor" />
        <label for="file-upload" class='cursor-pointer dark:bg-dm-light-primary  flex items-center p-2 border-l border-r'>
            <Icon src={BsFileEarmarkPlusFill} />
        </label>
        <input onchange={(e) => selectedFile = (e.currentTarget.value)} id="file-upload" type="file" class="hidden" name="file" />
        <input spellCheck={false} disabled={disabled} type="text" name="content" class='p-2 dark:bg-dm-light-primary focus:outline-0 w-full'/>
        <DarkButton notRounded class='w-20 flex items-center text-[20px]'>
            <Icon src={AiOutlineSend} className="ml-auto mr-auto" />
        </DarkButton>
      </form>
    </div>