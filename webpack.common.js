const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
    about: path.resolve(__dirname, "./src/about.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", //content hash use hash and the hash changes if something in the module changes.
    assetModuleFilename: "[name][ext]", //keeps the same name for images when compiled from src to dist
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/about.html"),
      filename: "about.html",
      chunks: ["about"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpeg|jpg|svg|gif)/i,
        type: "asset/resource",
      },
    ],
  },
};
