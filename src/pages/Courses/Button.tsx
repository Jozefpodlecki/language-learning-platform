import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import style from "./item.scss";

type Props = {
    value: string;
    disabled?: boolean;
    icon?: IconDefinition;
    onClick?: () => void;
};

const Button: FunctionComponent<Props> = ({
    value,
    disabled,
    icon,
    onClick,
}) => {
    return (
        <div
            className={`${style.button} ${disabled ? style.disabled : ""}`}
            onClick={onClick}
        >
            <div>{value}</div>
            <div className={style.buttonIcon}>
                <FontAwesomeIcon icon={icon} />
            </div>
        </div>
    );
};

export default Button;
