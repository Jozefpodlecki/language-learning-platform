import { Course } from "models/Course";
import { LessonMetadata } from "models/LessonMetadata";
import { Dataset } from "models/dataset";
import _lessonMetadata from "../assets/data/lessonMetadata.json";
import _courses from "../assets/data/course.json";
import _lessons from "../assets/data/lesson.json";
import { Lesson } from "models/Lesson";

type PageCriteria = {
    page: number;
    pageSize: number;
};

const defaultOptions: PageCriteria = {
    page: 0,
    pageSize: 10,
}

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
    let courses = _courses.map((pr) => ({
        ...pr,
        thumbnailUrl: courseImages[pr.thumbnailUrl],
    }));

    const { page, pageSize } = {
        ...defaultOptions,
        ...options
    }

    const from = page * pageSize;
    const to = from + pageSize;

    courses.slice(from, to);

    return Promise.resolve(courses);
};

export const getLessonAsync = (lessonId: string) => {
    const lesson = _lessons.find((pr) => pr.id === lessonId) as Lesson;

    return Promise.resolve(lesson);
};

export const getCourseAsync = (courseId: string) => {
    const course = _courses.find((pr) => pr.id === courseId) as Course;

    return Promise.resolve(course);
};

export const getLessonsByCourseAsync = (courseId: string) => {
    const lessons = _lessons.filter((pr) => pr.courseId === courseId).map((pr) => ({
        ...pr,
        thumbnailUrl: courseImages[pr.thumbnailUrl],
    })) as Lesson[];

    return Promise.resolve(lessons);
};

export const getLessonDatasetAsync = (lessonId: string): Promise<Dataset> => {
    const course = _lessons.find((pr) => pr.id === lessonId) as Lesson;
    const dataset = courseDatasets[course.datasetUrl];

    return Promise.resolve(dataset);
};

export const getLessoneMetadataAsync = (
    lessonId: string
): Promise<LessonMetadata> => {
    const lessonMetadata = _lessonMetadata.find(
        (pr) => pr.lessonId === lessonId
    ) as LessonMetadata;

    return Promise.resolve(lessonMetadata);
};
