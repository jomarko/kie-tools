/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    "monaco.min": "./src/monaco.min.ts",
  },
  output: {
    libraryTarget: "umd",
    library: "monaco",
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/standalone"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve("ts-loader"),
      },
      {
        test: /\.css$/,
        use: [require.resolve("style-loader"), require.resolve("css-loader")],
      },
      {
        test: /\.ttf$/,
        use: [require.resolve("url-loader")],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
