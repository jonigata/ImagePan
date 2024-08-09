<script lang="ts">
  import { tick } from "svelte";
  import Parameter from "./Parameter.svelte";
  import SpreadCanvas from "./SpreadCanvas.svelte";
  import { easeInOut, generateScenes, type MovieInfo } from "./lib/generateScenes";
  import { createVideoWithImages } from "./lib/generateMovieFile";

  export let image: HTMLImageElement | null = null;
  
  let startingWait = 0;
  let endingWait = 0;
  let panTime = 5;
  let canvas: HTMLCanvasElement;
  let width: number;
  let height: number;
  let cursor = 0;
  let playing: number;
  let progress: number | null = null;
  const fps = 24;

  //const aspect_ratio = 16 / 9;
  const aspect_ratio = 1;

  $: onImageChanged(image);
  async function onImageChanged(img: HTMLImageElement | null) {
    if (!img) return;
    await img.decode();
    await tick();
    const w = img.width;
    const h = img.height;
    width = Math.floor(w / 2) * 2;
    // heightはaspect_ratio以下になるようにする
    if (h / width > aspect_ratio) {
      height = width * aspect_ratio;
    } else {
      height = h;
    }
    // heightは2の倍数
    height = Math.floor(height / 2) * 2;
    onSeek(cursor);
  }

  function onCanvasChanged(ev: CustomEvent<{canvas: HTMLCanvasElement}>) { 
    onSeek(cursor);
  }

  $: onSeek(cursor);
  function onSeek(rt: number) {
    if (!image) return;
    const t = easeInOut(rt);
    let top = (image.height - height) * t;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, -top);
  }

  function play() {
    if (playing) clearInterval(playing);
    playing = setInterval(() => {
      cursor += 1 / (panTime * fps);
      if (cursor > 1) {
        cursor = 1;
        clearInterval(playing);
      }
      onSeek(cursor);
    }, 1000 / fps);
  }

  async function build() {
    progress = 0;
    const info: MovieInfo = {width,height,startingWait,panTime,endingWait,fps};
    const scenes = generateScenes(image!, info);
    console.log(scenes);
    const url = await createVideoWithImages(info.width, info.height, fps, scenes, (p: number) => {
      progress = p;
      console.log("progress", progress);
    });
    download(url);
    progress = null;
  }

  function download(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

</script>

<div class="container">
  <Parameter label={"開始ウェイト"} value={startingWait} min={0} max={5} step={1}/>
  <Parameter label={"パン時間"} value={panTime} min={0} max={10} step={1}/>
  <Parameter label={"終了ウェイト"} value={endingWait} min={0} max={5} step={1}/>
  <div class="canvas-container">
    <SpreadCanvas width={image?.width ?? 256} height={height} bind:canvas={canvas} on:canvaschanged={onCanvasChanged}/>
  </div>
  <div class="cursor-container">
    <span>開始</span>
    <input type="range" bind:value={cursor} min={0} max={1} step={0.001} name="seek"/>
    <span>終了</span>
    <button on:click={play}>再生</button>
  </div>
  <div class="cursor-container">
    <button on:click={build}>ビルド</button>
    {#if progress !== null}
      <progress value={progress} max={1}/>
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 12px;
  }
  .canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  .cursor-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 12px;
  }
  .cursor-container input[type=range] {
    flex-grow: 1;
  }
</style>
