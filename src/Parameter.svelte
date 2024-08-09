<script lang="ts">
  export let label: string;
  export let value: number;
  export let min: number;
  export let max: number;
  export let step: number;
</script>

<div class="entry">
  <div class="label">
    {label}
  </div>
  <div class="pair">
    <input type="range" bind:value={value} min={min} max={max} step={step} name="range-slider"/>
    <div class="number-box">
      <input type="number" bind:value={value} min={min} max={max} step={step} name="number-box"/>
    </div>
  </div>
</div>

<style>
  .entry {
    width: 100%;
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .label {
    width: 200px;
    text-align: left;
  }
  .pair {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }
  .number-box {
    width: 50px;
    height: 20px;
    display: inline-block;
    vertical-align: bottom;
  }
  input[type=number] {
    width: 50px;
    height: 20px;
  }
</style>