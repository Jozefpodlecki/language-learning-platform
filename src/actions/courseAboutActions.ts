import { Dataset } from "models/dataset";
import { createAsyncAction } from "typesafe-actions";

export const getCourseDataset = createAsyncAction(
    "getCourseDataset.request",
    "getCourseDataset.success",
    "getCourseDataset.error"
)<string, Dataset, void>();
