import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import style from "./courseSession.scss";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import RecordAudio from "./RecordAudio";
import { useHistory, useParams } from "react-router";
import { finishSession, getCourseAsync, getSession, moveNext } from "api";
import ProgressBar from "components/ProgressBar";
import CourseCompletion from "./CourseCompletion";

const CourseSession: FunctionComponent = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.courseSession);
    const { 
        item,
        course,
        session, 
        hasSubmit } = state;
    const { courseId, sessionId } = useParams<{
        courseId: string;
        sessionId: string;
    }>();
    const history = useHistory();
    const completed = useMemo(
        () => session.isLoading === true ? 0 : session.completedCount / session.itemCount * 100,
    [session]);
    const [id, setId] = useState("");
    const [remainingSeconds, setRemainingTime] = useState(-1);

    useEffect(() => {
        if (item.isLoading === false && id !== item.id) {
            setRemainingTime(5);
            setId(item.id);
        }

        if (course.isLoading === true) {
            getCourseAsync(courseId)
                .then(course => {
                    dispatch(actions.getCourse.success(course));
                })
        }

        if (item.isLoading === true) {
            getSession(sessionId)
                .then(session => {
                    dispatch(actions.startSession.success(session));
                })
        }

        if (session.isLoading === false 
            && !session.completedOn
            && item.isLoading === false
            && item.isCompleted) {

            if(remainingSeconds === -1) {
                setRemainingTime(5);
                return;
            }

            let timeoutHandle: NodeJS.Timeout;

            const handle = () => {

                if(remainingSeconds === 1) {
                    dispatch(actions.nextItem.request())

                    moveNext(sessionId)
                        .then(session => {
                            actions.nextItem.success(session);
                        });

                    return;
                }

                setRemainingTime(remainingSeconds => remainingSeconds - 1);
            }

            timeoutHandle = setTimeout(handle, 1000);

            return () => {
                clearTimeout(timeoutHandle);
            }
        }
    }, [id, course, item, remainingSeconds]);

    const onQuit = () => {
        dispatch(actions.quitSession.success());

        finishSession(sessionId)
            .then(pr => {
                history.push("/");
            })
    }
    
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

    let content;
    let isCompleted = false;
    let isCorrect = false;

    if(session.completedOn) {
        return <CourseCompletion
            name={course.name}
            correctPercentage={session.correctPercentage}
        />
    }
    
    if(item.isLoading === true) {
        content = <div>
            <Loader
                type="ThreeDots"
                color="black"
                width={200}
                height={200}
            />
        </div>
    }
    else {
        isCompleted = item.isCompleted;
        isCorrect = item.isCorrect;

        if(item.type === "multiple choice question") {
            content =  <MultipleChoiceQuestion
                {...item}
                sessionId={sessionId}
                title={course.name}
                remainingSeconds={remainingSeconds}
                completed={completed}
                hasSubmit={hasSubmit}
                onQuit={onQuit}
            />
        }
    
        if(item.type === "record audio") {
            content = <RecordAudio
                {...item}
                title={course.name}
                completed={completed}
                hasSubmit={hasSubmit}
            />
        }
    }

    return  <div className={`${style.course_session} ${isCompleted ? isCorrect ? style.right : style.wrong : "" }`}>
        {content}
        <div className={style.progress}>
            <ProgressBar
                width={20}
                completed={completed}/>
        </div>
    </div>
};

export default CourseSession;
