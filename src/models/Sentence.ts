export interface Sentence {
    id: string;
    languageId: string;
    source: string;
    dest: string;
    properties: Record<string, string | Array<any>>;
}