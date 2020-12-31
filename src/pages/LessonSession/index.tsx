import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";

import { finishSession, getCourseAsync, getLessonAsync, getSession, moveToNextExercise } from "api";
import { useHistory, useParams } from "react-router";
import LessonCompletion from "../LessonCompletion";
import FillTable from "./FillTable";
import MatchPairs from "./MatchPairs";
import MemoryGame from "./MemoryGame";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ProgressBar from "components/ProgressBar";
import RecordAudio from "./RecordAudio";
import Transcribe from "./Transcribe";
import style from "./index.scss";

type RouteParams = {
    courseId: string;
    lessonId: string;
    sessionId: string;
}

const CourseSession: FunctionComponent = () => {
    const dispatch = useDispatch();
    const {
        pages: {
            session: {
                session,
                exercise,
                lesson
            }
        },
    } = useSelector((state) => state);
    const { 
        courseId,
        lessonId,
        sessionId } = useParams<RouteParams>();
    const history = useHistory();
    const completed = useMemo(
        () =>
            session.isLoading === true
                ? 0
                : (session.completedCount / session.itemCount) * 100,
        [session]
    );
    const [exerciseId, setExerciseId] = useState("");
    const [remainingSeconds, setRemainingTime] = useState(-1);

    useEffect(() => {

        if (session.isLoading === true) {
            getSession(sessionId).then((session) => {
                dispatch(actions.startSession.success(session));
            });
        }

        if (lesson.isLoading === true) {
            getLessonAsync(lessonId).then((lesson) => {
                dispatch(actions.getLesson.success(lesson));
            });
        }

        if (exercise.isLoading === false && exerciseId !== exercise.id) {
            setRemainingTime(5);
            setExerciseId(exercise.id);
        }
        
        if (
            session.isLoading === false &&
            !session.completedOn &&
            exercise.isLoading === false &&
            exercise.isCompleted
        ) {
            if (remainingSeconds === -1) {

                if(exercise.type === "fill table") {
                    setRemainingTime(30);
                }
                else {
                    setRemainingTime(5);
                }
                
                return;
            }

            let timeoutHandle: NodeJS.Timeout;

            const handle = () => {
                if (remainingSeconds === 1) {
                    dispatch(actions.nextExercise.request());

                    moveToNextExercise(sessionId).then(({
                        session,
                        exercise
                    }) => {
                        dispatch(actions.nextExercise.success({
                            session,
                            exercise,
                        }));
                    });

                    return;
                }

                setRemainingTime((remainingSeconds) => remainingSeconds - 1);
            };

            timeoutHandle = setTimeout(handle, 1000);

            return () => {
                clearTimeout(timeoutHandle);
            };
        }
    }, [exerciseId, session, exercise, remainingSeconds]);

    const onNextOne = () => {
        dispatch(actions.nextExercise.request());

        moveToNextExercise(sessionId).then(({
            session,
            exercise
        }) => {
            dispatch(actions.nextExercise.success({
                session,
                exercise,
            }));
        });
    }

    const onQuit = () => {
        dispatch(actions.quitSession.success());

        finishSession(sessionId).then((pr) => {
            history.push("/");
        });
    };

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

    let content;
    let isCompleted = false;
    let isCorrect = false;
    
    if (session.completedOn) {
        return (
            <LessonCompletion
                name={lesson.name}
                correctPercentage={session.correctPercentage}
            />
        );
    }

    if (exercise.isLoading === true) {
        content = (
            <div className={style.loaderWrapper}>
                <Loader
                    type="ThreeDots"
                    color="black"
                    width={200}
                    height={200}
                />
            </div>
        );
    } else {
        isCompleted = exercise.isCompleted;
        isCorrect = exercise.isCorrect;

        if (exercise.type === "multiple choice question") {
            content = (
                <MultipleChoiceQuestion
                    {...exercise}
                    sessionId={sessionId}
                    title={lesson.name}
                    remainingSeconds={remainingSeconds}
                    completed={completed}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }

        if (exercise.type === "record audio") {
            content = (
                <RecordAudio
                    {...exercise}
                    title={lesson.name}
                    completed={completed}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }

        if (exercise.type === "memory game") {
            content = (
                <MemoryGame
                    {...exercise}
                    sessionId={sessionId}
                    title={lesson.name}
                    remainingSeconds={remainingSeconds}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }

        if (exercise.type === "fill table") {
            content = (
                <FillTable
                    {...exercise}
                    sessionId={sessionId}
                    title={lesson.name}
                    remainingSeconds={remainingSeconds}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }

        if (exercise.type === "match pairs") {
            content = (
                <MatchPairs
                    {...exercise}
                    sessionId={sessionId}
                    title={lesson.name}
                    remainingSeconds={remainingSeconds}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }

        if (exercise.type === "transcribe") {
            content = (
                <Transcribe
                    {...exercise}
                    sessionId={sessionId}
                    title={lesson.name}
                    remainingSeconds={remainingSeconds}
                    onNextOne={onNextOne}
                    onQuit={onQuit}
                />
            );
        }
    }

    return (
        <div
            className={`${style.course_session} ${
                isCompleted ? (isCorrect ? style.right : style.wrong) : ""
            }`}
        >
            {content}
            <div className={style.progress}>
                <ProgressBar width={20} completed={completed} />
            </div>
        </div>
    );
};

export default CourseSession;
