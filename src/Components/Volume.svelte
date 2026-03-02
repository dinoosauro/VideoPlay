<script lang="ts">
    import { onMount } from "svelte";
    import DropdownAnimation from "../ts/DropdownAnimation";
    import type { PopupScalingInfo } from "../ts/Interfaces";
    import inputRangeStyle from "../ts/InputTypeRangeStyle";
    import { lang } from "../ts/Lang";
    let {scaleInfo, video}: {
        /**
         * Information used to animate the opening of the sleep dialog 
         */
        scaleInfo: PopupScalingInfo,
        video: HTMLVideoElement
    } = $props();
    let {scaling} = $derived(scaleInfo);

    onMount(() => {
        DropdownAnimation.triggerAnimation(container, false, scaling);
    })
    let container: HTMLDivElement;
    let videoVolume = $state(video.volume);
    $effect(() => {
        video.volume = videoVolume;
        video.muted = videoVolume === 0;
    })
</script>

<div bind:this={container} class="dropdownItem">
    <input use:inputRangeStyle type="range" step="0.001" max="1" min="0" bind:value={videoVolume}><br>
    <p>{lang("Current volume")}: {Math.floor(videoVolume * 100)}%</p>
</div>