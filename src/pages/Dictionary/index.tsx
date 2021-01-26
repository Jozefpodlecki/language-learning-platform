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
import LanguageFilter from "./LanguageFilter";
import SearchBox from "./SearchBox";
import Navbar from "pages/Navbar";
import { playAudioWithSpeechSynthesis } from "appUtils";
import { Filter } from "./Filter";

const Dictionary: FunctionComponent = () => {
    const [{
        filter,
        items,
        isLoading,
    }, setState] = useState<{
        filter: Filter,
        items: any[],
        isLoading: boolean
    }>({
        filter: {
            direction: "left",
            sourceLanguage: undefined,
            destinationLanguage: undefined,
            enabled: true,
            value: "",
        },
        items: [],
        isLoading: false,
    })

    useEffect(() => {
        if(!filter.value) {
            return;
        }

        setState(state => ({...state, isLoading: true}));
       
        getPhrases({
            text: filter.value,
            sourcelanguageId: "zh",
            destlanguageId: "en",
            page: 0,
        }).then(items => {
            setState(state => ({
                ...state,
                items,
                isLoading: false,
            }))
        })

    }, [filter.value]);

    const onChange = (filter: Filter) => {
        setState(state => ({
            ...state,
            filter: {
                ...state.filter,
                ...filter
            },
        }));
    }
   
    return (
        <div className={style.container}>
            <Navbar />
            <div className={style.content}>
                <div className={style.panel}>
                    <SearchBox
                        filter={filter}
                        onChange={onChange}/>
                    {filter.enabled ? <div>
                        <div>
                            <div className={style.label}>Filter by language...</div>
                            <LanguageFilter
                                filter={filter}
                                onChange={onChange}/>
                        </div>
                    </div> : null}
                </div>
                <div className={style.results}>
                    {!isLoading && items.length ? <table className={style.items}>
                        <thead>
                            <tr className={style.header}>
                                <td className={style.headerCell}>Phrase</td>
                                <td className={style.headerCell}>Meaning/meanings</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? <tr>
                                <td>Loading...</td>
                            </tr> : items.map(pr => <Item key={pr.id} {...pr}/>)}
                        </tbody>
                    </table> : null}
                </div>
            </div>
        </div>
    );
};

export default Dictionary;
