export type Course = {
    id: string;
    name: string;
    languageId: string;
    datasetUrl?: string;
    thumbnailUrl: string;
    parentCourseId: string;
};
