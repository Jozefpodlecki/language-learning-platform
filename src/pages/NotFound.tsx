import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faUserAstronaut } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent, useEffect, useState } from "react";

import style from "./notFound.scss";

const NotFound: FunctionComponent = ({}) => {
    return (
        <div className={style.container}>
            <div className={style.content}>
                <div>
                    <div className={style.icon}>
                        <FontAwesomeIcon icon={faUserAstronaut} />
                    </div>
                    <div className={style.title}>Page not found</div>
                </div>
                <div className={style.actions}>
                    <Link className={style.link} to="/">
                        Go to courses
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
