import { AudioToSentenceItem } from "./AudioToSentenceItem"
import { FillTableItem } from "./FillTableItem"
import { MatchPairsItem } from "./MatchPairsItem"
import { MCQItem } from "./MCQItem"
import { MemoryGameItem } from "./MemoryGameItem"
import { RecordAudioItem } from "./RecordAudioItem"
import { TranscribeItem } from "./TranscribeItem"

export * from "./AudioToSentenceItem"
export * from "./TranscribeItem"
export * from "./MemoryGameItem"
export * from "./FillTableItem"
export * from "./MCQItem"
export * from "./RecordAudioItem"
export * from "./MatchPairsItem"
export * from "./Answer"

export type CourseItem = MCQItem
    | RecordAudioItem
    | AudioToSentenceItem
    | TranscribeItem
    | FillTableItem
    | MatchPairsItem
    | MemoryGameItem

export type CourseItemType = Pick<CourseItem, "type">["type"]