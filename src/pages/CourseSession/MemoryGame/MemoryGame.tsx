import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import ActionButton from "components/ActionButton";
import * as actions from "actions";
import { MemoryGameItem } from "models/CourseItem";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import Item from "./Item";

import style from "./memoryGame.scss";
import { moveNext, sendMemoryGameData } from "api";

type Props = MemoryGameItem & {
    sessionId: string;
    title: string,
    hasChanged: boolean;
    hasSubmit: boolean;
    remainingSeconds: number;
    onQuit(): void;
};

const MemoryGame: FunctionComponent<Props> = ({
    sessionId,
    items,
    hasSubmit,
    hasChanged,
    isCorrect,
    remainingSeconds,
    isCompleted
}) => {
    const dispatch = useDispatch();

    const onClick = (id: string) => {
        
    }

    const onCheck = () => {

        dispatch(actions.sendAnswer.request());

        sendMemoryGameData(sessionId, [])
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

    return <div>
        <div className={style.memoryGame}>
            {items.map(pr => <Item onClick={onClick}/>)}
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
}

export default MemoryGame;