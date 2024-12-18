<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let panelType = "";
  export let zoomInTarget: MediaItem | null;
  interface MediaItem {
    url: string;
    displayName: string;
  }
  const dispatch = createEventDispatcher();

  let video: HTMLVideoElement | null = null;


  function clearTarget() {
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.src = "";
    }
    dispatch("clearTarget");
  }
</script>

{#if zoomInTarget}
  <div class="zoom-in-panel-bg">
    <div class={`zoom-in-panel ${zoomInTarget ? "show" : ""}`}>
      <div class="title-row">
        <div class="left">
          {#if panelType === "cctv" && zoomInTarget.displayName}
            <div class="text">{zoomInTarget.displayName}</div>
          {/if}
        </div>
        <div class="right">
          <div
            class="zoom-out-icon"
            on:pointerdown|stopPropagation={clearTarget}
          ></div>
        </div>
      </div>
      <div class="img-row">
        {#if panelType === "cctv"}
          <video bind:this={video} class="video" autoplay>
            <source src={zoomInTarget.url} type="video/mp4" />
            <track kind="captions" />
          </video>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  .zoom-in-panel-bg {
    width: 100vw;
    height: 100vh;
    background-color: #00000099;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9900;
    /* backdrop-filter: blur(10px); */
    & .zoom-in-panel {
      display: flex;
      flex-direction: column;
      width: 90%;
      height: 90%;
      background-color: #012c2cb2;
      border: 1px solid #313131;
      box-sizing: border-box;
      opacity: 0;
      border-radius: 8px;
      transform-origin: center center;
      pointer-events: visible;

      &.show {
        opacity: 1;
      }

      & .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #012c2c80;
        height: 50px;
        padding: 15px;
        & .left {
          display: flex;
          align-items: center;
          & .text {
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0.5px;
            margin: 0 5px;
            user-select: none;
			color: #ffffff;
          }
        }
        & .right {
          display: flex;
          align-items: center;
          & .zoom-out-icon {
            background-image: url("$lib/icon/zoom_out.svg");
            width: 24px;
            height: 24px;
            background-repeat: no-repeat;
            background-size: 100%;
            background-position: center;
            cursor: pointer;
            pointer-events: visible;
          }
        }
      }
      & .img-row {
        box-sizing: border-box;
        padding: 15px;
        width: 100%;
        height: calc(100% - 90px);
        & .video {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
