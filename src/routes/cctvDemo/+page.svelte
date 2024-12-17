<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import ZoomInPanel from "$lib/components/ZoomInPanel";
  let map: mapboxgl.Map | undefined;
  export let data: {
    MAPBOX_TOKEN: string;
    CUSTOM_MAP_STYLE_2?: string;
  };
  const { MAPBOX_TOKEN, CUSTOM_MAP_STYLE_2 } = data;

  let cctvXs01 = "https://3d-models.eyeots.com/poc/cctv/xs01.mov";
  let cctvXs02 = "https://3d-models.eyeots.com/poc/cctv/xs02.mov";
  let cctvXs03 = "https://3d-models.eyeots.com/poc/cctv/xs03.mov";
  let cctvXs04 = "https://3d-models.eyeots.com/poc/cctv/xs04.mov";
  let cctvXs06 = "https://3d-models.eyeots.com/poc/cctv/aicctv1.mp4";
  let cctvXs07 = "https://3d-models.eyeots.com/poc/cctv/aicctv2.mp4";

  let accessToken: string = MAPBOX_TOKEN;
  let customMapStyle = CUSTOM_MAP_STYLE_2
    ? CUSTOM_MAP_STYLE_2
    : "mapbox://styles/mapbox/light-v11";

  let showAllCCTVs = false;

  const initialView: {
    id: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  } = {
    id: "initialView",
    center: [121.51832859540923, 25.060130550623782],
    zoom: 14.264720945577302,
    pitch: 73.49999999999996,
    bearing: -51.200000000000045,
  };
  const twView: {
    id: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  } = {
    id: "twView",
    center: [120.84551742831331, 23.50020655724505],
    zoom: 7.609594557568757,
    pitch: 54.86081664831626,
    bearing: -22.56938326419686,
  };
  const thView: {
    id: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  } = {
    id: "thView",
    center: [100.71240773197599, 13.712874415655293],
    zoom: 10.46307235269232,
    pitch: 51.755969151530515,
    bearing: 0,
  };

  const cctvs: {
    id: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
    videoUrl: string;
    videoCoordinates: [number, number][];
  }[] = [
    {
      id: "cctv1",
      center: [121.52769438802147, 25.062069616096878],
      videoUrl: cctvXs01,
      zoom: 20.899285875881525,
      pitch: 84.99999999999997,
      bearing: 7.366810362461251,
      videoCoordinates: [
        [121.52806731223978, 25.062770666313824],
        [121.52735593237554, 25.064221054561543],
        [121.52758914357588, 25.061833329874148],
        [121.52770099186068, 25.0618073240025],
      ],
    },

    {
      id: "cctv2",
      center: [121.52758291507462, 25.058038352456165],
      videoUrl: cctvXs02,
      zoom: 21.039065535822463,
      pitch: 82.00000000000001,
      bearing: 7.215265985947326,
      videoCoordinates: [
        [121.52723257015981, 25.05883416511179],
        [121.5279890379282, 25.058685316501453],
        [121.52757694742724, 25.057760336031222],
        [121.52749691476254, 25.0577719948692],
      ],
    },
    {
      id: "cctv3",
      center: [121.52749466910063, 25.05296792253631],
      videoUrl: cctvXs03,
      zoom: 19.612951284547883,
      pitch: 83.00000000000007,
      bearing: -15.202346801336944,
      videoCoordinates: [
        [121.52698005807525, 25.05386274102382],
        [121.5278649294201, 25.054004473279264],
        [121.52782734239213, 25.052105384252116],
        [121.52767462481427, 25.0521989421499],
      ],
    },
    {
      id: "cctv4",
      center: [121.52955639085172, 25.048244701246915],
      videoUrl: cctvXs04,
      zoom: 20.378062760567477,
      pitch: 81.50000000000006,
      bearing: -52.58022481119917,
      videoCoordinates: [
        [121.52772824907606, 25.0488369513009],
        [121.52746408661898, 25.051503069019702],
        [121.52992412798102, 25.048145355413794],
        [121.52980270946642, 25.047980278820447],
      ],
    },
    {
      id: "cctv5",
      center: [120.5391684675072, 22.710764810168108],
      videoUrl: "",
      zoom: 16.21926411145746,
      pitch: 81.50000000000006,
      bearing: -52.58022481119917,
      videoCoordinates: [],
    },
    {
      id: "cctv6",
      center: [100.69795551393837, 13.72143312911032],
      videoUrl: "",
      zoom: 16.21926411145746,
      pitch: 81.50000000000006,
      bearing: -52.58022481119917,
      videoCoordinates: [],
    },
    {
      id: "cctv7",
      center: [100.75983858398985, 13.610784841683737 ],
      videoUrl: "",
      zoom: 16.21926411145746,
      pitch: 81.50000000000006,
      bearing: -52.58022481119917,
      videoCoordinates: [],
    },
  ];

  function calculateDistance(
    coord1: [number, number],
    coord2: [number, number]
  ): number {
    const R = 6371e3;
    const rad = Math.PI / 180;
    const lat1 = coord1[1] * rad;
    const lat2 = coord2[1] * rad;
    const deltaLat = (coord2[1] - coord1[1]) * rad;
    const deltaLng = (coord2[0] - coord1[0]) * rad;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function addVideoLayer(
    id: string,
    videoUrl: string,
    coordinates: [number, number][]
  ): void {
    if (!map) return;
    if (id === "cctv5" || id === "cctv6" || id === "cctv7") return;
    map.addSource(id, {
      type: "video",
      urls: [videoUrl],
      coordinates: coordinates as [
        [number, number],
        [number, number],
        [number, number],
        [number, number],
      ],
    });
    map.addLayer({
      id: `${id}-layer`,
      type: "raster",
      source: id,
      paint: {
        "raster-opacity": 1,
      },
    });
    map.setLayoutProperty(`${id}-layer`, "visibility", "none");
  }

  function updateVideoVisibility(): void {
    if (!map) return;

    const center = map.getCenter();
    cctvs.forEach((cctv) => {
      if (!map) return;
      const distance = calculateDistance([center.lng, center.lat], cctv.center);
      const source = map.getSource(cctv.id);

      if (source) {
        const shouldDisplay = showAllCCTVs || distance <= 100;
        map.setLayoutProperty(
          `${cctv.id}-layer`,
          "visibility",
          shouldDisplay ? "visible" : "none"
        );
      }
    });
  }

  function createMarker(map: mapboxgl.Map, data: any) {
    const element = document.querySelector(data.elementSelector) as
      | HTMLElement
      | HTMLVideoElement;

    if (!element) {
      console.error(`Element ${data.elementSelector} not found.`);
      return null;
    }

    const marker = new mapboxgl.Marker({
      element,
      draggable: false,
      offset: data.offset || [0, 0],
    })
      .setLngLat([data.markerCoordinate[0], data.markerCoordinate[1]])
      .addTo(map);

    return marker;
  }
  function calculateBearing(
    start: [number, number],
    end: [number, number]
  ): number {
    const deltaLng = end[0] - start[0];
    const deltaLat = end[1] - start[1];
    const angle = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI);
    return (angle + 360) % 360;
  }

  onMount(() => {
    mapboxgl.accessToken = accessToken;

    map = new mapboxgl.Map({
      container: "mapContainer",
      style: customMapStyle,
      center: initialView.center,
      zoom: initialView.zoom,
      pitch: initialView.pitch,
      bearing: initialView.bearing,
    });

    map.on("load", () => {
      if (!map) return;
      cctvs.forEach((cctv) => {
        if (!map) return;
        addVideoLayer(cctv.id, cctv.videoUrl, cctv.videoCoordinates);

        markersData.forEach((data) => {
          if (!map) return;
          const marker = createMarker(map, data);
          if (!marker) return;
        });

        hideLabels();
      });
    });
    map.on("move", logMapState);
    map.on("zoom", logMapState);
    return () => map?.remove();
  });
  function logMapState() {
    if (map) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const pitch = map.getPitch();
      const bearing = map.getBearing();
      // console.log(`地圖狀態更新:
      //   center: [${center.lng}, ${center.lat}],
      //   zoom: ${zoom},
      //   pitch: ${pitch},
      //   bearing: ${bearing}`);
    }
  }
  function hideLabels() {
    if (!map) return;

    const style = map.getStyle();
    if (!style || !style.layers) return;

    style.layers.forEach((layer) => {
      if (!map) return;
      if (
        layer.type === "symbol" &&
        layer.layout &&
        layer.layout["text-field"]
      ) {
        map.setLayoutProperty(layer.id, "visibility", "none");
      }
    });
  }

  function flyTo(view: {
    id: string;
    center: [number, number];
    zoom: number;
    pitch: number;
    bearing: number;
  }) {
    if (!map) return;
    if (view.id === "cctv4") {
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        speed: 0.5,
        curve: 1,
        duration: 5000,
        essential: true,
      });
      setTimeout(() => {
        if (!map) return;
        map.setLayoutProperty(`${"cctv4"}-layer`, "visibility", "visible");
      }, 5000);
    } else if (view.id === "cctv3") {
      map.setLayoutProperty(`${"cctv4"}-layer`, "visibility", "none");
      if (!map) return;
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        speed: 0.5,
        curve: 1,
        duration: 3000,
        essential: true,
      });
      setTimeout(() => {
        if (!map) return;
        map.setLayoutProperty(`${"cctv3"}-layer`, "visibility", "visible");
      }, 3000);
    } else if (view.id === "cctv2") {
      map.setLayoutProperty(`${"cctv3"}-layer`, "visibility", "none");
      if (!map) return;
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        speed: 0.1,
        curve: 0.1,
        duration: 8000,
        essential: true,
      });
      setTimeout(() => {
        if (!map) return;
        map.setLayoutProperty(`${"cctv2"}-layer`, "visibility", "visible");
      }, 8000);
    } else if (view.id === "cctv1") {
      map.setLayoutProperty(`${"cctv2"}-layer`, "visibility", "none");
      if (!map) return;
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        speed: 0.1,
        curve: 0.1,
        duration: 8000,
        essential: true,
      });
      setTimeout(() => {
        if (!map) return;
        map.setLayoutProperty(`${"cctv1"}-layer`, "visibility", "visible");
      }, 8000);
    } else {
      cctvs.forEach((cctv) => {
        if (!map) return;

        if (cctv.id === "cctv5" || cctv.id === "cctv6" || cctv.id === "cctv7")
          return;
        // map.setLayoutProperty(`${cctv.id}-layer`, "visibility", "none");
      });
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        speed: 0.5,
        curve: 1,
        duration: 5000,
        essential: true,
      });
    }
  }

  const markersData = [
    {
      id: "line-source",
      markerCoordinate: [121.52768117570645, 25.06216549179632, 100],
      targetCoordinate: [121.5165, 25.0172],
      elementSelector: ".custom-marker",
      lineColor: "#ffffff",
      offset: [0, 0],
    },
    {
      id: "line-source2",
      markerCoordinate: [121.52757746953625, 25.05804302240466, 100],
      targetCoordinate: [121.4583479609985, 25.126182781299626],
      elementSelector: ".custom-marker2",
      lineColor: "#ffffff",
    },
    {
      id: "line-source3",
      markerCoordinate: [121.52739604470275, 25.053126176641513, 100],
      targetCoordinate: [121.4583479609985, 25.126182781299626],
      elementSelector: ".custom-marker3",
      lineColor: "#ffffff",
    },
    {
      id: "line-source4",
      markerCoordinate: [121.5296207085911, 25.04820608779596, 100],
      targetCoordinate: [121.4583479609985, 25.126182781299626],
      elementSelector: ".custom-marker4",
      lineColor: "#ffffff",
    },
    {
      id: "line-source5",
      markerCoordinate: [120.5391684675072, 22.710764810168108, 100],
      targetCoordinate: [120.5391684675072, 22.710764810168108],
      elementSelector: ".custom-marker5",
      lineColor: "#ffffff",
    },
    {
      id: "line-source6",
      markerCoordinate: [100.69795551393837, 13.72143312911032, 100],
      targetCoordinate: [120.5391684675072, 22.710764810168108],
      elementSelector: ".custom-marker6",
      lineColor: "#ffffff",
    },
    {
      id: "line-source7",
      markerCoordinate: [100.75983858398985, 13.610784841683737, 100],
      targetCoordinate: [120.5391684675072, 22.710764810168108],
      elementSelector: ".custom-marker7",
      lineColor: "#ffffff",
    },
  ];

  function openLink() {
    const url = "https://tci-demo.eyeots.com/" as string;
    const windowName = "tci";
    const existingWindow = window.open("", windowName);

    if (existingWindow) {
      existingWindow.location.href = url;
    } else {
      window.open(url, windowName);
    }
  }

  function singleFlyTo(
    view: {
      id: string;
      center: [number, number];
      zoom: number;
      pitch: number;
      bearing: number;
    },
    map: mapboxgl.Map
  ) {
    if (!map) return;

    cctvs.forEach((cctv) => {
      if (!map) return;

      if (view.id === "cctv5" || view.id === "cctv6" || view.id === "cctv7")
        return;
      map.setLayoutProperty(`${cctv.id}-layer`, "visibility", "none");
    });

    map.flyTo({
      center: view.center,
      zoom: view.zoom,
      pitch: view.pitch,
      bearing: view.bearing,
      speed: 0.5,
      curve: 1,
      duration: 5000,
      essential: true,
    });
    setTimeout(() => {
      if (!map) return;
      if (view.id === "cctv5" || view.id === "cctv6" || view.id === "cctv7")
        return;
      map.setLayoutProperty(`${view.id}-layer`, "visibility", "visible");
    }, 6000);
  }

  interface VideoItem {
    displayName: string;
    url: string;
  }
  let zoomInTarget: VideoItem | null;
  function onZoomInVideo(cctvId: string) {
    if (cctvId === "cctv6") {
      zoomInTarget = { url: cctvXs06, displayName: "cctv6" };
    } else if (cctvId === "cctv7") {
      zoomInTarget = { url: cctvXs07, displayName: "cctv7" };
    }
  }

  function onClearTarget(e: CustomEvent) {
    zoomInTarget = null;
  }
</script>

<div id="mapContainer"></div>
{#if map}
  <div class="custom-marker-style custom-marker">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <div class="info">
        <button
          class="link-btn"
          on:click|stopPropagation={() =>
            singleFlyTo(cctvs[0], map as mapboxgl.Map)}
        >
          <div class="v-icon"></div>
          新生民權路口
        </button>
      </div>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker2">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <div class="info">
        <button
          class="link-btn"
          on:click|stopPropagation={() =>
            singleFlyTo(cctvs[1], map as mapboxgl.Map)}
        >
          <div class="v-icon"></div>
          新生民生路口
        </button>
      </div>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker3">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <div class="info">
        <button
          class="link-btn"
          on:click|stopPropagation={() =>
            singleFlyTo(cctvs[2], map as mapboxgl.Map)}
        >
          <div class="v-icon"></div>
          新生南京路口
        </button>
      </div>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker4">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <div class="info">
        <button
          class="link-btn"
          on:click|stopPropagation={() =>
            singleFlyTo(cctvs[3], map as mapboxgl.Map)}
        >
          <div class="v-icon"></div>
          新生長安路口
        </button>
      </div>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker5">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <div class="info">
        <!-- <a class='link' href="https://tci-demo.eyeots.com/" target="_blank">CCTV 5</a> -->
        <div class="link" on:pointerdown|stopPropagation={openLink}>
          https://tci-demo.eyeots.com/
        </div>
      </div>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker6">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <button class="info" on:click={() => onZoomInVideo("cctv6")}>
        <!-- svelte-ignore element_invalid_self_closing_tag -->
        <video class="video-cube" src={cctvXs06} autoplay muted loop />
      </button>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
  <div class="custom-marker-style custom-marker7">
    <div class="wrap">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="line4"></div>
      <div class="line5"></div>
      <button class="info" on:click={() => onZoomInVideo('cctv7')}>
        <!-- svelte-ignore element_invalid_self_closing_tag -->
        <video class="video-cube" src={cctvXs07} autoplay muted loop />
      </button>
      <div class="light-wrap">
        <div class="light"></div>
      </div>
    </div>
  </div>
{/if}
<div class="controls">
  <button on:click={() => flyTo(initialView)}>Taipei</button>
  <button on:click={() => flyTo(twView)}>Taiwan</button>
  <button on:click={() => flyTo(thView)}>Bangkok</button>
  <button on:click={() => flyTo(cctvs[0])}>新生民權路口</button>
  <button on:click={() => flyTo(cctvs[1])}>新生民生路口</button>
  <button on:click={() => flyTo(cctvs[2])}>新生南京路口</button>
  <button on:click={() => flyTo(cctvs[3])}>新生長安路口</button>
  <button on:click={() => flyTo(cctvs[4])}>TCI Bio</button>
</div>

{#if zoomInTarget}
  <ZoomInPanel panelType="cctv" on:clearTarget={onClearTarget} {zoomInTarget}
  ></ZoomInPanel>
{/if}

<style lang="postcss">
  #mapContainer {
    width: 100vw;
    height: 100vh;
  }
  .custom-marker-style {
    pointer-events: none;
    transform-origin: bottom center;
    color: #333333;

    & .wrap {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      & .line {
        border-left: 1px solid transparent;
        border-image-source: linear-gradient(
          135deg,
          transparent 0%,
          #ffffff 50%,
          #ffffff 100%
        );
        border-image-slice: 1;
        position: absolute;
        bottom: 0;
        left: -6px;
        /* width: 80px; */
        height: 100px;
        animation: rise 5s infinite;
      }
      & .line2 {
        border-left: 1px solid transparent;
        border-image-source: linear-gradient(
          135deg,
          transparent 0%,
          #ffffff 50%,
          #ffffff 100%
        );
        border-image-slice: 1;
        position: absolute;
        bottom: 0;
        left: 0px;
        /* width: 80px; */
        animation: easeIn 3s forwards;
      }
      & .line3 {
        border-left: 1px solid transparent;
        border-image-source: linear-gradient(
          135deg,
          transparent 0%,
          #ffffff 50%,
          #ffffff 100%
        );
        border-image-slice: 1;
        position: absolute;
        bottom: 0;
        right: -6px;
        height: 20px;
        animation: rise 7s infinite;
      }
      & .line4 {
        border-left: 1px solid transparent;
        border-image-source: linear-gradient(
          135deg,
          transparent 0%,
          #ffffff 50%,
          #1becff 100%
        );
        border-image-slice: 1;
        position: absolute;
        bottom: 0;
        left: -12px;
        height: 60px;
        animation: rise 6s infinite;
      }
      & .line5 {
        border-left: 1px solid transparent;
        border-image-source: linear-gradient(
          135deg,
          transparent 0%,
          #ffffff 50%,
          #1becff 100%
        );
        border-image-slice: 1;
        position: absolute;
        bottom: -6px;
        right: -12px;
        height: 40px;
        animation: rise 5s infinite;
      }
      & .info {
        color: #262626;
        font-size: 10px;
        padding: 5px 10px 5px 0px;
        display: flex;
        align-items: center;
        justify-content: start;
        position: absolute;
        left: 4px;
        bottom: 90px;
        font-weight: 500;
        font-size: 10px;
        white-space: nowrap;
        height: 30px;
        display: flex;
        align-items: center;
        animation: easeIn3 3s forwards;
        opacity: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.99) 0%,
          rgba(183, 210, 255, 0.8) 60%,
          rgba(17, 24, 39, 0.01) 100%
        );
        cursor: pointer;
        box-sizing: border-box;
        animation-delay: 3s;
        filter: drop-shadow(5px 0px 10px rgba(42, 255, 255, 0.3));
        & .link {
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          padding: 0 10px;
          &:hover {
            filter: brightness(1.2)
              drop-shadow(5px 0px 10px rgba(42, 255, 255, 0.3));
            transform: scale(1.03);
          }
        }
        & .v-icon {
          width: 20px;
          height: 20px;
          background-image: url("/images/cctv_icon.svg");
          background-size: 100%;
          background-repeat: no-repeat;
          background-position: center;
          margin: 0 5px 0 0;
        }
        & .link-btn {
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: start;
        }

        & .video-cube {
          width: 160px;
          height: 90px;
        }
      }
      & .light-wrap {
        pointer-events: none;
        position: absolute;
        left: 4px;
        bottom: 90px;
        width: 120px;
        height: 30px;
        /* background-color: red; */
        overflow: hidden;
        & .light {
          width: 1px;
          height: 30px;
          /* background-color: red; */
          background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.99) 0%,
            rgba(183, 210, 255, 0.8) 30%,
            rgba(17, 24, 39, 0.01) 100%
          );
          box-shadow: #1becff 0px 0px 10px;
          box-sizing: border-box;
          animation: moving 10s infinite 8s;
        }
      }
    }
  }

  .controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    display: flex;
    gap: 10px;
  }
  .controls button {
    padding: 10px 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    bottom: 100px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap;
  }
  .controls button:hover {
    background-color: #f0f0f0;
  }
  @keyframes easeIn {
    0% {
      opacity: 0;
      height: 0px;
    }
    100% {
      opacity: 1;
      height: 120px;
    }
  }
  @keyframes easeIn2 {
    0% {
      opacity: 0;
      height: 0px;
    }
    100% {
      opacity: 1;
      height: 100px;
    }
  }
  @keyframes easeIn3 {
    0% {
      opacity: 0;
      width: 0px;
    }
    100% {
      opacity: 1;
      width: 120px;
    }
  }

  @keyframes shift {
    0% {
      transform: translateY(10px);
      opacity: 1;
    }
    50% {
      transform: translateY(-2px);
      opacity: 0.5;
    }
    100% {
      transform: translateY(10px);
      opacity: 1;
    }
  }
  @keyframes moving {
    0% {
      transform: translateX(-20px);
      opacity: 1;
    }
    50% {
      transform: translateX(160px);
      opacity: 0.5;
    }
    100% {
      transform: translateX(-20px);
      opacity: 1;
    }
  }
  @keyframes rise {
    0% {
      transform: translateY(0px) scaleY(1);
      opacity: 0;
    }
    30% {
      /* transform: translateY(0px); */
      opacity: 1;
    }
    60% {
      /* transform:translateY(-50px) scaleY(0.45); */
      opacity: 0;
    }
    100% {
      transform: translateY(-80px) scaleY(0.01);
      opacity: 0;
    }
  }
</style>
