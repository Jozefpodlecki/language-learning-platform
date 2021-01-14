import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useState,
} from "react";

import { Dataset } from "models/dataset";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getCourseAsync } from "api";
import { useParams } from "react-router";
import ChineseRadicalsItemTemplate from "./ChineseRadicalsItemTemplate";
import FrenchItemTemplate from "./FrenchItemTemplate";
import Hsk1ItemTemplate from "./Hsk1ItemTemplate";
import Loader from "react-loader-spinner";
import Navbar from "../Navbar";
import style from "./index.scss";

const CourseAbout: FunctionComponent = () => {
    const {
        pages: {
            course: { course },
        },
    } = useSelector((state) => state);

    const dispatch = useDispatch();
    const { courseId } = useParams<{
        courseId: string;
    }>();
    const [{ value, items, pageSize, page }, setState] = useState({
        value: "",
        items: [],
        pageSize: 30,
        page: 0,
    });

    useEffect(() => {
        if (course.isLoading === true) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });

            return;
        }

        if (course.id !== courseId) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });
            return;
        }

        // if (course.dataset.isLoading === true) {
        //     getCourseDatasetAsync(courseId).then((dataset) => {
        //         dispatch(actions.getCourseDataset.success(dataset));
        //     });
        // }
    }, [course]);

    // useEffect(() => {
    //     if (course.isLoading === true || course.dataset.isLoading === true) {
    //         return;
    //     }

    //     let items: Dataset = course.dataset;

    //     let filter = (pr: any) => pr.meaning.includes(value);

    //     if (course.name.includes("HSK")) {
    //         filter = (pr: any) => pr.meanings.includes(value);
    //     }

    //     if (value) {
    //         items = items.filter(filter);
    //     }

    //     const from = page * pageSize;
    //     items = items.slice(from, from + pageSize);

    //     setState((state) => ({ ...state, items }));
    // }, [course, value]);

    // if (course.isLoading === true) {
    //     return (
    //         <div>
    //             <Loader
    //                 type="ThreeDots"
    //                 color="black"
    //                 width={200}
    //                 height={200}
    //             />
    //         </div>
    //     );
    // }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;

        setState((state) => ({ ...state, value }));
    };

    let ItemTemplate: FunctionComponent;

    // if (course.name === "Chinese Radicals") {
    //     ItemTemplate = ChineseRadicalsItemTemplate;
    // }

    // if (course.name.includes("HSK")) {
    //     ItemTemplate = Hsk1ItemTemplate;
    // }

    // if (course.name.includes("French")) {
    //     ItemTemplate = FrenchItemTemplate;
    // }

    return (
        <div>
            <Navbar />
            <div className={style.header}>
                <Link className={style.back} to="/">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <div className={style.backTitle}>Back</div>
                </Link>
                {/* <div className={style.title}>{course.name}</div> */}
            </div>
            <div className={style.sectionHeader}>Dataset</div>
            {/* {course.dataset.isLoading === true ? (
                <Loader
                    type="ThreeDots"
                    color="black"
                    width={200}
                    height={200}
                />
            ) : (
                <>
                    <div className={style.searchbox}>
                        <input
                            className={style.input}
                            type="text"
                            value={value}
                            placeholder="Search"
                            onChange={onChange}
                        />
                    </div>
                    <div className={style.list}>
                        {items.map((pr) => (
                            <ItemTemplate key={pr.id} {...pr} />
                        ))}
                    </div>
                </>
            )} */}
        </div>
    );
};

export default CourseAbout;
