import * as actions from "actions";
import { createSession, getCourses, getLastSession } from "api";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import { useHistory } from "react-router";
import Item from "./Item";
import Navbar from "../Navbar";
import style from "./index.scss";

const Courses: FunctionComponent = () => {
    const dispatch = useDispatch();
    const {
        user: {
            id
        },
        pages: {
            courses: { courses, session },
        },
    } = useSelector((state) => state);
    const history = useHistory();

    useEffect(() => {
        if (courses.isLoading) {
            dispatch(actions.getCourses.request());

            getCourses({
                page: 0,
                pageSize: 10,
            }).then((courses) => {
                dispatch(actions.getCourses.success(courses));
            });
        }
            
        if (session.isLoading) {
            getLastSession().then((session) => {
                dispatch(actions.getLastSession.success(session));
            });
        }

    }, [session, courses]);

    const {
        hasUncompletedSession,
        uncompletedCourseId,
        sessionLink,
    } = useMemo(() => {
        if (session.isLoading === true) {
            return {
                hasUncompletedSession: false,
                uncompletedCourseId: "-1",
            };
        }

        const uncompletedCourseId = session.courseId;
        const hasUncompletedSession = !session.completedOn;
        const sessionLink = `/course/${uncompletedCourseId}/session/${session.id}`;

        return {
            uncompletedCourseId,
            hasUncompletedSession,
            sessionLink,
        };
    }, [session]);

    const onContinue = () => {
        if (session.isLoading === true) {
            return;
        }

        history.push(sessionLink);
    };

    if (courses.isLoading === true) {
        return <div>Loading...</div>;
    }
    console.log(courses);
    return (
        <div className={style.courses}>
            <Navbar />
            <main>
                <header className={style.header}>Courses</header>
                <div className={style.list}>
                    {courses.map((course) => (
                        <Item
                            key={course.id}
                            {...course}
                            disabled={
                                hasUncompletedSession &&
                                course.id === uncompletedCourseId
                            }
                        />
                    ))}
                </div>
            </main>
            {hasUncompletedSession ? (
                <div className={style.continuePopup}>
                    <div className={style.button} onClick={onContinue}>
                        <div>Continue your last course</div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Courses;