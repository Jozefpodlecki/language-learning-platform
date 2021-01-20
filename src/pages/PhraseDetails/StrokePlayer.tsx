import { getPhrase, getPhrases } from "api";
import { useDispatch } from "react-redux";
import React, {
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./index.scss";
import { useParams } from "react-router";
import { encode, decode } from "js-base64";
import ReactPlayer from 'react-player'
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    stroke: string;
}

const Player: FunctionComponent<Props> = ({
    stroke,
}) => {
    const [{
        isPlaying
    }, setState] = useState({
        isPlaying: false,
    })
    const [overlayStyle, setStyle] = useState({});
    const playerRef = useRef<HTMLDivElement>();
    const videoRef = useRef<HTMLVideoElement>();

    const resizeOverlay = () => {
        const element = playerRef.current;

        const { width, height} = element.getBoundingClientRect();

        setStyle({
            width: `${width}px`,
            height: `${height}px`,
        });
    }
    
    useEffect(() => {
        resizeOverlay();
    }, [playerRef]);

    const onEnded = () => {
        const element = videoRef.current;
        element.currentTime = 0;
        setState(state => ({...state, isPlaying: false}));
    };

    const onLoadedData = () => {
        resizeOverlay();
    };

    const onPlay = () => {
        videoRef.current.play();
        setState(state => ({...state, isPlaying: true}));
    }

    return <div ref={playerRef} className={style.player}>
        <video ref={videoRef} width="200" onEnded={onEnded} onLoadedData={onLoadedData}>
            <source src={stroke}
                type="video/webm"/>
        </video>
        {!isPlaying ? <div style={overlayStyle} className={style.playOverlay} onClick={onPlay}>
            <div>
                <FontAwesomeIcon icon={faPlay}/>
            </div>
        </div> : null}
    </div>;
};

export default Player;
