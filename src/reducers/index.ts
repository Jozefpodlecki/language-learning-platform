import { combineReducers } from "redux";
import courseAboutReducer from "./courseAboutReducer";
import courseSessionReducer from "./courseSessionReducer";
import coursesReducer from "./coursesReducer";

export const rootReducer = combineReducers({
    courseSession: courseSessionReducer,
    courses: coursesReducer,
    course: courseAboutReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
