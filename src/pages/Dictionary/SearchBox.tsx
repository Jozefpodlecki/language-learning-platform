import { getPhrases } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState,
} from "react";
import style from "./searchBox.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Item from "./Item";

type Props = {
    filter: {
        value: string;
        enabled: boolean;
    }
    onChange(value: any): void;
}

const SearchBox: FunctionComponent<Props> = ({
    filter,
    onChange,
}) => {

    const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        onChange({[name]: value});
    }

    const _onFilterChange = () => onChange({enabled: !filter.enabled})


    return <div className={style.searchbox}>
        <input
            className={style.input}
            type="text"
            name="value"
            value={filter.value}
            placeholder="Search..."
            onChange={_onChange}/>
        {filter.enabled ? null : <div className={style.filter} onClick={_onFilterChange}>
            <FontAwesomeIcon icon={faFilter}/>
        </div>}
    </div>
}

export default SearchBox;