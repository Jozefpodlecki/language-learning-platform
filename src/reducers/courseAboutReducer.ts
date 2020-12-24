import * as actions from "actions";
import { Course } from "models/Course";
import { Dataset } from "models/dataset";
import { Loadable, unload } from "models/Loadable";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {
    course: Loadable<Course & { 
        dataset: Loadable<Dataset>
    }>;
}

const initialState: State = {
    course: {
        isLoading: true
    }
}

export default (
    state = initialState,
    action: Action
):  State => {
    
    if(action.type === getType(actions.getCourse.success)) {
        const course = unload(action.payload);

        return {
            ...state,
            course: {
                ...course,
                dataset: {
                    isLoading: true,
                }
            }
        };
    }

    if(action.type === getType(actions.getCourseDataset.success)) {
        const dataset = unload(action.payload);

        if(state.course.isLoading === true) {
            return state;
        }

        return {
            ...state,
            course: {
                ...state.course,
                dataset,
            }
        };
    }
    

    return state;
};