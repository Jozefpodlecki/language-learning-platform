import * as actions from "actions";
import { useDispatch } from "react-redux";
import { useSelector } from "hooks/useSelector";
import React, {
    ChangeEvent,
    FunctionComponent,
    useEffect,
    useRef,
    useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createSession, getCourseAsync, getLessonsByCourseAsync } from "api";
import { useHistory, useParams } from "react-router";
import Loader from "react-loader-spinner";
import Navbar from "../Navbar";
import style from "./index.scss";
import Item from "./Item";

const CourseLesson: FunctionComponent = () => {
    const {
        user: {
            id: userId,
        },
        pages: {
            course: { 
                course,
                lessons,
            },
        },
    } = useSelector((state) => state);

    const dispatch = useDispatch();
    const { courseId } = useParams<{
        courseId: string;
    }>();
    const history = useHistory();
    const [{ value, items, pageSize, page }, setState] = useState({
        value: "",
        items: [],
        pageSize: 30,
        page: 0,
    });

    useEffect(() => {
        if (course.isLoading === true || course.id !== courseId) {
            getCourseAsync(courseId).then((course) => {
                dispatch(actions.getCourse.success(course));
            });

            getLessonsByCourseAsync(courseId).then((lessons) => {
                dispatch(actions.getLessonsByCourse.success(lessons));
            });

            return;
        }


    }, [course]);

    const onPractice = (lessonId: string) => {
        dispatch(actions.startSession.request());

        createSession(userId, lessonId, courseId, false).then((session) => {
            dispatch(actions.startSession.success(session));

            history.push(`/course/${courseId}/lesson/${lessonId}/session/${session.id}`);
        });
    }
   
    if (course.isLoading === true || lessons.isLoading === true) {
        return (
            <div>
                <Loader
                    type="ThreeDots"
                    color="black"
                    width={200}
                    height={200}
                />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className={style.header}>
                <Link className={style.back} to="/">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <div className={style.backTitle}>Back</div>
                </Link>
                <div className={style.title}>{course.name}</div>
            </div>
            <div className={style.list}>
                {lessons.map(pr => <Item key={pr.id} {...pr}
                    onPractice={onPractice}/>)}
            </div>
        </div>
    );
};

export default CourseLesson;
