import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";
import { Course } from "models/Course";
import { CourseMetadata } from "models/CourseMetadata";
import { Dataset } from "models/dataset";
import { Loadable, unload } from "models/Loadable";

type Action = ActionType<typeof actions>;

type State = {
    course: Loadable<
        Course & {
            dataset: Loadable<Dataset>;
        }
    >;
    metadata: Loadable<CourseMetadata>;
};

const initialState: State = {
    course: {
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
                dataset: {
                    isLoading: true,
                },
            },
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
                dataset,
            },
        };
    }

    return state;
};
