import * as actions from "actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowCircleLeft,
    faArrowCircleRight,
    faArrowsAltV,
    faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import {
    getCourseAsync,
    getCourseDatasetAsync,
    getCourseMetadataAsync,
} from "api";
import { playAudioWithSpeechSynthesis, random } from "appUtils";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useSelector } from "hooks/useSelector";
import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useState } from "react";
import style from "./index.scss";

const CourseFlashcards: FunctionComponent = () => {
    const dispatch = useDispatch();
    const {
        pages: {
            course: { course, metadata },
        },
    } = useSelector((state) => state);
    const { courseId } = useParams<{
        courseId: string;
    }>();
    const [{ current, flipped, indicies }, setState] = useState({
        current: 0,
        flipped: false,
        indicies: [0],
    });

    useEffect(() => {
        if (course.isLoading === true || course.id !== courseId) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });
            return;
        }

        if (metadata.isLoading === true || metadata.courseId !== courseId) {
            getCourseMetadataAsync(courseId).then((metadata) => {
                dispatch(actions.getCourseMetadata.success(metadata));
            });
        }

        if (course.dataset.isLoading === true) {
            getCourseDatasetAsync(courseId).then((dataset) => {
                dispatch(actions.getCourseDataset.success(dataset));
            });
        }
    }, [course]);

    if (
        course.isLoading === true ||
        course.dataset.isLoading === true ||
        metadata.isLoading === true
    ) {
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

    const onFlip = () => {
        setState((state) => ({ ...state, flipped: !state.flipped }));
    };

    const onPrev = () => {
        if (course.dataset.isLoading === true) {
            return;
        }

        const newCurrent = current - 1;

        setState((state) => ({
            ...state,
            flipped: false,
            current: newCurrent > 0 ? newCurrent : indicies.length - 1,
        }));
    };

    const onNext = () => {
        if (course.dataset.isLoading === true) {
            return;
        }

        const index = random(0, course.dataset.length);
        setState((state) => ({
            ...state,
            flipped: false,
            current: state.current + 1,
            indicies: [...state.indicies, index],
        }));
    };

    const onPlayAudio = () => {
        const key = item[flashcards.key];
        playAudioWithSpeechSynthesis("zh", key);
    };

    const index = indicies[current];
    const item = course.dataset[index];
    const flashcards = metadata.flashcards;
    const key = item[flashcards.key];
    const value = item[flashcards.value];

    return (
        <div className={style.container}>
            <div className={style.header}>{course.name}</div>
            <div className={style.content}>
                <div className={style.bar}>
                    <div className={style.button} onClick={onPrev}>
                        <div>Previous</div>
                        <div className={style.buttonIcon}>
                            <FontAwesomeIcon icon={faArrowCircleLeft} />
                        </div>
                    </div>
                </div>
                <div className={style.flashcard}>
                    <div className={style.wrapper}>
                        <div>
                            {flipped ? (
                                <div>
                                    <div className={style.key}>{key}</div>
                                    <div className={style.value}>{value}</div>
                                </div>
                            ) : (
                                <div className={style.key}>{key}</div>
                            )}
                            <div>
                                <div
                                    className={style.button}
                                    onClick={onPlayAudio}
                                >
                                    <FontAwesomeIcon icon={faVolumeUp} />
                                </div>
                            </div>
                        </div>
                        <div className={style.actions}>
                            <div className={style.button} onClick={onFlip}>
                                <div>Flip</div>
                                <div className={style.buttonIcon}>
                                    <FontAwesomeIcon icon={faArrowsAltV} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.bar}>
                    <div className={style.button} onClick={onNext}>
                        <div>Next</div>
                        <div className={style.buttonIcon}>
                            <FontAwesomeIcon icon={faArrowCircleRight} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseFlashcards;
