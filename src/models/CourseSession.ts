import { CourseItem } from "./CourseItem";

export type CourseSession = {
    id: string;
    items: CourseItem[];
    completedOn?: Date;
    startedOn: Date;
    expiresOn?: Date;
    completedCount: number;
    itemCount: number;
    currentItemId: string;
    courseId: string;
}

