import { CourseItemType } from "./CourseItem";

export type CourseMetadata = {
    courseId: string;
    courseItems: CourseItemMetadata[];
}

export type CourseItemMetadata = {
    type: CourseItemType;
    transform: Record<string, string>[];
}