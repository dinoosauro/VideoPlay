import Settings from "./Settings";

interface TranslationObj {
    it: string
}

const availableTranslations = new Map<string, TranslationObj>([
    ["Change playback rate", {it: "Cambia velocità di riproduzione"}],
    ["Change volume", {it: "Cambia volume"}],
    ["Previous video", {it: "Video precedente"}],
    ["Play/pause video", {it: "Riproduci/ferma video"}],
    ["Next video", {it: "Prossimo video"}],
    ["Enter/exit picture-in-picture mode", {it: "Entra/esci dalla modalità picture-in-picture"}],
    ["Open/close fullscreen mode", {it: "Apri/chiudi modalità a schermo intero"}],
    ["Current playback rate", {it: "Velocità di riproduzione corrente"}],
    ["Album", {it: "Album"}],
    ["Album artists", {it: "Artisti dell'album"}],
    ["Artists", {it: "Artisti"}],
    ["Category", {it: "Categorie"}],
    ["Conductor", {it: "Conduttore"}],
    ["Copyright", {it: "Copyright"}],
    ["Date", {it: "Data"}],
    ["Description", {it: "Descrizione"}],
    ["Encoded by", {it: "Codificato da"}],
    ["Genre", {it: "Genere"}],
    ["License", {it: "Licenza"}],
    ["Title", {it: "Titolo"}],
    ["Subtitle", {it: "Sottotitolo"}],
    ["Year", {it: "Anno"}],
    ["Queue", {it: "Coda"}],
    ["Add videos to the queue", {it: "Aggiungi video alla coda"}],
    ["View metadata", {it: "Visualizza metadati"}],
    ["Delete video from the queue", {it: "Rimuovi video dalla coda"}],
    ["Close dialog", {it: "Chiudi dialogo"}],
    ["Settings", {it: "Impostazioni"}],
    ["Video speed", {it: "Velocità del video"}],
    ["Default playback rate", {it: "Velocità di riproduzione predefinita"}],
    ["Adjust pitch when the video's playback rate changes", {it: "Aggiusta il pitch quando viene cambiata la velocità di riproduzione del video"}],
    ["Change quick playback rate toggles", {it: "Cambia i pulsanti rapidi della velocità"}],
    ["You can change here the buttons that appear below the playback rate slider", {it: "Puoi cambiare qui i pulsanti che appariranno sotto allo slider della velocità del video"}],
    ["New video speed", {it: "Nuova velocità del video"}],
    ["Add", {it: "Aggiungi"}],
    ["Added buttons (click to remove)", {it: "Pulsanti aggiunti (clicca per rimuovere)"}],
    ["Application styling", {it: "Personalizzazione dell'applicazione"}],
    ["Here you can customize the styling of VideoPlay", {it: "Qui puoi cambiare lo stile di VideoPlay"}],
    ["Background color", {it: "Colore di sfondo"}],
    ["Text color", {it: "Colore del testo"}],
    ["CSS font", {it: "Font CSS"}],
    ["Card color", {it: "Colore della card"}],
    ["Secondary card color", {it: "Colore della card secondario"}],
    ["Accent color", {it: "Colore principale"}],
    ["Change video resize option", {it: "Cambia le opzioni di ridimensionamento del video"}],
    ["View queue", {it: "Visualizza coda"}],
    ["Open settings dialog", {it: "Apri il dialogo delle impostazioni"}],
    ["Pick new subtitles", {it: "Seleziona i nuovi sottotitoli"}],
    ["Cast video", {it: "Trasmetti video"}],
    ["Current volume", {it: "Volume attuale"}],
    ["Play your local videos, directly from your browser", {it: "Riproduci i tuoi video locali, direttamente dal tuo browser"}],
    ["Pick videos", {it: "Seleziona video"}],
    ["Metadata about", {it: "Metadati di"}],
    ["Common metadata", {it: "Metadati comuni"}],
    ["Track number", {it: "Numero di traccia"}],
    ["Disk number", {it: "Numero del disco"}],
    ["Comment", {it: "Commento"}],
    ["Lyrics", {it: "Testo"}],
    ["All metadata", {it: "Tutti i metadati"}],
    ["Open source licenses", {it: "Licenze open source"}],
    ["Here you can see the license of all the open source libraries used by VideoPlay", {it: "Qui puoi vedere la licenza di tutte le librerie open source utilizzate da VideoPlay"}],
    ["Loop the current video", {it: "Imposta il video corrente in loop"}],
    ["Control panel settings", {it: "Impostazioni del centro di controllo"}],
    ["Here you can change the behavior of the next/previous buttons you can click from your OS's control panel.", {it: "Qui puoi cambiare il funzionamento dei pulsanti per andare avanti/indietro che puoi cliccare nel pannello di controllo del tuo sistema operativo"}],
    ["When the Next/Previous button is clicked", {it: "Quando il pulsante Prossimo/Precedente è cliccato"}],
    ["Go to the next/previous video", {it: "Vai al prossimo/precedente video"}],
    ["Go forward/backwards in the video", {it: "Vai avanti/indietro nel video"}],
    ["When the Forwards/Backwards button is clicked", {it: "Quando il pulsante Avanti/Indietro è cliccato"}],
    ["When going backwards/forwards, skip these seconds (put a negative number to use the default value)", {it: "Quando si va avanti/indietro, salta questi secondi (inserire un numero negativo per usare il valore di default)"}],
    ["Read video metadata immediately after they have been uploaded. If disabled, video information in the Control Center might be incomplete", {it: "Leggi i metadati del video subito dopo che sono stati caricati. Se disabilitato, le informazioni sul video nel pannello di controllo potrebbero essere incomplete"}]
])


/**
 * Get the translated text of a string
 * @param str the string that should be translated
 * @returns the translated string
 */
export function lang(str: string) {
    const translation = availableTranslations.get(str);
    if (translation) return translation[Settings.language as "it" ?? navigator.language.substring(0, 2) as "it"] ?? str;
    return str;
}