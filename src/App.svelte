<script lang="ts">
    import BottomVideoControls from "./Components/BottomVideoControls.svelte";
    import TopVideoButtons from "./Components/TopVideoButtons.svelte";
    import type { VideoStorage } from "./ts/Interfaces";
    import "./Components/Settings.svelte";
    import { lang } from "./ts/Lang";
    import type { IAudioMetadata } from "music-metadata";
    import Settings from "./ts/Settings";
    import UpdateMediaSessionMetadata from "./ts/UpdateMediaSessionMetadata";
    import MediaSessionControls from "./ts/MediaSessionControls";
  let videoList: VideoStorage[] = $state([]);
  let videoUrl = "";
  let video: HTMLVideoElement | undefined = $state(undefined);
  let videoControls: HTMLDivElement; 
  if (typeof crypto.randomUUID === "undefined") crypto.randomUUID = () => Math.random().toString() as any;
</script>


{#if videoList.length === 0}
<header>
    <div class="flex hcenter gap">
        <img alt="Logo" src="./icon.svg" style="width: 64px; height: 64px">
        <h1>VideoPlay</h1>
    </div>
  <p>{lang("Play your local videos, directly from your browser")}.</p>
</header>

<button style="background-color: var(--secondcard);" onclick={() => {
  const input = Object.assign(document.createElement("input"), {
    type: "file",
    multiple: true,
    accept: "video/*",
    onchange: async () => {
      if (input.files) {
        videoUrl = URL.createObjectURL(input.files[0]);
        for (const file of input.files) {
          let metadata: IAudioMetadata | undefined;
          if (Settings.metadata.autoReadMetadata) {
            try {
              const metadataLib = await import("music-metadata");
              metadata = await metadataLib.parseBlob(file);
            } catch(ex) {
              console.warn(ex);
            }
          }
          videoList.push({file, id: crypto.randomUUID(), metadata});
          if (videoList.length === 1) {
            UpdateMediaSessionMetadata(videoList[0]);
          }
        }
      }
    }
  });
  input.click();
}}>{lang("Pick videos")}</button>
{:else}
<div class="videoContainer">
  <!-- svelte-ignore a11y_media_has_caption -->
  <video playsinline onclick={() => {
    videoControls.getAttribute("data-disable") ? videoControls.removeAttribute("data-disable") : videoControls.setAttribute("data-disable", "true");
  }} bind:this={video} use:MediaSessionControls={videoList} autoplay src={videoUrl}></video>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div class="videoControls" bind:this={videoControls} role="button" tabindex="-1" onclick={(e) => {
    if ((e.target as HTMLElement).nodeName === "IMG" || (e.target as HTMLElement).nodeName === "BUTTON" || (e.target as HTMLElement).nodeName === "INPUT") return;
    videoControls.getAttribute("data-disable") ? videoControls.removeAttribute("data-disable") : videoControls.setAttribute("data-disable", "true"); // Let's hide the video controls if they're being shown (so, if data-disable isn't set).
  }}>
    <TopVideoButtons videoInfo={videoList} videoObj={video}></TopVideoButtons>
    <BottomVideoControls {videoList} videoObj={video}></BottomVideoControls>
    <span></span>
  </div>
</div>
{/if}

<style>
  .videoContainer {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
  }
  video {
    width: 100vw;
    height: auto;
    object-fit: contain;
  }
  .videoControls {
    pointer-events: none;
    transition: opacity 0.2s ease-in-out;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
    opacity: 0;
  }
</style>