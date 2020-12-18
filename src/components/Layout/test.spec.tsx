import { render } from "@testing-library/react";
import Layout from "./index";
import React from "react";

describe("Layout spec", () => {
    it("renders the component", () => {
        const container = render(
            <Layout>
                <div />
            </Layout>
        );
        expect(container).toMatchSnapshot();
    });
});
