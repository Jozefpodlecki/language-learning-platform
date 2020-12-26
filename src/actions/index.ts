import { Course } from "models/Course";
import { CourseMetadata } from "models/CourseMetadata";
import { createAsyncAction } from "typesafe-actions";

export * from "./courseAboutActions";
export * from "./coursesActions";
export * from "./courseSessionActions";

export const getCourse = createAsyncAction(
    "getCourse.request",
    "getCourse.success",
    "getCourse.error"
)<void, Course, void>();

export const getCourseMetadata = createAsyncAction(
    "getCourseMetadata.request",
    "getCourseMetadata.success",
    "getCourseMetadata.error"
)<void, CourseMetadata, void>();
