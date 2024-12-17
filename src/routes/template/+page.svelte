<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";

  let map: mapboxgl.Map | undefined;
  export let data
  const { MAPBOX_TOKEN } = data;
  export let accessToken: string = MAPBOX_TOKEN;
  export let lng: number = 121.46814867792826;
  export let lat: number = 25.06486125863416;


  onMount(() => {
    mapboxgl.accessToken = accessToken;

    map = new mapboxgl.Map({
      container: "mapContainer",
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [lng, lat],
      zoom: 11,
      bearing: -12,
      pitch: 50,
    });
    map = map;

    return () => map?.remove();
  });
</script>

<div id="mapContainer"></div>

<style lang="postcss">
  #mapContainer {
    width: 100vw;
    height: 100vh;
  }
</style>
