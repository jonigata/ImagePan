<script lang="ts">
  import SourceImage from './SourceImage.svelte';
  import TargetVideo from './TargetVideo.svelte';

  let image: HTMLImageElement | null = null;

  async function onImageChanged(event: CustomEvent<{url: string}>) {
    console.log("onImageChanged", event.detail.url);
    const img = new Image();
    img.src = event.detail.url;
    await img.decode();
    console.log("image decoded", img.width, img.height);
    image = img;
  }
</script>

<div class="container">
  <div class="left">
    <SourceImage on:imagechanged={onImageChanged}/>
  </div>
  <div class="right">
    <TargetVideo {image}/>
  </div>
</div>

<style>
  .container {
    display: flex;
    width: 100vw;
    height: 100vh;
  }
  .left, .right {
    flex: 1;
    padding: 1rem;
  }
  .left {
    background-color: #f0f0f0;
  }
  .right {
    background-color: #ffffff;
  }
</style>
