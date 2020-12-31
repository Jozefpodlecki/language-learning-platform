import {
    Answer,
    Exercise,
    FillTableItem,
    FillTableItemItem,
    Item as MCQItem,
    MatchPairsItem,
    MemoryGameItem,
    RecordAudioItem,
    TranscribeItem,
} from "models/Exercise";
import { ExerciseMetadata, LessonMetadata } from "models/LessonMetadata";
import { Dataset } from "models/dataset";
import { v4 as uuidv4 } from "uuid";
import { random } from "appUtils";

type Result = {
    index: number;
    item: Exercise;
};

const getRandomItemFromDataset = (dataset: Dataset, exclude: Set<number>) => {
    let index = random(0, dataset.length);

    while (exclude.has(index)) {
        index = random(0, dataset.length);
    }

    const datasetItem = dataset[index];

    return {
        index,
        datasetItem,
    };
};

const transformObject = (item: Record<string, any>, courseItemMetadata: ExerciseMetadata, index: number | undefined = undefined) => {

    if(!index) {
        index = random(0, courseItemMetadata.transform.length);
    }
    const transform = courseItemMetadata.transform[index];

    return {
        id: item.id,
        answer: item[transform.answer],
        question: item[transform.question],
        description: item[transform.description],
        source: item[transform.source],
        text: item[transform.text],
        sourceLanguageId:
            item[transform.sourceLanguageId],
        destination: item[transform.destination],
        destinationLanguageId:
            item[transform.destinationLanguageId],
        transcription: item[transform.transcription],
        canPlayAudio: Boolean(transform.canPlayAudio) || false,
    };
};

export const getRandomAnswers = (
    rightIndex: number,
    rightAnswer: Answer,
    wrongAnswerCount: number,
    dataset: Dataset,
    courseItemMetadata: ExerciseMetadata,
    transformIndex: number
) => {
    const answers: Answer[] = [];
    const exclude = new Set([rightIndex]);

    for (const _ of Array(wrongAnswerCount)) {
        const { datasetItem, index } = getRandomItemFromDataset(
            dataset,
            exclude
        );
        exclude.add(index);

        const item = transformObject(datasetItem, courseItemMetadata, transformIndex);

        answers.push({
            id: uuidv4(),
            value: item.answer,
            isCorrect: false,
            isSelected: false,
        });
    }

    answers.splice(random(0, answers.length), 0, rightAnswer);

    return answers;
};

export const generateExercises = (
    itemsCount: number,
    dataset: Dataset,
    courseMetadata: LessonMetadata
) => {
    const list: Exercise[] = [];

    const { exercises } = courseMetadata;
    const courseItemsEnabled = exercises.filter((pr) => pr.enabled);
    const exclude = new Set<number>();

    while (itemsCount > list.length) {
        const index = random(0, courseItemsEnabled.length);
        const courseItemMetadata = courseItemsEnabled[index];

        let result: Result;

        switch (courseItemMetadata.type) {
            case "multiple choice question":
                result = generateMCQItem(dataset, exclude, courseItemMetadata);
                break;

            case "fill table":
                result = generateFillTableItem(
                    dataset,
                    exclude,
                    courseItemMetadata
                );
                break;

            case "record audio":
                result = generateRecordAudioItem(
                    dataset,
                    exclude,
                    courseItemMetadata
                );
                break;

            case "match pairs":
                result = generateMatchPairsItem(
                    dataset,
                    exclude,
                    courseItemMetadata,
                    3
                );
                break;

            case "memory game":
                result = generateMemoryGameItem(
                    dataset,
                    exclude,
                    courseItemMetadata,
                    3
                );
                break;

            case "transcribe":
                result = generateTranscribeItem(
                    dataset,
                    exclude,
                    courseItemMetadata,
                    courseMetadata
                );
                break;

            default:
                throw new Error("Could not find course item type");
        }

        exclude.add(result.index);
        list.push(result.item);
    }

    return list;
};

export const generateFillTableItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata
): Result => {
    const result: FillTableItem = {
        id: uuidv4(),
        type: "fill table",
        items: [],
        expected: [],
        isCompleted: false,
        isCorrect: false,
    };

    for (const _ of Array(5)) {
        const { index, datasetItem } = getRandomItemFromDataset(
            dataset,
            exclude
        );

        exclude.add(index);
        const item = transformObject(datasetItem, courseItemMetadata);

        const it: FillTableItemItem = {
            id: item.id,
            source: item.source,
            destination: "",
            isCorrect: false,
        };

        result.items.push(it);
        result.expected.push({
            ...it,
            destination: item.destination,
            isCorrect: true,
        });
    }

    return {
        index: -1,
        item: result,
    };
};

export const generateMemoryGameItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata,
    numberOfMemoryGameItems: number
): Result => {
    const result: MemoryGameItem = {
        id: uuidv4(),
        type: "memory game",
        items: [],
        isCompleted: false,
        isCorrect: false,
        incorrectTries: 0,
    };

    for (const _ of Array(numberOfMemoryGameItems)) {
        const { datasetItem } = getRandomItemFromDataset(
            dataset,
            exclude
        );

        const item = transformObject(datasetItem, courseItemMetadata);

        result.items.push({
            id: uuidv4(),
            matchId: item.id,
            value: item.source,
            state: "none",
            isMatched: false,
        });

        result.items.push({
            id: uuidv4(),
            matchId: item.id,
            value: item.destination,
            state: "none",
            isMatched: false,
        });
    }

    let i = 2;

    while (i ** 2 <= result.items.length) {
        i++;
    }

    const padCount = i - result.items.length;

    if (padCount) {
        const padding = Array(padCount)
            .fill({})
            .map(() => ({
                id: uuidv4(),
                matchId: "",
                value: "",
                state: "disabled" as const,
                isMatched: false,
            }));

        result.items = result.items.concat(padding);
    }

    result.items = reshuffle(result.items);

    return {
        index: -1,
        item: result,
    };
};

export const generateMatchPairsItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata,
    numberOfPairs: number
): Result => {
    const result: MatchPairsItem = {
        id: uuidv4(),
        type: "match pairs",
        items: [],
        pieces: [],
        expected: [],
        isCompleted: false,
        isCorrect: false,
    };

    for (const _ of Array(numberOfPairs)) {
        const { datasetItem } = getRandomItemFromDataset(
            dataset,
            exclude
        );

        const item = transformObject(datasetItem, courseItemMetadata);

        const pairItem = {
            id: uuidv4(),
            source: item.source,
            destination: "",
        };

        const piece = {
            id: uuidv4(),
            value: item.destination,
        };

        result.items.push(pairItem);
        result.pieces.push(piece);
        result.expected.push({
            ...pairItem,
            destination: item.destination,
        });
    }

    return {
        index: -1,
        item: result,
    };
};

export const generateTranscribeItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata,
    courseMetadata: LessonMetadata,
): Result => {
    const { index, datasetItem } = getRandomItemFromDataset(dataset, exclude);

    const item = transformObject(datasetItem, courseItemMetadata);

    const result: TranscribeItem = {
        id: item.id,
        type: "transcribe",
        source: item.source,
        sourceLanguageId: courseMetadata.sourceLanguageId,
        destination: item.destination,
        destinationLanguageId: item.destination,
        transcription: "",
        isCompleted: false,
        isCorrect: false,
    };

    return {
        index,
        item: result,
    };
};

export const generateRecordAudioItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata
): Result => {
    const { datasetItem } = getRandomItemFromDataset(dataset, exclude);

    const item = transformObject(datasetItem, courseItemMetadata);

    const result: RecordAudioItem = {
        id: item.id,
        type: "record audio",
        isCorrect: false,
        isCompleted: false,
        text: item.text,
        description: item.description,
        languageId: item.sourceLanguageId,
    };

    return {
        index: -1,
        item: result,
    };
};

const reshuffle = <T>(items: T[]): T[] => {
    const indicies = new Set<number>();

    while (items.length !== indicies.size) {
        let index = random(0, items.length);

        while (indicies.has(index)) {
            index = random(0, items.length);
        }

        indicies.add(index);

        if (items.length - indicies.size === 2) {
            const remainingIndicies = items
                .map((or, index) => index)
                .filter((pr) => !indicies.has(pr));

            for (const index of remainingIndicies) {
                indicies.add(index);
            }
        }
    }

    items = Array.from(indicies.values()).map((index) => items[index]);

    return items;
};

export const generateMCQItem = (
    dataset: Dataset,
    exclude: Set<number>,
    courseItemMetadata: ExerciseMetadata
): Result => {
    const { index, datasetItem } = getRandomItemFromDataset(dataset, exclude);

    const randomTransform = random(0, courseItemMetadata.transform.length);

    const item = transformObject(datasetItem, courseItemMetadata, randomTransform);

    const rightAnswer = {
        id: item.id,
        value: item.answer,
        isCorrect: true,
        isSelected: false,
    };

    const question = {
        id: item.id,
        value: item.question,
    };

    const result: MCQItem = {
        id: item.id,
        type: "multiple choice question",
        rightAnswer,
        answers: getRandomAnswers(
            index,
            rightAnswer,
            2,
            dataset,
            courseItemMetadata,
            randomTransform
        ),
        question,
        isCorrect: false,
        isCompleted: false,
        canPlayAudio: item.canPlayAudio,
    };

    return {
        index,
        item: result,
    };
};