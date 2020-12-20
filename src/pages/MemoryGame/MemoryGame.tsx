import { useSelector } from "hooks/useSelector";
import { MemoryGameItem } from "models/CourseItem";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import Item from "./Item";

import style from "./memoryGame.scss";

type Props = MemoryGameItem;

const MemoryGame: FunctionComponent<Props> = ({
    items,
}) => {
    const dispatch = useDispatch();

    const onClick = (id: string) => {
        
    }

    return <div>
        <div className={style.memoryGame}>
            {items.map(pr => <Item onClick={onClick}/>)}
        </div>
        
    </div>
}

export default MemoryGame;