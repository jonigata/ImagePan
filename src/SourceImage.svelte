<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dropzone } from './lib/dropzone';
  import { createImageFromBlob } from './lib/imageUtils';

  const dispatch = createEventDispatcher();

  let src: string | null = null;
  let alt: string | null = null;

  async function onFileDrop(files: FileList) {
    console.log("onFileDrop", files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      src = url;
      alt = file.name;
      dispatch('imagechanged', { url: url });
    }
  }

</script>

<div class="container" use:dropzone={onFileDrop}>
  {#if src}
    <img class="image" {src} {alt}/>
  {:else}
    <p>ここに画像をドロップしてください</p>
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* アスペクト比を維持してギリギリ収まるようにする */
  }

</style>
