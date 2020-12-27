import { Course } from "models/Course";
import { CourseMetadata } from "models/CourseMetadata";
import { Dataset } from "models/dataset";
import _courseMetadata from "../assets/data/courseMetadata.json";
import _courses from "../assets/data/courses.json";

type PageCriteria = {
    page: number;
    pageSize: number;
};

const importImages = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys().reduce((acc, key) => {
        const module = context(key);

        acc[key] = module.default;

        return acc;
    }, {} as Record<string, string>);
};

const importDatasets = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys().reduce((acc, key) => {
        const module = context(key);
        acc[key] = module;

        return acc;
    }, {} as Record<string, Dataset>);
};

const courseImagesContext = require.context(
    "/src/assets/images",
    false,
    /\.(png|jpe?g|svg)$/,
    "sync"
);

const courseDatasetContext = require.context(
    "/src/assets/data/dataset",
    false,
    /\.json$/,
    "sync"
);

export const courseImages = importImages(courseImagesContext);
const courseDatasets = importDatasets(courseDatasetContext);

export const getCourses = (options: PageCriteria) => {
    const courses = _courses.map((pr) => ({
        ...pr,
        thumbnailUrl: courseImages[pr.thumbnailUrl],
    }));

    return Promise.resolve(courses);
};

export const getCourseAsync = (courseId: string) => {
    const course = _courses.find((pr) => pr.id === courseId) as Course;

    return Promise.resolve(course);
};

export const getCourseDatasetAsync = (courseId: string): Promise<Dataset> => {
    const course = _courses.find((pr) => pr.id === courseId) as Course;
    const dataset = courseDatasets[course.datasetUrl];

    return Promise.resolve(dataset);
};

export const getCourseMetadataAsync = (
    courseId: string
): Promise<CourseMetadata> => {
    const courseMetadata = _courseMetadata.find(
        (pr) => pr.courseId === courseId
    ) as CourseMetadata;

    return Promise.resolve(courseMetadata);
};
