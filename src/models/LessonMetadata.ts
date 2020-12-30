import { ExerciseType } from "./Exercise";

export type LessonMetadata = {
    lessonId: string;
    courseId: string;
    sourceLanguageId: string;
    destinationLanguageId: string;
    flashcards: {
        key: string;
        value: string;
    };
    exercises: ExerciseMetadata[];
};

export type ExerciseMetadata = {
    enabled: boolean;
    type: ExerciseType;
    transform: Record<string, string>[];
};
