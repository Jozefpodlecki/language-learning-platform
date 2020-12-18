import { render } from "@testing-library/react";
import Courses from "./Courses";
import React from "react";

describe("Courses spec", () => {
    it("renders the component", () => {
        const container = render(<Courses />);
        expect(container).toMatchSnapshot();
    });
});
