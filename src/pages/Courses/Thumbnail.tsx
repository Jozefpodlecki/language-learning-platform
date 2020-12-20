
import React, { FunctionComponent, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import style from "./thumbnail.scss";

type Props = {
    src: string;
}

const Thumbnail: FunctionComponent<Props> = ({
    src
}) => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const image = new Image();

        image.onload = () => {
            setLoading(false);
        }

        image.src = src;
    }, [src]);

    if(isLoading) {
        return <div className={style.loader}>
            <Loader
                type="ThreeDots"
                color="black"
                width={50}
                height={50}/>
        </div>
    }

    return <div className={style.thumbnail}>
        <img className={style.image} src={src} alt={src}/>;
    </div>
};

export default Thumbnail;
