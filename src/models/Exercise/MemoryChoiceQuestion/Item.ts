import { Answer } from "./Answer";
import { BaseItem } from "models/Exercise/BaseItem";
import { Entity } from "models/Entity";

export type Item = BaseItem & {
    id: string;
    type: "multiple choice question";
    question: Entity;
    answers: Answer[];
    answer?: Answer;
    rightAnswer: Answer;
    canPlayAudio: boolean;
};
