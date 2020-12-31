import * as actions from "actions";
import { createSession } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter, faGraduationCap, faRetweet, faSearch } from "@fortawesome/free-solid-svg-icons";
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
            <div className={style.items}>
                {items.map(pr => <div key={pr.id}>

                </div>)}
            </div>
        </div>
    );
};

export default Dictionary;
