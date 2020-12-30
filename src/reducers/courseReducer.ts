import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";
import { Course } from "models/Course";
import { LessonMetadata } from "models/LessonMetadata";
import { Dataset } from "models/dataset";
import { Loadable, unload } from "models/Loadable";
import { Lesson } from "models/Lesson";

type Action = ActionType<typeof actions>;

type State = {
    course: Loadable<Course>;
    lessons: Loadable<Lesson[]>;
    metadata: Loadable<LessonMetadata>;
};

const initialState: State = {
    course: {
        isLoading: true,
    },
    lessons: {
        isLoading: true,
    },
    metadata: {
        isLoading: true,
    },
};

export default (state = initialState, action: Action): State => {
    if (action.type === getType(actions.getCourse.success)) {
        const course = unload(action.payload);

        return {
            ...state,
            course: {
                ...course,
            },
        };
    }

    if (action.type === getType(actions.getLessonsByCourse.success)) {
        const lessons = unload(action.payload);

        return {
            ...state,
            lessons,
        };
    }

    if (action.type === getType(actions.getCourseMetadata.success)) {
        const metadata = unload(action.payload);

        return {
            ...state,
            metadata,
        };
    }

    if (action.type === getType(actions.getCourseDataset.success)) {
        const dataset = unload(action.payload);

        if (state.course.isLoading === true) {
            return state;
        }

        return {
            ...state,
            course: {
                ...state.course,
            },
        };
    }

    return state;
};
