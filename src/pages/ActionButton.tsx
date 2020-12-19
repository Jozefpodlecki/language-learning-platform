import React, { FunctionComponent } from "react";

import style from "./actionButton.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = { 
    disabled?: boolean;
    value: string;
    icon: IconProp;
    onClick(): void;
};

const ActionButton: FunctionComponent<Props> = ({
    disabled = false,
    value,
    icon,
    onClick,
}) => {

    return <div
        className={`${style.button} ${ disabled ? "" : style.disabled}`}
        onClick={onClick}>
        <div>{value}</div>
        <div className={style.icon}>
            <FontAwesomeIcon icon={icon}/>
        </div>
    </div>
};

export default ActionButton;
