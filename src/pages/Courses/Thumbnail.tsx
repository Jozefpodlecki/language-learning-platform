import Loader from "react-loader-spinner";
import React, { FunctionComponent, useEffect, useState } from "react";
import style from "./thumbnail.scss";

type Props = {
    src: string;
};

const width = 300;
const height = 200;

const Thumbnail: FunctionComponent<Props> = ({ src }) => {
    const [isLoading, setLoading] = useState(true);
    const [dataUri, setDataUri] = useState(src);

    useEffect(() => {
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");

            context.drawImage(image, 0, 0, width, height);
            const url = canvas.toDataURL("image/jpeg");
            setLoading(false);
            setDataUri(url);
        };

        image.src = src;
    }, [src]);

    if (isLoading) {
        return (
            <div className={style.loader}>
                <Loader type="ThreeDots" color="black" width={50} height={50} />
            </div>
        );
    }

    return (
        <div className={style.thumbnail}>
            <img className={style.image} src={dataUri} alt={src} />;
        </div>
    );
};

export default Thumbnail;
