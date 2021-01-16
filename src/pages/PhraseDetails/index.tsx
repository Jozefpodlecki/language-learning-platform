import { getPhrases } from "api";
import { useDispatch } from "react-redux";
import React, {
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import style from "./index.scss";

const PhraseDetails: FunctionComponent = () => {
    const [{
        value,
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

    return (
        <div className={style.container}>
            
        </div>
    );
};

export default PhraseDetails;
