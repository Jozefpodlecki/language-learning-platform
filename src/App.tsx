import { Route, Switch, useHistory } from "react-router";

import CourseAbout from "pages/Course";
import CourseFlashcards from "pages/CourseFlashcards";
import CourseReview from "pages/LessonReview";
import LessonSession from "pages/LessonSession";
import Courses from "pages/Courses";
import NotFound from "pages/NotFound";
import React, { FunctionComponent, useEffect } from "react";
import UnderConstruction from "pages/UnderConstruction";
import CourseLesson from "pages/CourseLesson";
import Dictionary from "pages/Dictionary";

const App: FunctionComponent = () => {

    return (
        <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/profile" component={UnderConstruction} />
            <Route
                exact
                path="/dictionary"
                component={Dictionary}
            />
            <Route
                exact
                path="/course/:courseId/lesson/:lessonId/session/:sessionId"
                component={LessonSession}
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
            {/* <Route
                exact
                path="/course/:courseId/info"
                component={CourseAbout}
            /> */}
            {/* <Route
                exact
                path="/course/:courseId/flashcards"
                component={CourseFlashcards}
            /> */}
            <Route component={NotFound} />
        </Switch>
    );
};

export default App;
