import { Selectable } from "."
import { BaseItem } from "./BaseItem"

export type MemoryGameItem = BaseItem & {
    type: "memory game";
    items: MemoryGameItemItem[];
    incorrectTries: number;
}

export type MemoryGameItemItem = {
    id: string;
    value: string;
    matchId: string;
    state: "none" | "disabled" | "right" | "wrong" | "correct" | "selected";
}
