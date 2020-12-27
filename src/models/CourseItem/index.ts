import { Answer } from "./Answer";
import { AudioToSentenceItem } from "./AudioToSentenceItem";
import { FillTableItem } from "./FillTableItem";
import { MCQItem } from "./MCQItem";
import { MatchPairsItem } from "./MatchPairsItem";
import { MemoryGameItem } from "./MemoryGameItem";
import { RecordAudioItem } from "./RecordAudioItem";
import { TranscribeItem } from "./TranscribeItem";

export * from "./AudioToSentenceItem";
export * from "./TranscribeItem";
export * from "./MemoryGameItem";
export * from "./FillTableItem";
export * from "./MCQItem";
export * from "./RecordAudioItem";
export * from "./MatchPairsItem";
export * from "./Answer";

export type Selectable<T> = T & { isSelected: boolean };

export type CourseItem =
    | MCQItem
    | RecordAudioItem
    | AudioToSentenceItem
    | TranscribeItem
    | FillTableItem
    | MatchPairsItem
    | MemoryGameItem;

export type CourseItemType = Pick<CourseItem, "type">["type"];
