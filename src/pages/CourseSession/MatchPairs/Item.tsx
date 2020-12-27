import { MemoryGameItem } from "models/CourseItem";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";
import { useSelector } from "hooks/useSelector";
import React, { FunctionComponent, MouseEvent } from "react";

import style from "./item.scss";

type Props = {
    id: string;
    source: string;
    destination: string;
    onClick(id: string): void;
    onDrop(id: string, value: string): void;
};

const Item: FunctionComponent<Props> = ({
    id,
    source,
    destination,
    onClick,
    onDrop,
}) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: "pairItem",
        drop: (item: { value: string; type: string }) => {
            onDrop(id, item.value);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    };

    return (
        <div data-id={id} className={style.row} onClick={_onClick}>
            <div className={style.cell}>{source}</div>
            <div className={style.cell}>{destination}</div>
        </div>
    );
};

export default Item;
