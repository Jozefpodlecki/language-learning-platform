import React, { ChangeEvent, FunctionComponent, useState } from "react";
import * as actions from "actions";
import style from "./index.scss";
import { FillTableItem } from "models/CourseItem";
import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { moveNext } from "api";
import ActionButton from "components/ActionButton";

type Props = FillTableItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    remainingSeconds: number;
    hasChanged: boolean;
    onQuit(): void;
};

const FillTable: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    items,
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

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const tableItemId = event.currentTarget.dataset.id;
        const value = event.currentTarget.value;

        dispatch(actions.fillTable({
            itemId: id,
            tableItemId,
            value,
        }))
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div>
            {items.map(pr => <div key={pr.id} className={style.item}>
                <div>{pr.source}</div>
                <div>
                    <input
                        data-id={pr.id}
                        className={style.input}
                        type="text"
                        value={pr.destination}
                        onChange={onChange}/>
                </div>
            </div>)}
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

export default FillTable;
