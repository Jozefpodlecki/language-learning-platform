import { resolve } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import common from "./webpack.common"

const environment = "production";
process.env.NODE_ENV = environment;

const config: Configuration = merge(common, {
    mode: environment,
    output: {
        path: resolve(__dirname, "build"),
        publicPath: "/language-learning-platform/",
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /styles\.scss$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [resolve(__dirname, "src/styles")],
                            },
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /styles\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        }
                    },
                    {
                        loader: "postcss-loader",
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                                includePaths: [resolve(__dirname, "src/styles")],
                            },
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css",
        }),
    ]
});

export default config;