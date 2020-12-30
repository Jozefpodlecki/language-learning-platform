import * as actions from "actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item as MCQItem } from "models/Exercise";
import {
    faArrowRight,
    faCheck,
    faRunning,
    faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import {
    hasBuiltInSpeechSynthesis,
    playAudioWithSpeechSynthesis,
} from "appUtils";
import { moveToNextExercise, sendAnswer } from "api";
import { useDispatch } from "react-redux";
import ActionButton from "components/ActionButton";
import Answer from "./Answer";
import Loader from "react-loader-spinner";
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState,
} from "react";
import style from "./index.scss";

type Props = MCQItem & {
    sessionId: string;
    title: string;
    completed: number;
    hasSelected: boolean;
    selectedAnswerId: string;
    remainingSeconds: number;
    onNextOne(): void;
    onQuit(): void;
};

const MultipleChoiceQuestion: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    question,
    isCompleted,
    isCorrect,
    rightAnswer,
    answers,
    answer,
    hasSelected,
    selectedAnswerId,
    remainingSeconds,
    canPlayAudio,
    onNextOne,
    onQuit,
}) => {
    const dispatch = useDispatch();
    const [isPlaying, setPlaying] = useState(false);

    const onKeyDown = (event: KeyboardEvent) => {
        const key = event.key;
        const answerIndex = Number(key);
        if (Number.isNaN(answerIndex)) {
            if (hasSelected && key === "Enter") {
                dispatch(actions.sendAnswer.request());

                const answer = answers.find((pr) => selectedAnswerId === pr.id);

                sendAnswer(sessionId, id, answer).then((item) => {
                    dispatch(actions.sendAnswer.success(item));
                });
            }
        } else {
            const answer = answers.find(
                (pr, index) => answerIndex === index + 1
            );

            if (!answer) {
                return;
            }

            dispatch(
                actions.selectAnswer({
                    answerId: answer.id,
                    itemId: id,
                })
            );
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [hasSelected]);

    const onClick = useCallback((answerId: string) => {
        dispatch(
            actions.selectAnswer({
                answerId,
                itemId: id,
            })
        );
    }, []);

    const onCheck = () => {
        if (!hasSelected) {
            return;
        }

        dispatch(actions.sendAnswer.request());

        const answer = answers.find((pr) => selectedAnswerId === pr.id);

        sendAnswer(sessionId, id, answer).then((item) => {
            dispatch(actions.sendAnswer.success(item));
        });
    };

    const onPlayAudio = () => {
        if (hasBuiltInSpeechSynthesis) {
            setPlaying(true);
            playAudioWithSpeechSynthesis("zh", question.value).then((pr) => {
                setPlaying(false);
            });
        }
    };

    return (
        <div className={style.quiz}>
            <div className={style.title}>{title}</div>
            <div data-id={id} className={style.item}>
                {isCompleted ? (
                    isCorrect ? (
                        <div className={style.answer}>
                            <div className={style.title}>Right!</div>
                            <div className={style.rightAnswer}>
                                It is <b>{rightAnswer.value}</b>
                            </div>
                        </div>
                    ) : (
                        <div className={style.answer}>
                            <div className={style.title}>Wrong!</div>
                            <div className={style.rightAnswer}>
                                The right answer is <b>{rightAnswer.value}</b>
                            </div>
                        </div>
                    )
                ) : null}
                <div className={style.question}>{question.value}</div>
                {canPlayAudio ? (
                    isPlaying ? (
                        <Loader
                            type="ThreeDots"
                            color="black"
                            width={50}
                            height={50}
                        />
                    ) : (
                        <ActionButton
                            value="Play"
                            onClick={onPlayAudio}
                            icon={faVolumeUp}
                        />
                    )
                ) : null}
                {isCompleted ? null : (
                    <div className={style.answers}>
                        {answers.map((answer, index) => (
                            <Answer
                                {...answer}
                                key={answer.id}
                                index={index}
                                hasSubmit={isCompleted}
                                onClick={onClick}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className={style.actions}>
                <ActionButton value="Quit" onClick={onQuit} icon={faRunning} />
                {isCompleted ? (
                    <ActionButton
                        value={`Next exercise in ${remainingSeconds}`}
                        onClick={onNextOne}
                        icon={faArrowRight}
                    />
                ) : (
                    <ActionButton
                        value="Next exercise"
                        onClick={onNextOne}
                        icon={faArrowRight}
                    />
                )}
                {isCompleted ? null : (
                    <ActionButton
                        disabled={!hasSelected}
                        value="Check"
                        onClick={onCheck}
                        icon={faCheck}
                    />
                )}
            </div>
        </div>
    );
};

export default MultipleChoiceQuestion;
