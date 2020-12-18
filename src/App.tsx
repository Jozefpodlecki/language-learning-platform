import { Route, Switch } from "react-router";
import CourseSession from "pages/CourseSession";
import Courses from "pages/Courses";
import React, { FunctionComponent } from "react";
import CourseAbout from "pages/CourseAbout";

const App: FunctionComponent = () => {
    return (
        <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/course/:courseId/session/:sessionId" component={CourseSession} />
            <Route exact path="/course/:courseId/info" component={CourseAbout} />
        </Switch>
    );
};

export default App;
