import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MemoryGameItemItemState } from "models/Exercise";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, MouseEvent, useMemo } from "react";
import style from "./item.scss";

type Props = {
    id: string;
    value: string;
    state: MemoryGameItemItemState;
    onClick(id: string): void;
};

const Item: FunctionComponent<Props> = ({ id, value, state, onClick }) => {
    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    };

    const stateStyle = useMemo(() => {
        switch (state) {
            case "right":
                return style.right;
            case "wrong":
                return style.wrong;
            case "completed":
                return style.completed;
            case "disabled":
                return style.disabled;
            case "selected":
                return style.selected;
            default:
                return "";
        }
    }, [state]);

    return (
        <div
            className={`${style.item} ${stateStyle}`}
            data-id={id}
            onClick={_onClick}
        >
            {state === "completed" ? (
                <div>
                    <FontAwesomeIcon icon={faCheck} />
                </div>
            ) : (
                value
            )}
        </div>
    );
};

export default Item;
