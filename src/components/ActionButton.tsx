import React, { FunctionComponent } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import style from "./actionButton.scss";

type Props = {
    disabled?: boolean;
    value: string;
    icon?: IconProp;
    onClick(): void;
};

const ActionButton: FunctionComponent<Props> = ({
    disabled = false,
    value,
    icon,
    onClick,
}) => {
    return (
        <div
            className={`${style.button} ${disabled ? style.disabled : ""}`}
            onClick={onClick}
        >
            <div>{value}</div>
            {icon ? (
                <div className={style.icon}>
                    <FontAwesomeIcon icon={icon} />
                </div>
            ) : null}
        </div>
    );
};

export default ActionButton;
