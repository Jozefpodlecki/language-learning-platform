import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import ActionButton from "components/ActionButton";
import * as actions from "actions";
import { MemoryGameItem, MemoryGameItemItem, Selectable } from "models/CourseItem";
import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import Item from "./Item";

import style from "./index.scss";
import { moveNext, sendMemoryGameData } from "api";

type Props =  MemoryGameItem & {
    sessionId: string;
    title: string,
    hasChanged: boolean;
    hasSubmit: boolean;
    remainingSeconds: number;
    isInteractive: boolean;
    selectedItems: MemoryGameItemItem[];
    onQuit(): void;
};

const MemoryGame: FunctionComponent<Props> = ({
    id,
    sessionId,
    items,
    title,
    hasSubmit,
    hasChanged,
    isCorrect,
    remainingSeconds,
    selectedItems,
    isCompleted,
    onQuit
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if(selectedItems.length > 1) {
            dispatch(actions.verifyPair(id));
        }
    }, [selectedItems])

    const onClick = (id: string) => {
        dispatch(actions.selectItem(id))
    }

    const onCheck = () => {

        dispatch(actions.sendAnswer.request());

        sendMemoryGameData(sessionId, id, [])
            .then(item => {
                dispatch(actions.sendMemoryGameData.success(item))
            })
    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                actions.nextItem.success(session);
            });
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div className={style.item}>
            <div className={style.header}>Match items</div>
            <div className={style.memoryGame}>
                {items.map(pr => <Item 
                    key={pr.id}
                    {...pr}
                    onClick={onClick}/>)}
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
        </div>
    </div>
}

export default MemoryGame;