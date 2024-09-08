const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./server.tsx", // Entry point for your server-side code
  target: "node", // This ensures we're bundling for Node.js
  externals: [nodeExternals()], // Exclude node_modules from the server bundle
  output: {
    path: path.resolve(__dirname, "dist/server"), // Separate server output from client
    filename: "server.js", // Name of the bundled server file
    publicPath: "/", // Optional: server-side serving path (rarely needed)
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/, // Transpile TypeScript and JSX
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Transpile using Babel
        },
      },
    ],
  },
  node: {
    __dirname: false, // Do not modify __dirname to ensure correct path resolution
    __filename: false, // Do not modify __filename
  },
};
