import { DragSourceMonitor, useDrag } from "react-dnd";
import React, { FunctionComponent } from "react";

import style from "./dragItem.scss";

type Props = {
    id: string;
    value: string;
    onClick(id: string): void;
};

const DragItem: FunctionComponent<Props> = ({ value }) => {
    const [{ isDragging }, drag] = useDrag({
        item: {
            value,
            type: "pairItem",
        },
        // end: (item: { destination: string } | undefined, monitor: DragSourceMonitor) => {
        // 	const dropResult = monitor.getDropResult()
        // 	if (item && dropResult) {

        // 	console.log(item, dropResult)
        // 	}
        // },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            style={{
                display: isDragging ? "none" : "block",
            }}
            className={style.item}
            ref={drag}
        >
            {value}
        </div>
    );
};

export default DragItem;
