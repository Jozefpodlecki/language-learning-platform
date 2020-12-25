import React, { FunctionComponent, MouseEvent, useMemo } from "react";
import style from "./item.scss";

type Props = {
    id: string;
    value: string;
    state: "none" | "disabled" | "right" | "wrong" | "correct" | "selected"
    onClick(id: string): void;
};

const Item: FunctionComponent<Props> = ({
    id,
    value,
    state,
    onClick,
}) => {
    
    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    }

    const stateStyle = useMemo(() => {
        switch(state) {
            case "correct":
                return style.correct;
            case "right":
                return style.correct;
            case "wrong":
                return style.correct;
            case "disabled":
                return style.correct;
            case "selected":
                return style.correct;
            default:
                return "";
        }
    }, [state]);

    return <div
        className={`${style.item} ${stateStyle}`}
        data-id={id}
        onClick={_onClick}>
        {value}
    </div>
}

export default Item;