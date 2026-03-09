<script lang="ts">
    import { onMount } from "svelte";
    import DropdownAnimation from "../ts/DropdownAnimation";
    import type { PopupScalingInfo, VideoStorage } from "../ts/Interfaces";
    import type { IPicture } from "music-metadata";
    import { getObjectUrl } from "../ts/IconsManager";
    import Dialog from "./SmallerComponents/Dialog.svelte";
    import Card from "./SmallerComponents/Card.svelte";
    import RemoveCaptionTrack from "../ts/RemoveCaptionTrack";
    import { lang } from "../ts/Lang";
    import ChangeVideo from "../ts/ChangeVideo";

    let {scaleInfo, video, videoInfo}: {
        /**
         * Information used to animate the opening of the sleep dialog 
         */
        scaleInfo: PopupScalingInfo,
        video: HTMLVideoElement,
        videoInfo: VideoStorage[]
    } = $props();
    let {closeCallback, scaling, limits} = $derived(scaleInfo);
    /**
     * If the script has finished to fetch the video metadata. This is used to refresh the queue with the new album art and the button to load the metadata information
     */
    let updatedMetadata = $state(false);
    /**
     * The VideoStorage object of the item whose metadata should be shown
     */
    let showMetadataInformation = $state<VideoStorage | undefined>(undefined);
    /**
     * A nested string array, with the name to display as the first entry, and the key of the music-metadata object to read as the second entry
     */
    const suggestedKeys = [[lang("Album"), "album"], [lang("Album artists"), "albumArtist"], [lang("Artists"), "artist"], [lang("Category"), "category"], [lang("Conductor"), "conductor"], [lang("Copyright"), "copyright"], [lang("Date"), "date"], [lang("Description"), "description"], [lang("Encoded by"), "encodedby"], [lang("Genre"), "genre"], [lang("License"), "license"], [lang("Title"), "title"], [lang("Subtitle"), "subtitle"], [lang("Year"), "year"]];
    onMount(() => {
        DropdownAnimation.triggerAnimation(container, false, scaling);
        (async () => {
            for (let i = 0; i < videoInfo.length; i++) { // Let's fetch the metadata of the videos, so that the user can view them in a dialog
                if (!videoInfo[i].metadata) {
                    const metadata = await import("music-metadata");
                    videoInfo[i].metadata = await metadata.parseBlob(videoInfo[i].file);
                    updatedMetadata = true;
                }
            }
        })()
        return () => {
            for (const url of urlsToRevoke) URL.revokeObjectURL(url);
        }
    });
    /**
     * A list of all the Object URLs that should be revoked since they're used only in the Queue section
     */
    let urlsToRevoke: string[] = [];
    function addObjectUrlToListToDelete(url: string) {
        urlsToRevoke.push(url);
        return url;
    }
    let container: HTMLDivElement;
</script>

<div bind:this={container} class="dropdownItem" style={limits}>
    <div class="flex hcenter gap">
        <h2>{lang("Queue")}:</h2>
        <button class="emptyButton" title={lang("Add videos to the queue")} onclick={() => {
            const input = Object.assign(document.createElement("input"), {
                type: "file",
                accept: "video/*",
                multiple: true,
                onchange: async () => {
                    if (input.files) {
                        const musicMetadata = await import("music-metadata");
                        for (const file of input.files) videoInfo.push({
                            file,
                            id: crypto.randomUUID(),
                            metadata: await musicMetadata.parseBlob(file)
                        });
                    }
                }
            });
            input.click();
        }}>
            <img style="width: 24px; height: 24px" src={getObjectUrl("add")} alt={lang("Add videos to the queue")}>
        </button>
    </div>
    <label class="flex hcenter gap">
        <input defaultChecked={video.loop} onchange={(e) => {
            video.loop = (e.target as HTMLInputElement).checked;
        }} type="checkbox">{lang("Loop the current video")}
    </label><br>
    {#key updatedMetadata}
    <div class="flex gap" style="flex-direction: column;">
        {#each videoInfo as possibleVideo, i (possibleVideo.id)}
            <div draggable={i !== 0} ondragover={e => e.preventDefault()} role="button" tabindex="0" ondrop={(e) => {
                // Let's move the VideoPosition object to the dropped position
                const sourcePosition = videoInfo.findIndex(i => i.id === e.dataTransfer?.getData("text/plain"));
                const destinationPosition = videoInfo.findIndex(i => i.id === possibleVideo.id);
                if (sourcePosition !== -1 && destinationPosition !== -1) videoInfo.splice(destinationPosition, 0, ...videoInfo.splice(sourcePosition, 1)) 
            }} ondragstart={(e) => e.dataTransfer?.setData("text/plain", possibleVideo.id)} class="flex hcenter gap" style="border: 1px solid var(--text); border-radius: 12px; padding: 0px 10px; background-color: var(--cardtransparent)">
            <button class="maxWidth flex hcenter gap emptyButton" style="display: flex;" onclick={() => {
                // Let's play the clicked video
                videoInfo.push(...videoInfo.splice(0, i));
                ChangeVideo({videoObj: video, file: videoInfo[0]});
            }}>
                {#if (possibleVideo.metadata?.common.picture?.length ?? 0) !== 0}
                    <img src={addObjectUrlToListToDelete(URL.createObjectURL(new Blob([(possibleVideo.metadata?.common.picture as IPicture[])[0].data as Uint8Array<ArrayBuffer>])))} alt="Album art">
                {/if}
                <div class="maxWidth flex hcenter gap">
                <div>                
                    <p>{possibleVideo.file.name}</p>
                    {#if possibleVideo.metadata?.common.artist || possibleVideo.metadata?.common.album || possibleVideo.metadata?.common.genre}
                        <p>{[possibleVideo.metadata?.common.artist, possibleVideo.metadata?.common.album, possibleVideo.metadata?.common.genre?.join(",")].filter(i => !!i).join(" — ")}</p>
                    {/if}
                </div>
                </div>
            </button>
            <button title={lang("View metadata")} class="emptyButton flex hcenter gap" onclick={() => {
                showMetadataInformation = possibleVideo;
            }}>
                <img src={getObjectUrl("searchinfo")} style="width: 24px; height: 24px" alt={lang("View metadata")}>
            </button>
            <button title={lang("Delete video from the queue")} class="emptyButton flex hcenter gap" onclick={() => {
                if (i === 0 && videoInfo.length > 1) {
                    ChangeVideo({videoObj: video, file: videoInfo[1]});
                }
                videoInfo.splice(i, 1);
            }}>
                <img style="width: 24px; height: 24px" src={getObjectUrl("dismiss")} alt={lang("Delete video from the queue")}>
            </button>
            </div>
        {/each}
        </div>
    {/key}
</div>
{#if showMetadataInformation?.metadata}
<Dialog>
    <div class="maxWidth flex" style="position: sticky; top: 15px; justify-content: right">
        <button class="flex hcenter circularButton" onclick={() => (showMetadataInformation = undefined)}>
            <img src={getObjectUrl("dismiss")} style="width: 24px; height: 24px" alt="Close dialog">
        </button>
    </div>
    <h3>{lang("Metadata about")} <i>{showMetadataInformation.file.name}</i></h3>
    {#if (showMetadataInformation.metadata.common.picture?.length ?? 0) !== 0}
        <div class="flex hcenter gap" style="flex-direction: column">
            {#each showMetadataInformation.metadata.common.picture as picture}
                <img style="width: 100%; max-height: 50vh; border-radius: 12px" alt={picture.description ?? "Album art"} src={addObjectUrlToListToDelete(URL.createObjectURL(new Blob([picture.data as Uint8Array<ArrayBuffer>])))}>
            {/each}
        </div><br>
    {/if}
    <Card secondCard={true}>
        <h4>{lang("Common metadata")}:</h4>
        <ul>
        {#each [...suggestedKeys,
            ...(showMetadataInformation.metadata.common.track.no !== null || showMetadataInformation.metadata.common.track.of !== null ? [[lang("Track number"), `${showMetadataInformation.metadata.common.track.no}/${showMetadataInformation.metadata.common.track.of}`, true]] : []), 
            ...(showMetadataInformation.metadata.common.disk.no !== null || showMetadataInformation.metadata.common.disk.of ? [[lang("Disk number"), `${showMetadataInformation.metadata.common.disk.no}/${showMetadataInformation.metadata.common.disk.of}`, true]] : []),
            ...(showMetadataInformation.metadata.common.lyrics?.at(0)?.text ? [["Lyrics", showMetadataInformation.metadata.common.lyrics?.at(0)?.text, true]] : []),
            ...(showMetadataInformation.metadata.common.comment ? (showMetadataInformation.metadata.common.comment.map(i => [`${lang("Comment")}${i.descriptor ? ` ${i.descriptor}` : ""}`, i.text ?? "", true])) : []),
            Object.keys(showMetadataInformation.metadata.common).filter(i => showMetadataInformation?.metadata && typeof showMetadataInformation.metadata.common[i as "album"] !== "object" && suggestedKeys.findIndex(j => j[1] === i) === -1)
         ] as [description, key, valueInKey]}
            {#if valueInKey || typeof showMetadataInformation.metadata.common[key as "album"] !== "undefined"}
            <li><strong>{description}:</strong><br>{valueInKey ? key : showMetadataInformation.metadata.common[key as "album"]}</li>
            {/if}
        {/each}
        </ul>
    </Card><br>
    <Card secondCard={true}>
        <h4>{lang("All metadata")}:</h4>
        <div class="flex gap" style="flex-direction: column;">
            {#each Object.keys(showMetadataInformation.metadata.native) as key}
            <Card>
                <strong style="display: block; text-align: center">{key} tags:</strong>
                <ul>
                    {#each showMetadataInformation.metadata.native[key] as arr}
                    <li><strong>{arr.id}:</strong> {arr.value}</li>
                    {/each}
                </ul>
            </Card>
            {/each}
        </div>
    </Card>
</Dialog>
{/if}

<style>
    img {
        border-radius: 12px;
        width: 65px;
        height: auto;
        object-fit: cover;
    }
    p {
        text-align: start;
    }
    li {
        white-space: pre-line;
        margin-bottom: 15px;
    }
</style>