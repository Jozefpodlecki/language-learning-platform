import { Answer } from "./MemoryChoiceQuestion/Answer";
import { AudioToSentenceItem } from "./AudioToSentenceItem";
import { FillTableItem } from "./FillTableItem";
import { Item as  MCQItem } from "./MemoryChoiceQuestion/Item";
import { MatchPairsItem } from "./MatchPairsItem";
import { MemoryGameItem } from "./MemoryGameItem";
import { RecordAudioItem } from "./RecordAudioItem";
import { TranscribeItem } from "./TranscribeItem";

export * from "./AudioToSentenceItem";
export * from "./TranscribeItem";
export * from "./MemoryGameItem";
export * from "./FillTableItem";
export * from "./MemoryChoiceQuestion/Item";
export * from "./RecordAudioItem";
export * from "./MatchPairsItem";
export * from "./MemoryChoiceQuestion/Answer";

export type Selectable<T> = T & { isSelected: boolean };

export type Exercise =
    | MCQItem
    | RecordAudioItem
    | AudioToSentenceItem
    | TranscribeItem
    | FillTableItem
    | MatchPairsItem
    | MemoryGameItem;

export type ExerciseType = Pick<Exercise, "type">["type"];