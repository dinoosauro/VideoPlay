<script lang="ts">
    import { getObjectUrl } from "../ts/IconsManager";
    import { type PopupScalingInfo, type VideoStorage } from "../ts/Interfaces";
    import ConvertSrtToVtt from "../ts/ConvertSrtToVtt";
    import DropdownButtonShow from "./DropdownButtonShow.svelte";
    import Queue from "./QueueAndMetadata.svelte";
    import Settings from "./Settings.svelte";
    import RemoveCaptionTrack from "../ts/RemoveCaptionTrack";
    import { lang } from "../ts/Lang";
    let {videoObj, videoInfo}: {videoObj: HTMLVideoElement, videoInfo: VideoStorage[]} = $props();
    let showSettings = $state(false);
</script>
<div class="topVideoControls flex hcenter gap">
    <button class="emptyButton flex hcenter" title={lang("Change video resize option")} onclick={() => {
        videoObj.style.objectFit = videoObj.style.objectFit === "cover" ? "fill": videoObj.style.objectFit === "fill" ? "contain" : "cover";
    }}>
        <img src={getObjectUrl("resizevideo")} alt={lang("Change video resize option")}>
    </button>
    <DropdownButtonShow iconAlt={lang("View queue")} placeholderIcon="list">
        {#snippet children(scaleInfo: PopupScalingInfo)}
        <Queue {scaleInfo} video={videoObj} {videoInfo}></Queue>
        {/snippet}
    </DropdownButtonShow>
    <button title={lang("Pick new subtitles")} class="emptyButton flex hcenter" onclick={() => {
        RemoveCaptionTrack(videoObj); // Remove the previous caption track
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            onchange: async () => {
                if (input.files) {
                    if (input.files[0].name.endsWith(".srt") || input.files[0].name.endsWith(".sub") || input.files[0].name.endsWith(".sbv")) { // We need to parse the subtitle
                        const track = videoObj.addTextTrack("captions", input.files[0].name);
                        for (const cue of ConvertSrtToVtt(await input.files[0].text(), input.files[0].name.endsWith(".sub") || input.files[0].name.endsWith(".sbv"))) track.addCue(cue);
                        track.mode = "showing"
                    } else if (input.files[0].name.endsWith(".vtt")) { // WebVTT subtitle track. Since it's natively supported by the browser, we can add it as a HTML track.
                    const track = document.createElement("track");
                    track.label = input.files[0].name;
                    track.kind = "captions";
                    track.src = URL.createObjectURL(input.files[0]);
                    track.default = true;
                    track.setAttribute("mode", "showing");
                    videoObj.append(track);
                }
            }
        }
    });
    input.click();
}}>
    <img src={getObjectUrl("subtitles")} alt={lang("Pick new subtitles")}>    
</button>
{#if typeof videoObj?.webkitShowPlaybackTargetPicker === "function"}
<button title={lang("Cast video")} class="emptyButton flex hcenter" onclick={() => {
    videoObj.webkitShowPlaybackTargetPicker?.();
}}>
        <img src={getObjectUrl("cast")} alt={lang("Cast video")}>
    </button>
    {/if}
    <button title={lang("Open settings dialog")} class="emptyButton flex hcenter" onclick={() => (showSettings = true)}>
        <img src={getObjectUrl("settings")} alt={lang("Open settings dialog")}>
    </button>
</div>

{#if showSettings}
<Settings {videoObj} closeCallback={() => (showSettings = false)}></Settings>
{/if}

<style>
    .topVideoControls {
        position: fixed;
        z-index: 2;
        border: 1px solid var(--text);
        padding: 5px;
        border-radius: 12px;
        top: 15px;
        right: 15px;
        width: fit-content;
        backdrop-filter: blur(8px) brightness(60%);
    }
    button {
        padding-top: 0px; padding-bottom: 0px; display: flex
    }
    img {
        width: 24px;
        height: 24px;
    }
</style>