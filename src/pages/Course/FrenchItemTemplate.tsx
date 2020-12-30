import { FrenchDatasetItem } from "models/dataset/French";
import React, { FunctionComponent } from "react";
import style from "./frenchItemTemplate.scss";

type Props = FrenchDatasetItem;

const FrenchItemTemplate: FunctionComponent<Props> = ({ id, en, fr }) => {
    return (
        <div key={id} className={style.item}>
            <div className={style.key}>{en}</div>
            <div className={style.value}>{fr}</div>
        </div>
    );
};

export default FrenchItemTemplate;
