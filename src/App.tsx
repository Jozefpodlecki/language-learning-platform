import { Route, Switch } from "react-router";
import CourseSession from "pages/CourseSession";
import Courses from "pages/Courses";
import React, { FunctionComponent } from "react";
import CourseAbout from "pages/CourseAbout";
import NotFound from "pages/NotFound";
import UnderConstruction from "pages/UnderConstruction";

const App: FunctionComponent = () => {
    return (
        <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/profile" component={UnderConstruction} />
            <Route exact path="/course/:courseId/session/:sessionId" component={CourseSession} />
            <Route exact path="/course/:courseId/info" component={UnderConstruction} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default App;
