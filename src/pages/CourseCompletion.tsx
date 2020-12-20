import { faGraduationCap, faSearch } from "@fortawesome/free-solid-svg-icons";
import ActionButton from "components/ActionButton";
import React, { CSSProperties, FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import style from "./courseCompletion.scss";

type Props = {
    name: string;
    correctPercentage: number;
}

const CourseCompletion: FunctionComponent<Props> = ({
    name,
    correctPercentage,
}) => {
    const textRef = useRef<SVGTextElement>();
    const [textStyle, setTextStyle] = useState<CSSProperties>({
        opacity: 0,
    });

    const onReview = () => {

    }

    const onCourses = () => {
        
    }

    const onPractice = () => {

    }

    useEffect(() => {
        const { width, height } = textRef.current.getBBox();
        setTextStyle({
            transform: `translateX(-${width/2}px) translateY(${height/4}px)`,
            opacity: 1,
        });
    }, [textRef]);

    return <div className={style.container}>
        <div className={style.header}>Course <b>{name}</b> Completed</div>
        <div className={style.stats}>
            <div className={style.visual}>
                <svg width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="50%" cy="50%" r="25" stroke="black" fill="white"/>
                    <text style={textStyle} ref={textRef} x="50%" y="50%">{correctPercentage}%</text>
                </svg>
            </div>
        </div>
        <div className={style.actions}>
            <ActionButton
                value="Review"
                onClick={onReview}
                icon={faSearch}/>
            <ActionButton
                value="Go to courses"
                onClick={onCourses}
                icon={faGraduationCap}/>
            <ActionButton
                value="Practice again"
                onClick={onPractice}/>
        </div>
    </div>
}

export default CourseCompletion;