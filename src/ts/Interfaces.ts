import type { IAudioMetadata } from "music-metadata";

export interface PopupScalingInfo {
    /**
     * Function called to close the dropdown menu
     */
    closeCallback: () => void;
    /**
     * The origin of the scaling used for the dropdown open/close animation
     */
    scaling: string;
    /**
     * Maximum width and height
     */
    limits: string
}

export interface VideoStorage {
    file: File,
    id: string,
    metadata?: IAudioMetadata
}

declare global {
    interface HTMLVideoElement {
        webkitEnterFullscreen?: () => void,
        webkitShowPlaybackTargetPicker?: () => void
    }
}