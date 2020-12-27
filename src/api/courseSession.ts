import {
    Answer,
    AudioToSentenceItem,
    FillTableItem,
    FillTableItemItem,
    MCQItem,
    MemoryGameItem,
    MemoryGameItemItem,
    TranscribeItem,
} from "models/CourseItem";
import { CourseSession } from "models/CourseSession";
import { QuestionAnswerItem } from "models/QuestionAnswerItem";
import { generateItems, generateRecordAudioItem, random } from "appUtils";
import { getCourseDatasetAsync, getCourseMetadataAsync } from "./course";
import { v4 as uuidv4 } from "uuid";

export const getSessionsFromLocalStorage = () =>
    (JSON.parse(localStorage.getItem("session")) || []) as CourseSession[];

const setSessionsToLocalStorage = (sessions: CourseSession[]) =>
    localStorage.setItem("session", JSON.stringify(sessions));

export const getSession = async (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    return Promise.resolve(session);
};

export const getLastSession = async () => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => !pr.completedOn);

    return Promise.resolve(session);
};

export const createSession = async (
    userId: string,
    courseId: string,
    isExam: boolean
) => {
    const sessions = getSessionsFromLocalStorage();

    const itemCount = random(5, 10);

    const session: CourseSession = {
        id: uuidv4(),
        startedOn: new Date(),
        completedCount: 0,
        itemCount,
        currentItemId: "",
        courseId,
        items: [],
        correctPercentage: 0,
        isExam,
        createdById: userId,
    };

    const dataset = await getCourseDatasetAsync(courseId);

    const numberOfCourseItemTypes = 2;

    const courseMetadata = await getCourseMetadataAsync(courseId);
    const items = generateItems(itemCount, dataset, courseMetadata);

    session.items = items;

    const index = random(0, items.length);
    const item = items[index];
    session.currentItemId = item.id;

    sessions.push(session);

    setSessionsToLocalStorage(sessions);

    return session;
};

export const sendFillTableItems = (
    sessionId: string,
    itemId: string,
    items: FillTableItemItem[],
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const courseItem = session.items.find(pr => pr.id === itemId) as FillTableItem;

    for(const item of items) {
        const expected = courseItem.expected.find(pr => pr.id === item.id);
        item.isCorrect = item.destination === expected.destination;
        item.destinationExpected = expected.destination;
    }

    courseItem.items = items;
    courseItem.isCorrect = !items.some(pr => !pr.isCorrect);
    courseItem.isCompleted = true;
    courseItem.completedOn = new Date();

    session.completedCount++;
    session.correctPercentage += courseItem.isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(courseItem);
}

export const sendTranscribeText = (
    sessionId: string,
    itemId: string,
    text: string
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const courseItem = session.items.find(
        (pr) => pr.type === "transcribe"
    ) as TranscribeItem;

    courseItem.isCorrect = false;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(courseItem);
};

export const sendMemoryGameData = (
    sessionId: string,
    itemId: string,
    data: MemoryGameItemItem[]
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const courseItem = session.items.find((pr) => pr.id === itemId) as MemoryGameItem;

    courseItem.items = data;
    courseItem.isCompleted = true;
    courseItem.isCorrect = true;

    session.completedCount++;
    session.correctPercentage += courseItem.isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(courseItem);
};

export const sendAnswer = (
    sessionId: string,
    itemId: string,
    answer: Answer
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const item = session.items.find((pr) => pr.id === itemId) as MCQItem;

    const isCorrect = answer.id === item.rightAnswer.id;
    item.isCorrect = isCorrect;
    item.isCompleted = true;
    item.completedOn = new Date();
    item.answer = answer;

    session.completedCount++;
    session.correctPercentage += isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(item);
};

export const moveNext = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    if (session.completedCount === session.itemCount) {
        session.completedOn = new Date();
        setSessionsToLocalStorage(sessions);

        return Promise.resolve(session);
    }

    const items = session.items.filter((pr) => !pr.isCompleted);

    const index = random(0, items.length);

    const item = items[index];
    session.currentItemId = item.id;
    session.modifiedOn = new Date();

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(session);
};

export const finishSession = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const currentDate = new Date();
    session.completedOn = currentDate;

    for (const item of session.items) {
        item.isCompleted = true;
        item.completedOn = currentDate;
    }

    setSessionsToLocalStorage(sessions);

    return Promise.resolve();
};
