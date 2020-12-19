import { Course } from "models/Course";
import { CourseSession } from "models/CourseSession";
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
)<void, CourseSession | undefined, void>();