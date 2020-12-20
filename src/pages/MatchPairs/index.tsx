import { useSelector } from "hooks/useSelector";
import { MatchPairsItem } from "models/CourseItem";
import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import Item from "./Item";

import style from "./index.scss";

type Props = MatchPairsItem;

const MatchPairs: FunctionComponent<Props> = ({
    items,
    items1
}) => {
    const dispatch = useDispatch();

    const onClick = (id: string) => {
        
    }

    return <div>
        <div>
            <div>
                {items.map(pr => <Item onClick={onClick}/>)}
            </div>
            <div>
                {items.map(pr => <div></div>)}
            </div>
        </div>
        <div>
            {items1.map(pr => <Item onClick={onClick}/>)}
        </div>
    </div>
}

export default MatchPairs;