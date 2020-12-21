import React, { CSSProperties, FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

import style from "./index.scss";

type Props = {
    correctPercentage: number;
}

const ProgressArc: FunctionComponent<Props> = ({
    correctPercentage
}) => {
    const textRef = useRef<SVGTextElement>();
    const [textStyle, setTextStyle] = useState<CSSProperties>({
        opacity: 0,
    });
    const circleRef = useRef<SVGCircleElement>();
    const [path, setPath] = useState("");
    
    useEffect(() => {
        const { width, height } = textRef.current.getBBox();
        setTextStyle({
            transform: `translateX(-${width/2}px) translateY(${height/4}px)`,
            opacity: 1,
        });
    }, [textRef]);

    useEffect(() => {
        const { width } = circleRef.current.getBBox()
        const radius = width / 2;

        let d = "";
        const startX = 50;
        const startY = 50;
        const step = (1 / 180) * Math.PI;

        let radians = -90 * step;
        let x = startX + Math.cos(radians) * radius;
        let y = startY + Math.sin(radians) * radius;

        const steps = Math.floor(correctPercentage * 360);
        
        d += ` M ${x} ${y}`;

        for(const _ of Array(steps)) {
            radians += step;

            x = startX + Math.cos(radians) * radius;
            y = startY + Math.sin(radians) * radius;

            d += ` L ${x} ${y}`;
        }

        setPath(d);

    }, [correctPercentage, circleRef]);

    const percentage = useMemo(() => 
        `${(correctPercentage * 100).toFixed(0)}%`, 
    [correctPercentage]);

    return <svg viewBox="0 0 100 100" preserveAspectRatio="none" shapeRendering="geometricPrecision">
        <circle ref={circleRef} cx="50%" cy="50%" r="45%"
            stroke="lightgray"
            strokeWidth="9"
            fill="transparent"/>
        <path
            style={{strokeDashoffset: path ? "0" : "300"}}
            className={style.progressArc} d={path}
            fill="transparent"
            stroke="greenyellow"
            strokeWidth="9"/>
        <text style={textStyle} ref={textRef} x="50%" y="50%">{percentage}</text>
        </svg>
    }

export default ProgressArc;