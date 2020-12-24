import { useSelector } from "hooks/useSelector";
import { MemoryGameItem } from "models/CourseItem";
import React, { FunctionComponent, MouseEvent } from "react";
import { useDispatch } from "react-redux";

import style from "./memoryGame.scss";

type Props = {
    onClick(id: string): void;
};

const Item: FunctionComponent<Props> = ({
    onClick,
}) => {
    
    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    }

    return <div onClick={_onClick}>
    </div>
}

export default Item;