import { Answer, MCQItem, MemoryGameItem, MemoryGameItemItem, RecordAudioItem } from "models/CourseItem";
import { Radical } from "models/Radical";
import MemoryGame from "pages/MemoryGame/MemoryGame";
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
        id: uuidv4(),
        type: "record audio",
        isCorrect: false,
        isCompleted: false,
        question: item.radical,
        description: item.pinyin,
    }
}

export const generateMemoryGameItem = (
    itemsCount: number,
    dataset: Radical[]): MemoryGameItem => {

    let items: MemoryGameItemItem[] = [];
    const indicies = new Set();

    for(const _ of Array(itemsCount)) {
        
        let index = random(0, dataset.length);
        
        while(indicies.has(index)) {
            index = random(0, dataset.length);
        }

        indicies.add(index);
        const datasetItem = dataset[index];

        items.push({
            id: uuidv4(),
            matchId: datasetItem.id,
            value: datasetItem.radical
        })

        items.push({
            id: uuidv4(),
            matchId: datasetItem.id,
            value: datasetItem.meaning
        })
    }

    let shuffledIndicies: number[] = [];
    indicies.clear();

    while(indicies.size !== shuffledIndicies.length) {
        let index = random(0, items.length);

        while(indicies.has(index)) {
            index = random(0, items.length);
        }

        shuffledIndicies.push(index);

        if(indicies.size - shuffledIndicies.length === 2) {
            const remainingIndicies = items
                .map((or, index) => index)
                .filter(pr => !shuffledIndicies.includes(pr))
                shuffledIndicies = shuffledIndicies.concat(remainingIndicies);
        }
    }
    
    items = shuffledIndicies.map(index => items[index]);

    return {
        id: uuidv4(),
        type: "memory game",
        items,
        isCompleted: false,
        isCorrect: false,
    }
}


export const generateMCQItems = (
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
            id: item.id,
            value: item.meaning,
            isCorrect: true,
            isSelected: false,
        }

        const question = {
            id: item.id,
            value: item.radical,
        }

        sessionItems.push({
            id: item.id,
            type: "multiple choice question",
            rightAnswer,
            answers: getRandomAnswers(index, rightAnswer, 2, items),
            question,
            isCorrect: false,
            isCompleted: false,
        })

        
    }

    return sessionItems;
}