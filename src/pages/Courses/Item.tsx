import { Course } from "models/Course";
import { Link } from "react-router-dom";
import {
    faBookOpen,
    faGraduationCap,
    faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Button from "./Button";
import React, { FunctionComponent } from "react";
import Thumbnail from "./Thumbnail";
import style from "./item.scss";

type Props = Course & {
    disabled: boolean;
    onPractice(courseId: string): void;
};

const Item: FunctionComponent<Props> = ({
    id,
    name,
    thumbnailUrl,
    onPractice,
}) => {
    const _onPractice = () => onPractice(id);

    return (
        <div className={style.course} key={id}>
            <div className={style.title}>{name}</div>
            <Thumbnail src={thumbnailUrl} />
            <div className={style.actions}>
                <Link to={`/course/${id}/info`}>
                    <Button value="About" icon={faInfo} />
                </Link>
                <Button
                    value="Practice"
                    onClick={_onPractice}
                    icon={faGraduationCap}
                />
                <Link to={`/course/${id}/flashcards`}>
                    <Button value="Flashcards" icon={faBookOpen} />
                </Link>
            </div>
        </div>
    );
};

export default Item;
