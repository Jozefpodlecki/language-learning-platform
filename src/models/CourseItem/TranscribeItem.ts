import { BaseItem } from "./BaseItem";

export type TranscribeItem = BaseItem &{
    type: "transcribe";
    source: string;
    sourceLanguageId: string;
    destination: string;
    destinationLanguageId: string;
    transcription: string;
}