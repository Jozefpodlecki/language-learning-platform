import React, { FunctionComponent, useEffect, useRef, useState } from "react";

import * as actions from "store/actions";
import style from "./recordAudio.scss";
import ProgressBar from "components/ProgressBar";
import { RecordAudioItem } from "models/Session";
import { faCheck, faMicrophone, faMicrophoneSlash, faRunning, faStop, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolve } from "path";
import { useDispatch } from "react-redux";

type Props = RecordAudioItem & { 
    title: string,
    hasSubmit: boolean;
    completed: number;
};

const RecordAudio: FunctionComponent<Props> = ({
    title,
    question,
    description,
    hasSubmit,
    completed,
    isCorrect,
    isCompleted,
}) => {
    const [{
        result,
        audioUrl,
        hasSpoken,
        isPlaying,
        isRecording
    }, setState] = useState({
        result: "",
        audioUrl: "",
        hasSpoken: false,
        isPlaying: false,
        isRecording: false
    });
    const dispatch = useDispatch();

    useEffect(() => {
        if(isCompleted) {
            
        }
    }, [isCompleted]);
 
    const onPlayAudio = async () => {
        const speechSynthesis = window.speechSynthesis;
        const speechSynthesisUtterance = new SpeechSynthesisUtterance(question);
        speechSynthesisUtterance.lang = "zh";
        speechSynthesisUtterance.addEventListener("start", () => {
            setState(state => ({...state, isPlaying: true}))
        })
        speechSynthesisUtterance.addEventListener("end", () => {
            setState(state => ({...state, isPlaying: false}))
        })

        speechSynthesis.speak(speechSynthesisUtterance);
        speechSynthesis.cancel()
    }

    const onRecordAudio = async () => {

        const mediaStream = await navigator.mediaDevices.getUserMedia({audio: true})
        const mediaRecorder = new MediaRecorder(mediaStream);
        const audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener("stop", () => {
            const blob = new Blob(audioChunks);
            const url = URL.createObjectURL(blob);
            setState(state => ({...state, audioUrl: url}))
        })

        mediaRecorder.start();

        setTimeout(() => {
            mediaRecorder.stop();
        }, 3000)

        const recognition = new window.webkitSpeechRecognition();

        recognition.continuous = false;
        recognition.lang = 'zh';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = function() {
            setState(state => ({...state, isRecording: true}))
        };
          
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            setState(state => ({...state, result: transcript}))
        };

        recognition.onend = function(event) {
            setState(state => ({...state, 
                hasSpoken: true,
                isRecording: false
            }))
        }

        recognition.start();
    }

    const onStopRecordAudio = () => {

    }

    const onStopPlayAudio = () => {

    }

    const onSkipAudio = () => {

    }

    const onQuit = () => {
        dispatch(actions.quitSession.request()); 
    }

    const onCheck = () => {
        if(!hasSpoken) {
            return;
        }

        dispatch(actions.sendAudio.request({
            transcript: result,
        }))
    }

    return  <div className={`${style.session} ${isCompleted ? isCorrect ? style.right : style.wrong : "" }`}>
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            <div className={style.item}>
                <div className={style.text}>
                    <div className={style.question}>{question}</div>
                    <div className={style.description}>{description}</div>
                </div>
                <div>
                    {isPlaying ? <div className={style.actionButton} onClick={onStopPlayAudio}>
                        <div>Stop</div>
                        <div className={style.actionIcon}>
                            <FontAwesomeIcon icon={faStop}/>
                        </div>
                    </div> : <div className={style.actionButton} onClick={onPlayAudio}>
                        <div>Play</div>
                        <div className={style.actionIcon}>
                            <FontAwesomeIcon icon={faVolumeUp}/>
                        </div>
                    </div>}
                    {isRecording ? <div className={style.actionButton} onClick={onStopRecordAudio}>
                        <div>Stop</div>
                        <div className={style.actionIcon}>
                            <FontAwesomeIcon icon={faStop}/>
                        </div>
                    </div> : <div className={style.actionButton} onClick={onRecordAudio}>
                        <div>Record</div>
                        <div className={style.actionIcon}>
                            <FontAwesomeIcon icon={faMicrophone}/>
                        </div>
                    </div>}
                </div>
            </div>
            <div className={style.actions}>
                <div className={style.actionButton} onClick={onQuit}>
                    <div>Quit</div>
                    <div className={style.actionIcon}>
                        <FontAwesomeIcon icon={faRunning}/>
                    </div>
                </div>
                <div className={style.actionButton} onClick={onSkipAudio}>
                    <div>I can't speak</div>
                    <div className={style.actionIcon}>
                        <FontAwesomeIcon icon={faMicrophoneSlash}/>
                    </div>
                </div>
                <div className={`${style.actionButton} ${ hasSpoken ? "" : style.actionButtonDisabled}`} onClick={onCheck}>
                    <div>Check</div>
                    <div className={style.actionIcon}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </div>
                </div>
            </div>
        </div>
        <div className={style.progress}>
            <ProgressBar
                width={20}
                completed={completed}/>
        </div>
    </div>
};

export default RecordAudio;
