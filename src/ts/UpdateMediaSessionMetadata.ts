import type { IAudioMetadata, IPicture } from "music-metadata";
import type { VideoStorage } from "./Interfaces";


/**
 * Update the MediaSession metadata
 * @param file the VideoStorage object with the information of the video that is being currently played. If not passed, the application will use the previous mediaSession metadata
 * @param albumArt a custom string with the URL of the album art. This parameter will be ignored if an album art is embedded in the video file.
 */
export default function UpdateMediaSessionMetadata(file?: VideoStorage, albumArt?: string) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: file ? file.metadata?.common.title || file.file.name.substring(0, file.file.name.lastIndexOf(".")) : navigator.mediaSession.metadata?.title,
        album: file ? file.metadata?.common.album : navigator.mediaSession.metadata?.album ,
        artist: file ? file.metadata?.common.artist : navigator.mediaSession.metadata?.artist,
        artwork: file ? (file.metadata?.common.picture?.length ?? 0) !== 0 ? [{src: URL.createObjectURL(new Blob([((file.metadata as IAudioMetadata).common.picture as IPicture[])[0].data as BlobPart]))}] : undefined : albumArt ? [{src: albumArt}] : undefined
    })
}