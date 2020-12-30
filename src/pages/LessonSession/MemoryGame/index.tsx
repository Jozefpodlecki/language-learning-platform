import * as actions from "actions";
import {
    MemoryGameItem,
    MemoryGameItemItem,
} from "models/Exercise";
import {
    faArrowRight,
    faRunning,
    faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import ActionButton from "components/ActionButton";
import Item from "./Item";
import React, { FunctionComponent, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendMemoryGameData } from "api";
import style from "./index.scss";

type Props = MemoryGameItem & {
    sessionId: string;
    title: string;
    hasChanged: boolean;
    hasSubmit: boolean;
    remainingSeconds: number;
    isInteractive: boolean;
    hasFinished: boolean;
    selectedItems: MemoryGameItemItem[];
    onNextOne(): void;
    onQuit(): void;
};

const MemoryGame: FunctionComponent<Props> = ({
    id,
    sessionId,
    items,
    title,
    hasFinished,
    remainingSeconds,
    isCompleted,
    onNextOne,
    onQuit,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasFinished) {
            setTimeout(() => {
                dispatch(actions.sendMemoryGameData.request());

                sendMemoryGameData(sessionId, id, items).then((item) => {
                    dispatch(actions.sendMemoryGameData.success(item));
                });
            }, 1000);

            return;
        }

        let handle: NodeJS.Timeout;

        const callback = () => {
            dispatch(actions.processPair());

            if (!hasFinished) {
                handle = setTimeout(callback, 500);
            }
        };

        handle = setTimeout(callback, 500);

        return () => {
            clearTimeout(handle);
        };
    }, [hasFinished]);

    const onClick = (id: string) => {
        dispatch(actions.selectItem(id));
    };

    const dimension = 4;

    return (
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            {hasFinished ? (
                <div className={style.result}>
                    <div>Nice one!</div>
                    <div>
                        <FontAwesomeIcon icon={faSmile} />
                    </div>
                </div>
            ) : (
                <div className={style.item}>
                    <div className={style.header}>Match items</div>
                    <div
                        style={{
                            gridTemplateColumns: `repeat(${dimension}, 200px)`,
                        }}
                        className={style.memoryGame}
                    >
                        {items.map((pr) => (
                            <Item key={pr.id} {...pr} onClick={onClick} />
                        ))}
                    </div>
                </div>
            )}
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
            </div>
        </div>
    );
};

export default MemoryGame;
