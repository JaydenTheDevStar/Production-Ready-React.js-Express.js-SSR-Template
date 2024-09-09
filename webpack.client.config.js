const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.tsx", // Main client-side entry
  output: {
    path: path.resolve(__dirname, "dist/static"), // Ensure client-side assets are in the right place
    filename: isDevelopment ? "[name].js" : "ClientIndex.[contenthash].js", // Proper hash for production
    publicPath: isDevelopment ? "/" : "/static", // Ensure the public path is set to /static
  },

  devtool: isDevelopment ? "source-map" : false,
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/, // Handle JS and TS files
        exclude: /node_modules/,
        use: "babel-loader", // Transpile using Babel
      },
      {
        test: /\.(css|scss)$/, // Handle CSS and SCSS
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [
    isDevelopment &&
      new HtmlWebpackPlugin({
        template: "./public/index.html", // Use HTML template only in development
        inject: "body",
      }),
    new CleanWebpackPlugin(), // Clean output directory before each build
    !isDevelopment &&
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
  ].filter(Boolean), // Filter out falsy values (e.g., conditional plugins)
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin({ parallel: true }), new CssMinimizerPlugin()],
    splitChunks: {
      chunks: "all", // Code splitting
    },
    runtimeChunk: "single", // Separate runtime chunk
  },
};
