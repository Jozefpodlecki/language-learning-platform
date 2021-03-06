import * as actions from "actions";
import { useDispatch } from "react-redux";
import Item from "./Item";
import React, { FunctionComponent } from "react";

import { MatchPairsItem } from "models/Exercise/MatchPairsItem";
import {
    faArrowRight,
    faCheck,
    faRunning,
} from "@fortawesome/free-solid-svg-icons";
import ActionButton from "components/ActionButton";
import DragItem from "./DragItem";
import style from "./index.scss";

type Props = MatchPairsItem & {
    sessionId: string;
    title: string;
    remainingSeconds: number;
    hasChanged: boolean;
    onNextOne(): void;
    onQuit(): void;
};

const MatchPairs: FunctionComponent<Props> = ({
    items,
    pieces,
    sessionId,
    isCorrect,
    hasChanged,
    remainingSeconds,
    isCompleted,
    onNextOne,
    onQuit,
}) => {
    const dispatch = useDispatch();

    const onClick = (id: string) => {};

    const onCheck = () => {};

    const onDrop = (id: string, value: string) => {};

    return (
        <div className={style.quiz}>
            <div className={style.item}>
                <div className={style.container}>
                    {items.map((pr) => (
                        <Item
                            key={pr.id}
                            {...pr}
                            onClick={onClick}
                            onDrop={onDrop}
                        />
                    ))}
                </div>
                <div className={style.dragContainer}>
                    {pieces.map((pr) => (
                        <DragItem key={pr.id} {...pr} onClick={onClick} />
                    ))}
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

export default MatchPairs;
