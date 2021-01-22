export * from "./course";
export * from "./courseSession";

import _phrases from "../assets/data/dictionary.json";
import _sentences from "../assets/data/sentences.json";

type Criteria = {
    page: number;
    text: string;
}

const pageSize = 5;

export const getPhrases = ({page, text}: Criteria) => {

    let items = _phrases
        .filter(pr => pr.meaning
            && pr.meaning.includes(text)
            || pr.meanings && pr.meanings.some(pr => pr.includes(text)))

    const from = page * pageSize;
    const to = from + pageSize;

    items = items.slice(from, to);

    return Promise.resolve(items);
}

export const getPhrase = (id: string) => {
    const phrase = _phrases.find(pr => pr.id === id);

    return Promise.resolve(phrase);
}

type SentencesCriteria = {
    page: number;
    word: string;
}

export const getSentences = ({
    word,
    page,
}: SentencesCriteria) => {
    let items = _sentences.filter(pr => pr.relevant_words.includes(word));
    const from = page * pageSize;
    const to = from + pageSize;

    items = items.slice(from, to);

    return Promise.resolve(items);
}
