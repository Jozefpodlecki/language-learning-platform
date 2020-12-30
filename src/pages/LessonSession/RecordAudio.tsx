import React, { FunctionComponent, useEffect, useState } from "react";

import * as actions from "actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RecordAudioItem } from "models/Exercise";
import {
    faCheck,
    faMicrophone,
    faMicrophoneSlash,
    faRunning,
    faStop,
    faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { playAudioWithSpeechSynthesis, recordAudio } from "appUtils";
import { useDispatch } from "react-redux";
import ActionButton from "../../components/ActionButton";
import style from "./recordAudio.scss";

type Props = RecordAudioItem & {
    title: string;
    completed: number;
};

const RecordAudio: FunctionComponent<Props> = ({
    title,
    text,
    languageId,
    description,
    isCompleted,
}) => {
    const [
        { hasSpoken, isPlaying, isRecording },
        setState,
    ] = useState({
        result: "",
        audioUrl: "",
        hasSpoken: false,
        isPlaying: false,
        isRecording: false,
    });
    const dispatch = useDispatch();

    useEffect(() => {
        if (isCompleted) {
        }
    }, [isCompleted]);

    const onPlayAudio = async () => {
        playAudioWithSpeechSynthesis(languageId, text)
        speechSynthesis.cancel();
    };

    const onRecordAudio = async () => {
    };

    const onStopRecordAudio = () => {};

    const onStopPlayAudio = () => {};

    const onSkipAudio = () => {};

    const onQuit = () => {
        dispatch(actions.quitSession.request());
    };

    const onCheck = () => {
        if (!hasSpoken) {
            return;
        }

        dispatch(actions.sendAudio.request());
    };

    return (
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            <div className={style.item}>
                <div className={style.text}>
                    <div className={style.question}>{text}</div>
                    <div className={style.description}>{description}</div>
                </div>
                <div>
                    {isPlaying ? (
                        <div
                            className={style.actionButton}
                            onClick={onStopPlayAudio}
                        >
                            <div>Stop</div>
                            <div className={style.actionIcon}>
                                <FontAwesomeIcon icon={faStop} />
                            </div>
                        </div>
                    ) : (
                        <div
                            className={style.actionButton}
                            onClick={onPlayAudio}
                        >
                            <div>Play</div>
                            <div className={style.actionIcon}>
                                <FontAwesomeIcon icon={faVolumeUp} />
                            </div>
                        </div>
                    )}
                    {isRecording ? (
                        <ActionButton
                            value="Stop"
                            onClick={onStopRecordAudio}
                            icon={faStop}
                        />
                    ) : (
                        <ActionButton
                            value="Record"
                            onClick={onRecordAudio}
                            icon={faMicrophone}
                        />
                    )}
                </div>
            </div>
            <div className={style.actions}>
                <ActionButton value="Quit" onClick={onQuit} icon={faRunning} />
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
    );
};

export default RecordAudio;
