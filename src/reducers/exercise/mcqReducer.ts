import * as actions from "actions";
import { Item as MCQItem } from "models/Exercise";
import { ActionType, getType } from "typesafe-actions";
import { ExercisePageState } from "./ExercisePageState";

type Action = ActionType<typeof actions>;

type State = MCQItem & ExercisePageState

export default (state: State, action: Action): State => {

    if (action.type === getType(actions.sendAnswer.success)) {
        const exercise = action.payload as State;

        return {
            ...state,
            ...exercise,
        };
    }

    if (action.type === getType(actions.selectAnswer)) {
        const { itemId, answerId } = action.payload;
        
        const answers = state.answers.map((pr) => ({
            ...pr,
            isSelected: false,
        }));
        
        const answer = answers.find((pr) => pr.id === answerId);
        answer.isSelected = true;
        state.answers = answers;

        return {
            ...state,
            answers,
            answer,
            hasChanged: true,
            multipleChoiceQuestion: {
                selectedAnswerId: answerId,
            }
        };
    }

    return state;
};
