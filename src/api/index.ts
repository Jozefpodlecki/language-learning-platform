export * from "./course";
export * from "./courseSession";

import _phrases from "../assets/data/dictionary.json";

type Criteria = {
    page: number;
    text: string;
}

export const getPhrases = ({page, text}: Criteria) => {

    const pageSize = 5;

    let items = _phrases
        .filter(pr => pr.meaning
            && pr.meaning.includes(text)
            || pr.meanings && pr.meanings.some(pr => pr.includes(text)))

    const from = page * pageSize;
    const to = from + pageSize;

    items = items.slice(from, to);

    return Promise.resolve(items);
}