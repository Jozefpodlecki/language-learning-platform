import { BaseItem } from "./BaseItem";

export type RecordAudioItem = BaseItem & {
    type: "record audio";
    question: string;
    description: string;
}