<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let panelType = "";
  console.log("panelType::: ", panelType);
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
            <div class="title-icon"></div>
            <div class="text">{zoomInTarget.displayName}</div>
            <div class="info-icon"></div>
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
    .zoom-in-panel {
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

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #012c2c80;
        height: 50px;
        padding: 15px;
        .left {
          display: flex;
          align-items: center;
          .title-icon {
            background-image: url("$lib/icon/cctv.svg");
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-size: 100%;
            background-position: center;
          }
          .text {
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 0.5px;
            margin: 0 5px;
            user-select: none;
			color: #ffffff;
          }
          .info-icon {
            background-image: url("$lib/icon/roadside_info.svg");
            width: 20px;
            height: 20px;
            background-repeat: no-repeat;
            background-size: 100%;
            background-position: center;
            pointer-events: visible;
            cursor: pointer;
            position: relative;
            &:before {
              content: "";
              position: absolute;
              bottom: 100%;
              left: 0;
              transform: rotate(180deg) translateX(-50%);
              border-width: 5px;
              border-style: solid;
              border-color: transparent transparent #ffffffbf transparent;
              opacity: 0;
              visibility: hidden;
              transition:
                opacity 0.3s ease,
                visibility 0.3s ease;
              z-index: 10;
            }
            &:after {
              content: "停車場出入口 CCTV 即時影像";
              position: absolute;
              bottom: calc(100% + 10px);
              left: calc(100% + 20px);
              transform: translateX(-50%);
              background-color: #ffffffbf;
              color: #4f4f4f;
              padding: 5px 10px;
              border-radius: 5px;
              white-space: nowrap;
              opacity: 0;
              visibility: hidden;
              transition:
                opacity 0.3s ease,
                visibility 0.3s ease;
              font-size: 14px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
              z-index: 10;

              height: 34px;
              font-weight: 400;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            &:hover::before {
              opacity: 1;
              visibility: visible;
            }
            &:hover::after {
              opacity: 1;
              visibility: visible;
            }
          }
        }
        .right {
          display: flex;
          align-items: center;
          .zoom-out-icon {
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
      .img-row {
        box-sizing: border-box;
        padding: 15px;
        width: 100%;
        height: calc(100% - 90px);
        .video {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
