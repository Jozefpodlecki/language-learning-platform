import { Entity } from "models/Entity";
import { Answer } from "./Answer";
import { BaseItem } from "./BaseItem";

export type MCQItem = BaseItem & {
    id: string;
    type: "multiple choice question";
    question: Entity;
    answers: Answer[];
    answer?: Answer;
    rightAnswer: Answer;
    canPlayAudio: boolean;
}