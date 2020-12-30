import * as actions from "actions";
import { MemoryGameItem, MemoryGameItemItem } from "models/Exercise";
import { ActionType, getType } from "typesafe-actions";
import { ExercisePageState } from "./ExercisePageState";

type Action = ActionType<typeof actions>;

type State = MemoryGameItem & ExercisePageState;

export default (state: State, action: Action): State => {

    if (action.type === getType(actions.selectItem)) {
        const id = action.payload;

        const items = [...state.items];
        const memoryGameItem = items.find((pr) => pr.id === id);

        let selectedItems = state.memoryGame.selectedItems;
        
        if (memoryGameItem.state === "selected") {
            selectedItems = selectedItems.filter(
                (pr) => pr.id !== memoryGameItem.id
            );
        } else {
            selectedItems = [...selectedItems, memoryGameItem];
        }

        memoryGameItem.state =
            memoryGameItem.state === "none" ? "selected" : "none";

        return {
            ...state,
            memoryGame: {
                ...state.memoryGame,
                selectedItems,
            }
        };
    }

    if (action.type === getType(actions.processPair)) {

        if (!state.items.some((pr) => !pr.isMatched)) {
            return {
                ...state,
                memoryGame: {
                    ...state.memoryGame,
                    hasFinished: true,
                }
            };
        }

        const selectedItems = state.memoryGame.selectedItems;
        
        if (selectedItems.length < 2) {
            return state;
        }

        const items = [...state.items];
        let [first, second, ...rest] = state.memoryGame.selectedItems;
        [first, second] = items.filter(
            (pr) => pr.id === first.id || pr.id === second.id
        );

        if (first.state === "wrong" && second.state === "wrong") {
            first.state = "none";
            second.state = "none";

            return {
                ...state,
                items,
                memoryGame: {
                    ...state.memoryGame,
                    selectedItems: rest,
                }
            };
        }

        if (first.state === "right" && second.state === "right") {
            first.state = "completed";
            first.isMatched = true;
            second.state = "completed";
            second.isMatched = true;

            return {
                ...state,
                items,
                memoryGame: {
                    ...state.memoryGame,
                    selectedItems: rest,
                }
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
            items,
            memoryGame: {
                ...state.memoryGame,
                selectedItems: rest,
            }
        };
    }

    // if (action.type === getType(actions.sendMemoryGameData.success)) {
    //     const exercise = unload(action.payload);

    //     if (state.isLoading === true) {
    //         return state;
    //     }

    //     const exercises = [
    //         ...state.exercises.filter((pr) => pr.id !== exercise.id),
    //         exercise,
    //     ];

    //     return {
    //         ...state,
    //         session: {
    //             ...state.session,
    //             exercises,
    //         },
    //         exercise,
    //     };
    // }

    return state;
};
