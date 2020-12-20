import { Course } from "models/Course";
import _radicals from "../assets/data/radicals.json";
import _courses from "../assets/data/courses.json";

type PageCriteria = {
    page: number;
    pageSize: number;
}

const importAll = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys()
        .reduce((acc, key) => {
            const module = context(key);
            
            acc[key] = module.default;

            return acc;
        }, {} as Record<string, string>);
};

const courseImagesContext = require.context(
    "../assets/images",
    false,
    /\.(png|jpe?g|svg)$/,
    "sync"
);

const courseImages = importAll(courseImagesContext);

export const getCourses = (options: PageCriteria) => {

    const courses = _courses.map(pr => ({
        ...pr,
        thumbnailUrl: courseImages[pr.thumbnailUrl],
    }))

    return Promise.resolve(courses);
}

export const getCourseAsync = (courseId: string) => {
    const course = _courses.find(pr => pr.id === courseId) as Course;

    return Promise.resolve(course);
}

export const getCourseDatasetAsync = (courseId: string) => {
    const course = _courses.find(pr => pr.id === courseId) as Course;

    if(course.datasetUrl === "./radicals.json") {
        return Promise.resolve(_radicals);
    }
}