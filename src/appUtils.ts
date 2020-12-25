import { Answer, 
    CourseItem, FillTableItem, FillTableItemItem,
    MatchPairsItem, MatchPairsItemItem, MCQItem, MemoryGameItem,
    MemoryGameItemItem, RecordAudioItem, TranscribeItem } from "models/CourseItem";
import { CourseItemMetadata, CourseMetadata } from "models/CourseMetadata";
import { Dataset } from "models/dataset";
import { v4 as uuidv4 } from "uuid";

export const random = (from: number, to: number) => Math.floor(Math.random() * (to - from) + from);

export const hasBuiltInSpeechSynthesis = !!window.speechSynthesis;

type Result = {
    index: number;
    item: CourseItem;
}

export const recordAudio = (timeout: number) => 
    navigator.mediaDevices.getUserMedia({audio: true}).then(mediaStream => new Promise((resolve, reject) => {
    const mediaRecorder = new MediaRecorder(mediaStream);
    const audioChunks: Blob[] = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data)
    })

    mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(audioChunks);
        const url = URL.createObjectURL(blob);
        resolve(url);
    })

    mediaRecorder.start();

    setTimeout(() => {
        mediaRecorder.stop();
    }, timeout)
}));

export const recognizeSpeech = (
    languageId: string,
    onstart: () => void,
    onresult: () => void,
    onend: () => void
    ) => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.lang = languageId;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = onstart;
    recognition.onresult = onresult;
    recognition.onend = onend;

    recognition.start();
}

export const playAudioWithSpeechSynthesis = (language: string, text: string) => new Promise((resolve, reject) => {
    const speechSynthesis = window.speechSynthesis;
    const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    speechSynthesisUtterance.lang = language;
    speechSynthesisUtterance.addEventListener("end", resolve);

    speechSynthesis.speak(speechSynthesisUtterance);
});

const getRandomItemFromDataset = (dataset: Dataset, exclude: Set<number>) => {
    let index = random(0, dataset.length);
        
    while(exclude.has(index)) {
        index = random(0, dataset.length);
    }

    const datasetItem = dataset[index];

    return {
        index,
        datasetItem
    }
}

const transformObject = (item: any, courseItemMetadata: CourseItemMetadata) => {
    
    const transform = courseItemMetadata.transform[0];

    return {
        id: item.id,
        answer: item[transform.answer],
        question: item[transform.question],
        description: item[transform.description],
        source: item[transform.source],
        sourceLanguageId: item[transform.sourceLanguageId] || eval(transform.sourceLanguageId),
        destination: item[transform.destination],
        destinationLanguageId: item[transform.destinationLanguageId] || eval(transform.destinationLanguageId),
        transcription: item[transform.transcription],
        canPlayAudio: item[transform.canPlayAudio] || false,
    }
}

// export const getRandomAnswers = (
//     rightIndex: number,
//     rightAnswer: Answer,
//     wrongAnswerCount: number,
//     items: QuestionAnswerItem[]) => {
//     const answers: Answer[] = [];
//     const indicies = new Set([rightIndex]);

//     for(const _ of Array(wrongAnswerCount)) {
        
//         let index = random(0, items.length);
        
//         while(indicies.has(index)) {
//             index = random(0, items.length);
//         }

//         indicies.add(index);
//         const item = items[index];
//         answers.push({
//             id: uuidv4(),
//             value: item.answer,
//             isCorrect: false,
//             isSelected: false,
//         });
//     }

//     answers.splice(random(0, answers.length), 0, rightAnswer);

//     return answers;
// }

export const getRandomAnswers = (
    rightIndex: number,
    rightAnswer: Answer,
    wrongAnswerCount: number,
    dataset: Dataset,
    courseItemMetadata: CourseItemMetadata) => {
    const answers: Answer[] = [];
    const exclude = new Set([rightIndex]);

    for(const _ of Array(wrongAnswerCount)) {
        
        const {
            datasetItem,
            index,
        } = getRandomItemFromDataset(dataset, exclude)
        exclude.add(index);

        const item = transformObject(datasetItem, courseItemMetadata);
        
        answers.push({
            id: uuidv4(),
            value: item.answer,
            isCorrect: false,
            isSelected: false,
        });
    }

    answers.splice(random(0, answers.length), 0, rightAnswer);

    return answers;
}

export const  generateItems = (
    itemsCount: number,
    dataset: Dataset,
    courseMetadata: CourseMetadata) => {
    const list: CourseItem[] = [];

    const { courseItems } = courseMetadata;
    const courseItemsEnabled = courseItems.filter(pr => pr.enabled);
    const exclude = new Set<number>();

    while(itemsCount > list.length) {
        const index = random(0, courseItemsEnabled.length)
        const courseItemMetadata = courseItemsEnabled[index];

        let result: Result;

        switch(courseItemMetadata.type) {
            case "multiple choice question":
                result = generateMCQItem(dataset, exclude, courseItemMetadata);
            break;

            case "fill table":
                result = generateFillTableItem(dataset, exclude, courseItemMetadata);
            break;

            case "record audio":
                result = generateRecordAudioItem(dataset, exclude, courseItemMetadata);
            break;

            case "match pairs":
                result = generateMatchPairsItem(dataset, exclude, courseItemMetadata, 5);
            break;

            case "memory game":
                result = generateMemoryGameItem(dataset, exclude, courseItemMetadata, 5);
            break;

            case "transcribe":       
                result = generateTranscribeItem(dataset, exclude, courseItemMetadata);             
            break;

            default:
                throw new Error("Could not find course item type");
        }

        exclude.add(result.index);
        list.push(result.item);
    }

    return list;
}


export const generateFillTableItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata): Result => {

    const result: FillTableItem = {
        id: uuidv4(),
        type: "fill table",
        items: [],
        isCompleted: false,
        isCorrect: false,
    }

    for(const _ of Array(5)) {
        const {
            index,
            datasetItem
        } = getRandomItemFromDataset(dataset, exclude);
    
        const item = transformObject(datasetItem, courseItemMetadata);
        
        const it: FillTableItemItem = {
            id: item.id,
            source: item.source,
            destination: item.destination
        };
        
        result.items.push(it);
    }

    return {
        index: -1,
        item: result
    }
}

export const generateMemoryGameItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata,
    numberOfMemoryGameItems: number): Result => {

    const result: MemoryGameItem = {
        id: uuidv4(),
        type: "memory game",
        items: [],
        isCompleted: false,
        isCorrect: false,
    }

    for(const _ of Array(numberOfMemoryGameItems)) {
        
        const {
            index,
            datasetItem
        } = getRandomItemFromDataset(dataset, exclude);
    
        const item = transformObject(datasetItem, courseItemMetadata);

        result.items.push({
            id: uuidv4(),
            matchId: item.id,
            value: item.source
        })

        result.items.push({
            id: uuidv4(),
            matchId: item.id,
            value: item.destination
        })
    }

    result.items = reshuffle(result.items);

    return {
        index: -1,
        item: result,
    }
}

export const generateMatchPairsItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata,
    numberOfPairs: number): Result => {

    const result: MatchPairsItem = {
        id: uuidv4(),
        type: "match pairs",
        items: [],
        pieces: [],
        expected: [],
        isCompleted: false,
        isCorrect: false,
    }

    for(const _ of Array(numberOfPairs)) {
        const {
            index,
            datasetItem
        } = getRandomItemFromDataset(dataset, exclude);
    
        const item = transformObject(datasetItem, courseItemMetadata);

        const pairItem = {
            id: uuidv4(),
            source: item.source,
            destination: "",   
        }

        const piece = {
            id: uuidv4(),
            value: item.destination,   
        }

        result.items.push(pairItem);
        result.pieces.push(piece);
        result.expected.push({
            ...pairItem,
            destination: item.destination
        });
    }

    return {
        index: -1,
        item: result
    }
}

export const generateTranscribeItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata): Result => {

    const {
        index,
        datasetItem
    } = getRandomItemFromDataset(dataset, exclude);

    const item = transformObject(datasetItem, courseItemMetadata);

    const result: TranscribeItem = {
        id: item.id,
        type: "transcribe",
        source: item.source,
        sourceLanguageId: item.source,
        destination: item.destination,
        destinationLanguageId: item.destination,
        transcription: "",
        isCompleted: false,
        isCorrect: false,
    }

    return {
        index,
        item: result,
    };
}

export const generateRecordAudioItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata
    ): Result => {
    
    const {
        index,
        datasetItem
    } = getRandomItemFromDataset(dataset, exclude);

    const item = transformObject(datasetItem, courseItemMetadata);

    const result: RecordAudioItem = {
        id: item.id,
        type: "record audio",
        isCorrect: false,
        isCompleted: false,
        question: item.question,
        description: item.description,
    }

    return {
        index: -1,
        item: result,
    }
}

const reshuffle = <T>(items: T[]): T[] => {

    let shuffledIndicies: number[] = [];
    const indicies = new Set<number>();

    while(items.length !== shuffledIndicies.length) {
        let index = random(0, items.length);

        while(indicies.has(index)) {
            index = random(0, items.length);
        }

        shuffledIndicies.push(index);
        indicies.add(index);

        if(indicies.size - shuffledIndicies.length === 2) {
            const remainingIndicies = items
                .map((or, index) => index)
                .filter(pr => !shuffledIndicies.includes(pr))
                shuffledIndicies = shuffledIndicies.concat(remainingIndicies);
        }
    }

    console.log(Array.from(indicies.entries()))
    items = shuffledIndicies.map(index => items[index]);

    return items;
}

export const generateMCQItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: CourseItemMetadata): Result => {

    const {
        index,
        datasetItem
    } = getRandomItemFromDataset(dataset, exclude);

    const item = transformObject(datasetItem, courseItemMetadata);

    const rightAnswer = {
        id: item.id,
        value: item.answer,
        isCorrect: true,
        isSelected: false,
    }

    const question = {
        id: item.id,
        value: item.question,
    }

    const result: MCQItem = {
        id: item.id,
        type: "multiple choice question",
        rightAnswer,
        answers: getRandomAnswers(index, rightAnswer, 2, dataset, courseItemMetadata),
        question,
        isCorrect: false,
        isCompleted: false,
        canPlayAudio: item.canPlayAudio,
    }

    return {
        index,
        item: result,
    };
}

// export const generateMCQItems = (
//     itemsCount: number,
//     items: QuestionAnswerItem[]) => {

//     const sessionItems: MCQItem[] = [];
//     const indicies = new Set();

//     for(const _ of Array(itemsCount)) {
        
//         let index = random(0, items.length);
        
//         while(indicies.has(index)) {
//             index = random(0, items.length);
//         }

//         indicies.add(index);
//         const item = items[index];

//         const rightAnswer = {
//             id: item.id,
//             value: item.answer,
//             isCorrect: true,
//             isSelected: false,
//         }

//         const question = {
//             id: item.id,
//             value: item.question,
//         }

//         sessionItems.push({
//             id: item.id,
//             type: "multiple choice question",
//             rightAnswer,
//             answers: getRandomAnswers(index, rightAnswer, 2, items),
//             question,
//             isCorrect: false,
//             isCompleted: false,
//         })

        
//     }

//     return sessionItems;
// 