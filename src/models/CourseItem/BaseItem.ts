export type BaseItem = {
    id: string;
    type: string;
    isCorrect: boolean;
    isCompleted: boolean;
    completedOn?: Date;
}