import React, { FunctionComponent, useEffect, useState } from "react";

import * as actions from "actions";
import style from "./recordAudio.scss";
import { RecordAudioItem } from "models/CourseItem";
import { faCheck, faMicrophone, faMicrophoneSlash, faRunning, faStop, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolve } from "path";
import { useDispatch } from "react-redux";
import ActionButton from "../components/ActionButton";

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

    return  <div className={style.quiz}>
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
                {isRecording ? <ActionButton
                    value="Stop"
                    onClick={onStopRecordAudio}
                    icon={faStop}/> : 
                <ActionButton
                    value="Record"
                    onClick={onRecordAudio}
                    icon={faMicrophone} />}
            </div>
        </div>
        <div className={style.actions}>
            <ActionButton
                value="Quit"
                onClick={onQuit}
                icon={faRunning}
            />
            <ActionButton
                value="I can't speak"
                onClick={onSkipAudio}
                icon={faMicrophoneSlash}
            />
            <ActionButton
                disabled={hasSpoken}
                value="Check"
                onClick={onCheck}
                icon={faCheck}
            />
        </div>
    </div>
};

export default RecordAudio;
