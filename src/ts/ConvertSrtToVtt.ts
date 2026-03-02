
/**
 * Parse the uploaded subtitle so that it can be read by the browser
 * @param text the content of the source SRT/SUB file
 * @param isSub if the file is not a SubRip file
 * @returns a list of VTTCue objects, that can be added to the Video element as subtitles
 */
export default function ConvertSrtToVtt(text: string, isSub?: boolean) {
    const regex = isSub ? /\d{1,}:\d{1,}:\d{1,}.\d{1,},\d{1,}:\d{1,}:\d{1,}.\d{1,}/ : /\d{2,}:\d{2}:\d{2},\d{3} --> \d{2,}:\d{2}:\d{2},\d{3}/
    const lines = text.split("\n");
    /**
     * When the current subtitle entry should start being displayed
     */
    let currentStartTime: number | undefined;
    /**
     * When the current subtitle entry should be hidden
     */
    let currentEndTime: number | undefined;
    let outputItems: VTTCue[] = [];
    /**
     * The text of the subtitle entry that is being read
     */
    let currentText = "";
    /**
     * Create a VTTCue object with the current text, start time and end time, and add it to the output array.
     */
    function addCurrentItemsToVttArray() {
        if (typeof currentStartTime !== "undefined" && typeof currentEndTime !== "undefined" && currentText !== "") {
            let outText = currentText.split("\n").slice(1, -1).join("\n");
            if (isSub) outText = outText.replaceAll("[br]", "\n");
            while (outText.endsWith("\n")) outText = outText.substring(0, outText.length - 1); // Let's remove unnecessary new lines
            outputItems.push(new VTTCue(currentStartTime, currentEndTime, outText));
        }
    }
    for (let i = 0; i < lines.length; i++) {
        if (regex.test(lines[i]) && (!isNaN(+lines[i-1]) || isSub)) { // For SubRip files, the previous line should be a number that indicates the position of the subtitle, so we'll check that this is the case before finalizing the current subtitle
            addCurrentItemsToVttArray();
            currentStartTime = parseSrtTimestamp(lines[i].substring(0, lines[i].indexOf(isSub ? "," : " ")));
            currentEndTime = parseSrtTimestamp(lines[i].trim().substring(lines[i].trim().lastIndexOf(isSub ? "," : " ") + 1));
            currentText = "";
        } else if (typeof currentStartTime !== "undefined" && typeof currentEndTime !== "undefined") currentText += `\n${lines[i]}`;
    }
    // We need to call the `addCurrentItemsToVttArray` one last time, since we haven't added the last subtitle entry
    currentText += `\n`; // Let's add the space delimeter that is normally added between the lines
    addCurrentItemsToVttArray();
    return outputItems
}

/**
 * Convert a timestamp of the SRT/SUB files to milliseconds
 * @param str the string with the HH:MM:SS.mmm/cc timestamp to convert
 * @returns the milliseconds that are equivalent to the passed string
 */
function parseSrtTimestamp(str: string) {
    const split = str.trim().split(/[;.,:]/g);
    if (split[3].length === 1) split[3] = `00${split[3]}`;
    if (split[3].length === 2) split[3] = `0${split[3]}`;
    return (+split[0] * 3600) + (+split[1] * 60) + +split[2] + (+split[3] / 1000);
}
