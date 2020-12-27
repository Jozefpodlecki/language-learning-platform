import React, { FunctionComponent, ReactNode } from "react";

import style from "./style.scss";

type LayoutProps = {
    children: ReactNode;
};

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
    return <div className={style.layout}>{children}</div>;
};

export default Layout;
