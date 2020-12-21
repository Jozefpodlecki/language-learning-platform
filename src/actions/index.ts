import { Course } from "models/Course";
import { createAsyncAction } from "typesafe-actions";

export * from "./courseAboutActions";
export * from "./coursesActions";
export * from "./courseSessionActions";

export const getCourse = createAsyncAction(
    "getCourse.request",
    "getCourse.success",
    "getCourse.error"
)<void, Course, void>();