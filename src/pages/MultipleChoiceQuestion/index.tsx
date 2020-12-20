import React, { FunctionComponent, useCallback, useEffect } from "react";
import * as actions from "actions";
import style from "./index.scss";
import { MCQItem } from "models/CourseItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { moveNext, sendAnswer } from "api";
import { useSelector } from "hooks/useSelector";
import Answer from "./Answer";
import ActionButton from "components/ActionButton";

type Props = MCQItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    completed: number;
    remainingSeconds: number;
    onQuit(): void;
};

const MultipleChoiceQuestion: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    question,
    hasSubmit,
    isCompleted,
    isCorrect,
    rightAnswer,
    answers,
    onQuit,
    remainingSeconds,
}) => {
    const dispatch = useDispatch();
    const {
        hasSelected,
        selectedAnswerId,
    } = useSelector((state) => state.courseSession);

    const onKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        const answerIndex = Number(key);
        if(Number.isNaN(answerIndex)) {
            if(hasSelected && key === "Enter") {
                sendAnswer(sessionId, selectedAnswerId)
                    .then(item => {
                        dispatch(actions.sendAnswer.success(item))
                    })
            }
        }
        else {
            const answer = answers.find((pr, index) => answerIndex === index + 1)

            if(!answer) {
                return;
            }

            dispatch(actions.selectAnswer({
                answerId: answer.id,
                itemId: id,
            }));
        }
    }

    useEffect(() => {

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        }
    }, [hasSelected]);

    const onClick = useCallback((answerId: string) => {
        dispatch(actions.selectAnswer({
            answerId,
            itemId: id,
        }))
    }, []);

    const onCheck = () => {
        if(!hasSelected) {
            return;
        }

        sendAnswer(sessionId, selectedAnswerId)
            .then(item => {
                dispatch(actions.sendAnswer.success(item))
            })
    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                debugger;
                actions.nextItem.success(session);
            });
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div className={style.item}>
            {isCompleted ? isCorrect ? 
                <div className={style.answer}>Right!</div> :
                <div className={style.answer}>
                    <div>Wrong!</div>
                    <div>The right answer is {rightAnswer.value}</div>
                </div> : null}
            <div className={style.question}>{question.value}</div>
            <div className={style.answers}>
                {answers.map((answer, index) => <Answer
                    {...answer}
                    key={answer.id}
                    index={index}
                    hasSubmit={hasSubmit}
                    onClick={onClick}/>)}
            </div>
        </div>
        <div className={style.actions}>
            <ActionButton
                value="Quit"
                onClick={onQuit}
                icon={faRunning}/>
            {isCompleted ? <ActionButton
                value={`Next item in ${remainingSeconds}`}
                onClick={onNextOne}
                icon={faArrowRight}/> : <ActionButton
                value="Next item"
                onClick={onNextOne}
                icon={faArrowRight}/>}
            {isCompleted ? null : <ActionButton
                disabled={!hasSelected}
                value="Check"
                onClick={onCheck}
                icon={faCheck}/>}
        </div>
    </div>
};

export default MultipleChoiceQuestion;
