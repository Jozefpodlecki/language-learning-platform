import { BaseItem } from "./BaseItem";

export type TranscribeItem = BaseItem &{
    type: "transcribe";
    source: string;
    transcription: string;
}