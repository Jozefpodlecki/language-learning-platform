import * as actions from "actions";
import { TranscribeItem } from "models/Exercise";
import { courseImages, sendTranscribeText } from "api";
import {
    faArrowRight,
    faCheck,
    faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import ActionButton from "components/ActionButton";
import React, { ChangeEvent, FunctionComponent, useMemo, useState } from "react";
import style from "./index.scss";
import { useSelector } from "hooks/useSelector";

const createRangeFunction = (p1: number, p2: number, p3: number) => {
    
    const c  = p1;
    const a = (p3 - 2 * p2 + c) * -2
    const b = p3 -c - a;

    return (value: number) => {
        const val = value * a ** 2 + value * b + c;
        return `${val.toString(16)}#`;
    };
}

const range = createRangeFunction(
    parseInt("FF2400", 16),
    parseInt("FD6A02", 16),
    parseInt("76FF7A", 16));

type Props = TranscribeItem & {
    sessionId: string;
    title: string;
    remainingSeconds: number;
    hasChanged: boolean;
    onNextOne(): void;
    onQuit(): void;
};

const Transcribe: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    source,
    sourceLanguageId,
    transcription,
    destination,
    isCompleted,
    isCorrect,
    hasChanged,
    remainingSeconds,
    onNextOne,
    onQuit,
}) => {
    const dispatch = useDispatch();
    const {
        pages: {
            session: {
                exercise
            }
        },
    } = useSelector((state) => state);
    const languageUrl = useMemo(() => courseImages[`./${sourceLanguageId}.png`], [sourceLanguageId]);

    if(exercise.isLoading === true) {
        return;
    }

    const { multipleChoiceQuestion: {
        selectedAnswerId
    } } = exercise;

    const onCheck = () => {
        dispatch(actions.sendTranscribe.request());

        sendTranscribeText(sessionId, id, transcription)
            .then(item => {
                dispatch(actions.sendTranscribe.success(item));
            })
    };

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const transcription = event.currentTarget.value;

        dispatch(
            actions.transcribeChange({
                itemId: id,
                transcription,
            })
        );
    };

    return (
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            <div data-id={id} className={style.item}>
                {isCompleted ? <div>
                    {isCorrect ? <div>
                        Good job!
                    </div> : <div>
                        <div>Wrong!</div>
                        <div>It is <b>{destination}</b></div>
                    </div>}
                </div>: <div className={style.header}>
                    <div>Translate to</div>
                    <img
                        className={style.image}
                        src={languageUrl}
                    />
                </div>}
                <div className={style.question}>{source}</div>
                <div>
                    <textarea
                        className={style.textarea}
                        style={{
                            color: range(0.5),
                        }}
                        value={transcription}
                        placeholder="......"
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className={style.actions}>
                <ActionButton value="Quit"
                    onClick={onQuit}
                    icon={faRunning} />
                {isCompleted ? (
                    <ActionButton
                        value={`Next item in ${remainingSeconds}`}
                        onClick={onNextOne}
                        icon={faArrowRight}
                    />
                ) : (
                    <ActionButton
                        value="Next item"
                        onClick={onNextOne}
                        icon={faArrowRight}
                    />
                )}
                {isCompleted ? null : (
                    <ActionButton
                        disabled={!hasChanged}
                        value="Check"
                        onClick={onCheck}
                        icon={faCheck}
                    />
                )}
            </div>
        </div>
    );
};

export default Transcribe;
