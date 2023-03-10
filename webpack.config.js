const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: { extensions: [".ts", ".js"] },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        port: 1234,
        hot: true,
        liveReload: true,
    },
};
