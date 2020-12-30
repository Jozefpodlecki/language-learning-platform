import { Course } from "models/Course";
import { LessonSession } from "models/LessonSession";
import { createAsyncAction } from "typesafe-actions";

export const getCourses = createAsyncAction(
    "getCourses.request",
    "getCourses.success",
    "getCourses.error"
)<void, Course[], void>();

export const getLastSession = createAsyncAction(
    "getLastSession.request",
    "getLastSession.success",
    "getLastSession.error"
)<void, LessonSession | undefined, void>();
