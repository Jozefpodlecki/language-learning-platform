import { faLightbulb, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FillTableItemItem } from "models/Exercise";
import React, { ChangeEvent, FunctionComponent } from "react";
import style from "./item.scss";

type Props = FillTableItemItem & {
    isCompleted: boolean;
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
        <div className={style.descCell}>
            <div>{source}</div>
            <div className={style.clickableIcon}>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <div className={style.clickableIcon}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </div>
        </div>
        <div className={`${style.cell} ${isCompleted ? isCorrect ? style.right : style.wrong : null}`}>
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
