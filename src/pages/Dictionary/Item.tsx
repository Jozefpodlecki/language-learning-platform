import { faInfo, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import React, {
    FunctionComponent,
} from "react";
import style from "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { playAudioWithSpeechSynthesis } from "appUtils";
import { Link } from "react-router-dom";

type Props = {
    id: string;
    type: "radical" | "character";
    radical?: string;
    meaning?: string;
    meanings?: string[];
    hanzi?: string;
    pinyin?: string;
    pinyin1?: string;
    radicals?: string[];
}

const Item: FunctionComponent<Props> = (props) => {

    const onPlay = () => {
        playAudioWithSpeechSynthesis("zh", props.hanzi)
    }

    const canPlayAudio = !!props.hanzi;

    return <tr className={style.item}>
        <td className={style.phraseCell}>
            <div className={style.phrase}>
                {props.radical ? <div>{props.radical}</div> : null}
                {props.hanzi ? <div>{props.hanzi}</div> : null}
                {canPlayAudio ? <div className={style.playIcon} onClick={onPlay}>
                    <FontAwesomeIcon icon={faVolumeUp}/>
                </div> : null}
            </div>
        </td>
        <td className={style.meaning}>
            <div>
                {props.meaning ? <div>{props.meaning}</div> : null}
                <div>
                    {props.meanings ? props.meanings.slice(0, 2).map(meaning => <div key={meaning}>{meaning}</div>) : null}
                </div>
            </div>
        </td>
        <td className={style.detailsCell}>
            <div className={style.details}>
                <Link to={`/dictionary/${props.id}`}>
                    <FontAwesomeIcon icon={faInfo}/>
                </Link>
            </div>
        </td>
    </tr>
}

export default Item;