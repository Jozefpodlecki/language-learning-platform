delete process.env.TS_NODE_PROJECT;

import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import DotenvPlugin from "webpack-dotenv-plugin";
import * as webpackDevServer from "webpack-dev-server"; // eslint-disable-line
import { Configuration } from "webpack";

const config: Configuration = {
    entry: {
        app: "./src/index.tsx",
    },
    output: {
        path: resolve(__dirname, "build"),
        publicPath: "/",
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".json", ".scss", ".js", "png", "svg", "jpg", "webm", "mp3"],
        plugins: [
            new TsconfigPathsPlugin({baseUrl: "src"}),
        ]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: "ts-loader"
            },
            {
                test: /\.(png|jpe?g|webm|mp3)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            
                        }
                    },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: resolve(__dirname, "src/assets/images/favicon.ico"),
            template: "index.html.ejs",
        }),
        new DotenvPlugin({
            sample: ".env",
            path: "./.env"
        }),
    ]
};

export default config;