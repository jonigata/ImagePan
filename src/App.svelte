<script lang="ts">
  import SplitView from './SplitView.svelte';
  import { initFFmpeg } from './lib/generateMovieFile';

  initFFmpeg();
</script>

<main>
  <SplitView />
</main>

<style>
</style>
