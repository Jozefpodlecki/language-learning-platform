import { getPhrase, getPhrases, getSentences } from "api";
import { useDispatch } from "react-redux";
import React, {
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./index.scss";
import { useParams } from "react-router";
import { encode, decode } from "js-base64";
import ReactPlayer from 'react-player'
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StrokePlayer from "./StrokePlayer";
import Navbar from "pages/Navbar";

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
    /\.webm$/,
    "sync"
);

const hanziStrokesMoveDict = importAsDict(hanziStrokesMoveContext);

const PhraseDetails: FunctionComponent = () => {
    const [{
        hanzi,
        pinyin,
        meanings,
        sentences,
    }, setState] = useState({
        hanzi: "",
        pinyin: "",
        meanings: [],
        isLoading: true,
        sentences: [],
    })
    const { id } = useParams<{ id: string }>();
    const playerRef = useRef<HTMLDivElement>();
    const videoRef = useRef<HTMLVideoElement>();
    
    useEffect(() => {
        
        getSentences({
            word: hanzi,
            page: 0,
        })
        .then(sentences => {
            setState(state => ({
                ...state,
                sentences,
            }))
        });

        getPhrase(id)
            .then(item => {
            setState(state => ({
                ...state,
                ...item,
                isLoading: false,
            }))
        })

    }, []);

    const onPlay = () => {
        videoRef.current.play();
    }

    const strokes = Array.from(hanzi)
        .map(pr => encode(pr))
        .map(pr => hanziStrokesMoveDict[`./${pr}.webm`]);
    
    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.phrase}>{hanzi}</div>
            <div>
                <div>Meanings</div>
                <div>
                    {meanings.map(meaning => <div key={meaning}>{meaning}</div>)}
                </div>
            </div>
            <div className={style.strokesList}>
                {strokes.map(stroke => <StrokePlayer key={stroke} stroke={stroke}/>)}
            </div>
            <div>
                <div>Example sentences.</div>
                <div>{sentences.map(sentence => <div key={sentence}>{sentence}</div>)}</div>
            </div>
        </div>
    );
};

export default PhraseDetails;
