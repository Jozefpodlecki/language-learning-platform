import * as actions from "actions";
import { useDispatch } from "react-redux";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useSelector } from "hooks/useSelector";
import { createSession, getCourses, getLastSession } from "api";

import style from "./index.scss";
import { useHistory } from "react-router";
import Navbar from "../Navbar";
import Item from "./Item";

const Courses: FunctionComponent = () => {
    const dispatch = useDispatch();
    const {
        courses,
        session,
    } = useSelector((state) => state.courses);
    const history = useHistory();

    useEffect(() => {
        if (session.isLoading || courses.isLoading) {
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
    }, [session, courses]);

    const {
        hasUncompletedSession,
        uncompletedCourseId,
        sessionLink,
    } = useMemo(() => {
        
        if(session.isLoading === true) {
            return {
                hasUncompletedSession: false,
                uncompletedCourseId: "-1",
            }
        }
        
        const uncompletedCourseId = session.courseId;
        const hasUncompletedSession = !session.completedOn;
        const sessionLink = `/course/${uncompletedCourseId}/session/${session.id}`;

        return {
            uncompletedCourseId,
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
        <Navbar/>
        <main>
            <header className={style.header}>
                Courses
            </header>
            <div>
                {courses.map((course) => <Item
                    key={course.id}
                    {...course}
                    disabled={hasUncompletedSession && course.id === uncompletedCourseId}
                    onAbout={onAbout}
                    onPractice={onPractice}
                    />)}
            </div>
        </main>
        {hasUncompletedSession ? <div className={style.continuePopup}>
            <div className={style.button} onClick={onContinue}>
                <div>Continue your last course</div>
            </div>
        </div> : null}
    </div>
};

export default Courses;
