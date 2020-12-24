import React, { ChangeEvent, FunctionComponent, useState } from "react";
import * as actions from "actions";
import style from "./index.scss";
import { AudioToSentenceItem, FillTableItem } from "models/CourseItem";
import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { moveNext } from "api";
import ActionButton from "components/ActionButton";

type Props = AudioToSentenceItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    remainingSeconds: number;
    hasChanged: boolean;
    onQuit(): void;
};

const AudioToSentence: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    text,
    isCompleted,
    remainingSeconds,
    hasChanged,
    onQuit,
}) => {
    const dispatch = useDispatch();

    const onCheck = () => {
        
        dispatch(actions.sendText.request());
    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                actions.nextItem.success(session);
            });
    }

    const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.currentTarget.value;
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div>
            <div>{text}</div>
            <div>
                <textarea
                    className={style.textarea}
                    style={{
                        color: "orange",
                    }}
                    value={text}
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

export default AudioToSentence;
