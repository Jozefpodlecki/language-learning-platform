import { Lesson } from "models/Lesson";
import Thumbnail from "pages/Courses/Thumbnail";
import React, { FunctionComponent } from "react";
import style from "./item.scss";

type Props = Lesson & {
    onPractice(id: string): void;
}

const Item: FunctionComponent<Props> = ({
    id,
    name,
    thumbnailUrl,
    onPractice
}) => {
    const _onPractice = () => onPractice(id);

    return <div className={style.item}>
        <div>{name}</div>
        <Thumbnail src={thumbnailUrl} />
        <div>
            <button type="button" className={style.button} onClick={_onPractice}>Practice</button>
        </div>
    </div>;
};

export default Item;
