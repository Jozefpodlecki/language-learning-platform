import * as actions from "actions";
import { useDispatch } from "react-redux";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useSelector } from "hooks/useSelector";
import { createSession, getCourses, getLastSession } from "api";

import style from "./courses.scss";
import { faGraduationCap, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router";

const Courses: FunctionComponent = () => {
    const dispatch = useDispatch();
    const {
        isLoading,
        courses,
        session,
    } = useSelector((state) => state.courses);
    const history = useHistory();

    useEffect(() => {
        if (isLoading) {
            dispatch(actions.getCourses.request());
            
            getCourses({
                page: 0,
                pageSize: 10,
            }).then(courses => {
                dispatch(actions.getCourses.success(courses));
            })

            getLastSession()
                .then(session => {
                    dispatch(actions.getLastSession.success(session));
                })
        }
    }, [isLoading]);

    const {
        hasUncompletedSession,
        courseId,
        sessionLink,
    } = useMemo(() => {
        
        if(session.isLoading === true) {
            return {
                hasUncompletedSession: false,
                courseId: "-1",
            }
        }
        
        const courseId = session.courseId;
        const hasUncompletedSession = !session.completedOn;
        const sessionLink = `/course/${courseId}/session/${session.id}`;

        return {
            courseId,
            hasUncompletedSession,
            sessionLink
        }

    }, [session]);

    const onContinue = () => {
        if(session.isLoading === true) {
            return;
        }

        history.push(sessionLink);
    };

    const onPractice = (courseId: string) => {
        dispatch(actions.startSession.request());
        
        createSession(courseId)
            .then(session => {
                dispatch(actions.startSession.success(session));
                history.push(`/course/${courseId}/session/${session.id}`);
            })
    }

    const onAbout = (courseId: string) => {
        history.push(`/course/${courseId}/info`);
    }

    if(courses.isLoading === true) {
        return <div>
            Loading...
        </div>
    }

    return <div className={style.courses}>
        <div className={style.header}>
            Courses
        </div>
        <div>
            {courses.map(({id, name}) => <div
                className={style.course}
                key={id}>
                <div className={style.title}>{name}</div>
                <div className={style.actions}>
                    <div className={`${style.button} ${hasUncompletedSession ? style.disabled : ""}`} onClick={() => onAbout(id)}>
                        <div>About</div>
                        <div className={style.buttonIcon}><FontAwesomeIcon icon={faInfo}/></div>
                    </div>
                    <div className={`${style.button} ${hasUncompletedSession ? style.disabled : ""}`} onClick={() => onPractice(id)}>
                        <div>Practice</div>
                        <div className={style.buttonIcon}><FontAwesomeIcon icon={faGraduationCap}/></div>
                    </div>
                </div>
            </div>)}
        </div>
        {hasUncompletedSession ? <div className={style.continuePopup}>
            <div className={style.button} onClick={onContinue}>
                <div>Continue your last course</div>
            </div>
        </div> : null}
    </div>
};

export default Courses;
