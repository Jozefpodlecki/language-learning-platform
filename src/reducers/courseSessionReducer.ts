import * as actions from "actions/courseSessionActions";
import { ActionType, getType } from "typesafe-actions";
import { Loadable, unload } from "models/Loadable";
import { Course } from "models/Course";
import { CourseSession } from "models/CourseSession";
import { CourseItem } from "models/CourseItem";

export type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<CourseSession>;
    hasSubmit: boolean;
    hasSelected: boolean;
    hasChanged: boolean;
    selectedAnswerId?: string;
    item: Loadable<CourseItem>;
    course: Loadable<Course>;
}

const initialState: State = {
    session: {
        isLoading: true,
    },
    hasSelected: false,
    hasChanged: false,
    hasSubmit: false,
    item: {
        isLoading: true,
    },
    course: {
        isLoading: true,
    },
}

export default (
    state = initialState,
    action: Action
):  State => {

    if(action.type === getType(actions.transcribeChange)) {
        const { 
            transcription,
        } = action.payload;

        let item = state.item;

        if(item.isLoading === true) {
            return state;
        }

        if(item.type !== "transcribe") {
            return state;
        }

        item = {
            ...item,
            transcription
        }

        return {
            ...state,
            item
        }
    }
            
    if(action.type === getType(actions.selectAnswer)) {
        const { 
            itemId,
            answerId,
        } = action.payload;

        const item = state.item;

        if(item.isLoading === true) {
            return state;
        }

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
            item,
        }
    }

    if(action.type === getType(actions.nextItem.request)) {
        return {
            ...state,
            item: {
                isLoading: true,
            }
        }
    }

    if(action.type === getType(actions.nextItem.success)) {
        const session = unload(action.payload);

        const item = unload(session.items.find(pr => pr.id === session.currentItemId));

        return {
            ...state,
            session,
            item,
        }
    }

    if(action.type === getType(actions.getCourse.success)) {
        const course = unload(action.payload);

        return {
            ...state,
            course
        }
    }

    if(action.type === getType(actions.quitSession.success)) {
        return {
            ...state,
            session: {
                isLoading: true,
            },
        }
    }

    if(action.type === getType(actions.sendAudio.request)) {

        return {
            ...state,
            item: {
                isLoading: true,
            }
        }
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

        return {
            ...state,
            session,
            item,
            hasSubmit: false
        }
    }
            
    return state;
};