import * as actions from "actions/coursesActions";
import { ActionType, getType } from "typesafe-actions";
import { Course } from "models/Course";
import { LessonSession } from "models/LessonSession";
import { Loadable, unload } from "models/Loadable";

type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<LessonSession>;
    courses: Loadable<Course[]>;
};

const initialState: State = {
    courses: {
        isLoading: true,
    },
    session: {
        isLoading: true,
    },
};

export default (state = initialState, action: Action): State => {
    if (action.type === getType(actions.getCourses.request)) {
        return {
            ...state,
        };
    }

    if (action.type === getType(actions.getCourses.success)) {
        const courses = unload(action.payload);

        return {
            ...state,
            courses,
        };
    }

    if (action.type === getType(actions.getLastSession.success)) {
        const session = action.payload;

        if (!session) {
            return state;
        }

        return {
            ...state,
            session: unload(session),
        };
    }

    return state;
};
