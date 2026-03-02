
/**
 * Convert the passed seconds to HH:MM:SS string
 * @param seconds the seconds to convert
 * @returns the formatted string
 */
export default function ConvertSecondsToTimestamp(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    seconds -= (hours * 3600);
    const minutes = Math.floor(seconds / 60);
    seconds -= (minutes * 60);
    seconds = Math.floor(seconds);
    return `${hours === 0 ? "" : hours < 10 ? `0${hours}:` : `${hours}:`}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}