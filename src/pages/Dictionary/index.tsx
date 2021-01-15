import * as actions from "actions";
import { createSession, getPhrases } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter, faGraduationCap, faRetweet, faSearch, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useSelector } from "hooks/useSelector";
import ActionButton from "components/ActionButton";
import React, {
    ChangeEvent,
    CSSProperties,
    FunctionComponent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import style from "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { playAudioWithSpeechSynthesis } from "appUtils";

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

    return <tr className={style.item}>
        <td className={style.phrase}>
            {props.radical ? <div>{props.radical}</div> : null}
            {props.hanzi ? <div>{props.hanzi}</div> : null}
            <div className={style.playIcon} onClick={onPlay}>
                <FontAwesomeIcon icon={faVolumeUp}/>
            </div>
        </td>
        <td className={style.meaning}>
            <div>{props?.meaning}</div>
            <div>{props?.meanings ? props?.meanings.map(meaning => <div key={meaning}>
                {meaning}
            </div>) : null}</div>
        </td>
    </tr>
}

const Dictionary: FunctionComponent = () => {
    const dispatch = useDispatch();
    const [{
        filter,
        value,
        items,
    }, setState] = useState({
        filter: {
            direction: "left",
            sourceLanguage: "",
            destinationLanguage: "",
            enabled: false,
        },
        value: "",
        items: [],
    })

    useEffect(() => {
        

        getPhrases({
            text: value,
            page: 0,
        }).then(items => {
            setState(state => ({
                ...state,
                items,
            }))
        })

    }, [value]);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setState(state => ({...state,
            [name]: value,
        }));
    }

    const onFilter = () => {
        setState(state => ({
            ...state,
            filter: {
                ...state.filter,
                enabled: true
            }
        }));
    }

    const onChangeLanguageFilter = () => {
        const directions = ["left", "right", "both"];
        let index = directions.findIndex(pr => pr === filter.direction) + 1

        if(index >= directions.length) {
            index = 0;
        }
        
        const direction = directions[index];

        setState(state => ({
            ...state,
            filter: {
                ...state.filter,
                direction,
            }
        }));
    }

    return (
        <div className={style.container}>
            <div>
                <div className={style.searchbox}>
                    <input
                        className={style.input}
                        type="text"
                        name="value"
                        value={value}
                        placeholder="Search..."
                        onChange={onChange}/>
                    {filter.enabled ? null : <div className={style.filter} onClick={onFilter}>
                        <FontAwesomeIcon icon={faFilter}/>
                    </div>}
                </div>
                {filter.enabled ? <div>
                    <div>
                        <div>Language</div>
                        <div className={style.languageFilter}>
                            <div>
                                <input
                                    className={style.input}
                                    type="text"
                                    name="sourceLanguage"
                                    value={filter.sourceLanguage}
                                    placeholder="From language..."
                                    onChange={onChange}/>
                            </div>
                            <div onClick={onChangeLanguageFilter} className={style.languageFilterIcon}>
                                {filter.direction === "left" ? 
                                    <FontAwesomeIcon icon={faArrowLeft}/> : filter.direction === "right" ? 
                                        <FontAwesomeIcon icon={faArrowRight}/> : 
                                        <FontAwesomeIcon icon={faArrowsAltH}/>}
                            </div>
                            <div>
                                <input
                                    className={style.input}
                                    type="text"
                                    name="destinationLanguage"
                                    value={filter.destinationLanguage}
                                    placeholder="To language..."
                                    onChange={onChange}/>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>
            <table className={style.items}>
                <tbody>
                    <tr className={style.header}>
                        <td className={style.headerCell}>Phrase</td>
                        <td className={style.headerCell}>Meaning/meanings</td>
                    </tr>
                    {items.map(pr => <Item key={pr.id} {...pr}/>)}
                </tbody>
            </table>
        </div>
    );
};

export default Dictionary;
