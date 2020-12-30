import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {

};

const initialState: State = {

};

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.fillTable)) {
        const { itemId, tableItemId, value } = action.payload;

        const exercise = state.exercise;

        if (exercise.isLoading === true) {
            return state;
        }

        if (exercise.type !== "fill table") {
            return state;
        }
        
        const items = [...exercise.items];
        const tableItem = items.find(pr => pr.id === tableItemId);
        tableItem.destination = value;
        const hasChanged = items.some(pr => pr.destination);

        return {
            ...state,
            exercise: {
                ...exercise,
                items,
            },
            hasChanged
        }
    }

    if (action.type === getType(actions.sendFillTableItems.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            },
        };
    }

    if (action.type === getType(actions.sendFillTableItems.success)) {
        const exercise = unload(action.payload);
        
        return {
            ...state,
            exercise,
        };
    }

    return state;
};
