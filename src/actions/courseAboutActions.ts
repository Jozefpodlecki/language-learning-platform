import { Course } from "models/Course";
import { createAsyncAction } from "typesafe-actions";

export const getCourseDataset = createAsyncAction(
    "getCourseDataset.request",
    "getCourseDataset.success",
    "getCourseDataset.error"
)<string, any[], void>();