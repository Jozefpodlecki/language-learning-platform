import React, { FunctionComponent } from "react";
import * as actions from "actions";
import style from "./multipleChoiceQuestion.scss";
import { MCQItem } from "models/CourseItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRunning } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { sendAnswer } from "api";
import { useSelector } from "hooks/useSelector";

type Props = MCQItem & {
    sessionId: string;
    title: string,
    hasSubmit: boolean;
    completed: number;
    onQuit(): void;
};

const MultipleChoiceQuestion: FunctionComponent<Props> = ({
    id,
    sessionId,
    title,
    question,
    hasSubmit,
    answers,
    onQuit,
}) => {
    const dispatch = useDispatch();
    const {
        hasSelected,
        selectedAnswerId,
    } = useSelector((state) => state.courseSession);
    
    const onClick = (answerId: string) => {
        dispatch(actions.selectAnswer({
            answerId,
            itemId: id,
        }))
    }

    const onCheck = () => {
        if(!hasSelected) {
            return;
        }

        sendAnswer(sessionId, selectedAnswerId)
            .then(item => {
                dispatch(actions.sendAnswer.success(item))
            })
    }

    return <div className={style.quiz}>
        <div className={style.title}>{title}</div>
        <div className={style.item}>
            <div className={style.question}>{question}</div>
            <div className={style.answers}>
                {answers.map(({ id, isSelected, isCorrect, value }, index) => <div
                    className={`${style.answer}
                        ${ isSelected ? style.selected : "" }
                        ${ hasSubmit ? isCorrect ? style.right : style.wrong : "" }`}
                    onClick={() => onClick(id)}
                    key={index}>
                        <div className={style.answerText}>{value}</div>
                        <div className={style.answerKey}>{index}</div>
                    </div>)}
            </div>
        </div>
        <div className={style.actions}>
            <div className={style.actionButton} onClick={onQuit}>
                <div>Quit</div>
                <div className={style.actionIcon}>
                    <FontAwesomeIcon icon={faRunning}/>
                </div>
            </div>
            <div className={style.actionButton}>
                <div>Next one</div>
            </div>
            <div className={`${style.actionButton} ${ hasSelected ? "" : style.actionButtonDisabled}`}
                onClick={onCheck}>
                <div>Check</div>
                <div className={style.actionIcon}>
                    <FontAwesomeIcon icon={faCheck}/>
                </div>
            </div>
        </div>
    </div>
};

export default MultipleChoiceQuestion;
