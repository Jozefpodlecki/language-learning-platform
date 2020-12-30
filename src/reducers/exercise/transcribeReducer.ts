import * as actions from "actions";
import { TranscribeItem } from "models/Exercise";
import { ActionType, getType } from "typesafe-actions";
import { ExercisePageState } from "./ExercisePageState";

type Action = ActionType<typeof actions>;

type State = TranscribeItem & ExercisePageState

export default (state: State, action: Action): State => {

    if (action.type === getType(actions.transcribeChange)) {
        const { transcription } = action.payload;

        const hasChanged = !!transcription;

        return {
            ...state,
            transcription,
            hasChanged,
        };
    }

    // if (action.type === getType(actions.sendTranscribe.request)) {
    //     return {
    //         ...state,
    //         exercise: {
    //             isLoading: true,
    //         },
    //     };
    // }

    // if (action.type === getType(actions.sendTranscribe.success)) {
    //     const exercise = unload(action.payload);

    //     return {
    //         ...state,
    //         exercise,
    //     };
    // }

    return state;
};
