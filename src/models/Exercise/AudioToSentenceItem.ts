import { BaseItem } from "./BaseItem";

export type AudioToSentenceItem = BaseItem & {
    type: "audio to sentence";
    source: string;
    text: string;
};
