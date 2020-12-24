import { BaseItem } from "./BaseItem";

export type MatchPairsItem = BaseItem & {
    type: "match pairs";
    expected: MatchPairsItemItem[];
    items: MatchPairsItemItem[];
}

export type MatchPairsItemItem = {
    id: string;
    value: string;
    matchId?: string
}