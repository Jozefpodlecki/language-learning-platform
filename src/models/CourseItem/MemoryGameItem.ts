import { BaseItem } from "./BaseItem"

export type MemoryGameItem = BaseItem &{
    type: "memory game";
    expected: MemoryGameItemItem[];
    items: MemoryGameItemItem[];
}

export type MemoryGameItemItem = {
    id: string;
    value: string;
    matchId?: string;
}
