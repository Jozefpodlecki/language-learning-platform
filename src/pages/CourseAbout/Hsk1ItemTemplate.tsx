import { HSK } from "models/dataset/HSK";
import React, { FunctionComponent } from "react";
import style from "./hsk1ItemTemplate.scss";

type Props = HSK;

const Hsk1ItemTemplate: FunctionComponent<Props> = ({
    id,
    hanzi,
    meanings
}) => {
    return <div
        key={id}
        className={style.item}>
        <div className={style.key}>{hanzi}</div>
        <div className={style.value}>{meanings}</div>
    </div>
}

export default Hsk1ItemTemplate;