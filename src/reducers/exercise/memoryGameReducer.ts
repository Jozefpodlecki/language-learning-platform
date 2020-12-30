import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {

};

const initialState: State = {

};

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.selectItem)) {
        const id = action.payload;

        const exercise = state.exercise;

        if (exercise.isLoading === true) {
            return state;
        }

        if (exercise.type !== "memory game") {
            return state;
        }

        const items = [...exercise.items];
        const memoryGameItem = items.find((pr) => pr.id === id);

        let selectedItems;

        if (memoryGameItem.state === "selected") {
            selectedItems = state.selectedItems.filter(
                (pr) => pr.id !== memoryGameItem.id
            );
        } else {
            selectedItems = [...state.selectedItems, memoryGameItem];
        }

        memoryGameItem.state =
            memoryGameItem.state === "none" ? "selected" : "none";

        return {
            ...state,
            selectedItems,
        };
    }

    if (action.type === getType(actions.processPair)) {
        const exercise = state.exercise;

        if (exercise.isLoading === true) {
            return state;
        }

        if (exercise.type !== "memory game") {
            return state;
        }

        if (!exercise.items.some((pr) => !pr.isMatched)) {
            return {
                ...state,
                exercise: {
                    ...exercise,
                },
                hasFinished: true,
            };
        }

        if (state.selectedItems.length < 2) {
            return state;
        }

        const items = [...exercise.items];
        let [first, second, ...rest] = state.selectedItems;
        [first, second] = items.filter(
            (pr) => pr.id === first.id || pr.id === second.id
        );

        if (first.state === "wrong" && second.state === "wrong") {
            first.state = "none";
            second.state = "none";

            return {
                ...state,
                exercise: {
                    ...exercise,
                    items,
                },
                selectedItems: rest,
            };
        }

        if (first.state === "right" && second.state === "right") {
            first.state = "completed";
            first.isMatched = true;
            second.state = "completed";
            second.isMatched = true;

            return {
                ...state,
                exercise: {
                    ...exercise,
                    items,
                },
                selectedItems: rest,
            };
        }

        if (first.matchId !== second.matchId) {
            first.state = "wrong";
            second.state = "wrong";
        } else {
            first.state = "right";
            second.state = "right";
        }

        rest = rest.concat([first, second]);

        return {
            ...state,
            exercise: {
                ...exercise,
                items,
            },
            selectedItems: rest,
        };
    }

    if (action.type === getType(actions.sendMemoryGameData.success)) {
        const exercise = unload(action.payload);

        if (state.isLoading === true) {
            return state;
        }

        const exercises = [
            ...state.exercises.filter((pr) => pr.id !== exercise.id),
            exercise,
        ];

        return {
            ...state,
            session: {
                ...state.session,
                exercises,
            },
            exercise,
        };
    }

    return state;
};
