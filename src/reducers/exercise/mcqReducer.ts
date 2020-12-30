import * as actions from "actions";
import { ActionType, getType } from "typesafe-actions";

type Action = ActionType<typeof actions>;

type State = {

};

const initialState: State = {

};

export default (state = initialState, action: Action): State => {

    if (action.type === getType(actions.sendAnswer.request)) {
        return {
            ...state,
            hasSubmit: true,
        };
    }

    if (action.type === getType(actions.sendAnswer.success)) {
        const exercise = unload(action.payload);

        if (state.session.isLoading === true) {
            return state;
        }

        if (exercise.type !== "multiple choice question") {
            return state;
        }

        const exercises = [
            ...state.session.exercises.filter((pr) => pr.id !== exercise.id),
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

    if (action.type === getType(actions.selectAnswer)) {
        const { itemId, answerId } = action.payload;

        const exercise = state.exercise;

        if (exercise.isLoading === true) {
            return state;
        }

        if (exercise.type !== "multiple choice question") {
            return state;
        }

        const answers = exercise.answers.map((pr) => ({
            ...pr,
            state: "none",
        }));
        const answer = answers.find((pr) => pr.id === answerId);
        answer.isSelected = true;
        exercise.answers = answers;

        return {
            ...state,
            hasSelected: true,
            selectedAnswerId: answerId,
            exercise,
        };
    }

    return state;
};
