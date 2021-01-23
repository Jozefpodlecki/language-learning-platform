export * from "./course";
export * from "./courseSession";

const importAsDict = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys().reduce((acc, key) => {
        const module = context(key);
        acc[key] = module.default;
        
        return acc;
    }, {} as Record<string, string>);
};

const importAsTest = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys().reduce((acc, key) => {
        const module = context(key);
        acc[key] = module;

        return acc;
    }, {} as Record<string, any>);
};

const hanziStrokesMoveContext = require.context(
    "/src/assets/hanzi-stroke-move",
    false,
    /\.webm$/,
    "sync"
);

export const hanziStrokesMoveDict = importAsDict(hanziStrokesMoveContext);

const dictionaryContext = require.context(
    "/src/assets/data/dictionary",
    false,
    /\.json$/,
    "sync"
);

const sentencesContext = require.context(
    "/src/assets/data/dictionary",
    false,
    /\.json$/,
    "sync"
);

const dictionary = importAsTest(dictionaryContext);
const sentencesDict = importAsTest(sentencesContext);

type Criteria = {
    page: number;
    sourcelanguageId: string;
    destlanguageId: string;
    text: string;
}

const pageSize = 5;

export const getPhrases = ({page, sourcelanguageId, destlanguageId, text}: Criteria) => {

    const phrases = dictionary[`${sourcelanguageId}-${destlanguageId}`];
    console.log(phrases)
    let items = phrases
        .filter(pr => pr.meaning
            && pr.meaning.includes(text)
            || pr.meanings && pr.meanings.some(pr => pr.includes(text)));

    const from = page * pageSize;
    const to = from + pageSize;

    items = items.slice(from, to);

    return Promise.resolve(items);
}

type PhraseCriteria = {
    id: string;
    sourcelanguageId: string;
    destlanguageId: string;
}

export const getPhrase = ({
    id,
    sourcelanguageId,
    destlanguageId
}: PhraseCriteria) => {

    const phrases = dictionary[`./${sourcelanguageId}-${destlanguageId}.json`] as any[];

    const phrase = phrases.find(pr => pr.id === id);

    return Promise.resolve(phrase);
}

type SentencesCriteria = {
    page: number;
    sourcelanguageId: string;
    destlanguageId: string;
    phraseId: string;
}

export const getSentences = ({
    phraseId,
    destlanguageId,
    sourcelanguageId,
    page,
}: SentencesCriteria) => {

    const phrases = dictionary[`./${sourcelanguageId}-${destlanguageId}.json`];
    
    const sentences = sentencesDict[`./${sourcelanguageId}-${destlanguageId}.json`];

    let items = sentences.filter(pr => pr.relevant_words.includes(word));
    const from = page * pageSize;
    const to = from + pageSize;

    items = items.slice(from, to);

    return Promise.resolve(items);
}
