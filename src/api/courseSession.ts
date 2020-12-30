import {
    Answer,
    FillTableItem,
    FillTableItemItem,
    Item as MCQItem,
    MemoryGameItem,
    MemoryGameItemItem,
    TranscribeItem,
} from "models/Exercise";
import { LessonSession } from "models/LessonSession";
import { random } from "appUtils";
import { getLessonDatasetAsync, getLessoneMetadataAsync } from "./course";
import { v4 as uuidv4 } from "uuid";
import { generateExercises } from "logic";

const useStorage = <T>(key: string, setter: (value: T) => string, getter: (value: string | undefined) => T) => {
    const _setter = (value: T) => localStorage.setItem(key, setter(value));
    const _getter = () => getter(localStorage.getItem(key))

    return {
        setter: _setter,
        getter: _getter,
    }
}

const {
    setter: setSessionsToLocalStorage,
    getter: getSessionsFromLocalStorage
} = useStorage<LessonSession[]>("session",
    (value) => JSON.stringify(value),
    (value) => JSON.parse(value) || []);

// export const getSessionsFromLocalStorage = () =>
//     (JSON.parse(localStorage.getItem("session")) || []) as LessonSession[];

// const setSessionsToLocalStorage = (sessions: LessonSession[]) =>
//     localStorage.setItem("session", JSON.stringify(sessions));

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
    lessonId: string,
    courseId: string,
    isExam: boolean
) => {
    const sessions = getSessionsFromLocalStorage();

    const itemCount = random(5, 10);

    const session: LessonSession = {
        id: uuidv4(),
        startedOn: new Date(),
        completedCount: 0,
        itemCount,
        currentExerciseId: "",
        lessonId,
        courseId,
        exercises: [],
        correctPercentage: 0,
        isExam,
        createdById: userId,
    };

    const dataset = await getLessonDatasetAsync(lessonId);

    const numberOfCourseItemTypes = 2;

    const courseMetadata = await getLessoneMetadataAsync(lessonId);
    const exercises = generateExercises(itemCount, dataset, courseMetadata);

    session.exercises = exercises;

    const index = random(0, exercises.length);
    const exercise = exercises[index];
    session.currentExerciseId = exercise.id;

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

    const exercise = session.exercises.find(pr => pr.id === itemId) as FillTableItem;

    for(const item of items) {
        const expected = exercise.expected.find(pr => pr.id === item.id);
        item.isCorrect = item.destination === expected.destination;
        item.destinationExpected = expected.destination;
    }

    exercise.items = items;
    exercise.isCorrect = !items.some(pr => !pr.isCorrect);
    exercise.isCompleted = true;
    exercise.completedOn = new Date();

    session.completedCount++;
    session.correctPercentage += exercise.isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(exercise);
}

export const sendTranscribeText = (
    sessionId: string,
    itemId: string,
    text: string
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const exercise = session.exercises.find(pr => pr.id === itemId) as TranscribeItem;

    exercise.isCompleted = true;
    exercise.isCorrect = text === exercise.destination;
    exercise.completedOn = new Date();
    
    session.completedCount++;
    session.correctPercentage += exercise.isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(exercise);
};

export const sendMemoryGameData = (
    sessionId: string,
    exerciseId: string,
    data: MemoryGameItemItem[]
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const exercise = session.exercises.find((pr) => pr.id === exerciseId) as MemoryGameItem;

    exercise.items = data;
    exercise.isCompleted = true;
    exercise.isCorrect = true;

    session.completedCount++;
    session.correctPercentage += exercise.isCorrect ? 1 / session.itemCount : 0;

    setSessionsToLocalStorage(sessions);

    return Promise.resolve(exercise);
};

export const sendAnswer = (
    sessionId: string,
    exerciseId: string,
    answer: Answer
) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const item = session.exercises.find((pr) => pr.id === exerciseId) as MCQItem;

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

export const moveToNextExercise = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    if (session.completedCount === session.itemCount) {
        session.completedOn = new Date();
        setSessionsToLocalStorage(sessions);

        return Promise.resolve({
            session,
            exercise: null
        });
    }

    const exercises = session.exercises.filter((pr) => !pr.isCompleted);

    const index = random(0, exercises.length);

    const exercise = exercises[index];
    session.currentExerciseId = exercise.id;
    session.modifiedOn = new Date();

    setSessionsToLocalStorage(sessions);

    return Promise.resolve({
        session,
        exercise
    });
};

export const finishSession = (sessionId: string) => {
    const sessions = getSessionsFromLocalStorage();

    const session = sessions.find((pr) => pr.id === sessionId);

    const currentDate = new Date();
    session.completedOn = currentDate;

    for (const exercise of session.exercises) {
        exercise.isCompleted = true;
        exercise.completedOn = currentDate;
    }

    setSessionsToLocalStorage(sessions);

    return Promise.resolve();
};
