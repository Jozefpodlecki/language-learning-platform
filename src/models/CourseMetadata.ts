import { CourseItemType } from "./CourseItem";

export type CourseMetadata = {
    courseId: string;
    flashcards: {
        key: string;
        value: string;
    };
    courseItems: CourseItemMetadata[];
};

export type CourseItemMetadata = {
    enabled: boolean;
    type: CourseItemType;
    transform: Record<string, string>[];
};
