import * as actions from "actions";
import { Exercise, FillTableItem } from "models/Exercise";
import { unload } from "models/Loadable";
import { ActionType, getType } from "typesafe-actions";
import { ExercisePageState } from "./ExercisePageState";

type Action = ActionType<typeof actions>;

type State = FillTableItem & ExercisePageState;

export default (state: State, action: Action): State => {

    if (action.type === getType(actions.fillTable)) {
        const { itemId, tableItemId, value } = action.payload;

        const items = [...state.items];
        const tableItem = items.find(pr => pr.id === tableItemId);
        tableItem.destination = value;
        const hasChanged = items.some(pr => pr.destination);

        return {
            ...state,
            ...items,
            hasChanged
        }
    }

    return {
        ...state,
        hasChanged: false,
    };
};
