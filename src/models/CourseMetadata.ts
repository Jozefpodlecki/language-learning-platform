import { CourseItemType } from "./CourseItem";

export type CourseMetadata = {
    courseId: string;
    courseItems: CourseItemMetadata[];
}

export type CourseItemMetadata = {
    enabled: boolean;
    type: CourseItemType;
    transform: Record<string, string>[];
}