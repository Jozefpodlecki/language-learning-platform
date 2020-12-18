import { Course } from "models/Course";
import { Session } from "models/Session";
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
)<void, Session | undefined, void>();