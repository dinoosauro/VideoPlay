import ChangeVideo from "./ChangeVideo";
import type { VideoStorage } from "./Interfaces";
import Settings from "./Settings";

let video: HTMLVideoElement | undefined;

interface MediaSessionProps {
    /**
     * The event fired
     */
    e: MediaSessionActionDetails,
    /**
     * If the application should change the video's currentTime instead of going to the previous/next video
     */
    seek: boolean,
    /**
     * If the application should either go forwards in the video, or should go to the next video
     */
    forward: boolean,
    /**
     * List of all the available videos in the queue
     */
    list: VideoStorage[],
    /**
     * The Video Element where the current video is being played
     */
    videoItem: HTMLVideoElement
}

/**
 * Function called from the MediaSession callbacks
 */
function mediaSessionButtons({e, seek, forward, list, videoItem}: MediaSessionProps) {
    if (seek) {
        videoItem.currentTime = Math.min(videoItem.duration, videoItem.currentTime + ((Settings.mediaSession.customOffset < 0 ? (e.seekOffset || 10) : Settings.mediaSession.customOffset) * (forward ? 1 : -1)));
    } else {
        if (list.length === 0) return;
        if (forward) {
            list.push(list.shift() as VideoStorage);
            ChangeVideo({videoObj: videoItem, file: list[0]});
        } else {
            list.unshift(list.pop() as VideoStorage);
            ChangeVideo({videoObj: videoItem, file: list[0]});
        }
    }
}


/**
 * Update all the callbacks from the MediaSession API
 * @param videoItem the element used to play the Video
 * @param list the list of all the available videos in the queue
 */
export default function MediaSessionControls(videoItem: HTMLVideoElement, list: VideoStorage[]) {
    video = videoItem;
    navigator.mediaSession.setActionHandler("nexttrack", (e) => {
        mediaSessionButtons({e, seek: Settings.mediaSession.nextButtonBehavior === "seek", forward: true, list, videoItem});
    });
    navigator.mediaSession.setActionHandler("previoustrack", (e) => {
        mediaSessionButtons({e, seek: Settings.mediaSession.nextButtonBehavior === "seek", forward: false, list, videoItem});
    });
    navigator.mediaSession.setActionHandler("seekbackward", (e) => {
        mediaSessionButtons({e, seek: Settings.mediaSession.seekButtonBehavior === "seek", forward: false, list, videoItem})
    });
    navigator.mediaSession.setActionHandler("seekforward", (e) => {
        mediaSessionButtons({e, seek: Settings.mediaSession.seekButtonBehavior === "seek", forward: true, list, videoItem})
    }),
    navigator.mediaSession.setActionHandler("seekto", (e) => {
        if (typeof e.seekTime !== "undefined") videoItem.currentTime = e.seekTime;
    });
    navigator.mediaSession.setActionHandler("pause", () => videoItem.pause());
    navigator.mediaSession.setActionHandler("play", () => videoItem.play());
}