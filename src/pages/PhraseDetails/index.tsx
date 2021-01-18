import { getPhrase, getPhrases } from "api";
import { useDispatch } from "react-redux";
import React, {
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import style from "./index.scss";
import { useParams } from "react-router";

const importAsDict = (context: __WebpackModuleApi.RequireContext) => {
    return context.keys().reduce((acc, key) => {
        const module = context(key);
        acc[key] = module.default;

        return acc;
    }, {} as Record<string, string>);
};

const hanziStrokesMoveContext = require.context(
    "/src/assets/hanzi-stroke-move",
    false,
    /\.gif$/,
    "sync"
);

const hanziStrokesMoveDict = importAsDict(hanziStrokesMoveContext);

const PhraseDetails: FunctionComponent = () => {
    const [{
        hanzi,
        pinyin,
    }, setState] = useState({
        hanzi: "",
        pinyin: "",
        isLoading: true,
    })
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        

        getPhrase(id)
            .then(item => {
            setState(state => ({
                ...state,
                ...item,
                isLoading: false,
            }))
        })

    }, []);

    return (
        <div className={style.container}>
            <div className={style.phrase}>{hanzi}</div>
            {Array.from(hanzi).map(pr => <div key={pr}>
                <img className={style.strokeMoveImage} src={hanziStrokesMoveDict[`./${pr}.gif`]} alt={pr}/>
            </div>)}
        </div>
    );
};

export default PhraseDetails;
