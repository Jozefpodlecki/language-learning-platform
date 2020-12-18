import { createAsyncAction } from "typesafe-actions";

export const getCourseDataset = createAsyncAction(
    "getCourse.request",
    "getCourse.success",
    "getCourse.error"
)<string, any[], void>();