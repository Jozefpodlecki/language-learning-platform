import { getPage } from "appUtils";
import { Language } from "models/Language";
import { Sentence } from "models/Sentence";
import { images, languageDictionary, sentencesDict } from "./assets";

export * from "./course";
export * from "./courseSession";

type Criteria = {
    page: number;
    sourcelanguageId: string;
    destlanguageId: string;
    text: string;
}

type DictionaryCriteria = {
    sourcelanguageId: string;
    destlanguageId: string;
}

const pageSize = 5;

const getDictionary = ({
    sourcelanguageId,
    destlanguageId
}: DictionaryCriteria) => {
    const dictionaryAsset = `./${sourcelanguageId}-${destlanguageId}.json`;

    const dictionary = languageDictionary[dictionaryAsset] as any[];

    return dictionary;
}

export const getPhrases = ({page, sourcelanguageId, destlanguageId, text}: Criteria) => {
   
    const phrases = getDictionary({sourcelanguageId, destlanguageId});
    debugger;
    let items = phrases
        .filter(pr => pr.meaning
            && pr.meaning.includes(text)
            || pr.meanings && pr.meanings.some((pr: any) => pr.includes(text)));

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

    const phrases = languageDictionary[`./${sourcelanguageId}-${destlanguageId}.json`] as any[];

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

    const sentences = sentencesDict[`./${sourcelanguageId}-${destlanguageId}.json`] as Sentence[];

    let items = sentences.filter(pr => pr.properties.relevant_words.some(npr => npr.phraseId === phraseId));

    items = getPage(items, page, pageSize);

    return Promise.resolve(items);
}

type LanguagesCriteria = {
    name?: string;
    page: number;
}

export const getLanguages = ({
    name,
    page,
}: LanguagesCriteria) => import("/assets/data/languages.json").then(pr => {
    let items = pr.default as Language[];

    if(name) {
        const nameNormalized = name.toLowerCase();

        items = items.filter(pr => pr.name.toLowerCase().includes(nameNormalized));
    }

    items = getPage(items, page, pageSize);
    items = items.map(pr => ({
        ...pr,
        imageUrl: images[`${pr.imageUrl}`]
    }))

    return items;
});