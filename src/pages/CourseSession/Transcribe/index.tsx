import React, { ChangeEvent, FunctionComponent, useState } from "react";
import * as actions from "actions";
import style from "./index.scss";
import { TranscribeItem } from "models/CourseItem";
import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { moveNext } from "api";
import ActionButton from "components/ActionButton";

type Props = TranscribeItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    remainingSeconds: number;
    hasChanged: boolean;
    onQuit(): void;
};

const Transcribe: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    source,
    transcription,
    isCompleted,
    remainingSeconds,
    hasChanged,
    onQuit,
}) => {
    const dispatch = useDispatch();

    const onCheck = () => {
        
        dispatch(actions.sendAnswer.request());
    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                actions.nextItem.success(session);
            });
    }

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const transcription = event.currentTarget.value;

        dispatch(actions.transcribeChange({
            itemId: id,
            transcription,
        }))
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div data-id={id} className={style.item}>
            <div className={style.question}>{source}</div>
            <div>
                <textarea
                    className={style.textarea}
                    style={{
                        color: "orange",
                    }}
                    value={transcription}
                    placeholder="Translate..."
                    onChange={onChange}/>
            </div>
        </div>
        <div className={style.actions}>
            <ActionButton
                value="Quit"
                onClick={onQuit}
                icon={faRunning}/>
            {isCompleted ? <ActionButton
                value={`Next item in ${remainingSeconds}`}
                onClick={onNextOne}
                icon={faArrowRight}/> : <ActionButton
                value="Next item"
                onClick={onNextOne}
                icon={faArrowRight}/>}
            {isCompleted ? null : <ActionButton
                disabled={!hasChanged}
                value="Check"
                onClick={onCheck}
                icon={faCheck}/>}
        </div>
    </div>
};

export default Transcribe;
