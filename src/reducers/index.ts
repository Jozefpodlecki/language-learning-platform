import { ReducersMapObject, combineReducers } from "redux";
import courseAboutReducer from "./courseAboutReducer";
import courseSessionReducer from "./courseSessionReducer";
import coursesReducer from "./coursesReducer";
import userReducer from "./userReducer";

export const rootReducer = combineReducers({
    user: userReducer,
    pages: combineReducers({
        courseSession: courseSessionReducer,
        courses: coursesReducer,
        course: courseAboutReducer,
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
