import type { IAudioMetadata, IPicture } from "music-metadata";
import type { VideoStorage } from "./Interfaces";
import RemoveCaptionTrack from "./RemoveCaptionTrack";
import UpdateMediaSessionMetadata from "./UpdateMediaSessionMetadata";

interface ChangeVideoProps {
    videoObj: HTMLVideoElement
    file: VideoStorage
}

/**
 * Change the currently-playing video. This function also automatically removes caption tracks and updates the MediaSession metadata object.
 */
export default function ChangeVideo({videoObj, file}: ChangeVideoProps) {
    URL.revokeObjectURL(videoObj.src);
    videoObj.src = URL.createObjectURL(file.file);
    videoObj.currentTime = 0;
    RemoveCaptionTrack(videoObj);
    if (navigator.mediaSession.metadata?.artwork && navigator.mediaSession.metadata?.artwork.length !== 0) URL.revokeObjectURL(navigator.mediaSession.metadata.artwork[0].src);
    UpdateMediaSessionMetadata(file);
}