<script lang="ts">
    import { getObjectUrl } from "../ts/IconsManager";
    import { lang } from "../ts/Lang";
    import Settings from "../ts/Settings";
    import Card from "./SmallerComponents/Card.svelte";
    import Dialog from "./SmallerComponents/Dialog.svelte";

    const {closeCallback, videoObj}: {closeCallback: () => void, videoObj: HTMLVideoElement} = $props();
    let newPlaybackSpeed = 1;
    let addedPlaybackSpeed = $state(Settings.playback.speedOptions);

    let selectedInfo = $state("2026 Borewit");
</script>

<Dialog>
    <div class="maxWidth flex" style="position: sticky; top: 15px; justify-content: right">
        <button title={lang("Close dialog")} class="flex hcenter circularButton" style="background-color: transparent;" onclick={() => closeCallback()}>
            <img src={getObjectUrl("dismiss")} style="width: 24px; height: 24px" alt={lang("Close dialog")}>
        </button>
    </div>
    <h3>{lang("Settings")}:</h3>
    <Card secondCard={true}>
        <h4>{lang("Video speed")}:</h4>
        <label class="flex hcenter gap">
            {lang("Default playback rate")}: <input style="background-color: var(--card);" type="number" bind:value={Settings.playback.defaultPlaybackRate}>
        </label><br>
        <label class="flex hcenter gap">
            <input type="checkbox" bind:checked={Settings.playback.adjustPitch} onchange={() => {
                videoObj.preservesPitch = Settings.playback.adjustPitch;
            }}>{lang("Adjust pitch when the video's playback rate changes")}
        </label><br>
        <Card>
            <h5 style="display: block; text-align: center;">{lang("Change quick playback rate toggles")}:</h5>
            <p>{lang("You can change here the buttons that appear below the playback rate slider")}.</p>
            <label class="flex hcenter gap">
                {lang("New video speed")}: <input type="number" bind:value={newPlaybackSpeed}>
                <button onclick={() => {
                    Settings.playback.speedOptions.push(newPlaybackSpeed);
                    addedPlaybackSpeed.push(newPlaybackSpeed);
                }}>{lang("Add")}</button>
            </label><br>
            <p>{lang("Added buttons (click to remove)")}:</p>
            <div class="flex hcenter wrap gap">
                {#each addedPlaybackSpeed as btn, i (`${btn}-${i}`)}
                <button onclick={() => {
                    addedPlaybackSpeed.splice(i, 1);
                    Settings.playback.speedOptions.splice(i, 1);
                }}>
                    {btn}
                </button>
                {/each}
            </div>
        </Card>
    </Card><br>
    <Card secondCard={true}>
        <h4>{lang("Application styling")}:</h4>
        <p>{lang("Here you can customize the styling of VideoPlay")}.</p><br>
        <div class="flex hcenter wrap gap">
            {#each [["background", lang("Background color"), "color"], ["text", lang("Text color"), "color"], ["font", lang("CSS font"), "text"], ["card", lang("Card color"), "color", true], ["secondcard", lang("Secondary card color"), "color"], ["accent", lang("Accent color"), "color"]] as [cssProp, description, inputType, addTransparent]}
            <label style="display: block; flex: 1 0 250px" class="emptyButton flex hcenter gap card">
                {description}:<br><br>
                <input type={inputType as string} defaultValue={getComputedStyle(document.body).getPropertyValue(`--${cssProp}`)} oninput={(e) => {
                    for (const prop of addTransparent ? [`--${cssProp}`, `--${cssProp}transparent`] : [`--${cssProp}`]) {
                        document.body.style.setProperty(prop, (e.target as HTMLInputElement).value);
                        Settings.cssColors[prop] = (e.target as HTMLInputElement).value;
                    }
                }}>
            </label>
            {/each}
        </div>
    </Card><br>
    <Card secondCard={true}>
        <h4>Language:</h4>
        <p>You might need to refresh the webpage to apply the selected language.</p>
        <select bind:value={Settings.language}>
            <option>Select a language</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
        </select>
    </Card><br>
    <Card secondCard={true}>
        <h4>{lang("Open source licenses")}:</h4>
        <p>{lang("Here you can see the license of all the open source libraries used by VideoPlay")}.</p>
        <select bind:value={selectedInfo}>
            <option value="2026 Borewit">music-metadata</option>
            <option value="2016-2025 Svelte Contributors">Svelte</option>
            <option value="2020 Microsoft Corporation">Fluent UI System Icons</option>
            <option value="2026 Dinoosauro">VideoPlay</option>
        </select><br><br>
        <Card>
            <p>
                MIT LICENSE<br><br>

                Copyright (c) {selectedInfo}<br><br>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br><br>

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br><br>

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

            </p>
        </Card>
    </Card>
</Dialog>

<style>
    .wrap {
        flex-wrap: wrap;
    }
    .wrap > * {
        flex: 1 0 60px;
    }
    button, input:not([type=checkbox]) {
        background-color: var(--secondcard);
    }
    select {
        background-color: var(--card);
    }
</style>