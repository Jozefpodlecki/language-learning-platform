import { render } from "@testing-library/react";
import App from "./App";
import React from "react";

describe("App spec", () => {
    it("renders the component", () => {
        const container = render(<App />);
        expect(container).toMatchSnapshot();
    });
});
