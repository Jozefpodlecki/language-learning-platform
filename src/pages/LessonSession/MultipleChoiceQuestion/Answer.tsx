import React, { FunctionComponent, MouseEvent } from "react";
import style from "./answer.scss";

type Props = {
    id: string;
    value: string;
    isSelected: boolean;
    isCorrect: boolean;
    hasSubmit: boolean;
    index: number;
    onClick(id: string): void;
};

const Answer: FunctionComponent<Props> = ({
    id,
    value,
    isSelected,
    isCorrect,
    hasSubmit,
    index,
    onClick,
}) => {
    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    };

    return (
        <div
            data-id={id}
            className={`${style.answer}
            ${isSelected ? style.selected : ""}
            ${hasSubmit ? (isCorrect ? style.right : style.wrong) : ""}`}
            onClick={_onClick}
            key={id}
        >
            <div className={style.text}>{value}</div>
            <div className={style.key}>{index + 1}</div>
        </div>
    );
};

export default Answer;
