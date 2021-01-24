import { Dataset } from "models/dataset";
import { Module } from "models/Module";

const importAssets = <T = any>(context: RequireContext, transformModule: (module: any) => T) => {

    return context.keys().reduce((acc, key) => {
        const module = context(key);

        acc[key] = transformModule(module);

        return acc;
    }, {} as Record<string, T>);
}

export const images = importAssets(require.context(
    "/src/assets/images",
    false,
    /\.(png|jpe?g|svg)$/,
    "sync"
), pr => pr.default);
export const courseDatasets = importAssets(require.context(
    "/src/assets/data/dataset",
    false,
    /\.json$/,
    "sync"
), pr => pr as Dataset);
export const languageDictionary = importAssets(require.context(
    "/src/assets/data/dictionary",
    false,
    /\.json$/,
    "sync"
), pr => pr as Dataset);
export const sentencesDict = importAssets(require.context(
    "/src/assets/data/sentences",
    false,
    /\.json$/,
    "sync"
), pr => pr as any);
export const hanziStrokesMoveDict = importAssets(require.context(
    "/src/assets/hanzi-stroke-move",
    false,
    /\.webm$/,
    "sync"
), pr => pr.default);