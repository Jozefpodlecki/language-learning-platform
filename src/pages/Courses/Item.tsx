
import { faGraduationCap, faInfo, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Course } from "models/Course";
import React, { FunctionComponent } from "react";
import style from "./item.scss";
import Thumbnail from "./Thumbnail";

type Props = Course & { 
    disabled: boolean;
    onAbout(courseId: string): void;
    onPractice(courseId: string): void;
};

type ButtonProps = {
    value: string;
    disabled?: boolean;
    icon?: IconDefinition;
    onClick(): void;
}

const Button: FunctionComponent<ButtonProps> = ({
    value,
    disabled,
    icon,
    onClick,
}) => {
    return <div
        className={`${style.button} ${disabled ? style.disabled : ""}`}
        onClick={onClick}>
        <div>{value}</div>
        <div className={style.buttonIcon}>
            <FontAwesomeIcon icon={icon}/>
        </div>
    </div>
}

const Item: FunctionComponent<Props> = ({
    id,
    languageId,
    name,
    thumbnailUrl,
    disabled,
    onAbout,
    onPractice
}) => {

    const _onAbout = () => onAbout(id);

    const _onPractice = () => onPractice(id);

    return <div
        className={style.course}
        key={id}>
        <div className={style.title}>{name}</div>
        <Thumbnail src={thumbnailUrl}/>
        <div className={style.actions}>
            <Button value="About"
                onClick={_onAbout}
                icon={faInfo}/>
            <Button value="Practice"
                onClick={_onPractice}
                icon={faGraduationCap}/>
        </div>
    </div>
};

export default Item;
