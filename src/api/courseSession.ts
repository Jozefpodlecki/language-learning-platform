import { v4 as uuidv4 } from "uuid";
import { CourseSession } from "models/CourseSession";
import { random, generateRecordAudioItem, generateMCQItems } from "appUtils";
import { MCQItem } from "models/CourseItem";
import { getCourseDatasetAsync } from "./course";

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

export const createSession = async (courseId: string) => {
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
    }

    const dataset = await getCourseDatasetAsync(courseId);
    //const items = generateMCQItems(itemCount, dataset);
    const items = generateMCQItems(itemCount, dataset);
    session.items = items;
    //session.items = [generateRecordAudioItem(dataset)]

    const index = random(0, items.length);
    const item = items[index];
    session.currentItemId = item.id;

    sessions.push(session)

    setSessionsToLocalStorage(sessions);

    return session;
}

export const sendAnswer = (sessionId: string, answerId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    const item = session.items.find(pr => pr.type === "multiple choice question" 
        && pr.answers.some(npr => npr.id === answerId)) as MCQItem;

    const isCorrect = answerId === item.rightAnswer.id;
    item.isCorrect = isCorrect;
    item.isCompleted = true;
    
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
    session.completedCount++;

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

