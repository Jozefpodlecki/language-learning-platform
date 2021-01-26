export interface DictionaryItem {
    id: string;
    languageId: string;
    partofSpeech: string[];
    value: string;
    meanings: string[];
    attributes: Record<string, any>;
}