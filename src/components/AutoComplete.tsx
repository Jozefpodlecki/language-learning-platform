import { getLanguages, getPhrases } from "api";
import { faArrowLeft, faArrowRight, faArrowsAltH, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import React, {
    ChangeEvent,
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./autocomplete.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Item = {
    id: string;
    imageUrl: string;
    value: string;
}

type Props = {
    name: string;
    placeholder: string;
    item?: Item
    onSelect(item: Item, property: string): void;
}

const AutoComplete: FunctionComponent<Props> = ({
    name,
    placeholder,
    item: _item,
    onSelect,
}) => {
    const [{
        item,
        suggestions,
        value,
        isShowing,
    }, setState] = useState({
        item: _item,
        isShowing: false,
        suggestions: [],
        value: "",
    })
    const inputRef = useRef<HTMLInputElement>();
    const wrapperRef = useRef<HTMLDivElement>();

    useEffect(() => {

        if(!isShowing) {
            return;
        }

        function onGlobalClick(event: Event) {
            const element = event.target as HTMLElement;

            if(!wrapperRef.current.contains(element)) {
                setState(state => ({...state, isShowing: false}))
            }
        }

        window.addEventListener("click", onGlobalClick)

        return () => window.removeEventListener("click", onGlobalClick)
    }, [isShowing, wrapperRef]);

    useEffect(() => {
        setState(state => ({...state, item: _item}))
    }, [_item]);

    useEffect(() => {
        getLanguages({
            page: 0,
            name: value,
        })
            .then(pr => {
                setState(state => ({...state, suggestions: pr}))
            })
    }, [value]);

    useEffect(() => {
        if(isShowing) {
            inputRef.current.focus();
        }
    }, [isShowing, inputRef]);

    const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        setState(state => ({...state, value}))
    }

    const onFocus = () => {
        setState(state => ({...state, isShowing: true}))
    }

    const onSuggestionClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const { id } = event.currentTarget.dataset;
        const suggestion = suggestions.find(pr => pr.id === id);
        onSelect(suggestion, name);
        setState(state => ({...state, isShowing: false}));
    }

    const onItemClick = () => {
        setState(state => ({...state,
            item: undefined,
            isShowing: true,
        }))
    }

    return <div ref={wrapperRef}>
        {item ? <div>
            <div className={style.item}
                onClick={onItemClick}
                style={{
                    width: "120px",
                    height: "50px",
                    background: `url(${item.imageUrl}) center center / cover no-repeat`
                }}></div>
            <div className={style.text}>{item.value}</div>
        </div> : <input
            ref={inputRef}
            className={style.input}
            type="text"
            name={name}
            value={value}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={_onChange}/>}
            {isShowing ? <div className={style.suggestionList}>{suggestions.map(pr => <div
                key={pr.id}
                data-id={pr.id}
                onClick={onSuggestionClick}
                className={style.suggestion}>
                <div style={{
                    width: "120px",
                    height: "50px",
                    background: `url(${pr.imageUrl}) center center / cover no-repeat`
                }}></div>
                <div className={style.text}>{pr.name}</div>
            </div>)}</div> : null}
    </div>
}

export default AutoComplete;