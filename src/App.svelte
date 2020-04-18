<script>
  import Cursor from "./Cursor";

  let clientWidth = 0;
  let clientHeight = 0;
</script>

<style>
  .container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    pointer-events: none;
  }

  .stage {
    display: block;
  }
</style>

<div class="container" bind:clientWidth bind:clientHeight>
  <svg class="stage" viewBox="0 0 {clientWidth} {clientHeight}">
    <Cursor />
  </svg>
</div>
