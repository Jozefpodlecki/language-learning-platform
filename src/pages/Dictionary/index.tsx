import { getPhrases } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import style from "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Item from "./Item";

const Dictionary: FunctionComponent = () => {
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
                <thead>
                    <tr className={style.header}>
                        <td className={style.headerCell}>Phrase</td>
                        <td className={style.headerCell}>Meaning/meanings</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {items.map(pr => <Item key={pr.id} {...pr}/>)}
                </tbody>
            </table>
        </div>
    );
};

export default Dictionary;
