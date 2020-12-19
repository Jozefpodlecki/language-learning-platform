import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useMemo } from "react";

import style from "./courseSession.scss";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import RecordAudio from "./RecordAudio";
import { useHistory, useParams } from "react-router";
import { finishSession, getCourseAsync, getSession, moveNext } from "api";
import ProgressBar from "components/ProgressBar";

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
    
    useEffect(() => {
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

        if (item.isLoading === false && item.isCompleted) {

            setTimeout(() => {
                dispatch(actions.nextItem.request())

                moveNext(sessionId)
                    .then(session => {
                        actions.nextItem.success(session);
                    });
            }, 2000);
        }
    }, [course, item]);

    const onQuit = () => {
        
        finishSession(sessionId)
            .then(pr => {
                dispatch(actions.quitSession.success());
            })
    }
    
    if(item.isLoading === true || course.isLoading === true) {
        return <div className={style.loader}>
            <Loader
                type="ThreeDots"
                color="black"
                width={200}
                height={200}
            />
        </div>
    }

    if(session.isLoading !== true && session.completedOn) {
        return <div>

        </div>
    }

    let content;

    if(item.type === "multiple choice question") {
        content =  <MultipleChoiceQuestion
            {...item}
            sessionId={sessionId}
            title={course.name}
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

    return  <div className={`${style.session} ${item.isCompleted ? item.isCorrect ? style.right : style.wrong : "" }`}>
        {content}
        <div className={style.progress}>
            <ProgressBar
                width={20}
                completed={completed}/>
        </div>
    </div>
};

export default CourseSession;
