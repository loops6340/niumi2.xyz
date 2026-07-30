<script lang="ts">
	import LightButton from "./UI/LightButton.svelte";

    interface Props {
        disabled: boolean;
    }
    let {disabled}: Props = $props()
</script>

    <div class="text-dm-light-primary hidden md:block px-2 bg-background w-75">
      <div class="hidden md:flex flex-col p-2 gap-2 text-darkmode-light-primary mx-2 bg-dm-dark-secondary">
        <h1>Enviar codigo xd</h1>
        <form method="POST" action="?/sendCode" class="flex flex-col gap-2" >
          <input required type="text" name="filename" class="focus:outline-0 border text-dm-dark-primary bg-dm-light-primary p-2" placeholder="nombre del archivo" />
          <textarea spellCheck={false} disabled={disabled} required name="content" id="contenido" class="p-2 bg-dm-dark-secondary border border-dm-light-primary focus:outline-0 w-full h-82 " placeholder="escribir codigo"></textarea>
          <LightButton>Enviar</LightButton>
        </form>
      </div>
    </div>
