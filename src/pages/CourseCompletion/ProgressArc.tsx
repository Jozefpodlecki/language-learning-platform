import { percentageToArc } from "appUtils";
import React, {
    CSSProperties,
    FunctionComponent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import style from "./index.scss";

type Props = {
    correctPercentage: number;
};

const ProgressArc: FunctionComponent<Props> = ({ correctPercentage }) => {
    const textRef = useRef<SVGTextElement>();
    const [textStyle, setTextStyle] = useState<CSSProperties>({
        opacity: 0,
    });
    const circleRef = useRef<SVGCircleElement>();
    const [path, setPath] = useState("");

    useEffect(() => {
        const { width, height } = textRef.current.getBBox();
        setTextStyle({
            transform: `translateX(-${width / 2}px) translateY(${
                height / 4
            }px)`,
            opacity: 1,
        });
    }, [textRef]);

    useEffect(() => {
        const { width } = circleRef.current.getBBox();
        const radius = width / 2;
        const path = percentageToArc(correctPercentage, radius);

        setPath(path);
    }, [correctPercentage, circleRef]);

    const percentage = useMemo(
        () => `${(correctPercentage * 100).toFixed(0)}%`,
        [correctPercentage]
    );

    const progressArcStyle = useMemo(
        () => ({ strokeDashoffset: path ? "0" : "300" }),
        [path]
    );

    const strokeWidth = 9;

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            shapeRendering="geometricPrecision"
        >
            <circle
                ref={circleRef}
                cx="50%"
                cy="50%"
                r="45%"
                stroke="lightgray"
                strokeWidth={strokeWidth}
                fill="transparent"
            />
            <path
                style={progressArcStyle}
                className={style.progressArc}
                d={path}
                fill="transparent"
                stroke="greenyellow"
                strokeWidth={strokeWidth}
            />
            <text style={textStyle} ref={textRef} x="50%" y="50%">
                {percentage}
            </text>
        </svg>
    );
};

export default ProgressArc;
