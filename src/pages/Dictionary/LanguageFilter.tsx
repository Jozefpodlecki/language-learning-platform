import { getPhrases } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import style from "./languageFilter.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    filter: {
        direction: string;
        sourceLanguage: string;
        destinationLanguage: string;
    }
    onChange(data: any): void;
}

const LanguageFilter: FunctionComponent<Props> = ({
    filter,
    onChange,
}) => {
    const onChangeLanguageFilter = () => {
        const directions = ["left", "right", "both"];
        let index = directions.findIndex(pr => pr === filter.direction) + 1

        if(index >= directions.length) {
            index = 0;
        }
        
        const direction = directions[index];

        onChange({direction});
    }

    const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        onChange(({[name]: value}));
    }

    const onClose = () => onChange(({enabled: false}));

    return <div className={style.languageFilter}>
        <div className={style.filterPanel}>
            <div className={style.languageFilterIcon} onClick={onClose}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
        </div>
        <div className={style.content}>
            <div>
                <input
                    className={style.input}
                    type="text"
                    name="sourceLanguage"
                    value={filter.sourceLanguage}
                    placeholder="From language..."
                    onChange={_onChange}/>
            </div>
            <div className={style.switchPanel}>
                <div onClick={onChangeLanguageFilter} className={style.languageFilterIcon}>
                    {filter.direction === "left" ? 
                        <FontAwesomeIcon icon={faArrowLeft}/> : filter.direction === "right" ? 
                            <FontAwesomeIcon icon={faArrowRight}/> : 
                            <FontAwesomeIcon icon={faArrowsAltH}/>}
                </div>
            </div>
            <div>
                <input
                    className={style.input}
                    type="text"
                    name="destinationLanguage"
                    value={filter.destinationLanguage}
                    placeholder="To language..."
                    onChange={_onChange}/>
            </div>
        </div>
    </div>
}

export default LanguageFilter;