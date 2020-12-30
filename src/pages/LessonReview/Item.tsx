import { Exercise } from "models/Exercise";
import React, { FunctionComponent } from "react";
import style from "./item.scss";

type Props = Exercise;

const Item: FunctionComponent<Props> = (props) => {
    if (props.type === "multiple choice question") {
        const { isCorrect, question, rightAnswer, answer } = props;

        return (
            <div className={style.item}>
                <div className={`${style.cell}`}>{question.value}</div>
                <div
                    className={`${style.cell} ${style.answer} ${
                        isCorrect ? style.right : style.wrong
                    }`}
                >
                    {answer.value}
                </div>
                <div className={`${style.cell} ${style.rightAnswer}`}>
                    {rightAnswer.value}
                </div>
            </div>
        );
    }

    return <div className={style.item}></div>;
};

export default Item;
