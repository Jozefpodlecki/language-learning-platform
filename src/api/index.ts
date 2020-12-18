import _radicals from "../assets/data/radicals.json";
import _courses from "../assets/data/courses.json";
import { Course } from "models/Course";
import { v4 as uuidv4 } from "uuid";
import { MCQItem, Session } from "models/Session";
import { random, generateRecordAudioItem, generateItems } from "appUtils";

type PageCriteria = {
    page: number;
    pageSize: number;
}

const importAll = (context: __WebpackModuleApi.RequireContext) => {
    context.keys()
};

export const getCourseAsync = (courseId: string) => {
    const course = _courses.find(pr => pr.id === courseId) as Course;

    return Promise.resolve(course);
}

export const getCourseDatasetAsync = (courseId: string) => {
    const course = _courses.find(pr => pr.id === courseId) as Course;

    if(course.datasetUrl === "./radicals.json") {
        return Promise.resolve(_radicals);
    }
}

const getSessionsFromLocalStorage = () => (JSON.parse(localStorage.getItem("session")) || []) as Session[];

const setSessionsToLocalStorage = (sessions: Session[]) => localStorage.setItem("session", JSON.stringify(sessions));

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

    const session: Session = {
        id: uuidv4(),
        startedOn: new Date(),
        completedCount: 0,
        itemCount,
        currentItemId: "",
        courseId,
        items: [],
    }

    const dataset = await getCourseDatasetAsync(courseId);
    const items = generateItems(itemCount, dataset);
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

    item.isCompleted = true;
    item.isCorrect = isCorrect;
    session.completedCount++;

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

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(session);
}

export const finishSession = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find(pr => pr.id === sessionId);

    session.completedOn = new Date();

    setSessionsToLocalStorage(sessions);

    return Promise.resolve();
}

export const getCourses = (options: PageCriteria) => {
    return Promise.resolve(_courses as Course[]);
}