/**
 * Remove all the caption tracks of a video. This removes appended track elements, and hides the other subtitles that have manually been added to the video.
 * @param video the Video element where the caption tracks should be removed
 */
export default function RemoveCaptionTrack(video: HTMLVideoElement) {
    for (const track of video.textTracks) track.mode = "disabled";
    for (const track of video.querySelectorAll("track")) {
        URL.revokeObjectURL(track.src);
        track.remove();
    }
}