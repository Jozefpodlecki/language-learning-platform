import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {

};

const initialState: State = {

};

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.sendAudio.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            },
        };
    }

    return state;
};
