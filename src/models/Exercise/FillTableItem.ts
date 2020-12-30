import { BaseItem } from "./BaseItem";

export type FillTableItem = BaseItem & {
    type: "fill table";
    items: FillTableItemItem[];
    expected: FillTableItemItem[];
};

export type FillTableItemItem = {
    id: string;
    source: string;
    destination: string;
    destinationExpected?: string;
    isCorrect: boolean;
};
