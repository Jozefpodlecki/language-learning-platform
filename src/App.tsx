import { Route, Switch, useHistory } from "react-router";
import { getSessionsFromLocalStorage } from "api";
import CourseAbout from "pages/CourseAbout";
import CourseFlashcards from "pages/CourseFlashcards";
import CourseReview from "pages/CourseReview";
import CourseSession from "pages/CourseSession";
import Courses from "pages/Courses";
import NotFound from "pages/NotFound";
import React, { FunctionComponent, useEffect } from "react";
import UnderConstruction from "pages/UnderConstruction";
import CourseLesson from "pages/CourseLesson";

const App: FunctionComponent = () => {

    return (
        <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/profile" component={UnderConstruction} />
            <Route
                exact
                path="/course/:courseId/session/:sessionId"
                component={CourseSession}
            />
            <Route
                exact
                path="/course/:courseId/session/:sessionId/review"
                component={CourseReview}
            />
             <Route
                exact
                path="/course/:courseId/lesson"
                component={CourseLesson}
            />
            <Route
                exact
                path="/course/:courseId/info"
                component={CourseAbout}
            />
            <Route
                exact
                path="/course/:courseId/flashcards"
                component={CourseFlashcards}
            />
            <Route component={NotFound} />
        </Switch>
    );
};

export default App;
