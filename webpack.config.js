const path = require("path");
const Dotenv = require("dotenv-webpack");
module.exports = {
  entry: {
    popup: "./react-chrome-extension/src/popup/index.tsx",
    options: "./react-chrome-extension/src/options/index.tsx",
    autofill: "./autofill/autofillScript.ts"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: { noEmit: false },
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "extension"),
  },
  plugins: [
    new Dotenv(),
  ],
};
