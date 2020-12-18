import * as actions from "actions/courseAboutActions";
import { Course } from "models/Course";
import { Loadable } from "models/Loadable";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {
    course: Loadable<Course & { dataset?: any[] }>;
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
            
    return state;
};