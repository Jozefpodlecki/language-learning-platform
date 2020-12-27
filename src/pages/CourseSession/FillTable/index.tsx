import * as actions from "actions";
import { FillTableItem } from "models/CourseItem";
import {
    faArrowRight,
    faCheck,
    faRunning,
} from "@fortawesome/free-solid-svg-icons";
import { moveNext, sendFillTableItems } from "api";
import { useDispatch } from "react-redux";
import ActionButton from "components/ActionButton";
import React, { ChangeEvent, FunctionComponent, useState } from "react";
import style from "./index.scss";
import Item from "./Item";

type Props = FillTableItem & {
    sessionId: string;
    title: string;
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
    isCorrect,
    remainingSeconds,
    hasChanged,
    onQuit,
}) => {
    const dispatch = useDispatch();

    const onCheck = () => {
        dispatch(actions.sendFillTableItems.request());

        sendFillTableItems(sessionId, id, items)
            .then(item => {
                dispatch(actions.sendFillTableItems.success(item));
            })
    };

    const onNextOne = () => {
        dispatch(actions.nextItem.request());

        moveNext(sessionId).then((session) => {
            actions.nextItem.success(session);
        });
    };

    const onChange = (tableItemId: string, value: string) => {
        
        dispatch(
            actions.fillTable({
                itemId: id,
                tableItemId,
                value,
            })
        );
    };

    return (
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            <div className={style.item}>
                {isCompleted ? <div className={style.header}>
                    {isCorrect ? 
                    <div>Nice one!</div> : 
                    <div>Few things were wrong...</div>}
                </div> : <div className={style.header}>Fill gaps</div>}
                <div>
                    {items.map((pr) => <Item
                        key={pr.id}
                        {...pr}
                        isCompleted={isCompleted}
                        onChange={onChange}
                        />)}
                </div>
            </div>
            <div className={style.actions}>
                <ActionButton value="Quit" onClick={onQuit} icon={faRunning} />
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

export default FillTable;
