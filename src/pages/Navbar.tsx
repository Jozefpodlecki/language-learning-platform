import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FunctionComponent, useEffect } from "react";
import { Link } from "react-router-dom";

import style from "./navbar.scss";

const Navbar: FunctionComponent = () => {
    return <nav className={style.navbar}>
        <div className={style.logo}>Language Learning Platform</div>
        <div className={style.right}>
            <Link className={style.userIcon} to="/profile">
                <FontAwesomeIcon icon={faUser}/>
            </Link>
        </div>
    </nav>
};

export default Navbar;
