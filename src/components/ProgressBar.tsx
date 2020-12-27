import React, { FunctionComponent } from "react";

import style from "./progressBar.scss";

type Props = {
    width: number;
    completed: number;
};

const ProgressBar: FunctionComponent<Props> = ({ width, completed }) => {
    return (
        <div style={{ width }} className={style.progressBar}>
            <div
                style={{ height: `${completed}%` }}
                className={style.bar}
            ></div>
        </div>
    );
};

export default ProgressBar;
