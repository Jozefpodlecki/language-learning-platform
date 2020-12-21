import * as actions from "actions/courseAboutActions";
import { unload } from "models/Loadable";
import { User } from "models/User";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {
    user: User
}

const initialState: State = {
    user: {
        id: "00000000-0000-0000-0000-000000000000",
        isGuest: true
    }
}

export default (
    state = initialState,
    action: Action
):  State => {
    
    return state;
};