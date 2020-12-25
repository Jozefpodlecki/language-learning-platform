import { BaseItem } from "./BaseItem";

export type MatchPairsItem = BaseItem & {
    type: "match pairs";
    expected: MatchPairsItemItem[];
    items: MatchPairsItemItem[];
    pieces: {
        id: string;
        value: string;
    }[];
}

export type MatchPairsItemItem = {
    id: string;
    source: string;
    destination: string;
}