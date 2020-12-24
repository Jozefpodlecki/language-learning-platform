import { Entity } from "models/Entity";

export type Answer = Entity & {
    isCorrect: boolean;
    isSelected: boolean;
}