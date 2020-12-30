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
};

const Item: FunctionComponent<Props> = ({
    id,
    name,
    thumbnailUrl,
}) => {

    return (
        <div className={style.course} key={id}>
            <div className={style.title}>{name}</div>
            <Thumbnail src={thumbnailUrl} />
            <div className={style.actions}>
                <Link to={`/course/${id}/info`}>
                    <Button value="About" icon={faInfo} />
                </Link>
                <Link to={`/course/${id}/lesson`}>
                    <Button value="Lessons" icon={faBookOpen} />
                </Link>
                {/* <Button
                    value="Practice"
                    onClick={_onPractice}
                    icon={faGraduationCap}
                />
                <Link to={`/course/${id}/flashcards`}>
                    <Button value="Flashcards" icon={faBookOpen} />
                </Link> */}
            </div>
        </div>
    );
};

export default Item;
