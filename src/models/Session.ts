export type Session = {
    id: string;
    items: QuizItem[];
    completedOn?: Date;
    startedOn: Date;
    expiresOn?: Date;
    completedCount: number;
    itemCount: number;
    currentItemId: string;
    courseId: string;
}

export type MCQItem = {
    id: string;
    type: "multiple choice question";
    question: string;
    answers: Answer[];
    rightAnswer: Answer;
    isCorrect: boolean;
    isCompleted: boolean;
}

export type Answer = {
    id: string;
    value: string;
    isCorrect: boolean;
    isSelected: boolean;
}

export type RecordAudioItem = {
    id: string;
    type: "record audio";
    question: string;
    description: string;
    isCorrect: boolean;
    isCompleted: boolean;
}

export type AudioToSentenceItem = {
    id: string;
    type: "audio to sentence";
    question: string;
    isCorrect: boolean;
    isCompleted: boolean;
}


export type QuizItem = MCQItem | RecordAudioItem | AudioToSentenceItem