import { Course } from "models/Course";
import { LessonMetadata } from "models/LessonMetadata";
import { Dataset } from "models/dataset";
import _lessonMetadata from "../assets/data/lessonMetadata.json";
import _courses from "../assets/data/course.json";
import _lessons from "../assets/data/lesson.json";
import { Lesson } from "models/Lesson";
import { courseDatasets, images } from "./assets";

type PageCriteria = {
    page: number;
    pageSize: number;
};

const defaultOptions: PageCriteria = {
    page: 0,
    pageSize: 10,
}

export const getCourses = (options: PageCriteria) => {
    let courses = _courses.map((pr) => ({
        ...pr,
        thumbnailUrl: images[pr.thumbnailUrl],
    }));

    const { page, pageSize } = {
        ...defaultOptions,
        ...options
    }

    const from = page * pageSize;
    const to = from + pageSize;

    courses = courses.slice(from, to);

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
        thumbnailUrl: images[pr.thumbnailUrl],
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
