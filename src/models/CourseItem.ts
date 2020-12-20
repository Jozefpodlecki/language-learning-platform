type BaseItem = {
    id: string;
    type: string;
    isCorrect: boolean;
    isCompleted: boolean;
}

export type Entity = {
    id: string;
    value: string;
}

export type Answer = Entity & {
    isCorrect: boolean;
    isSelected: boolean;
}

export type MCQItem = BaseItem & {
    id: string;
    type: "multiple choice question";
    question: Entity;
    answers: Answer[];
    rightAnswer: Answer;
}

export type RecordAudioItem = BaseItem & {
    type: "record audio";
    question: string;
    description: string;
}

export type AudioToSentenceItem = BaseItem &{
    type: "audio to sentence";
    question: string;
}

export type TranscribeItem = BaseItem &{
    type: "transcribe sentence";
    source: string;
    transcription: string;
}

export type FillTableItem = BaseItem &{
    type: "fill table";
    question: string;
}

export type MatchPairsItem = BaseItem &{
    type: "match pairs";
    items: any[];
    items1: any[];
}

export type MemoryGameItem = BaseItem &{
    type: "memory game";
    items: MemoryGameItemItem[];
}

export type MemoryGameItemItem = {
    id: string;
    value: string;
    matchId: string;
}

export type CourseItem = MCQItem
    | RecordAudioItem
    | AudioToSentenceItem
    | TranscribeItem
    | FillTableItem
    | MemoryGameItem