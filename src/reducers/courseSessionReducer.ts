import * as actions from "actions/courseSessionActions";
import { ActionType, getType } from "typesafe-actions";
import { Loadable, unload } from "models/Loadable";
import { Course } from "models/Course";
import { QuizItem, Session } from "models/Session";

export type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<Session>;
    hasSubmit: boolean;
    hasSelected: boolean;
    selectedAnswerId?: string;
    item: Loadable<QuizItem>;
    completed: number;
    course: Loadable<Course>;
}

const initialState = {
    
}

export default (
    state = initialState,
    action: Action
):  State => {
            
    if(action.type === getType(actions.selectAnswer)) {
        const { 
            itemId,
            answerId,
        } = action.payload;

        if(state.session.isLoading === true) {
            return state;
        }

        const items = [...state.session.items];

        const item = items.find(pr => pr.id === itemId);

        if(item.type !== "multiple choice question") {
            return state;
        }

        const answers = item.answers.map(pr => ({...pr, isSelected: false}));
        const answer = answers.find(pr => pr.id === answerId);
        answer.isSelected = true;
        item.answers = answers;

        return {
            ...state,
            hasSelected: true,
            selectedAnswerId: answerId,
            session: {
                ...state.session,
                items: items
            }
        }
    }

    if(action.type === getType(actions.nextItem.request)) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === getType(actions.nextItem.success)) {
        const session = unload(action.payload);

        const completed = session.completedCount / session.itemCount * 100;
        const item = unload(session.items.find(pr => pr.id === session.currentItemId));

        return {
            ...state,
            session,
            item,
            completed,
            isLoading: false,
        }
    }

    if(action.type === getType(actions.getCourse.success)) {
        const course = unload(action.payload);

        return {
            ...state,
            course
        }
    }

    if(action.type === getType(actions.quitSession.request)) {
        return {
            ...state,
            isLoading: true,
        }
    }

    if(action.type === getType(actions.quitSession.success)) {
        return {
            ...state,
            session: {
                isLoading: true,
            },
            isLoading: false,
        }
    }

    if(action.type === getType(actions.sendAudio.request)) {
        const { transcript } = action.payload;

        if(!transcript) {
            return state;
        }

        
        if(state.item.isLoading === true) {
            return state;
        }

        if(state.item.type !== "record audio") {
            return state;
        }

        state.item.description
    }

    if(action.type === getType(actions.sendAnswer.request)) {

        return {
            ...state,
            hasSubmit: true,
        }
    }

    if(action.type === getType(actions.sendAnswer.success)) {
        const item = unload(action.payload);

        if(state.session.isLoading === true) {
            return state;
        }

        const items = [
            ...state.session.items.filter(pr => pr.id !== item.id),
            item
        ]

        return {
            ...state,
            session: {
                ...state.session,
                items
            },
            item,
        }
    }

    if(action.type === getType(actions.startSession.success)) {
        const session = unload(action.payload);

        const item = unload(session.items.find(pr => pr.id === session.currentItemId));
        const completed = session.completedCount / session.itemCount * 100;

        return {
            ...state,
            session,
            item,
            completed,
            isLoading: false,
            hasSubmit: false
        }
    }
            
    return state;
};