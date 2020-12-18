import { Answer, MCQItem, RecordAudioItem } from "models/Session";
import { Radical } from "models/Radical";
import { v4 as uuidv4 } from "uuid";

export const random = (from: number, to: number) => Math.floor(Math.random() * (to - from) + from);

export const getRandomAnswers = (
    rightIndex: number,
    rightAnswer: Answer,
    wrongAnswerCount: number,
    items: Radical[]) => {
    const answers: Answer[] = [];
    const indicies = new Set([rightIndex]);
    let it = 2;

    for(const _ of Array(wrongAnswerCount)) {
        
        let index = random(0, items.length);
        
        while(indicies.has(index)) {
            index = random(0, items.length);
        }

        indicies.add(index);
        const item = items[index];
        answers.push({
            id: uuidv4(),
            isCorrect: false,
            value: item.meaning,
            isSelected: false,
        });
    }

    answers.splice(random(0, answers.length), 0, rightAnswer);

    return answers;
}

export const generateRecordAudioItem = (items: Radical[]): RecordAudioItem => {
    const index = random(0, items.length);
    const item = items[index];

    return {
        id: "1",
        type: "record audio",
        isCorrect: false,
        isCompleted: false,
        question: item.radical,
        description: item.pinyin,
    }
}

export const generateItems = (
    itemsCount: number,
    items: Radical[]) => {

    const sessionItems: MCQItem[] = [];
    const indicies = new Set();

    for(const _ of Array(itemsCount)) {
        
        let index = random(0, items.length);
        
        while(indicies.has(index)) {
            index = random(0, items.length);
        }

        indicies.add(index);
        const item = items[index];

        const rightAnswer = {
            id: uuidv4(),
            value: item.meaning,
            isCorrect: true,
            isSelected: false,
        }

        sessionItems.push({
            id: item.id,
            type: "multiple choice question",
            rightAnswer,
            answers: getRandomAnswers(index, rightAnswer, 2, items),
            question: item.radical,
            isCorrect: false,
            isCompleted: false,
        })

        
    }

    return sessionItems;
}