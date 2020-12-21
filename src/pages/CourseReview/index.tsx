import * as actions from "actions";
import { getCourseAsync, getSession } from "api";
import dayjs from "dayjs";
import { useSelector } from "hooks/useSelector";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import Loader from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import style from "./index.scss";
import Item from "./Item";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const CourseReview: FunctionComponent = () => {
    const dispatch = useDispatch();
    const { courseId, sessionId } = useParams<{
        courseId: string;
        sessionId: string;
    }>();
    const {
        course,
        session,
    } = useSelector((state) => state.pages.courseSession);

    useEffect(() => {

        if (course.isLoading === true) {
            getCourseAsync(courseId)
                .then(course => {
                    dispatch(actions.getCourse.success(course));
                })
        }

        if (session.isLoading === true) {
            getSession(sessionId)
                .then(session => {
                    dispatch(actions.startSession.success(session));
                })
        }
    }, [course, session]);

    const time = useMemo(() => {
        if(session.isLoading === true) {
            return "";
        }

        const date = dayjs(session.completedOn)
        const diff = date.diff(session.startedOn);

        const formatted = dayjs.duration(diff).humanize(false);

        return formatted;
    }, [session]);

    if(session.isLoading === true || course.isLoading === true) {
        return <div className={style.loader}>
            <Loader
                type="ThreeDots"
                color="black"
                width={200}
                height={200}
            />
        </div>
    }

    return <div className={style.container}>
        <div className={style.header}>Course <b>{course.name}</b> Review</div>
        <div>
            <div className={style.field}>
                <div className={style.label}>
                    <div>
                        <FontAwesomeIcon icon={faClock}/>
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
                {session.items.map(pr => <Item key={pr.id} {...pr}/>)}
            </div>
        </div>
    </div>
}

export default CourseReview;