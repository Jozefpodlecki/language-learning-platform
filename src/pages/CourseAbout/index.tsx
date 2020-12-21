import * as actions from "actions";
import React, { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";

import style from "./index.scss";
import Loader from "react-loader-spinner";
import { getCourseAsync, getCourseDatasetAsync } from "api";
import { useParams } from "react-router";
import Navbar from "../Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ChineseRadicalsItemTemplate from "./ChineseRadicalsItemTemplate";

const CourseAbout: FunctionComponent = () => {
    const {
        pages: {
            course: {
                course
            }
        }
    } = useSelector((state) => state);

    const dispatch = useDispatch();
    const { courseId } = useParams<{
        courseId: string;
    }>();
    const [{
        value,
        items,
        pageSize,
        page,
    }, setState] = useState({
        value: "",
        items: [],
        pageSize: 30,
        page: 0,
    });

    useEffect(() => {
        if(course.isLoading === true) {
            getCourseAsync(courseId)
                .then(course => {
                    dispatch(actions.getCourse.success(course));
                })
        }
        else {
            if(course.dataset.isLoading === true) {
                getCourseDatasetAsync(courseId)
                    .then(dataset => {
                        dispatch(actions.getCourseDataset.success(dataset));
                    })
            }
        }

    }, [course])

    useEffect(() => {
        if(course.isLoading === true || course.dataset.isLoading === true) {
            return;
        }

        let items: any[] = course.dataset;

        if(value) {
            items = items.filter(pr => pr.meaning.includes(value));
        }

        const from = page * pageSize;
        items = items.slice(from, from + pageSize)

        setState(state => ({...state, items}))
    }, [course, value]);

    if(course.isLoading === true) {
        return <div>
            <Loader
                type="ThreeDots"
                color="black"
                width={200}
                height={200}/>
        </div>
    }

    if(course.dataset.isLoading === true) {
        return <div>
            <Loader
                type="ThreeDots"
                color="black"
                width={200}
                height={200}/>
        </div>
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;

        setState(state => ({...state, value}));
    }

    let ItemTemplate: FunctionComponent;

    if(course.name === "Chinese Radicals") {
        ItemTemplate = ChineseRadicalsItemTemplate;
    }

    return <div>
        <Navbar/>
        <div className={style.header}>
            <Link className={style.back} to="/">
                <FontAwesomeIcon icon={faArrowLeft}/>
                <div className={style.backTitle}>Back</div>
            </Link>
            <div className={style.title}>{course.name}</div>
        </div>
        <div className={style.sectionHeader}>Dataset</div>
        <div className={style.searchbox}>
            <input
                className={style.input}
                type="text"
                value={value}
                placeholder="Search"
                onChange={onChange}/>
        </div>
        <div className={style.list}>
            {items.map(pr => <ItemTemplate {...pr}/>)}
        </div>
    </div>
};

export default CourseAbout;
