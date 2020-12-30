import * as actions from "actions";
import { RecordAudioItem } from "models/Exercise";
import { ActionType, getType } from "typesafe-actions";
import { ExercisePageState } from "./ExercisePageState";

type Action = ActionType<typeof actions>;

type State = RecordAudioItem & ExercisePageState

export default (state: State, action: Action): State => {

    return state;
};
