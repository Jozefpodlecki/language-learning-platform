import { Loadable } from "models/Loadable"
import { QuizItem, Session } from "models/Session"
import { Course } from "models/Course"

export type State = {
    isLoading: boolean;
    session: Loadable<Session>;
    hasSubmit: boolean;
    hasSelected: boolean;
    selectedAnswerId?: string;
    item: Loadable<QuizItem>;
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
