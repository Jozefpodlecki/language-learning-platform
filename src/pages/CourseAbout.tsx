import React, { FunctionComponent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";

import style from "./courseAbout.scss";

const CourseAbout: FunctionComponent = () => {
    const {
        course
    } = useSelector((state) => state.course);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(course.isLoading === true) {
        }

    }, [course])

    if(course.isLoading === true) {
        return <div>

        </div>
    }    

    return <div>
        <div>
            {course.dataset ? course.dataset.map(pr => <div
                key={pr.id}
                className={style.dataitem}>
                <div>{pr.radical}</div>
                <div>{pr.meaning}</div>
            </div>) : null}
        </div>
    </div>
};

export default CourseAbout;
