import { useSelector } from "hooks/useSelector";
import { MemoryGameItem } from "models/CourseItem";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";

import style from "./memoryGame.scss";

type Props = {
    onClick(id: string): void;
};

const Item: FunctionComponent<Props> = ({
    onClick,
}) => {
    
    const _onClick = () => {
        
    }

    return <div onClick={_onClick}>
    </div>
}

export default Item;