import * as actions from "actions/courseActions";
import { ActionType, getType } from "typesafe-actions";
import { User } from "models/User";
import { unload } from "models/Loadable";

type Action = ActionType<typeof actions>;

type State = User;

const initialState: State = {
    id: "00000000-0000-0000-0000-000000000000",
    isGuest: true,
};

export default (state = initialState, action: Action): State => {
    return state;
};
