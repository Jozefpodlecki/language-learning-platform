import { Exercise } from "./Exercise";

export type LessonSession = {
    id: string;
    exercises: Exercise[];
    startedOn: Date;
    modifiedOn?: Date;
    expiresOn?: Date;
    completedOn?: Date;
    completedCount: number;
    itemCount: number;
    currentExerciseId: string;
    lessonId: string;
    courseId: string;
    correctPercentage: number;
    createdById: string;
    isExam: boolean;
};
