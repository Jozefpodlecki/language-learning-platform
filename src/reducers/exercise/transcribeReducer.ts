import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {

};

const initialState: State = {

};

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.transcribeChange)) {
        const { transcription } = action.payload;

        let exercise = state.exercise;

        if (exercise.isLoading === true) {
            return state;
        }

        if (exercise.type !== "transcribe") {
            return state;
        }

        const hasChanged = !!transcription;

        exercise = {
            ...exercise,
            transcription,
        };

        return {
            ...state,
            exercise,
            hasChanged,
        };
    }

    if (action.type === getType(actions.sendTranscribe.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            },
        };
    }

    if (action.type === getType(actions.sendTranscribe.success)) {
        const exercise = unload(action.payload);

        return {
            ...state,
            exercise,
        };
    }

    return state;
};
