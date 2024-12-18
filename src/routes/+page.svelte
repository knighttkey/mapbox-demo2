<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  onMount(() => {
    goto("/cctvDemo6", { replaceState: true });
  });
</script>

<style lang="postcss">
</style>
