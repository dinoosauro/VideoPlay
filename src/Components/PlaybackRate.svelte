<script lang="ts">
    import { onMount } from "svelte";
    import DropdownAnimation from "../ts/DropdownAnimation";
    import type { PopupScalingInfo } from "../ts/Interfaces";
    import Settings from "../ts/Settings";
    import inputRangeStyle from "../ts/InputTypeRangeStyle";
    import { lang } from "../ts/Lang";

    let {scaleInfo, video}: {
        /**
         * Information used to animate the opening of the sleep dialog 
         */
        scaleInfo: PopupScalingInfo,
        video: HTMLVideoElement
    } = $props();
    let {scaling, closeCallback} = $derived(scaleInfo);

    onMount(() => {
        DropdownAnimation.triggerAnimation(container, false, scaling);
    })
    
    let videoSpeed = $state(video.playbackRate);
    $effect(() => {
        video.playbackRate = videoSpeed;
    })
    let container: HTMLDivElement;
</script>

<div class="dropdownItem" bind:this={container}>
    <input use:inputRangeStyle type="range" min="0.25" step="0.01" max="4" bind:value={videoSpeed}>
    <p>{lang("Current playback rate")}: {videoSpeed}x</p>
    <div class="flex hcenter gap wcenter">
        {#each Settings.playback.speedOptions as playbackOptions}
        <button onclick={async () => {
            videoSpeed = playbackOptions;
            await DropdownAnimation.triggerAnimation(container, true, scaling);
            closeCallback()
        }}>{playbackOptions}x</button>
        {/each}
    </div>
</div>

<style>
    button {
        width: fit-content;
    }
</style>