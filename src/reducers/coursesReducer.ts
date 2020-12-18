import * as actions from "actions/coursesReducer";
import { ActionType, getType } from "typesafe-actions";
import { Loadable, unload } from "models/Loadable";
import { Course } from "models/Course";
import { Session } from "models/Session";

type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<Session>;
    courses: Loadable<Course[]>;
}

const initialState = {

}

export default (
    state = initialState,
    action: Action
):  State => {
            
    
    if(action.type === getType(actions.getCourses.request)) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === getType(actions.getCourses.success)) {
        const courses = unload(action.payload);

        return {
            ...state,
            isLoading: false,
            courses,
        }
    }

    if(action.type === getType(actions.getLastSession.success)) {
        const session = action.payload;

        if(!session) {
            return state;
        }

        return {
            ...state,
            isLoading: false,
            session: unload(session),
        }
    }

    return state;
};