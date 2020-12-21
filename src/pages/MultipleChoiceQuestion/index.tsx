import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import * as actions from "actions";
import style from "./index.scss";
import { MCQItem } from "models/CourseItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faRunning, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { moveNext, sendAnswer } from "api";
import { useSelector } from "hooks/useSelector";
import Answer from "./Answer";
import ActionButton from "components/ActionButton";
import { hasBuiltInSpeechSynthesis, playAudioWithSpeechSynthesis } from "appUtils";
import Loader from "react-loader-spinner";

type Props = MCQItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    completed: number;
    hasSelected: boolean;
    selectedAnswerId: string;
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
    answer,
    hasSelected,
    selectedAnswerId,
    remainingSeconds,
    onQuit,
}) => {
    const dispatch = useDispatch();
    const [isPlaying, setPlaying] = useState(false);

    const onKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        const answerIndex = Number(key);
        if(Number.isNaN(answerIndex)) {
            if(hasSelected && key === "Enter") {

                dispatch(actions.sendAnswer.request());

                const answer = answers.find((pr) => selectedAnswerId === pr.id)

                sendAnswer(sessionId, answer)
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

        dispatch(actions.sendAnswer.request());

        const answer = answers.find((pr) => selectedAnswerId === pr.id)

        sendAnswer(sessionId, answer)
            .then(item => {
                dispatch(actions.sendAnswer.success(item))
            })
    }

    const onNextOne = () => {
        dispatch(actions.nextItem.request())

        moveNext(sessionId)
            .then(session => {
                actions.nextItem.success(session);
            });
    }

    const onPlayAudio = () => {
        if(hasBuiltInSpeechSynthesis) {
            setPlaying(true);
            playAudioWithSpeechSynthesis("zh", question.value)
                .then(pr => {
                    setPlaying(false);
                })
        }
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div data-id={id} className={style.item}>
            {isCompleted ? isCorrect ? 
                <div className={style.answer}>
                    <div className={style.title}>Right!</div>
                    <div className={style.rightAnswer}>It is <b>{rightAnswer.value}</b></div>
                </div> :
                <div className={style.answer}>
                    <div className={style.title}>Wrong!</div>
                    <div className={style.rightAnswer}>The right answer is <b>{rightAnswer.value}</b></div>
                </div> : null}
            <div className={style.question}>
                {question.value}
            </div>
            {isPlaying ? <Loader
                type="ThreeDots"
                color="black"
                width={50}
                height={50}/> : <ActionButton
                value="Play"
                onClick={onPlayAudio}
                icon={faVolumeUp}
            />}
            {hasSubmit ? null : <div className={style.answers}>
                {answers.map((answer, index) => <Answer
                    {...answer}
                    key={answer.id}
                    index={index}
                    hasSubmit={hasSubmit}
                    onClick={onClick}/>)}
            </div>}
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
