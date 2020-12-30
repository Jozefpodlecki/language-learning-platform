import { ChineseRadical } from "models/dataset/ChineseRadical";
import React, { FunctionComponent } from "react";
import style from "./chineseRadicalsItemTemplate.scss";

type Props = ChineseRadical;

const ChineseRadicalsItemTemplate: FunctionComponent<Props> = ({
    id,
    radical,
    meaning,
}) => {
    return (
        <div key={id} className={style.item}>
            <div className={style.key}>{radical}</div>
            <div className={style.value}>{meaning}</div>
        </div>
    );
};

export default ChineseRadicalsItemTemplate;
