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

import ReactPlayer from 'react-player'
import { faArrowLeft, faBackward, faPlay, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StrokePlayer from "./StrokePlayer";
import Navbar from "pages/Navbar";
import { playAudioWithSpeechSynthesis } from "appUtils";
import { Link } from "react-router-dom";
import { getStrokes } from "api/assets";

const PhraseDetails: FunctionComponent = () => {
    const [{
        hanzi,
        pinyin,
        meanings,
        radicals,
        sentences,
    }, setState] = useState({
        hanzi: "",
        pinyin: "",
        meanings: [],
        radicals: [],
        isLoading: true,
        sentences: [],
    })
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        
        getPhrase({
            id,
            sourcelanguageId: "zh",
            destlanguageId: "en",
        })
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
            phraseId: id,
            sourcelanguageId: "zh",
            destlanguageId: "en",
            page: 0,
        })
        .then(sentences => {
            setState(state => ({
                ...state,
                sentences,
            }))
        });

    }, [hanzi]);

    const strokes = getStrokes(hanzi);
    
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
                <div>
                    <Link to="/dictionary">
                        <FontAwesomeIcon icon={faArrowLeft}/>
                        <span className={style.back}>Back</span>
                    </Link>
                </div>
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
                    <div className={style.section}>Radicals</div>
                    <div>
                        {radicals.map(radical => <div key={radical}>{radical}</div>)}
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
