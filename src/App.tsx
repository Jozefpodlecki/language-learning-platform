import { Route, Switch, useHistory } from "react-router";
import CourseSession from "pages/CourseSession";
import Courses from "pages/Courses";
import React, { FunctionComponent, useEffect } from "react";
import CourseAbout from "pages/CourseAbout";
import NotFound from "pages/NotFound";
import UnderConstruction from "pages/UnderConstruction";
import CourseFlashcards from "pages/CourseFlashcards";
import CourseReview from "pages/CourseReview";
import { getSessionsFromLocalStorage } from "api";

const App: FunctionComponent = () => {
    const history = useHistory()

    const onStorage = () => {
        const session = getSessionsFromLocalStorage();

        if(!session.length) {
            if(history.location.pathname === "/") {
                history.push("/");
            }
        }
    }

    useEffect(() => {
        window.addEventListener("storage", onStorage);

        return () => window.removeEventListener("storage", onStorage);
    }, [history])

    return (
        <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/profile" component={UnderConstruction} />
            <Route exact path="/course/:courseId/session/:sessionId" component={CourseSession} />
            <Route exact path="/course/:courseId/session/:sessionId/review" component={CourseReview} />
            <Route exact path="/course/:courseId/info" component={CourseAbout} />
            <Route exact path="/course/:courseId/flashcards" component={CourseFlashcards} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default App;
