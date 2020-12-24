import { v4 as uuidv4 } from "uuid";
import { CourseSession } from "models/CourseSession";
import { random, generateRecordAudioItem, generateItems } from "appUtils";
import { Answer, AudioToSentenceItem, MCQItem, MemoryGameItem, MemoryGameItemItem } from "models/CourseItem";
import { getCourseDatasetAsync, getCourseMetadataAsync } from "./course";
import { QuestionAnswerItem } from "models/QuestionAnswerItem";

const getSessionsFromLocalStorage = () => (JSON.parse(localStorage.getItem("session")) || []) as CourseSession[];

const setSessionsToLocalStorage = (sessions: CourseSession[]) => localStorage.setItem("session", JSON.stringify(sessions));

export const getSession = async (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    return Promise.resolve(session);
}

export const getLastSession = async () => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => !pr.completedOn);

    return Promise.resolve(session);
}

export const createSession = async (
    userId: string,
    courseId: string,
    isExam: boolean) => {
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
    }

    const dataset = await getCourseDatasetAsync(courseId);
    //const items = generateMCQItems(itemCount, dataset);

    const numberOfCourseItemTypes = 2;

    const courseMetadata = await getCourseMetadataAsync(courseId);
    const items = generateItems(itemCount, dataset, courseMetadata)

    //const items = generateMCQItems(itemCount, dataset);
    session.items = items;
    //session.items = [generateRecordAudioItem(dataset)]

    const index = random(0, items.length);
    const item = items[index];
    session.currentItemId = item.id;

    sessions.push(session)

    setSessionsToLocalStorage(sessions);

    return session;
}

export const sendAudioToSentenceText = (sessionId: string, text: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    const item = session.items.find(pr => pr.type === "audio to sentence") as AudioToSentenceItem;

    item.isCorrect = false;

    return Promise.resolve();
}

export const sendMemoryGameData = (sessionId: string, data: MemoryGameItemItem[]) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    const item = session.items.find(pr => pr.type === "memory game") as MemoryGameItem;

    item.isCorrect = false;

    return Promise.resolve();
}

export const sendAnswer = (sessionId: string, answer: Answer) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    const item = session.items.find(pr => pr.type === "multiple choice question" 
        && pr.answers.some(npr => npr.id === answer.id)) as MCQItem;

    const isCorrect = answer.id === item.rightAnswer.id;
    item.isCorrect = isCorrect;
    item.isCompleted = true;
    item.answer = answer;

    session.completedCount++;
    session.correctPercentage += isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(item);
}

export const moveNext = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    if(session.completedCount === session.itemCount) {

        session.completedOn = new Date();
        setSessionsToLocalStorage(sessions);

        return Promise.resolve(session);
    }

    const items = session.items.filter(pr => !pr.isCompleted);

    const index = random(0, items.length);

    const item = items[index];
    session.currentItemId = item.id;
    session.modifiedOn = new Date();

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(session);
}

export const finishSession = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    session.completedOn = new Date();

    for(const item of session.items) {
        item.isCompleted = true;
    }

    setSessionsToLocalStorage(sessions);

    return Promise.resolve();
}

