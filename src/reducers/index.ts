import { combineReducers } from "redux";
import courseReducer from "./courseReducer";
import lessonSessionReducer from "./lessonSessionReducer";
import coursesReducer from "./coursesReducer";
import userReducer from "./userReducer";

export const rootReducer = combineReducers({
    user: userReducer,
    pages: combineReducers({
        session: lessonSessionReducer,
        courses: coursesReducer,
        course: courseReducer
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
