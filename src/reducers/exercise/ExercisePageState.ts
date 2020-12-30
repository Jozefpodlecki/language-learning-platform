import { MemoryGameItemItem } from "models/Exercise";

export type ExercisePageState = {
    isLoading: false;
    hasChanged: boolean;
    multipleChoiceQuestion: {
        selectedAnswerId: string;
    },
    memoryGame: {
        hasFinished: boolean,
        selectedItems: MemoryGameItemItem[];
    }
}

export const defaultState: ExercisePageState = {
    isLoading: false,
    hasChanged: false,
    multipleChoiceQuestion: {
        selectedAnswerId: "",
    },
    memoryGame: {
        hasFinished: false,
        selectedItems: [] as MemoryGameItemItem[],
    }
}