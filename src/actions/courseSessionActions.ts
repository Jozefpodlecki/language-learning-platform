import { Course } from "models/Course";
import { CourseSession } from "models/CourseSession";
import { CourseItem } from "models/CourseItem";
import { createAction, createAsyncAction } from "typesafe-actions";

type SendAudioPayload = {
    audioUrl?: string;
    transcript?: string;
}

export const getCourse = createAsyncAction(
    "getCourse.request",
    "getCourse.success",
    "getCourse.error"
)<void, Course, void>();

export const nextItem = createAsyncAction(
    "nextItem.request",
    "nextItem.success",
    "nextItem.error"
)<void, CourseSession, void>();

export const startSession = createAsyncAction(
    "startSession.request",
    "startSession.success",
    "startSession.error"
)<void, CourseSession, void>();

export const quitSession = createAsyncAction(
    "quitSession.request",
    "quitSession.success",
    "quitSession.error"
)<void, void, void>();

export const sendAudio = createAsyncAction(
    "sendAudio.request",
    "sendAudio.success",
    "sendAudio.error"
)<SendAudioPayload, void, void>();

export const sendAnswer = createAsyncAction(
    "sendAnswer.request",
    "sendAnswer.success",
    "sendAnswer.error"
)<void, CourseItem, void>();

export const selectAnswer = createAction("selectAnswer")<{
    answerId: string;
    itemId: string;
}>();