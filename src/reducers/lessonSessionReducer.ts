import * as actions from "actions/courseSessionActions";
import { ActionType, getType } from "typesafe-actions";
import { Course } from "models/Course";
import {
    Exercise,
    MemoryGameItem,
    MemoryGameItemItem,
    Selectable,
} from "models/Exercise";
import { LessonSession } from "models/LessonSession";
import { Loadable, unload } from "models/Loadable";
import { Lesson } from "models/Lesson";
import fillTableReducer from "./exercise/fillTableReducer";
import mcqReducer from "./exercise/mcqReducer";
import memoryGameReducer from "./exercise/memoryGameReducer";
import transcribeReducer from "./exercise/transcribeReducer";
import matchPairReducer from "./exercise/matchPairReducer";
import recordAudioReducer from "./exercise/recordAudioReducer";
import { defaultState, ExercisePageState } from "./exercise/ExercisePageState";

export type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<LessonSession>;
    exercise: Loadable<Exercise & ExercisePageState>;
    lesson: Loadable<Lesson>;
}

const initialState: State = {
    session: {
        isLoading: true,
    },
    exercise: {
        isLoading: true,
    },
    lesson: {
        isLoading: true,
    },
};

// & {
//     // hasSubmit: boolean;
//     // hasSelected: boolean;
//     // hasChanged: boolean;
//     // hasFinished: boolean;
//     // selectedAnswerId?: string;
//     // selectedItems: MemoryGameItemItem[];
//     exercise: Loadable<Exercise>;
//     lesson: Loadable<Lesson>;
// }

// const est = {
//     hasSelected: false,
//     hasChanged: false,
//     hasFinished: false,
//     hasSubmit: false,
//     selectedItems: [],
//     exercise: {
//         isLoading: true,
//     },
//     course: {
//         isLoading: true,
//     },
// }

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.sendData.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            }
        };
    }

    if (action.type === getType(actions.sendData.success)) {
        const exercise = unload(action.payload);

        return {
            ...state,
            exercise: {
                ...exercise,
                ...defaultState
            }
        };
    }

    if (action.type === getType(actions.sendFillTableItems.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            }
        };
    }

    if (action.type === getType(actions.sendFillTableItems.success)) {
        const exercise = unload(action.payload);

        return {
            ...state,
            exercise: {
                ...defaultState,
                ...exercise,
            }
        };
    }

    let exercise = state.exercise;

    if(exercise.isLoading === false) {
        switch(exercise.type) {
            case "fill table":
                exercise = fillTableReducer(exercise, action)
                break;
            case "multiple choice question":
                exercise = mcqReducer(exercise, action);
                break;
            case "memory game":
                exercise = memoryGameReducer(exercise, action)
                break;
            case "transcribe":
                exercise = transcribeReducer(exercise, action)
                break;
            case "match pairs":
                exercise = matchPairReducer(exercise, action)
                break;
            case "record audio":
                exercise = recordAudioReducer(exercise, action)
                break;

        }
    }

    if (action.type === getType(actions.nextExercise.request)) {
        return {
            ...state,
            exercise: {
                isLoading: true,
            }
        };
    }

    if (action.type === getType(actions.nextExercise.success)) {

        const {
            session: _session,
            exercise: _exercise,
        } = action.payload;

        const session = unload(_session);

        if(!_exercise) {
            return {
                ...state,
                ...session,
            };
        }

        const exercise = unload(_exercise);

        if (exercise.type === "memory game") {
            const _exercise = {
                ...exercise,
                items: exercise.items = exercise.items.map((pr) => ({
                    ...pr,
                    isSelected: false,
                })),
            };

            return {
                ...state,
                ...session,
                exercise: {
                    ..._exercise,
                    ...defaultState
                },
            };
        }

        return {
            ...state,
            ...session,
            exercise: {
                ...exercise,
                ...defaultState
            },
        };
    }

    if (action.type === getType(actions.getLesson.success)) {
        const lesson = unload(action.payload);

        return {
            ...state,
            lesson,
        };
    }

    if (action.type === getType(actions.quitSession.success)) {
        return {
            ...state,
            session: {
                isLoading: true,
            }
        };
    }

    if (action.type === getType(actions.startSession.success)) {
        const session = unload(action.payload);

        const exercise = unload(
            session.exercises.find((pr) => pr.id === session.currentExerciseId)
        );

        if (exercise.type === "memory game") {
            const _exercise = {
                ...exercise,
                items: exercise.items = exercise.items.map((pr) => ({
                    ...pr,
                    isSelected: false,
                })),
            };

            return {
                ...state,
                session,
                exercise: {
                    ..._exercise,
                    ...defaultState
                },
            };
        }

        return {
            ...state,
            session,
            exercise: {
                ...exercise,
                ...defaultState
            },
        };
    }

    return {
        ...state,
        exercise
    };
};
