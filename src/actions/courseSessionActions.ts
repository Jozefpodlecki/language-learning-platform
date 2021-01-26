import { Course } from "models/Course";
import { Exercise } from "models/Exercise";
import { Lesson } from "models/Lesson";
import { LessonSession } from "models/LessonSession";
import { createAction, createAsyncAction } from "typesafe-actions";

type SendAudioPayload = {
    audioUrl?: string;
    transcript?: string;
};

export const getLesson = createAsyncAction(
    "getLesson.request",
    "getLesson.success",
    "getLesson.error"
)<void, Lesson, void>();

export const getCourse = createAsyncAction(
    "getCourse.request",
    "getCourse.success",
    "getCourse.error"
)<void, Course, void>();

export const nextExercise = createAsyncAction(
    "nextExercise.request",
    "nextExercise.success",
    "nextExercise.error"
)<void, {
    session: LessonSession;
    exercise?: Exercise;
}, void>();

export const startSession = createAsyncAction(
    "startSession.request",
    "startSession.success",
    "startSession.error"
)<void, LessonSession, void>();

export const quitSession = createAsyncAction(
    "quitSession.request",
    "quitSession.success",
    "quitSession.error"
)<void, void, void>();

export const sendData = createAsyncAction(
    "sendData.request",
    "sendData.success",
    "sendData.error"
)<void, Exercise, void>();

export const sendFillTableItems = createAsyncAction(
    "sendFillTableItems.request",
    "sendFillTableItems.success",
    "sendFillTableItems.error"
)<void, Exercise, void>();

export const sendTranscribe = createAsyncAction(
    "sendTranscribe.request",
    "sendTranscribe.success",
    "sendTranscribe.error"
)<void, Exercise, void>();

export const sendAudio = createAsyncAction(
    "sendAudio.request",
    "sendAudio.success",
    "sendAudio.error"
)<void, Exercise, void>();

export const sendText = createAsyncAction(
    "sendText.request",
    "sendText.success",
    "sendText.error"
)<void, Exercise, void>();

export const sendAnswer = createAsyncAction(
    "sendAnswer.request",
    "sendAnswer.success",
    "sendAnswer.error"
)<void, Exercise, void>();

export const sendMatchPairsData = createAsyncAction(
    "sendMatchPairsData.request",
    "sendMatchPairsData.success",
    "sendMatchPairsData.error"
)<void, Exercise, void>();

export const sendMemoryGameData = createAsyncAction(
    "sendMemoryGameData.request",
    "sendMemoryGameData.success",
    "sendMemoryGameData.error"
)<void, Exercise, void>();

export const selectAnswer = createAction("selectAnswer")<{
    itemId: string;
    answerId: string;
}>();

export const selectItem = createAction("selectItem")<string>();
export const processPair = createAction("processPair")();

export const transcribeChange = createAction("transcribeChange")<{
    itemId: string;
    transcription: string;
}>();

export const fillTable = createAction("fillTable")<{
    itemId: string;
    tableItemId: string;
    value: string;
}>();
