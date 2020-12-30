import * as actions from "actions";
import { getCourseAsync, getLessonAsync, getSession } from "api";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useSelector } from "hooks/useSelector";
import Item from "./Item";
import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import style from "./index.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const CourseReview: FunctionComponent = () => {
    const dispatch = useDispatch();
    const { lessonId, sessionId } = useParams<{
        lessonId: string;
        sessionId: string;
    }>();
    const { lesson, session } = useSelector(
        (state) => state.pages.session
    );

    useEffect(() => {
        if (lesson.isLoading === true || lesson.id !== lessonId) {
            getLessonAsync(lessonId).then((lesson) => {
                dispatch(actions.getCourse.success(lesson));
            });
        }

        if (session.isLoading === true || session.id !== sessionId) {
            getSession(sessionId).then((session) => {
                dispatch(actions.startSession.success(session));
            });
        }
    }, [lesson, session]);

    const time = useMemo(() => {
        if (session.isLoading === true) {
            return "";
        }

        const date = dayjs(session.completedOn);
        const diff = date.diff(session.startedOn);

        const formatted = dayjs.duration(diff).humanize(false);

        return formatted;
    }, [session]);

    if (session.isLoading === true || lesson.isLoading === true) {
        return (
            <div className={style.loader}>
                <Loader
                    type="ThreeDots"
                    color="black"
                    width={200}
                    height={200}
                />
            </div>
        );
    }

    if (!session.completedOn) {
        return <div className={style.container}>Course is not completed.</div>;
    }

    return (
        <div className={style.container}>
            <div className={style.header}>
                Course <b>{lesson.name}</b> Review
            </div>
            <div>
                <div className={style.field}>
                    <div className={style.label}>
                        <div>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                        <div className={style.labelText}>Time:</div>
                    </div>
                    <div className={style.value}>{time}</div>
                </div>
                <div className={style.sectionHeader}>Activity</div>
                <div className={style.list}>
                    <div className={style.item}>
                        <div className={style.cell}>Question</div>
                        <div className={style.cell}>Selected answer</div>
                        <div className={style.cell}>Right answer</div>
                    </div>
                    {session.exercises.map((pr) => (
                        <Item key={pr.id} {...pr} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseReview;
