export type DropdownItem = {
    id: string;
    imageUrl: string;
    value: string;
}

export type Filter = {
    direction: "left" | "right" | "both";
    sourceLanguage?: DropdownItem;
    destinationLanguage?: DropdownItem;
    enabled: boolean;
    value: string;
}