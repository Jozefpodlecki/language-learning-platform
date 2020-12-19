import { Loadable } from "models/Loadable"
import { CourseSession } from "models/CourseSession"
import { CourseItem } from "models/CourseItem"
import { Course } from "models/Course"

export type State = {
    isLoading: boolean;
    session: Loadable<CourseSession>;
    hasSubmit: boolean;
    hasSelected: boolean;
    selectedAnswerId?: string;
    item: Loadable<CourseItem>;
    completed: number;
    course: Loadable<Course & { dataset?: any[] }>;
    courses: Loadable<Course[]>;
}

export const initialState: State = {
    isLoading: true,
    session: {
        isLoading: true,
    },
    hasSelected: false,
    hasSubmit: false,
    completed: 0,
    item: {
        isLoading: true,
    },
    course: {
        isLoading: true,
    },
    courses: {
        isLoading: true,
    }
};
