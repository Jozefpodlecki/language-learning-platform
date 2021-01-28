import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { playAudioWithSpeechSynthesis } from "appUtils";
import React, { FunctionComponent, MouseEvent, useState } from "react";
import style from "./answer.scss";

type Props = {
    id: string;
    value: string;
    isSelected: boolean;
    isCorrect: boolean;
    hasSubmit: boolean;
    index: number;
    onClick(id: string): void;
};

const Answer: FunctionComponent<Props> = ({
    id,
    value,
    isSelected,
    isCorrect,
    hasSubmit,
    index,
    onClick,
}) => {
    const [isPlaying, setPlaying] = useState(false);
    const _onClick = (event: MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;

        onClick(id);
    };

    const languageId = "zh";
    const canPlayAudio = true;

    const onPlay = () => {
        setPlaying(true);
        playAudioWithSpeechSynthesis(languageId, value).then((pr) => {
            setPlaying(false);
        });
    }

    return (
        <div
            data-id={id}
            className={`${style.answer}
            ${isSelected ? style.selected : ""}
            ${hasSubmit ? (isCorrect ? style.right : style.wrong) : ""}`}
            onClick={_onClick}
            key={id}
        >
            <div className={style.text}>
                <div>{value}</div>
                {canPlayAudio ? <div className={style.playIcon} onClick={onPlay}>
                    <FontAwesomeIcon icon={faVolumeUp}/>
                </div> : null}
            </div>
            <div className={style.key}>{index + 1}</div>
        </div>
    );
};

export default Answer;
