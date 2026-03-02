<script lang="ts">
    import BottomVideoControls from "./Components/BottomVideoControls.svelte";
    import TopVideoButtons from "./Components/TopVideoButtons.svelte";
    import type { VideoStorage } from "./ts/Interfaces";
    import "./Components/Settings.svelte";
    import { lang } from "./ts/Lang";
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
    onchange: () => {
      if (input.files) {
        videoUrl = URL.createObjectURL(input.files[0]);
        videoList.push(...Array.from(input.files).map(i => {return {file: i, id: crypto.randomUUID()}}));
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
  }} bind:this={video} autoplay src={videoUrl}></video>
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