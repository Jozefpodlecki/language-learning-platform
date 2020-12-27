import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faHardHat } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";

import style from "./underConstruction.scss";

const UnderConstruction: FunctionComponent = ({}) => {
    return (
        <div className={style.container}>
            <div className={style.content}>
                <div>
                    <div className={style.icon}>
                        <FontAwesomeIcon icon={faHardHat} />
                    </div>
                    <div className={style.title}>Under construction</div>
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

export default UnderConstruction;
