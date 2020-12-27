import { BaseItem } from "./BaseItem";

export type RecordAudioItem = BaseItem & {
    type: "record audio";
    text: string;
    description: string;
    languageId: string;
};
