import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";

import "i18n";
import store from "store/store";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
dayjs.extend(duration);
dayjs.extend(relativeTime)

const root = document.getElementById(process.env.root);

ReactDOM.render(
    <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DndProvider>
    </Provider>,
    root
);
