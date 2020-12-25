
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import Item from "./Item";
import * as actions from "actions";

import style from "./index.scss";
import { MatchPairsItem } from "models/CourseItem/MatchPairsItem";
import ActionButton from "components/ActionButton";
import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { moveNext } from "api";
import { useDrop } from "react-dnd";
import DragItem from "./DragItem";

type Props = MatchPairsItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    hasChanged: boolean;
    remainingSeconds: number;
    onQuit(): void;
}

const MatchPairs: FunctionComponent<Props> = ({
    items,
    pieces,
    sessionId,
    isCorrect,
    remainingSeconds,
    hasChanged,
    isCompleted,
    onQuit,
}) => {
    const dispatch = useDispatch();
    

    const onClick = (id: string) => {
        
    }

    const onCheck = () => {

    }

    const onDrop = (id: string, value: string) => {

    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                actions.nextItem.success(session);
            });
    }

    return <div className={style.quiz}>
        <div className={style.item}>
            <div className={style.container}>
                {items.map(pr => <Item key={pr.id} {...pr} onClick={onClick} onDrop={onDrop}/>)}
            </div>
            <div className={style.dragContainer}>
                {pieces.map(pr => <DragItem key={pr.id} {...pr} onClick={onClick}/>)}
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
}

export default MatchPairs;