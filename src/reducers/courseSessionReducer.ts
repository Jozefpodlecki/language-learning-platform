import * as actions from "actions/courseSessionActions";
import { ActionType, getType } from "typesafe-actions";
import { Loadable, unload } from "models/Loadable";
import { Course } from "models/Course";
import { CourseSession } from "models/CourseSession";
import { CourseItem, MemoryGameItem, MemoryGameItemItem, Selectable } from "models/CourseItem";

export type Action = ActionType<typeof actions>;

type State = {
    session: Loadable<CourseSession>;
    hasSubmit: boolean;
    hasSelected: boolean;
    hasChanged: boolean;
    selectedAnswerId?: string;
    selectedItems: MemoryGameItemItem[];
    courseItem: Loadable<CourseItem>;
    course: Loadable<Course>;
}

const initialState: State = {
    session: {
        isLoading: true,
    },
    hasSelected: false,
    hasChanged: false,
    hasSubmit: false,
    selectedItems: [],
    courseItem: {
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

        let courseItem = state.courseItem;

        if(courseItem.isLoading === true) {
            return state;
        }

        if(courseItem.type !== "transcribe") {
            return state;
        }

        courseItem = {
            ...courseItem,
            transcription
        }

        return {
            ...state,
            courseItem
        }
    }

    if(action.type === getType(actions.verifyPair)) {
        const courseItem = state.courseItem;

        if(courseItem.isLoading === true) {
            return state;
        }

        if(courseItem.type !== "memory game") {
            return state;
        }

        const items = courseItem.items;
        let [first, second, ...rest] = state.selectedItems;

        if(first.matchId !== second.matchId) {
            [first, second] = items.filter(pr => pr.id === first.id || pr.id === second.id)
            first.state = "wrong";
            second.state = "wrong";
        }
        else
        {
            first.state = "right";
            second.state = "right";
        }

        return {
            ...state,
            courseItem: {
                ...courseItem,
                items
            },
            selectedItems: rest,
        }
    }

    if(action.type === getType(actions.selectItem)) {
        const id = action.payload;

        const courseItem = state.courseItem;

        if(courseItem.isLoading === true) {
            return state;
        }

        if(courseItem.type !== "memory game") {
            return state;
        }

        const items = [...courseItem.items]
        const memoryGameItem = items.find(pr => pr.id === id);
        memoryGameItem.state = memoryGameItem.state === "none" ? "selected" : "none";

        let selectedItems;

        if(memoryGameItem.state === "selected") {
            selectedItems = state.selectedItems.filter(pr => pr.id !== memoryGameItem.id);
        }
        else {
            selectedItems = [...state.selectedItems, memoryGameItem]
        }

        return {
            ...state,
            selectedItems,
        }
    }
            
    if(action.type === getType(actions.selectAnswer)) {
        const { 
            itemId,
            answerId,
        } = action.payload;

        const courseItem = state.courseItem;

        if(courseItem.isLoading === true) {
            return state;
        }

        if(courseItem.type !== "multiple choice question") {
            return state;
        }

        const answers = courseItem.answers.map(pr => ({...pr, state: "none"}));
        const answer = answers.find(pr => pr.id === answerId);
        answer.isSelected = true;
        courseItem.answers = answers;

        return {
            ...state,
            hasSelected: true,
            selectedAnswerId: answerId,
            courseItem,
        }
    }

    if(action.type === getType(actions.nextItem.request)) {
        return {
            ...state,
            courseItem: {
                isLoading: true,
            }
        }
    }

    if(action.type === getType(actions.nextItem.success)) {
        const session = unload(action.payload);

        let courseItem = unload(session.items.find(pr => pr.id === session.currentItemId));

        if(courseItem.type === "memory game") {

            let newCourseItem = {
                ...courseItem,
                items: courseItem.items = courseItem.items.map(pr => ({...pr, isSelected: false}))
            }

            return {
                ...state,
                session,
                courseItem: newCourseItem,
            }
        }

        return {
            ...state,
            session,
            courseItem,
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
            courseItem: {
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
        const courseItem = unload(action.payload);

        if(state.session.isLoading === true) {
            return state;
        }

        if(courseItem.type !== "multiple choice question") {
            return state;
        }

        const items = [
            ...state.session.items.filter(pr => pr.id !== courseItem.id),
            courseItem
        ]

        return {
            ...state,
            session: {
                ...state.session,
                items
            },
            courseItem,
        }
    }

    if(action.type === getType(actions.startSession.success)) {
        const session = unload(action.payload);

        const courseItem = unload(session.items.find(pr => pr.id === session.currentItemId));

        if(courseItem.type === "memory game") {

            let newCourseItem = {
                ...courseItem,
                items: courseItem.items = courseItem.items.map(pr => ({...pr, isSelected: false}))
            }

            return {
                ...state,
                session,
                courseItem: newCourseItem,
            }
        }

        return {
            ...state,
            session,
            courseItem,
        }
    }
            
    return state;
};