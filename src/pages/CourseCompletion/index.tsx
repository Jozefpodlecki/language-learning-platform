import * as actions from "actions";
import { faGraduationCap, faSearch } from "@fortawesome/free-solid-svg-icons";
import { createSession } from "api";
import ActionButton from "components/ActionButton";
import { useSelector } from "hooks/useSelector";
import React, { CSSProperties, FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import style from "./index.scss";
import ProgressArc from "./ProgressArc";

type Props = {
    name: string;
    correctPercentage: number;
}

const CourseCompletion: FunctionComponent<Props> = ({
    name,
    correctPercentage,
}) => {
    const dispatch = useDispatch();
    const {
        user: {
            user
        },
    } = useSelector((state) => state);
    const { courseId, sessionId } = useParams<{
        courseId: string;
        sessionId: string;
    }>();
    const history = useHistory();
    
    const onReview = () => {
        history.push(`/course/${courseId}/session/${sessionId}/review`);
    }

    const onCourses = () => {
        history.push("/");
    }

    const onPractice = () => {
        dispatch(actions.startSession.request());
        
        createSession(
            user.id,
            courseId,
            false)
            .then(session => {
                dispatch(actions.startSession.success(session));
                history.push(`/course/${courseId}/session/${session.id}`);
            })
    }

    return <div className={style.container}>
        <div className={style.header}>Course <b>{name}</b> Completed</div>
        <div className={style.stats}>
            <div>
                <div className={style.scoreLabel}>Your score</div>
                <div className={style.visual}>
                    <ProgressArc correctPercentage={correctPercentage}/>
                </div>
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