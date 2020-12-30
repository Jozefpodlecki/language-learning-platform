import { Course } from "models/Course";
import { LessonMetadata } from "models/LessonMetadata";
import { Lesson } from "models/Lesson";
import { createAsyncAction } from "typesafe-actions";

export * from "./courseActions";
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
)<void, LessonMetadata, void>();

export const getLessonsByCourse = createAsyncAction(
    "getLessonsByCourse.request",
    "getLessonsByCourse.success",
    "getLessonsByCourse.error"
)<void, Lesson[], void>();
