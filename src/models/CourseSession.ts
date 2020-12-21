import { CourseItem } from "./CourseItem";

export type CourseSession = {
    id: string;
    items: CourseItem[];
    startedOn: Date;
    modifiedOn?: Date;
    expiresOn?: Date;
    completedOn?: Date;
    completedCount: number;
    itemCount: number;
    currentItemId: string;
    courseId: string;
    correctPercentage: number;
    createdById: string;
    isExam: boolean;
}

