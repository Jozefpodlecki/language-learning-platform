import { FillTableItemItem } from "models/CourseItem";
import React, { ChangeEvent, FunctionComponent } from "react";
import style from "./item.scss";

type Props = FillTableItemItem & {
    isCompleted: boolean;
    expected: string;
    onChange(id: string, value: string): void;
};

const Item: FunctionComponent<Props> = ({
    id,
    source,
    destination,
    destinationExpected,
    isCorrect,
    isCompleted,
    onChange
}) => {

    const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const element = event.currentTarget;
        const value = element.value;

        onChange(id, value);
    }

    return <div className={style.item}>
        <div className={style.cell}>{source}</div>
        <div className={`${style.cell} ${isCompleted ? isCorrect ? style.right : style.right : null}`}>
            <input
                data-id={id}
                className={style.input}
                type="text"
                value={destination}
                placeholder="......."
                onChange={_onChange}
            />
        </div>
        {isCompleted ? <div className={`${style.cell} ${style.right}`}>{destinationExpected}</div> : null}
    </div>
};

export default Item;
