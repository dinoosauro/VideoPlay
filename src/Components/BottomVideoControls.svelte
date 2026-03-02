<script lang="ts">
    import ConvertSecondsToTimestamp from "../ts/ConvertSecondsToTimestamp";
    import { getObjectUrl } from "../ts/IconsManager";
    import inputRangeStyle from "../ts/InputTypeRangeStyle";
    import type { PopupScalingInfo, VideoStorage } from "../ts/Interfaces";
    import { lang } from "../ts/Lang";
    import RemoveCaptionTrack from "../ts/RemoveCaptionTrack";
    import DropdownButtonShow from "./DropdownButtonShow.svelte";
    import PlaybackRate from "./PlaybackRate.svelte";
    import Volume from "./Volume.svelte";

    function nextVideo() {
        if (videoObj.loop) {
            videoObj.currentTime = 0;
            return;
        }
        if (videoList.length === 1) return;
        videoList.push(videoList.shift() as VideoStorage); // Let's add the video that has been played at the end of the queue
        URL.revokeObjectURL(videoObj.src);
        videoObj.src = URL.createObjectURL(videoList[0].file);
        videoObj.currentTime = 0;
        RemoveCaptionTrack(videoObj);
    }
    let playPauseBtn: HTMLImageElement;
    const {
        videoObj,
        videoList,
    }: { videoObj: HTMLVideoElement; videoList: VideoStorage[] } = $props();
    $effect(() => {
        if (videoObj) {
            videoObj.onpause = () => {
                playPauseBtn.src = getObjectUrl("play");
            };
            videoObj.onplay = () => {
                playPauseBtn.src = getObjectUrl("pause");
            };
            videoObj.onended = () => {
                nextVideo();
            }
            videoObj.addEventListener("enterpictureinpicture", () => {
                pictureInPictureIcon.src = getObjectUrl("pictureinpictureexit");
            });
            videoObj.addEventListener("leavepictureinpicture", () => {
                pictureInPictureIcon.src = getObjectUrl("pictureinpictureenter");
            });
            videoObj.addEventListener("timeupdate", () => {
                secondsStart.textContent = ConvertSecondsToTimestamp(videoObj.currentTime);
                secondsEnd.textContent = ConvertSecondsToTimestamp(videoObj.duration);
                range.max = videoObj.duration.toString();
                if (!blockProgressUpdate) {
                    range.value = videoObj.currentTime.toString();
                    range.dispatchEvent(new Event("change"));
                }
            })
        }
    });
    let fullscreenIcon: HTMLImageElement;
    let pictureInPictureIcon: HTMLImageElement;

    let secondsStart: HTMLSpanElement;
    let secondsEnd: HTMLSpanElement;
    let range: HTMLInputElement;
    let blockProgressUpdate = false;
</script>

<div class="videoBottomContainer">
    <div>
        <input type="range" step="0.001" max="1" value="0" onmousedown={() => (blockProgressUpdate = true)} onmouseup={() => (blockProgressUpdate = false)} ontouchstart={() => (blockProgressUpdate = true)} ontouchend={() => (blockProgressUpdate = false)} bind:this={range} use:inputRangeStyle={() => {
            videoObj.currentTime = +range.value;
        }}>
        <div style="height: 7px;"></div>
        <span bind:this={secondsStart}>0:00</span>
        <span bind:this={secondsEnd} style="float: right;">0:00</span>
    </div>
    <div class="flex hcenter gap">
        <div class="flex hcenter gap">
        <DropdownButtonShow placeholderIcon="topspeed" iconAlt={lang("Change playback rate")}>
            {#snippet children(scaleInfo: PopupScalingInfo)}
                <PlaybackRate {scaleInfo} video={videoObj}></PlaybackRate>
            {/snippet}
        </DropdownButtonShow>
            <DropdownButtonShow
                placeholderIcon="volume"
                iconAlt={lang("Change volume")}
            >
                {#snippet children(scaleInfo: PopupScalingInfo)}
                    <Volume {scaleInfo} video={videoObj}></Volume>
                {/snippet}
            </DropdownButtonShow>
        </div>
        <div class="flex hcenter gap wcenter maxWidth">
            <button
                title={lang("Previous video")}
                class="emptyButton"
                onclick={() => {
                    if (videoObj.currentTime > 5 || videoObj.loop) { // Go back to the start of the video
                        videoObj.currentTime = 0;
                        return;
                    }
                    // We'll play the previous video, that'll be the last that has been added by the queue
                    videoList.unshift(videoList.pop() as VideoStorage);
                    URL.revokeObjectURL(videoObj.src);
                    videoObj.src = URL.createObjectURL(videoList[0].file);
                    videoObj.currentTime = 0;
                    RemoveCaptionTrack(videoObj);
                }}
            >
                <img src={getObjectUrl("prev")} alt={lang("Previous video")} />
            </button>
            <button
                class="emptyButton"
                onclick={() => videoObj[videoObj.paused ? "play" : "pause"]()}
                title={lang("Play/pause video")}
            >
                <img
                    bind:this={playPauseBtn}
                    src={getObjectUrl(videoObj?.paused ? "play" : "pause")}
                    alt={lang("Play/pause video")}
                />
            </button>
            <button
                class="emptyButton"
                onclick={() => nextVideo()}
                title={lang("Next video")}
            >
                <img src={getObjectUrl("next")} alt={lang("Next video")} />
            </button>
        </div>
        <div class="flex hcenter gap">
        <button class="emptyButton" title={lang("Enter/exit picture-in-picture mode")} onclick={() => {
            document.pictureInPictureElement ? document.exitPictureInPicture() : videoObj.requestPictureInPicture();
        }}>
            <!-- svelte-ignore a11y_img_redundant_alt -->
            <img bind:this={pictureInPictureIcon} src={getObjectUrl(`pictureinpicture${document.pictureInPictureElement ? "exit" : "enter"}`)} alt={lang("Enter/exit picture-in-picture mode")}>
        </button>
            <button
                class="emptyButton"
                title={lang("Open/close fullscreen mode")}
                onclick={() => {
                    // We'll try using the Fullscreen API if supported, otherwise we'll use the WebKit fallback
                    const videoContainer = document.querySelector(
                        ".videoContainer",
                    ) as HTMLDivElement | undefined;
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                        fullscreenIcon.src = getObjectUrl("fullscreenmaximize");
                        return;
                    }
                    if (videoContainer?.requestFullscreen) {
                        videoContainer.requestFullscreen({
                            navigationUI: "hide",
                        });
                        fullscreenIcon.src = getObjectUrl("fullscreenminimize");
                        return;
                    }
                    if (videoObj?.webkitEnterFullscreen) videoObj.webkitEnterFullscreen();
                }}
            >
                <img
                    src={getObjectUrl("fullscreenmaximize")}
                    bind:this={fullscreenIcon}
                    alt={lang("Open/close fullscreen mode")}
                />
            </button>
        </div>
    </div>
</div>

<style>
    .videoBottomContainer {
        position: fixed;
        z-index: 2;
        bottom: 25px;
        left: calc(15vw - 15px);
        width: 70vw;
        max-height: 40vh;
        overflow: auto;
        backdrop-filter: blur(16px) brightness(40%);
        padding: 15px;
        border-radius: 12px;
    }
    img {
        width: 24px;
        height: 24px;
    }
</style>
