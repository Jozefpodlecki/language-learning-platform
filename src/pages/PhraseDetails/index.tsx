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
import { faPlay, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StrokePlayer from "./StrokePlayer";
import Navbar from "pages/Navbar";
import { playAudioWithSpeechSynthesis } from "appUtils";

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

    useEffect(() => {
        
        if(!hanzi) {
            return;
        }

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

    }, [hanzi]);

    const strokes = Array.from(hanzi)
        .map(pr => encode(pr))
        .map(pr => hanziStrokesMoveDict[`./${pr}.webm`]);
    
    const onPlay = () => {
        playAudioWithSpeechSynthesis("zh", hanzi)
    }

    const onPlaySentence = (event: React.MouseEvent<HTMLDivElement>) => {
        const sentence = event.currentTarget.dataset.sentence;
        playAudioWithSpeechSynthesis("zh", sentence);
    }

    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.content}>
                <div className={style.phrase}>
                    <div className={style.text}>{hanzi}</div>
                    <div className={style.playIcon} onClick={onPlay}>
                        <FontAwesomeIcon icon={faVolumeUp}/>
                    </div>
                </div>
                <div>
                    <div className={style.section}>Meanings</div>
                    <div>
                        {meanings.map(meaning => <div key={meaning}>{meaning}</div>)}
                    </div>
                </div>
                <div>
                    <div className={style.section}>Strokes</div>
                    <div className={style.strokesList}>
                        {strokes.map(stroke => <StrokePlayer width={100} key={stroke} stroke={stroke}/>)}
                    </div>
                </div>
                <div>
                    <div className={style.section}>Example sentences</div>
                    <div>{sentences.map(sentence => <div key={sentence}>
                        <div className={style.sentenceItem}>
                            <div className={style.sentenceText}>{sentence.zn}</div>
                            <div data-sentence={sentence.zn} className={style.playIcon} onClick={onPlaySentence}>
                                <FontAwesomeIcon icon={faVolumeUp}/>
                            </div>
                        </div>
                        <div>{sentence.en}</div>
                    </div>)}</div>
                </div>
            </div>
        </div>
    );
};

export default PhraseDetails;
