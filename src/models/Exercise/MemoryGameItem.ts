import { BaseItem } from "./BaseItem";

export type MemoryGameItem = BaseItem & {
    type: "memory game";
    items: MemoryGameItemItem[];
    incorrectTries: number;
};

export type MemoryGameItemItemState =
    | "none"
    | "disabled"
    | "right"
    | "wrong"
    | "selected"
    | "completed";

export type MemoryGameItemItem = {
    id: string;
    value: string;
    matchId: string;
    isMatched: boolean;
    state: MemoryGameItemItemState;
};
